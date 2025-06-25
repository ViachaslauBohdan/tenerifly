export type Locale = 'en' | 'pl' | 'fr' | 'ru' | 'uk';

export interface LocaleConfig {
  code: Locale;
  name: string;
  flag: string;
}

export const LOCALES: LocaleConfig[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
];