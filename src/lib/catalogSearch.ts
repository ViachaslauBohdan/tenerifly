const COPY: Record<
  string,
  {
    label: string;
    placeholder: string;
    empty: string;
    clear: string;
    namePlaceholder: string;
  }
> = {
  en: {
    label: "Search",
    placeholder: "Name, area or description",
    empty: "Nothing matches this search.",
    clear: "Clear search",
    namePlaceholder: "Apartment name",
  },
  ru: {
    label: "Поиск",
    placeholder: "Название, район или описание",
    empty: "Ничего не найдено.",
    clear: "Очистить поиск",
    namePlaceholder: "Название квартиры",
  },
  pl: {
    label: "Szukaj",
    placeholder: "Nazwa, dzielnica lub opis",
    empty: "Nic nie pasuje do wyszukiwania.",
    clear: "Wyczyść wyszukiwanie",
    namePlaceholder: "Nazwa apartamentu",
  },
  fr: {
    label: "Recherche",
    placeholder: "Nom, quartier ou description",
    empty: "Aucun résultat pour cette recherche.",
    clear: "Effacer la recherche",
    namePlaceholder: "Nom de l'appartement",
  },
  uk: {
    label: "Пошук",
    placeholder: "Назва, район або опис",
    empty: "Нічого не знайдено.",
    clear: "Очистити пошук",
    namePlaceholder: "Назва апартаментів",
  },
  ua: {
    label: "Пошук",
    placeholder: "Назва, район або опис",
    empty: "Нічого не знайдено.",
    clear: "Очистити пошук",
    namePlaceholder: "Назва апартаментів",
  },
  de: {
    label: "Suche",
    placeholder: "Name, Gebiet oder Beschreibung",
    empty: "Keine Treffer für diese Suche.",
    clear: "Suche löschen",
    namePlaceholder: "Name der Wohnung",
  },
  es: {
    label: "Buscar",
    placeholder: "Nombre, zona o descripción",
    empty: "Nada coincide con la búsqueda.",
    clear: "Borrar búsqueda",
    namePlaceholder: "Nombre del apartamento",
  },
};

export function catalogSearchCopy(locale: string) {
  return COPY[locale] || COPY.en;
}

export function catalogSearchQuery(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function catalogSearchWords(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

export function matchesCatalogSearch(
  query: string,
  parts: Array<string | number | null | undefined>
): boolean {
  const tokens = catalogSearchWords(query);
  if (tokens.length === 0) return true;
  const haystack = new Set(
    catalogSearchWords(
      parts
        .filter((part) => part !== undefined && part !== null && String(part).trim() !== "")
        .join(" ")
    )
  );
  return tokens.every((token) => haystack.has(token));
}

/** Letter sequence inside an apartment title. Description and area are ignored. */
export function matchesCatalogName(query: string, name: unknown): boolean {
  const needle = catalogSearchQuery(query);
  if (!needle) return true;
  return String(name ?? "").toLowerCase().includes(needle);
}
