"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { pickLocaleBundle } from "@/types/locale";
import mainJson from "@/i18n/main.json";

type FooterBundle = {
  footer?: {
    description?: string;
    contacts?: string;
    legalNotice?: string;
  };
  sections?: { excursions?: { title?: string } };
  faq?: { title?: string };
};

export function SiteFooter() {
  const { locale, createLocaleLink } = useTranslation();
  const t = pickLocaleBundle(mainJson as Record<string, FooterBundle>, locale);

  return (
    <footer className="py-16 md:py-20" style={{ backgroundColor: "#1a1b1e" }}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
            <div className="mt-6 space-y-3">
              {t.sections?.excursions?.title ? (
                <Link
                  href={createLocaleLink("/#excursions")}
                  className="block text-gray-400 transition-colors hover:text-white"
                >
                  {t.sections.excursions.title}
                </Link>
              ) : null}
              {t.faq?.title ? (
                <Link
                  href={createLocaleLink("/#faq")}
                  className="block text-gray-400 transition-colors hover:text-white"
                >
                  {t.faq.title}
                </Link>
              ) : null}
            </div>
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
