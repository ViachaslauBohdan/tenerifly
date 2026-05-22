/**
 * Sets document.documentElement.lang without calling headers() in the root layout
 * (keeps pages statically cacheable).
 */
export function LocaleHtmlLang({ locale }: { locale: string }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(locale)};`,
      }}
    />
  );
}
