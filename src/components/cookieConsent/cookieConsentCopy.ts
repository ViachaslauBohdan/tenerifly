import type { Locale } from "@/types/locale";

export type CookieConsentCopy = {
  title: string;
  message: string;
  accept: string;
  reject: string;
  policy: string;
  manage: string;
  statusOn: string;
  statusOff: string;
};

const COPY: Record<Locale, CookieConsentCopy> = {
  en: {
    title: "Cookies",
    message:
      "We use cookies to remember this choice and, if you agree, to measure advertising. Essential cookies keep the site working.",
    accept: "Accept",
    reject: "Reject",
    policy: "Cookie policy",
    manage: "Cookie settings",
    statusOn: "Advertising cookies are on.",
    statusOff: "Advertising cookies are off.",
  },
  ru: {
    title: "Файлы cookie",
    message:
      "Мы используем cookie, чтобы запомнить этот выбор и, если вы согласитесь, измерять рекламу. Необходимые cookie нужны для работы сайта.",
    accept: "Принять",
    reject: "Отклонить",
    policy: "Политика cookie",
    manage: "Настройки cookie",
    statusOn: "Рекламные cookie включены.",
    statusOff: "Рекламные cookie выключены.",
  },
  ua: {
    title: "Файли cookie",
    message:
      "Ми використовуємо cookie, щоб запам’ятати цей вибір і, якщо ви погодитесь, вимірювати рекламу. Необхідні cookie потрібні для роботи сайту.",
    accept: "Прийняти",
    reject: "Відхилити",
    policy: "Політика cookie",
    manage: "Налаштування cookie",
    statusOn: "Рекламні cookie увімкнені.",
    statusOff: "Рекламні cookie вимкнені.",
  },
  pl: {
    title: "Pliki cookie",
    message:
      "Używamy plików cookie, aby zapamiętać ten wybór i — jeśli się zgodzisz — mierzyć reklamy. Niezbędne pliki cookie są potrzebne do działania strony.",
    accept: "Akceptuję",
    reject: "Odrzucam",
    policy: "Polityka cookie",
    manage: "Ustawienia cookie",
    statusOn: "Reklamowe pliki cookie są włączone.",
    statusOff: "Reklamowe pliki cookie są wyłączone.",
  },
  de: {
    title: "Cookies",
    message:
      "Wir verwenden Cookies, um diese Auswahl zu speichern und — wenn Sie zustimmen — Werbung zu messen. Notwendige Cookies halten die Website am Laufen.",
    accept: "Akzeptieren",
    reject: "Ablehnen",
    policy: "Cookie-Richtlinie",
    manage: "Cookie-Einstellungen",
    statusOn: "Werbe-Cookies sind aktiv.",
    statusOff: "Werbe-Cookies sind aus.",
  },
  es: {
    title: "Cookies",
    message:
      "Usamos cookies para recordar esta elección y, si acepta, para medir la publicidad. Las cookies esenciales mantienen el sitio en funcionamiento.",
    accept: "Aceptar",
    reject: "Rechazar",
    policy: "Política de cookies",
    manage: "Ajustes de cookies",
    statusOn: "Las cookies publicitarias están activadas.",
    statusOff: "Las cookies publicitarias están desactivadas.",
  },
  fr: {
    title: "Cookies",
    message:
      "Nous utilisons des cookies pour mémoriser ce choix et, si vous acceptez, pour mesurer la publicité. Les cookies essentiels font fonctionner le site.",
    accept: "Accepter",
    reject: "Refuser",
    policy: "Politique cookies",
    manage: "Paramètres des cookies",
    statusOn: "Les cookies publicitaires sont activés.",
    statusOff: "Les cookies publicitaires sont désactivés.",
  },
};

export function cookieConsentCopy(locale: Locale): CookieConsentCopy {
  return COPY[locale] ?? COPY.en;
}
