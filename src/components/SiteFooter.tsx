"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { pickLocaleBundle } from "@/types/locale";
import mainJson from "@/i18n/main.json";
import { navShortFaqLabel } from "@/lib/navShortLabels";

type FooterBundle = {
  footer?: {
    description?: string;
    contacts?: string;
    quickLinks?: string;
    legalNotice?: string;
  };
  sections?: { excursions?: { title?: string } };
  legalPage?: { title?: string };
};

const footerNavLinkClass =
  "block text-gray-400 transition-colors hover:text-white";

export function SiteFooter() {
  const { locale, createLocaleLink } = useTranslation();
  const t = pickLocaleBundle(mainJson as Record<string, FooterBundle>, locale);
  const faqLabel = pickLocaleBundle(navShortFaqLabel, locale);
  const excursionsTitle = t.sections?.excursions?.title?.trim();
  const legalPageTitle = t.legalPage?.title?.trim();

  return (
    <footer className="py-16 md:py-20" style={{ backgroundColor: "#1a1b1e" }}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-2xl font-bold text-white">Tenerifly.io</h3>
            {t.footer?.description ? (
              <p className="mb-4 text-gray-400">{t.footer.description}</p>
            ) : null}
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Tenerifly. All rights reserved.
            </p>
          </div>

          <div>
            {t.footer?.quickLinks ? (
              <h4 className="mb-6 text-lg font-semibold text-white">
                {t.footer.quickLinks}
              </h4>
            ) : null}
            <nav className="space-y-3" aria-label={t.footer?.quickLinks}>
              {excursionsTitle ? (
                <Link
                  href={createLocaleLink("/#excursions")}
                  className={footerNavLinkClass}
                >
                  {excursionsTitle}
                </Link>
              ) : null}
              <Link href={createLocaleLink("/#faq")} className={footerNavLinkClass}>
                {faqLabel}
              </Link>
              {legalPageTitle ? (
                <Link
                  href={createLocaleLink("/aviso-legal")}
                  className={footerNavLinkClass}
                >
                  {legalPageTitle}
                </Link>
              ) : null}
            </nav>
          </div>

          <div>
            {t.footer?.contacts ? (
              <h4 className="mb-6 text-lg font-semibold text-white">
                {t.footer.contacts}
              </h4>
            ) : null}
            <a
              href="tel:+34613211069"
              className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
            >
              <Phone className="h-4 w-4" />
              +34613211069
            </a>
          </div>
        </div>

        {t.footer?.legalNotice ? (
          <div className="mt-10 border-t border-gray-700 pt-8 md:mt-12 md:pt-10">
            <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">
              {t.footer.legalNotice}
            </p>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
