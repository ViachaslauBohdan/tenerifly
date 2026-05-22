"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { ChevronDown, Languages, Menu, X } from "lucide-react";
import { localeDisplayCode } from "@/types/locale";
import worldToursJson from "@/i18n/worldTours.json";
import { pickLocaleBundle } from "@/types/locale";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ua", name: "Українська", flag: "🇺🇦" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
] as const;

export type SiteHeaderLanguage = (typeof languages)[number]["code"];

const headerNavHome: Record<string, string> = {
  en: "Home",
  ru: "Главная",
  pl: "Start",
  fr: "Accueil",
  uk: "Головна",  ua: "Головна",
  de: "Start",
  es: "Inicio",
};

const headerNavFaq: Record<string, string> = {
  en: "FAQ",
  ru: "Вопросы",
  pl: "FAQ",
  fr: "FAQ",
  uk: "Питання",  ua: "Питання",
  de: "FAQ",
  es: "FAQ",
};

const headerNavTransfers: Record<string, string> = {
  en: "Transfers",
  ru: "Трансферы",
  pl: "Transfery",
  fr: "Transferts",
  uk: "Трансфери",  ua: "Трансфери",
  de: "Transfers",
  es: "Traslados",
};

const headerAnchorClass =
  "touch-manipulation whitespace-nowrap rounded-md px-1.5 py-1 text-[11px] font-medium leading-tight text-white/90 transition-colors hover:bg-white/10 hover:text-white min-[400px]:rounded-lg min-[400px]:px-2 min-[400px]:py-1.5 min-[400px]:text-xs sm:px-2 sm:py-1.5 sm:text-sm sm:leading-normal md:py-1.5 lg:px-2.5";

const headerAnchorActiveClass =
  "touch-manipulation whitespace-nowrap rounded-md bg-white/15 px-1.5 py-1 text-[11px] font-medium leading-tight text-white min-[400px]:rounded-lg min-[400px]:px-2 min-[400px]:py-1.5 min-[400px]:text-xs sm:px-2 sm:py-1.5 sm:text-sm sm:leading-normal md:py-1.5 lg:px-2.5";

const mobileNavLinkClass =
  "touch-manipulation block w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white active:bg-white/15";

type SiteHeaderProps = {
  language: SiteHeaderLanguage;
  onLanguageChange: (code: SiteHeaderLanguage) => void;
  selectLanguageLabel: string;
  tabLabels: {
    accommodation: string;
    cars: string;
    excursions: string;
    blog: string;
  };
  variant?: "home" | "standalone";
  showTransfers?: boolean;
  activePage?: "world-tours";
  createLocaleLink: (path: string) => string;
  onScrollToSection?: (
    sectionId: string
  ) => (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function SiteHeader({
  language,
  onLanguageChange,
  selectLanguageLabel,
  tabLabels,
  variant = "standalone",
  showTransfers = false,
  activePage,
  createLocaleLink,
  onScrollToSection,
}: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (media.matches) setMobileMenuOpen(false);
    };
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const worldToursNav = pickLocaleBundle(
    worldToursJson as Record<string, { badge: string }>,
    language
  );
  const homeHref = createLocaleLink("/");

  const sectionHref = (sectionId: string) =>
    variant === "home" ? `#${sectionId}` : `${homeHref}#${sectionId}`;

  const navLinkProps = (sectionId: string) => {
    if (variant === "home" && onScrollToSection) {
      return {
        href: `#${sectionId}`,
        onClick: onScrollToSection(sectionId),
      };
    }
    return { href: sectionHref(sectionId) };
  };

  const navLinkPropsMobile = (sectionId: string) => {
    const props = navLinkProps(sectionId);
    const baseOnClick = props.onClick;
    return {
      ...props,
      onClick: (e: MouseEvent<HTMLAnchorElement>) => {
        closeMobileMenu();
        baseOnClick?.(e);
      },
    };
  };

  const worldToursClassName =
    activePage === "world-tours" ? headerAnchorActiveClass : headerAnchorClass;

  const mobileWorldToursClassName =
    activePage === "world-tours"
      ? `${mobileNavLinkClass} bg-white/15 text-white`
      : mobileNavLinkClass;

  const renderNavLinks = (linkClass: string, worldToursLinkClass: string) => (
    <>
      {variant === "home" ? (
        <a {...navLinkProps("home")} className={linkClass}>
          {pickLocaleBundle(headerNavHome, language)}
        </a>
      ) : (
        <Link href={homeHref} className={linkClass} onClick={closeMobileMenu}>
          {pickLocaleBundle(headerNavHome, language)}
        </Link>
      )}
      <a {...navLinkProps("accommodation")} className={linkClass}>
        {tabLabels.accommodation}
      </a>
      <a {...navLinkProps("cars")} className={linkClass}>
        {tabLabels.cars}
      </a>
      {showTransfers && (
        <a {...navLinkProps("transfers")} className={linkClass}>
          {pickLocaleBundle(headerNavTransfers, language)}
        </a>
      )}
      <a {...navLinkProps("excursions")} className={linkClass}>
        {tabLabels.excursions}
      </a>
      <a {...navLinkProps("blog")} className={linkClass}>
        {tabLabels.blog}
      </a>
      <a {...navLinkProps("faq")} className={linkClass}>
        {pickLocaleBundle(headerNavFaq, language)}
      </a>
      <Link
        href={createLocaleLink("/world-tours")}
        className={worldToursLinkClass}
        aria-current={activePage === "world-tours" ? "page" : undefined}
        onClick={closeMobileMenu}
      >
        {worldToursNav.badge}
      </Link>
    </>
  );

  const renderMobileNavLinks = () => (
    <>
      {variant === "home" ? (
        <a {...navLinkPropsMobile("home")} className={mobileNavLinkClass}>
          {pickLocaleBundle(headerNavHome, language)}
        </a>
      ) : (
        <Link
          href={homeHref}
          className={mobileNavLinkClass}
          onClick={closeMobileMenu}
        >
          {pickLocaleBundle(headerNavHome, language)}
        </Link>
      )}
      <a {...navLinkPropsMobile("accommodation")} className={mobileNavLinkClass}>
        {tabLabels.accommodation}
      </a>
      <a {...navLinkPropsMobile("cars")} className={mobileNavLinkClass}>
        {tabLabels.cars}
      </a>
      {showTransfers && (
        <a {...navLinkPropsMobile("transfers")} className={mobileNavLinkClass}>
          {pickLocaleBundle(headerNavTransfers, language)}
        </a>
      )}
      <a {...navLinkPropsMobile("excursions")} className={mobileNavLinkClass}>
        {tabLabels.excursions}
      </a>
      <a {...navLinkPropsMobile("blog")} className={mobileNavLinkClass}>
        {tabLabels.blog}
      </a>
      <a {...navLinkPropsMobile("faq")} className={mobileNavLinkClass}>
        {pickLocaleBundle(headerNavFaq, language)}
      </a>
      <Link
        href={createLocaleLink("/world-tours")}
        className={mobileWorldToursClassName}
        aria-current={activePage === "world-tours" ? "page" : undefined}
        onClick={closeMobileMenu}
      >
        {worldToursNav.badge}
      </Link>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/55 backdrop-blur-md pt-[env(safe-area-inset-top,0px)]">
      <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-1.5 px-2 pb-2 pt-1.5 min-[400px]:gap-2 min-[400px]:px-2.5 min-[400px]:pb-2.5 sm:px-3 md:flex-row md:items-center md:gap-2 md:py-2 md:pb-2 lg:gap-3 lg:px-4">
        <div className="flex w-full min-w-0 items-center justify-between gap-2 md:contents">
          <div
            className="relative shrink-0 [color-scheme:dark] md:order-3"
            title={languages.find((l) => l.code === language)?.name}
          >
            <div className="flex h-7 items-stretch overflow-hidden rounded-full border border-white/20 bg-black/25 shadow-sm backdrop-blur-md min-[400px]:h-8 sm:h-9">
              <span
                className="flex items-center border-r border-white/10 bg-white/[0.06] px-1.5 text-white/70 min-[400px]:px-2"
                aria-hidden
              >
                <Languages className="h-3 w-3 min-[400px]:h-3.5 min-[400px]:w-3.5 sm:h-4 sm:w-4" />
              </span>
              <div className="relative min-w-[2.85rem] min-[400px]:min-w-[3.15rem]">
                <select
                  value={language}
                  onChange={(e) =>
                    onLanguageChange(e.target.value as SiteHeaderLanguage)
                  }
                  aria-label={selectLanguageLabel}
                  className="h-full w-full min-w-[2.85rem] cursor-pointer appearance-none bg-transparent py-0 pl-1.5 pr-6 text-[10px] font-semibold uppercase tracking-wide text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/25 min-[400px]:min-w-[3.15rem] min-[400px]:pl-2 min-[400px]:pr-7 min-[400px]:text-[11px] sm:min-w-[3.35rem] sm:pl-2.5 sm:pr-8 sm:text-sm"
                >
                  {languages.map((lang) => (
                    <option
                      key={lang.code}
                      value={lang.code}
                      className="bg-slate-900 text-white"
                    >
                      {`${lang.flag} ${localeDisplayCode(lang.code)}`}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden
                  className="pointer-events-none absolute right-0.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white/45 min-[400px]:right-1 min-[400px]:h-3.5 min-[400px]:w-3.5 sm:right-1.5 sm:h-4 sm:w-4"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white transition-colors hover:bg-white/10 min-[400px]:h-9 min-[400px]:w-9 md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="site-header-mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>

        <nav
          className="hidden min-h-0 min-w-0 flex-1 flex-nowrap items-center gap-0 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] md:order-2 md:flex md:max-w-full md:justify-start md:overflow-y-visible lg:scroll-pr-0 [&::-webkit-scrollbar]:hidden"
          aria-label="Page sections"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {renderNavLinks(headerAnchorClass, worldToursClassName)}
        </nav>

        <nav
          id="site-header-mobile-menu"
          className={`w-full flex-col gap-0.5 border-t border-white/10 py-2 md:hidden ${
            mobileMenuOpen ? "flex" : "hidden"
          }`}
          aria-label="Page sections"
        >
          {renderMobileNavLinks()}
        </nav>
      </div>
    </header>
  );
}
