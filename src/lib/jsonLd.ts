import type { Locale } from "@/types/locale";
import { SITE_URL, absoluteUrlForLocale } from "@/lib/seo";
import { SITE_BRAND } from "@/lib/site";

export function stripRichTextToPlain(html: string, maxLen = 5000): string {
  if (!html) return "";
  const plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > maxLen ? `${plain.slice(0, maxLen)}…` : plain;
}

const BC: Record<
  Locale,
  {
    home: string;
    apartments: string;
    tours: string;
    cars: string;
    blog: string;
  }
> = {
  en: {
    home: "Home",
    apartments: "Apartments",
    tours: "Tours",
    cars: "Car hire",
    blog: "Blog",
  },
  pl: {
    home: "Strona główna",
    apartments: "Apartamenty",
    tours: "Wycieczki",
    cars: "Wynajem aut",
    blog: "Blog",
  },
  fr: {
    home: "Accueil",
    apartments: "Appartements",
    tours: "Excursions",
    cars: "Location de voiture",
    blog: "Blog",
  },
  ru: {
    home: "Главная",
    apartments: "Апартаменты",
    tours: "Экскурсии",
    cars: "Аренда авто",
    blog: "Блог",
  },
  ua: {
    home: "Головна",
    apartments: "Апартаменти",
    tours: "Тури",
    cars: "Оренда авто",
    blog: "Блог",
  },
  de: {
    home: "Startseite",
    apartments: "Apartments",
    tours: "Ausflüge",
    cars: "Mietwagen",
    blog: "Blog",
  },
  es: {
    home: "Inicio",
    apartments: "Apartamentos",
    tours: "Excursiones",
    cars: "Alquiler de coches",
    blog: "Blog",
  },
};

export type BreadcrumbSegment =
  | { kind: "home" }
  | { kind: "apartments" }
  | { kind: "tours" }
  | { kind: "cars" }
  | { kind: "blog" }
  | { kind: "named"; name: string; path: string };

const SECTION_PATH: Record<
  Exclude<BreadcrumbSegment, { kind: "named" }>["kind"],
  string
> = {
  home: "",
  apartments: "/apartments",
  tours: "/tours",
  cars: "/cars",
  blog: "/blog",
};

function segmentToItem(
  locale: Locale,
  seg: BreadcrumbSegment
): { name: string; url: string } {
  if (seg.kind === "named") {
    return {
      name: seg.name,
      url: absoluteUrlForLocale(locale, seg.path),
    };
  }
  const L = BC[locale];
  const labels: Record<typeof seg.kind, string> = {
    home: L.home,
    apartments: L.apartments,
    tours: L.tours,
    cars: L.cars,
    blog: L.blog,
  };
  return {
    name: labels[seg.kind],
    url: absoluteUrlForLocale(locale, SECTION_PATH[seg.kind]),
  };
}

export function breadcrumbListJsonLd(
  locale: Locale,
  segments: BreadcrumbSegment[]
): Record<string, unknown> {
  const items = segments.map((s) => segmentToItem(locale, s));
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function detailJsonLdGraph(
  nodes: Record<string, unknown>[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

export function blogPostingJsonLd(input: {
  url: string;
  headline: string;
  description: string;
  image: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@type": "BlogPosting",
    "@id": `${input.url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
    headline: input.headline,
    description: stripRichTextToPlain(input.description, 500),
    image: input.image,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
  if (input.datePublished) node.datePublished = input.datePublished;
  if (input.dateModified) node.dateModified = input.dateModified;
  if (input.authorName) {
    node.author = { "@type": "Person", name: input.authorName };
  }
  return node;
}

export function productOfferJsonLd(input: {
  url: string;
  name: string;
  description: string;
  image: string;
  price?: number;
  priceCurrency?: string;
}): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@type": "Product",
    "@id": `${input.url}#product`,
    name: input.name,
    description: stripRichTextToPlain(input.description, 500),
    image: input.image,
    url: input.url,
    brand: { "@type": "Brand", name: SITE_BRAND },
  };
  if (
    input.price != null &&
    Number.isFinite(input.price) &&
    input.priceCurrency
  ) {
    node.offers = {
      "@type": "Offer",
      url: input.url,
      priceCurrency: input.priceCurrency,
      price: input.price,
      availability: "https://schema.org/InStock",
    };
  }
  return node;
}

export function serviceTransferJsonLd(input: {
  url: string;
  name: string;
  description: string;
  image: string;
  lowPrice: number;
  highPrice: number;
  priceCurrency: string;
}): Record<string, unknown> {
  return {
    "@type": "Service",
    "@id": `${input.url}#service`,
    name: input.name,
    description: stripRichTextToPlain(input.description, 500),
    image: input.image,
    url: input.url,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Tenerife",
      containedInPlace: { "@type": "Country", name: "Spain" },
    },
    offers: {
      "@type": "AggregateOffer",
      url: input.url,
      priceCurrency: input.priceCurrency,
      lowPrice: input.lowPrice,
      highPrice: input.highPrice,
      offerCount: 2,
    },
  };
}
