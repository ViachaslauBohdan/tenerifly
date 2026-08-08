import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE_BRAND } from "@/lib/site";
import translationsJson from "@/i18n/main.json";

type FooterCopy = (typeof translationsJson)["en"]["footer"];
type ExcursionsCopy = (typeof translationsJson)["en"]["sections"]["excursions"];

type HomeFooterProps = {
  footer: FooterCopy;
  excursionsTitle: ExcursionsCopy["title"];
  legalPageTitle?: string;
  createLocaleLink: (path: string) => string;
};

export function HomeFooter({
  footer,
  excursionsTitle,
  legalPageTitle,
  createLocaleLink,
}: HomeFooterProps) {
  const legalNotice = (footer as { legalNotice?: string }).legalNotice;

  return (
    <footer className="py-16 md:py-20" style={{ backgroundColor: "#1a1b1e" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">{SITE_BRAND}</h3>
            <p className="text-gray-400 mb-4">{footer.description}</p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} {SITE_BRAND}. All rights reserved.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              {footer.quickLinks}
            </h4>
            <nav className="space-y-3" aria-label={footer.quickLinks}>
              <Link
                href={createLocaleLink("/#excursions")}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                {excursionsTitle}
              </Link>
              <Link
                href={createLocaleLink("/#faq")}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                FAQ
              </Link>
              {legalPageTitle ? (
                <Link
                  href={createLocaleLink("/aviso-legal")}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  {legalPageTitle}
                </Link>
              ) : null}
            </nav>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              {footer.contacts}
            </h4>
            <div className="space-y-3">
              <a
                href="tel:+34613211069"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                +34613211069
              </a>
            </div>
          </div>
        </div>
        {legalNotice ? (
          <div className="mt-10 border-t border-gray-700 pt-8 md:mt-12 md:pt-10">
            <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">
              {legalNotice}
            </p>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
