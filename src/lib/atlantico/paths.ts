/**
 * Supplier booking paths. Apache returns 404 without the trailing slash
 * (`/confirm`, `/payment`); the PHP app only answers `/confirm/`, `/payment/`.
 *
 * OpenAPI: https://tozi007.github.io/supplier-api/
 * - POST /confirm/  — reserve without gateway (affiliate / account)
 * - POST /payment/  — same body, 302 to payment gateway
 */
export const ATLANTICO_PATHS = {
  confirm: "/confirm/",
  payment: "/payment/",
} as const;

export type AtlanticoBookingCheckout = "confirm" | "payment";
