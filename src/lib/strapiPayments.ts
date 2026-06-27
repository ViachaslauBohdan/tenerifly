import type {
  PaymentCategory,
  PaymentTransaction,
  PaymentTransactionStatus,
} from '@/types/strapi';

const DEFAULT_STRAPI_URL =
  'https://tenerifly-strapi-production.up.railway.app';

function getStrapiConfig() {
  const baseUrl = (
    process.env.STRAPI_API_URL ||
    process.env.NEXT_PUBLIC_STRAPI_API_URL ||
    DEFAULT_STRAPI_URL
  ).replace(/\/$/, '');

  const token =
    process.env.STRAPI_API_TOKEN ||
    process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token) {
    throw new Error('STRAPI_API_TOKEN is not configured');
  }

  return { baseUrl, token };
}

type StrapiListResponse<T> = {
  data: Array<{ id: number; documentId?: string; attributes?: T } & T>;
};

export type CreatePaymentTransactionInput = Omit<
  PaymentTransaction,
  'id' | 'documentId'
>;

export async function findPaymentTransactionByStripeSessionId(
  stripeSessionId: string
): Promise<PaymentTransaction | null> {
  const { baseUrl, token } = getStrapiConfig();
  const params = new URLSearchParams({
    'filters[stripeSessionId][$eq]': stripeSessionId,
    'pagination[pageSize]': '1',
  });

  const response = await fetch(
    `${baseUrl}/api/payment-transactions?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Strapi find payment-transaction failed (${response.status}): ${body}`
    );
  }

  const json = (await response.json()) as StrapiListResponse<PaymentTransaction>;
  const entry = json.data?.[0];
  if (!entry) return null;

  if ('attributes' in entry && entry.attributes) {
    return {
      id: entry.id,
      documentId: entry.documentId,
      ...entry.attributes,
    };
  }

  return entry as PaymentTransaction;
}

export async function createPaymentTransaction(
  input: CreatePaymentTransactionInput
): Promise<PaymentTransaction> {
  const { baseUrl, token } = getStrapiConfig();

  const response = await fetch(`${baseUrl}/api/payment-transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: input }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Strapi create payment-transaction failed (${response.status}): ${body}`
    );
  }

  const json = (await response.json()) as {
    data: { id: number; documentId?: string; attributes?: PaymentTransaction } & PaymentTransaction;
  };

  const entry = json.data;
  if ('attributes' in entry && entry.attributes) {
    return {
      id: entry.id,
      documentId: entry.documentId,
      ...entry.attributes,
    };
  }

  return entry as PaymentTransaction;
}

export function parsePaymentCategories(value: string | undefined): PaymentCategory[] {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(
      (item): item is PaymentCategory =>
        item === 'tour' || item === 'car' || item === 'apartment'
    );
}

export function isPaymentTransactionStatus(
  value: string
): value is PaymentTransactionStatus {
  return value === 'completed' || value === 'refunded';
}
