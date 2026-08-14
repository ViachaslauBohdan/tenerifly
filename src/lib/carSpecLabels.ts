import { localeContentKey } from "@/types/locale";

const TRANSMISSION_LABELS: Record<string, Record<string, string>> = {
  automatic: {
    en: "Automatic",
    ru: "Автомат",
    pl: "Automatyczna",
    fr: "Automatique",
    uk: "Автомат",
    de: "Automatik",
    es: "Automático",
  },
  manual: {
    en: "Manual",
    ru: "Механика",
    pl: "Manualna",
    fr: "Manuelle",
    uk: "Механіка",
    de: "Manuell",
    es: "Manual",
  },
  "semi-automatic": {
    en: "Semi-automatic",
    ru: "Полуавтомат",
    pl: "Półautomatyczna",
    fr: "Semi-automatique",
    uk: "Напівавтомат",
    de: "Halbautomatik",
    es: "Semiautomático",
  },
};

function normalizeTransmission(value: string): string {
  const key = value.trim().toLowerCase().replace(/_/g, "-");
  if (
    key === "auto" ||
    key === "автомат" ||
    key === "акпп" ||
    key === "automatik" ||
    key === "automatique" ||
    key === "automático" ||
    key === "automatico" ||
    key === "automatyczna"
  ) {
    return "automatic";
  }
  if (
    key === "механика" ||
    key === "мкпп" ||
    key === "manuell" ||
    key === "manuelle" ||
    key === "manualna" ||
    key === "механіка"
  ) {
    return "manual";
  }
  if (
    key === "semiautomatic" ||
    key === "полуавтомат" ||
    key === "полуавтоматическая" ||
    key === "напівавтомат"
  ) {
    return "semi-automatic";
  }
  return key;
}

/** CMS stores `automatic` / `manual` / `semi-automatic`; show the UI locale label. */
export function carTransmissionLabel(
  value: string | null | undefined,
  locale: string
): string {
  if (!value || !value.trim()) return "—";
  const kind = normalizeTransmission(value);
  const bundle = TRANSMISSION_LABELS[kind];
  if (!bundle) return value;
  const lang = localeContentKey(locale);
  return bundle[lang] || bundle.en;
}
