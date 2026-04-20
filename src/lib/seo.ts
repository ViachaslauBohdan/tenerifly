import { LOCALES } from "@/types/locale";
import type { Locale } from "@/types/locale";

/** Canonical site origin (no trailing slash). All public URLs use /{locale}/… per routing. */
export const SITE_URL = "https://tenerifly.io";

export const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg";

export type PageSeo = {
  title: string;
  description: string;
  keywords: string[];
};

function normalizePath(path: string): string {
  if (path === "") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Absolute URL for a locale segment. English uses /en/… like other locales (middleware redirects unprefixed paths).
 */
export function absoluteUrlForLocale(locale: Locale, path: string): string {
  const p = normalizePath(path);
  return `${SITE_URL}/${locale}${p}`;
}

/** hreflang map + x-default (English). */
export function hreflangAlternates(path: string): Record<string, string> {
  const p = normalizePath(path);
  const entries: [string, string][] = LOCALES.map((l) => [
    l.code,
    absoluteUrlForLocale(l.code, p),
  ]);
  entries.push(["x-default", absoluteUrlForLocale("en", p)]);
  return Object.fromEntries(entries);
}

export function ogLocale(locale: Locale): string {
  const map: Record<Locale, string> = {
    en: "en_US",
    ru: "ru_RU",
    pl: "pl_PL",
    fr: "fr_FR",
    uk: "uk_UA",
    de: "de_DE",
    es: "es_ES",
  };
  return map[locale];
}

export function organizationAndWebsiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Tenerifly.io",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: DEFAULT_OG_IMAGE,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Tenerifly.io",
        inLanguage: ["en", "pl", "fr", "ru", "uk", "de", "es"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

export const SEO_HOME: Record<Locale, PageSeo> = {
  en: {
    title: "Tenerifly.io — Your Gateway to Tenerife",
    description:
      "Discover Tenerife with Tenerifly.io: holiday accommodation, car hire, and guided tours across the Canary Islands. Book with local hosts for better value and authentic trips.",
    keywords: [
      "Tenerife",
      "Canary Islands",
      "Tenerife accommodation",
      "Tenerife car rental",
      "Tenerife tours",
      "Tenerife travel",
      "Canary Islands holiday",
    ],
  },
  pl: {
    title: "Tenerifly.io — Odkryj Teneryfę",
    description:
      "Teneryfa i Wyspy Kanaryjskie: apartamenty i domy, wynajem aut oraz wycieczki z lokalnymi organizatorami. Rezerwuj online po polsku — bez pośredników.",
    keywords: [
      "Teneryfa",
      "Wyspy Kanaryjskie",
      "noclegi Teneryfa",
      "wynajem aut Teneryfa",
      "wycieczki Teneryfa",
      "wakacje Teneryfa",
      "apartamenty Teneryfa",
    ],
  },
  fr: {
    title: "Tenerifly.io — Votre porte d’entrée à Ténérife",
    description:
      "Ténérife et îles Canaries : hébergements, location de voiture et excursions avec des prestataires locaux. Réservez en français pour des séjours authentiques.",
    keywords: [
      "Ténérife",
      "îles Canaries",
      "hébergement Ténérife",
      "location voiture Ténérife",
      "excursions Ténérife",
      "voyage Ténérife",
      "vacances Canaries",
    ],
  },
  ru: {
    title: "Tenerifly.io — Тенерифе и Канарские острова",
    description:
      "Жильё на Тенерифе, аренда авто и экскурсии с местными организаторами. Планируйте отдых на Канарах на русском языке — прямые цены и локальные гиды.",
    keywords: [
      "Тенерифе",
      "Канарские острова",
      "аренда жилья Тенерифе",
      "аренда авто Тенерифе",
      "экскурсии Тенерифе",
      "отдых на Тенерифе",
      "Канары тур",
    ],
  },
  uk: {
    title: "Tenerifly.io — Тенеріфе та Канарські острови",
    description:
      "Житло на Тенеріфе, оренда авто та тури з локальними партнерами. Плануйте канарську подорож українською — прямі бронювання та чесні ціни.",
    keywords: [
      "Тенеріфе",
      "Канарські острови",
      "житло Тенеріфе",
      "оренда авто Тенеріфе",
      "тури Тенеріфе",
      "відпочинок Тенеріфе",
      "Канари подорож",
    ],
  },
  de: {
    title: "Tenerifly.io — Dein Einstieg in Teneriffa",
    description:
      "Teneriffa und Kanaren: Unterkünfte, Mietwagen und Touren mit lokalen Anbietern. Direkt buchen — authentische Erlebnisse auf den Kanaren.",
    keywords: [
      "Teneriffa",
      "Kanaren",
      "Unterkunft Teneriffa",
      "Mietwagen Teneriffa",
      "Ausflüge Teneriffa",
      "Urlaub Teneriffa",
      "Kanaren Reise",
    ],
  },
  es: {
    title: "Tenerifly.io — Tu puerta de entrada a Tenerife",
    description:
      "Tenerife e islas Canarias: alojamiento, alquiler de coches y excursiones con proveedores locales. Reserva en español y disfruta el destino como un local.",
    keywords: [
      "Tenerife",
      "Islas Canarias",
      "alojamiento Tenerife",
      "alquiler coche Tenerife",
      "excursiones Tenerife",
      "viaje Tenerife",
      "vacaciones Canarias",
    ],
  },
};

export const SEO_APARTMENTS: Record<Locale, PageSeo> = {
  en: {
    title: "Accommodation in Tenerife | Tenerifly.io",
    description:
      "Browse apartments, villas, and holiday homes in Tenerife. Compare listings and book directly with local hosts across the Canary Islands.",
    keywords: [
      "Tenerife accommodation",
      "Tenerife apartments",
      "Tenerife villas",
      "holiday rental Tenerife",
      "Canary Islands accommodation",
    ],
  },
  pl: {
    title: "Noclegi i apartamenty na Teneryfie | Tenerifly.io",
    description:
      "Apartamenty, wille i domy wakacyjne na Teneryfie. Przeglądaj oferty i rezerwuj bezpośrednio u lokalnych gospodarzy na Wyspach Kanaryjskich.",
    keywords: [
      "noclegi Teneryfa",
      "apartamenty Teneryfa",
      "wille Teneryfa",
      "wynajem Teneryfa",
      "Wyspy Kanaryjskie noclegi",
    ],
  },
  fr: {
    title: "Hébergement à Ténérife | Tenerifly.io",
    description:
      "Appartements, villas et maisons de vacances à Ténérife. Comparez les annonces et réservez directement avec des hôtes locaux aux Canaries.",
    keywords: [
      "hébergement Ténérife",
      "appartement Ténérife",
      "location Ténérife",
      "villa Ténérife",
      "Canaries séjour",
    ],
  },
  ru: {
    title: "Жильё и апартаменты на Тенерифе | Tenerifly.io",
    description:
      "Квартиры, виллы и дома для отдыха на Тенерифе. Сравнивайте объявления и бронируйте напрямую у владельцев на Канарах.",
    keywords: [
      "жильё Тенерифе",
      "апартаменты Тенерифе",
      "аренда Тенерифе",
      "вилла Тенерифе",
      "Канары жильё",
    ],
  },
  uk: {
    title: "Житло та апартаменти на Тенеріфе | Tenerifly.io",
    description:
      "Квартири, вілли та будинки для відпочинку на Тенеріфе. Порівнюйте оголошення та бронюйте напряму у локальних орендодавців на Канарах.",
    keywords: [
      "житло Тенеріфе",
      "апартаменти Тенеріфе",
      "оренда Тенеріфе",
      "вілла Тенеріфе",
      "Канари житло",
    ],
  },
  de: {
    title: "Unterkünfte auf Teneriffa | Tenerifly.io",
    description:
      "Apartments, Villen und Ferienhäuser auf Teneriffa. Angebote vergleichen und direkt bei lokalen Gastgebern auf den Kanaren buchen.",
    keywords: [
      "Unterkunft Teneriffa",
      "Apartment Teneriffa",
      "Ferienwohnung Teneriffa",
      "Villa Teneriffa",
      "Kanaren Urlaub",
    ],
  },
  es: {
    title: "Alojamiento en Tenerife | Tenerifly.io",
    description:
      "Apartamentos, villas y casas vacacionales en Tenerife. Compara anuncios y reserva directamente con anfitriones locales en Canarias.",
    keywords: [
      "alojamiento Tenerife",
      "apartamentos Tenerife",
      "alquiler vacacional Tenerife",
      "villa Tenerife",
      "Canarias alojamiento",
    ],
  },
};

export const SEO_TOURS: Record<Locale, PageSeo> = {
  en: {
    title: "Tours & excursions in Tenerife | Tenerifly.io",
    description:
      "Book Teide, whale watching, hiking, and boat trips in Tenerife. Hand-picked experiences across the Canary Islands with trusted local operators.",
    keywords: [
      "Tenerife tours",
      "Tenerife excursions",
      "Teide tour",
      "whale watching Tenerife",
      "Canary Islands activities",
    ],
  },
  pl: {
    title: "Wycieczki i atrakcje na Teneryfie | Tenerifly.io",
    description:
      "Teide, obserwacja wielorybów, trekking i rejsy — wybierz wycieczki na Teneryfie. Sprawdzone atrakcje na Wyspach Kanaryjskich.",
    keywords: [
      "wycieczki Teneryfa",
      "Teide wycieczka",
      "wieloryby Teneryfa",
      "atrakcje Teneryfa",
      "Kanary atrakcje",
    ],
  },
  fr: {
    title: "Excursions et visites à Ténérife | Tenerifly.io",
    description:
      "Teide, observation de baleines, randonnées et sorties en mer à Ténérife. Activités sélectionnées aux Canaries avec des prestataires locaux.",
    keywords: [
      "excursions Ténérife",
      "Teide excursion",
      "baleines Ténérife",
      "activités Ténérife",
      "Canaries tour",
    ],
  },
  ru: {
    title: "Экскурсии и туры на Тенерифе | Tenerifly.io",
    description:
      "Тейде, киты, походы и морские прогулки на Тенерифе. Подбор экскурсий по Канарам с проверенными местными операторами.",
    keywords: [
      "экскурсии Тенерифе",
      "тур Тейде",
      "киты Тенерифе",
      "достопримечательности Тенерифе",
      "Канары экскурсии",
    ],
  },
  uk: {
    title: "Екскурсії та тури на Тенеріфе | Tenerifly.io",
    description:
      "Тейде, спостереження за китами, піші маршрути та морські тури на Тенеріфе. Активності на Канарах з перевіреними партнерами.",
    keywords: [
      "екскурсії Тенеріфе",
      "тур Тейде",
      "кити Тенеріфе",
      "що подивитись Тенеріфе",
      "Канари тури",
    ],
  },
  de: {
    title: "Ausflüge & Touren auf Teneriffa | Tenerifly.io",
    description:
      "Teide, Walbeobachtung, Wandern und Bootstouren auf Teneriffa. Erlebnisse auf den Kanaren mit zuverlässigen lokalen Anbietern.",
    keywords: [
      "Ausflüge Teneriffa",
      "Teide Tour",
      "Walbeobachtung Teneriffa",
      "Aktivitäten Teneriffa",
      "Kanaren Touren",
    ],
  },
  es: {
    title: "Excursiones y tours en Tenerife | Tenerifly.io",
    description:
      "Teide, avistamiento de ballenas, senderismo y salidas en barco en Tenerife. Experiencias en Canarias con operadores locales de confianza.",
    keywords: [
      "excursiones Tenerife",
      "tour Teide",
      "ballenas Tenerife",
      "actividades Tenerife",
      "Canarias excursiones",
    ],
  },
};

export const SEO_CARS: Record<Locale, PageSeo> = {
  en: {
    title: "Car rental in Tenerife | Tenerifly.io",
    description:
      "Compare cars for hire in Tenerife — economy to premium. Explore the Canary Islands at your own pace with transparent rental options.",
    keywords: [
      "Tenerife car rental",
      "Tenerife car hire",
      "Canary Islands rental car",
      "Tenerife airport car hire",
    ],
  },
  pl: {
    title: "Wynajem samochodu na Teneryfie | Tenerifly.io",
    description:
      "Porównaj auta na wynajem na Teneryfie — od ekonomicznych po premium. Zwiedzaj Wyspy Kanaryjskie we własnym tempie.",
    keywords: [
      "wynajem aut Teneryfa",
      "wypożyczalnia Teneryfa",
      "auto Teneryfa",
      "lotnisko Teneryfa wynajem",
      "Kanary samochód",
    ],
  },
  fr: {
    title: "Location de voiture à Ténérife | Tenerifly.io",
    description:
      "Comparez les véhicules à louer à Ténérife — citadines, SUV ou premium. Roulez librement aux Canaries avec des options claires.",
    keywords: [
      "location voiture Ténérife",
      "location auto Ténérife",
      "aéroport Ténérife voiture",
      "louer voiture Canaries",
    ],
  },
  ru: {
    title: "Аренда авто на Тенерифе | Tenerifly.io",
    description:
      "Выбор автомобилей на Тенерифе — от эконома до премиума. Путешествуйте по Канарам самостоятельно с понятными условиями аренды.",
    keywords: [
      "аренда авто Тенерифе",
      "прокат машины Тенерифе",
      "авто Канары",
      "аэропорт Тенерифе аренда",
    ],
  },
  uk: {
    title: "Оренда авто на Тенеріфе | Tenerifly.io",
    description:
      "Підбір авто на Тенеріфе — від економу до преміуму. Подорожуйте Канарами у власному ритмі з прозорими умовами оренди.",
    keywords: [
      "оренда авто Тенеріфе",
      "прокат авто Тенеріфе",
      "авто Канари",
      "аеропорт Тенеріфе оренда",
    ],
  },
  de: {
    title: "Mietwagen auf Teneriffa | Tenerifly.io",
    description:
      "Fahrzeuge auf Teneriffa mieten — von Kleinwagen bis Premium. Die Kanaren flexibel mit klaren Mietoptionen erkunden.",
    keywords: [
      "Mietwagen Teneriffa",
      "Auto mieten Teneriffa",
      "Flughafen Teneriffa Mietwagen",
      "Kanaren Auto",
    ],
  },
  es: {
    title: "Alquiler de coches en Tenerife | Tenerifly.io",
    description:
      "Compara coches de alquiler en Tenerife — económicos a premium. Recorre Canarias a tu ritmo con condiciones claras.",
    keywords: [
      "alquiler coche Tenerife",
      "rent a car Tenerife",
      "coche aeropuerto Tenerife",
      "Canarias alquiler auto",
    ],
  },
};

export const SEO_BLOG: Record<Locale, PageSeo> = {
  en: {
    title: "Tenerife travel blog | tips & local guides | Tenerifly.io",
    description:
      "Practical guides, itineraries, and news about Tenerife and the Canary Islands — written for travellers planning their next trip.",
    keywords: [
      "Tenerife blog",
      "Tenerife travel tips",
      "Canary Islands guide",
      "Tenerife itinerary",
    ],
  },
  pl: {
    title: "Blog o Teneryfie — porady i przewodniki | Tenerifly.io",
    description:
      "Praktyczne porady, trasy i aktualności o Teneryfie i Wyspach Kanaryjskich — dla podróżników planujących wyjazd.",
    keywords: [
      "blog Teneryfa",
      "porady Teneryfa",
      "Wyspy Kanaryjskie przewodnik",
      "wakacje Teneryfa",
    ],
  },
  fr: {
    title: "Blog voyage Ténérife | conseils & idées | Tenerifly.io",
    description:
      "Guides pratiques, itinéraires et actualités sur Ténérife et les îles Canaries — pour préparer votre séjour.",
    keywords: [
      "blog Ténérife",
      "conseils Ténérife",
      "guide Canaries",
      "itinéraire Ténérife",
    ],
  },
  ru: {
    title: "Блог о Тенерифе — советы и гиды | Tenerifly.io",
    description:
      "Полезные материалы, маршруты и новости о Тенерифе и Канарах — для тех, кто планирует поездку.",
    keywords: [
      "блог Тенерифе",
      "советы Тенерифе",
      "гид Канары",
      "маршрут Тенерифе",
    ],
  },
  uk: {
    title: "Блог про Тенеріфе — поради та гіди | Tenerifly.io",
    description:
      "Корисні матеріали, маршрути та новини про Тенеріфе й Канарські острови — для планування подорожі.",
    keywords: [
      "блог Тенеріфе",
      "поради Тенеріфе",
      "гід Канари",
      "маршрут Тенеріфе",
    ],
  },
  de: {
    title: "Teneriffa Reiseblog | Tipps & Inspiration | Tenerifly.io",
    description:
      "Praktische Ratgeber, Routen und Neuigkeiten zu Teneriffa und den Kanaren — für die Reiseplanung.",
    keywords: [
      "Teneriffa Blog",
      "Reisetipps Teneriffa",
      "Kanaren Guide",
      "Routen Teneriffa",
    ],
  },
  es: {
    title: "Blog de viajes Tenerife | consejos y rutas | Tenerifly.io",
    description:
      "Guías prácticas, rutas y novedades sobre Tenerife y Canarias — para organizar tu escapada.",
    keywords: [
      "blog Tenerife",
      "consejos Tenerife",
      "guía Canarias",
      "ruta Tenerife",
    ],
  },
};
