const COPY: Record<string, { label: string; placeholder: string; empty: string }> = {
  en: {
    label: "Search",
    placeholder: "Name, area or description",
    empty: "Nothing matches this search.",
  },
  ru: {
    label: "Поиск",
    placeholder: "Название, район или описание",
    empty: "Ничего не найдено.",
  },
  pl: {
    label: "Szukaj",
    placeholder: "Nazwa, dzielnica lub opis",
    empty: "Nic nie pasuje do wyszukiwania.",
  },
  fr: {
    label: "Recherche",
    placeholder: "Nom, quartier ou description",
    empty: "Aucun résultat pour cette recherche.",
  },
  uk: {
    label: "Пошук",
    placeholder: "Назва, район або опис",
    empty: "Нічого не знайдено.",
  },
  ua: {
    label: "Пошук",
    placeholder: "Назва, район або опис",
    empty: "Нічого не знайдено.",
  },
  de: {
    label: "Suche",
    placeholder: "Name, Gebiet oder Beschreibung",
    empty: "Keine Treffer für diese Suche.",
  },
  es: {
    label: "Buscar",
    placeholder: "Nombre, zona o descripción",
    empty: "Nada coincide con la búsqueda.",
  },
};

export function catalogSearchCopy(locale: string) {
  return COPY[locale] || COPY.en;
}

export function catalogSearchQuery(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

export function matchesCatalogSearch(
  query: string,
  parts: Array<string | number | null | undefined>
): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = parts
    .filter((part) => part !== undefined && part !== null && String(part).trim() !== "")
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}
