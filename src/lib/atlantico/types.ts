export const ATLANTICO_LANGUAGES = [
  "CAS",
  "ENG",
  "FRA",
  "RUS",
  "ALE",
  "ITA",
] as const;

export type AtlanticoLanguage = (typeof ATLANTICO_LANGUAGES)[number];

export type AtlanticoClassification = {
  id: string;
  code: string;
  name: string;
  desc?: string;
  image?: string;
  count?: number;
};

export type AtlanticoTourSummary = {
  id: string;
  code: string;
  name: string;
  desc?: string;
  image?: string;
  price?: string;
  ids?: string;
  duration?: string;
  category?: string;
};

export type AtlanticoTourDetails = AtlanticoTourSummary & {
  category?: string;
  faq?: string;
  video?: string;
  childAge?: string;
  infantAge?: string;
  ghygo?: string;
};

export type AtlanticoPriceType = "0" | "1" | "2" | "3";

export type AtlanticoEventDetails = {
  id: string;
  code: string;
  name: string;
  days?: number[];
  times?: string[];
  fak?: string;
  pProd?: AtlanticoPriceType | string;
  route?: string;
  desc?: string;
  icons?: string[];
};

export type AtlanticoSessionItem = {
  time: string;
  available: string;
  precio?: string;
  bruto?: string;
  sessionId?: string;
  rcId?: string;
  TipoReservaId?: string;
};

export type AtlanticoLoadLimitsResponse = {
  id: string;
  code?: number;
  quote?: string;
  dates: {
    limit?: number[];
    date?: string[];
    used?: number[];
    wdays?: number[];
  };
  sessions?: Record<string, AtlanticoSessionItem[]>;
};

export type AtlanticoConfirmRequest = {
  userId: string;
  t_id: string;
  t_group: string;
  language: AtlanticoLanguage;
  tourDate: string;
  sesTime: string;
  adults: number;
  childs: number;
  infants: number;
  name: string;
  email: string;
  phone: string;
  hotel?: string;
  room?: string;
  mpoint?: string;
  mtime?: string;
  Notes?: string;
};

export type AtlanticoConfirmResponse = {
  bookingCode: string;
  message?: string;
};

/** Result of POST /payment/ — customer should be sent to paymentUrl. */
export type AtlanticoPaymentResponse = {
  paymentUrl: string;
};

export type PerPersonPrices = {
  kind: "perPerson";
  adult: number;
  child: number;
  infant: number;
  adultCommission: number;
  childCommission: number;
  infantCommission: number;
};

export type PerDayPrices = {
  kind: "perDay";
  tiers: Array<{ days: number; price: number; commission: number }>;
};

export type UniquePrices = {
  kind: "unique";
  price: number;
  commission: number;
};

export type ParsedPrices = PerPersonPrices | PerDayPrices | UniquePrices;
