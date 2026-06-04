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
    ua: "uk_UA",
    de: "de_DE",
    es: "es_ES",
  };
  return map[locale];
}

/** Other locales for `openGraph.alternateLocale` (Facebook / OG locale hints). */
export function openGraphAlternateLocales(exclude: Locale): string[] {
  return LOCALES.filter((l) => l.code !== exclude).map((l) => ogLocale(l.code));
}

export function organizationAndWebsiteJsonLd(): Record<string, unknown> {
  const homeEn = absoluteUrlForLocale("en", "");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Tenerifly.io",
        url: SITE_URL,
        sameAs: ["https://twitter.com/tenerifly"],
        logo: {
          "@type": "ImageObject",
          url: DEFAULT_OG_IMAGE,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: homeEn,
        name: "Tenerifly.io",
        alternateName: ["Tenerifly"],
        description:
          "Tenerife travel: rent apartments and holiday homes, hire cars, and book tours in the Canary Islands. Plan your trip to Tenerife—flights, stays, and local experiences.",
        inLanguage: ["en", "pl", "fr", "ru", "ua", "de", "es"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

export const SEO_HOME: Record<Locale, PageSeo> = {
  en: {
    title: "Tenerifly.io — Tenerife travel: fly, stay & explore the Canary Islands",
    description:
      "Flying to Tenerife? Plan your whole trip on Tenerifly.io: rent apartments and villas, hire a car, and book tours across Tenerife—Spain’s largest Canary Island. Search Tenerife holidays with local hosts.",
    keywords: [
      "Tenerife",
      "fly to Tenerife",
      "Tenerife flights",
      "Tenerife holiday",
      "Tenerife Canary Islands",
      "visit Tenerife",
      "Tenerife stays",
      "Tenerife car rental",
      "Tenerife tours",
      "Tenerife travel",
      "Canary Islands holiday",
    ],
  },
  pl: {
    title: "Tenerifly.io — Lot na Teneryfę: noclegi, auto i wycieczki",
    description:
      "Planujesz lot na Teneryfę? Zarezerwuj nocleg, wynajem auta i wycieczki w jednym miejscu. Teneryfa i Wyspy Kanaryjskie — oferty od lokalnych gospodarzy, bez pośredników.",
    keywords: [
      "Teneryfa",
      "lot na Teneryfę",
      "Teneryfa wakacje",
      "Wyspy Kanaryjskie",
      "noclegi Teneryfa",
      "wynajem aut Teneryfa",
      "wycieczki Teneryfa",
      "apartamenty Teneryfa",
    ],
  },
  fr: {
    title: "Tenerifly.io — Voyage à Ténérife : vol, séjour et îles Canaries",
    description:
      "Vous prévoyez un vol vers Ténérife ? Réservez hébergement, voiture et excursions au même endroit. Ténérife et les Canaries avec des prestataires locaux.",
    keywords: [
      "Ténérife",
      "vol Ténérife",
      "vacances Ténérife",
      "îles Canaries",
      "hébergement Ténérife",
      "location voiture Ténérife",
      "excursions Ténérife",
      "voyage Ténérife",
    ],
  },
  ru: {
    title: "Tenerifly.io — Тенерифе: перелёт, жильё, авто и туры на Канарах",
    description:
      "Собираетесь на Тенерифе? Забронируйте жильё, аренду авто и экскурсии в одном сервисе. Канарские острова — прямые цены от местных организаторов.",
    keywords: [
      "Тенерифе",
      "перелёт на Тенерифе",
      "отдых на Тенерифе",
      "Канарские острова",
      "аренда жилья Тенерифе",
      "аренда авто Тенерифе",
      "экскурсии Тенерифе",
      "Канары тур",
    ],
  },
  ua: {
    title: "Tenerifly.io — Тенеріфе: переліт, житло, авто та тури",
    description:
      "Плануєте політ на Тенеріфе? Забронюйте житло, оренду авто та тури в одному місці. Канарські острови — прямі пропозиції від локальних партнерів.",
    keywords: [
      "Тенеріфе",
      "політ на Тенеріфе",
      "відпочинок Тенеріфе",
      "Канарські острови",
      "житло Тенеріфе",
      "оренда авто Тенеріфе",
      "тури Тенеріфе",
      "Канари подорож",
    ],
  },
  de: {
    title: "Tenerifly.io — Teneriffa Urlaub: Flug, Unterkunft & Mietwagen",
    description:
      "Sie fliegen nach Teneriffa? Unterkunft, Mietwagen und Ausflüge zentral planen. Kanaren-Urlaub mit lokalen Anbietern — direkt und transparent buchen.",
    keywords: [
      "Teneriffa",
      "Flug Teneriffa",
      "Teneriffa Urlaub",
      "Kanaren",
      "Unterkunft Teneriffa",
      "Mietwagen Teneriffa",
      "Ausflüge Teneriffa",
      "Kanaren Reise",
    ],
  },
  es: {
    title: "Tenerifly.io — Viajar a Tenerife: vuelo, alojamiento y coche",
    description:
      "¿Vuelo a Tenerife? Reserva apartamento o villa, coche de alquiler y excursiones en un solo sitio. Tenerife e Islas Canarias con proveedores locales.",
    keywords: [
      "Tenerife",
      "vuelo a Tenerife",
      "vacaciones Tenerife",
      "Islas Canarias",
      "alojamiento Tenerife",
      "alquiler coche Tenerife",
      "excursiones Tenerife",
      "viaje Tenerife",
    ],
  },
};

export const SEO_APARTMENTS: Record<Locale, PageSeo> = {
  en: {
    title: "Tenerife apartments for rent | holiday lets & short stays | Tenerifly.io",
    description:
      "Rent an apartment in Tenerife for your holiday or longer stay. Browse holiday lets, flats, and villas—Tenerife apartment rental with direct booking from local hosts in the Canary Islands.",
    keywords: [
      "Tenerife rent apartment",
      "rent apartment Tenerife",
      "Tenerife apartment rental",
      "Tenerife apartments for rent",
      "holiday apartment Tenerife",
      "Tenerife stays",
      "Tenerife apartments",
      "Tenerife villas",
      "holiday rental Tenerife",
      "Canary Islands stays",
    ],
  },
  pl: {
    title: "Wynajem apartamentu na Teneryfie | noclegi i krótkie pobyty | Tenerifly.io",
    description:
      "Wynajem apartamentu na Teneryfie — wakacje i dłuższe pobyty. Przeglądaj oferty: apartamenty, wille i domy. Rezerwacja u lokalnych gospodarzy na Wyspach Kanaryjskich.",
    keywords: [
      "wynajem apartamentu Teneryfa",
      "apartament Teneryfa wynajem",
      "noclegi Teneryfa",
      "apartamenty Teneryfa",
      "wille Teneryfa",
      "wynajem Teneryfa",
      "Wyspy Kanaryjskie noclegi",
    ],
  },
  fr: {
    title: "Louer un appartement à Ténérife | location saisonnière | Tenerifly.io",
    description:
      "Louer un appartement à Ténérife pour vos vacances ou un séjour prolongé. Appartements, villas et maisons d’hôtes aux Canaries — réservation directe.",
    keywords: [
      "louer appartement Ténérife",
      "location appartement Ténérife",
      "hébergement Ténérife",
      "appartement Ténérife",
      "location vacances Ténérife",
      "villa Ténérife",
      "Canaries séjour",
    ],
  },
  ru: {
    title: "Снять квартиру на Тенерифе | аренда жилья и апартаментов | Tenerifly.io",
    description:
      "Аренда квартиры на Тенерифе для отдыха или длительного проживания. Квартиры, виллы, апартаменты на Канарах — бронирование напрямую у владельцев.",
    keywords: [
      "снять квартиру Тенерифе",
      "аренда квартиры Тенерифе",
      "аренда апартаментов Тенерифе",
      "жильё Тенерифе",
      "апартаменты Тенерифе",
      "аренда жилья Тенерифе",
      "Канары жильё",
    ],
  },
  ua: {
    title: "Оренда квартири на Тенеріфе | подобово та довгостроково | Tenerifly.io",
    description:
      "Оренда квартири на Тенеріфе для відпочинку чи довшого перебування. Квартири, апартаменти, вілли на Канарах — бронювання напряму у власників.",
    keywords: [
      "оренда квартири Тенеріфе",
      "зняти квартиру Тенеріфе",
      "квартира подобово Тенеріфе",
      "житло Тенеріфе",
      "апартаменти Тенеріфе",
      "оренда житла Тенеріфе",
      "Канари житло",
    ],
  },
  de: {
    title: "Wohnung auf Teneriffa mieten | Ferienwohnung & Apartment | Tenerifly.io",
    description:
      "Apartment oder Ferienwohnung auf Teneriffa mieten — Kurzurlaub oder längerer Aufenthalt. Angebote von lokalen Gastgebern auf den Kanaren vergleichen.",
    keywords: [
      "Wohnung mieten Teneriffa",
      "Ferienwohnung Teneriffa",
      "Apartment Teneriffa",
      "Unterkunft Teneriffa",
      "Teneriffa mieten",
      "Villa Teneriffa",
      "Kanaren Urlaub",
    ],
  },
  es: {
    title: "Alquiler apartamento Tenerife | vacacional y larga estancia | Tenerifly.io",
    description:
      "Alquilar apartamento en Tenerife para vacaciones o estancias largas. Pisos, apartamentos y villas en Canarias — reserva directa con anfitriones locales.",
    keywords: [
      "alquiler apartamento Tenerife",
      "alquilar piso Tenerife",
      "apartamentos Tenerife",
      "alquiler vacacional Tenerife",
      "alojamiento Tenerife",
      "villa Tenerife",
      "Canarias alojamiento",
    ],
  },
};

export const SEO_TOURS: Record<Locale, PageSeo> = {
  en: {
    title: "Tours in Tenerife | Tenerifly.io",
    description:
      "Book Teide, whale watching, hiking, and boat trips in Tenerife. Hand-picked experiences across the Canary Islands with trusted local operators.",
    keywords: [
      "Tenerife tours",
      "Tenerife day tours",
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
  ua: {
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

export const SEO_WORLD_TOURS: Record<Locale, PageSeo> = {
  en: {
    title: "Worldwide package tour search | Tenerifly.io",
    description:
      "Search package tours to any country, resort, or hotel worldwide. Compare departures from your city — beyond Tenerife and the Canary Islands.",
    keywords: [
      "worldwide tour search",
      "package tours",
      "international holidays",
      "tour search",
      "world travel deals",
    ],
  },
  pl: {
    title: "Wyszukiwarka tourów na całym świecie | Tenerifly.io",
    description:
      "Wycieczki pakietowe do dowolnego kraju, kurortu lub hotelu. Porównuj wyloty z Twojego miasta — nie tylko Teneryfa.",
    keywords: [
      "tury na świecie",
      "wycieczki pakietowe",
      "wyszukiwarka tourów",
      "wakacje za granicą",
    ],
  },
  fr: {
    title: "Recherche de circuits dans le monde | Tenerifly.io",
    description:
      "Séjours packagés vers tout pays, resort ou hôtel. Comparez les départs depuis votre ville — au-delà de Tenerife.",
    keywords: [
      "circuit monde",
      "voyage organisé",
      "recherche séjour",
      "tour opérateur",
    ],
  },
  ru: {
    title: "Поиск туров по всему миру | Tenerifly.io",
    description:
      "Пакетные туры в любую страну, курорт или отель. Ищите вылеты из вашего города — не только Тенерифе.",
    keywords: [
      "туры по миру",
      "пакетные туры",
      "поиск туров",
      "отдых за границей",
    ],
  },
  ua: {
    title: "Пошук туру по всьому світу | Tenerifly.io",
    description:
      "Пакетні тури в будь-яку країну, курорт чи готель. Порівнюйте вильоти з вашого міста — не лише Тенеріфе.",
    keywords: [
      "тури світу",
      "пакетні тури",
      "пошук туру",
      "відпочинок за кордоном",
    ],
  },
  de: {
    title: "Weltweite Pauschalreise-Suche | Tenerifly.io",
    description:
      "Pauschalreisen in jedes Land, jeden Ort und jedes Hotel. Abflüge aus Ihrer Stadt vergleichen — nicht nur Teneriffa.",
    keywords: [
      "Weltreisen",
      "Pauschalreisen",
      "Toursuche",
      "weltweit Urlaub",
    ],
  },
  es: {
    title: "Búsqueda de tours en todo el mundo | Tenerifly.io",
    description:
      "Viajes organizados a cualquier país, resort u hotel. Compara salidas desde tu ciudad — no solo Tenerife.",
    keywords: [
      "tours mundo",
      "viajes organizados",
      "buscador tours",
      "vacaciones internacionales",
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
  ua: {
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

export const SEO_LEGAL_NOTICE: Record<Locale, PageSeo> = {
  en: {
    title: "Legal Notice | Tenerifly.io",
    description:
      "Legal notice for tenerifly.io: PanaFera acts as an online tourism intermediary. Intermediary conditions, scope of services, and claims procedure.",
    keywords: [
      "Tenerifly legal notice",
      "PanaFera intermediary",
      "tourism intermediation Tenerife",
    ],
  },
  pl: {
    title: "Informacja prawna | Tenerifly.io",
    description:
      "Informacja prawna tenerifly.io: PanaFera jako pośrednik turystyczny online. Warunki pośrednictwa i zakres usług.",
    keywords: [
      "informacja prawna Tenerifly",
      "PanaFera pośrednik",
      "pośrednictwo turystyczne Teneryfa",
    ],
  },
  fr: {
    title: "Mentions légales | Tenerifly.io",
    description:
      "Mentions légales de tenerifly.io : PanaFera, service d'intermédiation touristique en ligne. Conditions d'intermédiation et champ des prestations.",
    keywords: [
      "mentions légales Tenerifly",
      "PanaFera intermédiaire",
      "intermédiation touristique Ténérife",
    ],
  },
  ru: {
    title: "Правовое уведомление | Tenerifly.io",
    description:
      "Правовое уведомление tenerifly.io: PanaFera как онлайн-посредник в туризме. Условия посредничества и объём услуг.",
    keywords: [
      "правовое уведомление Tenerifly",
      "PanaFera посредник",
      "туристическое посредничество Тенерифе",
    ],
  },
  ua: {
    title: "Правове повідомлення | Tenerifly.io",
    description:
      "Правове повідомлення tenerifly.io: PanaFera як онлайн-посередник у туризмі. Умови посередництва та обсяг послуг.",
    keywords: [
      "правове повідомлення Tenerifly",
      "PanaFera посередник",
      "туристичне посередництво Тенеріфе",
    ],
  },
  de: {
    title: "Rechtlicher Hinweis | Tenerifly.io",
    description:
      "Rechtlicher Hinweis zu tenerifly.io: PanaFera als Online-Tourismevermittler. Vermittlerbedingungen und Leistungsumfang.",
    keywords: [
      "rechtlicher Hinweis Tenerifly",
      "PanaFera Vermittler",
      "Tourismusvermittlung Teneriffa",
    ],
  },
  es: {
    title: "Aviso Legal | Tenerifly.io",
    description:
      "Aviso legal de tenerifly.io: PanaFera como intermediario turístico online. Condición de intermediario y alcance de los servicios.",
    keywords: [
      "aviso legal Tenerifly",
      "PanaFera intermediario",
      "intermediación turística Tenerife",
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
  ua: {
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
