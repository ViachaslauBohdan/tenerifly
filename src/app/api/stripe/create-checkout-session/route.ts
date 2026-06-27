import { NextResponse } from 'next/server';
import type { PaymentCategory } from '@/types/strapi';
import { SITE_URL } from '@/lib/site';
import { getStripe, getStripeSecretKey } from '@/lib/stripe';

const MIN_AMOUNT_EUR = 0.5;
const VALID_CATEGORIES: PaymentCategory[] = ['tour', 'car', 'apartment'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CheckoutRequestBody = {
  categories?: string[];
  amount?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerNote?: string;
  locale?: string;
};

function isValidCategory(value: string): value is PaymentCategory {
  return VALID_CATEGORIES.includes(value as PaymentCategory);
}

function resolveSiteOrigin(req: Request): string {
  const origin = req.headers.get('origin');
  if (origin) return origin.replace(/\/$/, '');

  const referer = req.headers.get('referer');
  if (referer) {
    try {
      const url = new URL(referer);
      return url.origin;
    } catch {
      // fall through
    }
  }

  return SITE_URL;
}

export async function POST(req: Request) {
  if (!getStripeSecretKey()) {
    return NextResponse.json(
      {
        error:
          'Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local (see deploy/STRIPE-SETUP.md).',
      },
      { status: 503 }
    );
  }

  try {
    const body = (await req.json()) as CheckoutRequestBody;
    const categories = (body.categories ?? []).filter(isValidCategory);
    const amount = Number(body.amount);
    const customerName = body.customerName?.trim() ?? '';
    const customerEmail = body.customerEmail?.trim() ?? '';
    const customerPhone = body.customerPhone?.trim() ?? '';
    const customerNote = body.customerNote?.trim() ?? '';
    const locale = body.locale?.trim() || 'en';

    if (categories.length === 0) {
      return NextResponse.json(
        { error: 'At least one category is required' },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount < MIN_AMOUNT_EUR) {
      return NextResponse.json(
        { error: `Amount must be at least €${MIN_AMOUNT_EUR}` },
        { status: 400 }
      );
    }

    if (!customerName) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!EMAIL_RE.test(customerEmail)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const amountInCents = Math.round(amount * 100);
    const stripe = getStripe();
    const categoriesLabel = categories.join(', ');
    const siteOrigin = resolveSiteOrigin(req);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: amountInCents,
            product_data: {
              name: 'Tenerife Joy payment',
              description: `Categories: ${categoriesLabel}`,
            },
          },
        },
      ],
      metadata: {
        categories: categories.join(','),
        locale,
        customerName,
        customerEmail,
        customerPhone,
        customerNote,
      },
      success_url: `${siteOrigin}/${locale}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteOrigin}/${locale}/pay?cancelled=1`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout session error:', error);

    const message =
      error instanceof Error && error.message.includes('Invalid API Key')
        ? 'Invalid STRIPE_SECRET_KEY. Check your Stripe test/live key in .env.local.'
        : error instanceof Error
          ? error.message
          : 'Could not start checkout';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
