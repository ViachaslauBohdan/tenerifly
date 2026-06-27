import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Resend } from 'resend';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import {
  createPaymentTransaction,
  findPaymentTransactionByStripeSessionId,
  parsePaymentCategories,
} from '@/lib/strapiPayments';

export const runtime = 'nodejs';

async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
      }
    );
    const data = await response.json();
    if (!data.ok) {
      console.error('Telegram send error:', data);
    }
  } catch (err) {
    console.error('Telegram request failed:', err);
  }
}

async function sendPaymentEmail(session: Stripe.Checkout.Session) {
  const resendApiKey =
    process.env.RESEND_API_KEY ||
    process.env.NEXT_RESEND_API_KEY ||
    process.env.NEXT_PUBLIC_RESEND_API_KEY;

  if (!resendApiKey) return;

  const recipients = (process.env.NEXT_DEFAULT_EMAIL_RECIPIENT ?? '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);

  if (recipients.length === 0) return;

  const resend = new Resend(resendApiKey);
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ||
    process.env.NEXT_PUBLIC_RESEND_EMAIL ||
    'onboarding@resend.dev';

  const metadata = session.metadata ?? {};
  const amountEur = ((session.amount_total ?? 0) / 100).toFixed(2);
  const categories = metadata.categories ?? '';
  const customerName = metadata.customerName ?? '';
  const customerEmail = metadata.customerEmail ?? session.customer_email ?? '';
  const customerPhone = metadata.customerPhone ?? '';
  const customerNote = metadata.customerNote ?? '';
  const locale = metadata.locale ?? 'en';

  const htmlBody = `
    <p><strong>Card payment received</strong></p>
    <p><strong>Amount:</strong> €${amountEur}</p>
    <p><strong>Categories:</strong> ${categories}</p>
    <p><strong>Name:</strong> ${customerName}</p>
    <p><strong>Email:</strong> ${customerEmail}</p>
    <p><strong>Phone:</strong> ${customerPhone || '—'}</p>
    <p><strong>Locale:</strong> ${locale}</p>
    <p><strong>Stripe session:</strong> ${session.id}</p>
    <p><strong>Note:</strong></p>
    <pre style="font-family: inherit; white-space: pre-wrap;">${customerNote || '—'}</pre>
  `;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: recipients,
      replyTo: customerEmail.includes('@') ? customerEmail : undefined,
      subject: `Card payment €${amountEur} — ${categories}`,
      html: htmlBody,
    });
  } catch (err) {
    console.error('Payment notification email failed:', err);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const existing = await findPaymentTransactionByStripeSessionId(session.id);
  if (existing) {
    return;
  }

  const metadata = session.metadata ?? {};
  const categories = parsePaymentCategories(metadata.categories);
  const paidAt = new Date(
    (session.created ?? Math.floor(Date.now() / 1000)) * 1000
  ).toISOString();

  await createPaymentTransaction({
    amount: (session.amount_total ?? 0) / 100,
    currency: (session.currency ?? 'eur').toUpperCase(),
    categories,
    customerName: metadata.customerName ?? 'Unknown',
    customerEmail:
      metadata.customerEmail ?? session.customer_email ?? 'unknown@example.com',
    customerPhone: metadata.customerPhone || null,
    customerNote: metadata.customerNote || null,
    locale: metadata.locale ?? 'en',
    stripeSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id ?? null,
    status: 'completed',
    paidAt,
  });

  const amountEur = ((session.amount_total ?? 0) / 100).toFixed(2);
  await sendPaymentEmail(session);
  await sendTelegramMessage(`
<b>Card payment received</b>

<b>Amount:</b> €${amountEur}
<b>Categories:</b> ${metadata.categories ?? '—'}
<b>Name:</b> ${metadata.customerName ?? '—'}
<b>Email:</b> ${metadata.customerEmail ?? session.customer_email ?? '—'}
<b>Phone:</b> ${metadata.customerPhone || '—'}
<b>Stripe session:</b> ${session.id}
<b>Note:</b>
${metadata.customerNote || '—'}
  `);
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET missing' },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await handleCheckoutCompleted(session);
    } catch (err) {
      console.error('Failed to persist payment transaction:', err);
      return NextResponse.json(
        { error: 'Failed to process payment' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
