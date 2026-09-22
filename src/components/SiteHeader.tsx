"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
// CreditCard used by commented Pay button below.
import { ChevronDown, /* CreditCard, */ Languages, Menu, X } from "lucide-react";
import { localeDisplayCode } from "@/types/locale";
import worldToursJson from "@/i18n/worldTours.json";
import mainJson from "@/i18n/main.json";
import { pickLocaleBundle } from "@/types/locale";
import { navShortFaqLabel } from "@/lib/navShortLabels";
import { BLOG_ENABLED } from "@/lib/siteFeatures";

type MainHeaderBundle = {
  legalPage?: { title?: string };
};

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
  uk: "Головна",
  ua: "Головна",
  de: "Start",
  es: "Inicio",
};

const headerNavTransfers: Record<string, string> = {
  en: "Transfers",
  ru: "Трансферы",
  pl: "Transfery",
  fr: "Transferts",
  uk: "Трансфери",
  ua: "Трансфери",
  de: "Transfers",
  es: "Traslados",
};

const headerNavAuthorTours: Record<string, string> = {
  en: "Author tours",
  ru: "Авторские туры",
  pl: "Wycieczki autorskie",
  fr: "Circuits auteur",
  uk: "Авторські тури",
  ua: "Авторські тури",
  de: "Autorentouren",
  es: "Tours de autor",
};

const headerAnchorClass =
  "touch-manipulation whitespace-nowrap rounded-lg px-2 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white lg:px-2.5";

const headerAnchorActiveClass =
  "touch-manipulation whitespace-nowrap rounded-lg bg-white/15 px-2 py-1.5 text-sm font-medium text-white lg:px-2.5";

// Temporarily hidden navbar Pay button styles — uncomment with payButton below.
// const headerPayClass =
//   "touch-manipulation inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-500/25 hover:text-white";
// const headerPayActiveClass =
//   "touch-manipulation inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-300/50 bg-emerald-500/30 px-3 text-sm font-semibold text-white";

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
  activePage?: "world-tours" | "pay";
  /** Kept for callers; navbar Pay control is currently commented out. */
  payByCardLabel?: string;
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
  // payByCardLabel,
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
  const homeHref = createLocaleLink("/");
  const legalPageTitle = pickLocaleBundle(
    mainJson as Record<string, MainHeaderBundle>,
    language
  ).legalPage?.title?.trim();
  const legalPageHref = createLocaleLink("/aviso-legal");

  const worldToursNav = pickLocaleBundle(
    worldToursJson as Record<string, { badge: string }>,
    language
  );
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

  // Temporarily hide navbar Pay — uncomment with headerPayClass / CreditCard import.
  // const payClassName =
  //   activePage === "pay" ? headerPayActiveClass : headerPayClass;
  // const payButton = payByCardLabel ? (
  //   <Link
  //     href={createLocaleLink("/pay")}
  //     className={payClassName}
  //     aria-current={activePage === "pay" ? "page" : undefined}
  //   >
  //     <CreditCard className="h-4 w-4 shrink-0" aria-hidden />
  //     <span>{payByCardLabel}</span>
  //   </Link>
  // ) : null;

  const languageSelector = (
    <div
      className="relative shrink-0 [color-scheme:dark]"
      title={languages.find((l) => l.code === language)?.name}
    >
      <div className="flex h-9 items-stretch overflow-hidden rounded-full border border-white/20 bg-black/25 shadow-sm backdrop-blur-md">
        <span
          className="flex items-center border-r border-white/10 bg-white/[0.06] px-2 text-white/70"
          aria-hidden
        >
          <Languages className="h-4 w-4" />
        </span>
        <div className="relative min-w-[3.15rem]">
          <select
            value={language}
            onChange={(e) =>
              onLanguageChange(e.target.value as SiteHeaderLanguage)
            }
            aria-label={selectLanguageLabel}
            className="h-full w-full min-w-[3.15rem] cursor-pointer appearance-none bg-transparent py-0 pl-2 pr-7 text-sm font-semibold uppercase tracking-wide text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/25"
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
            className="pointer-events-none absolute right-1.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45"
          />
        </div>
      </div>
    </div>
  );

  const headerControls = (
    <div className="flex shrink-0 items-center gap-2">
      {/* {payButton} */}
      {languageSelector}
    </div>
  );

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
      <a {...navLinkProps("author-tours")} className={linkClass}>
        {pickLocaleBundle(headerNavAuthorTours, language)}
      </a>
      {BLOG_ENABLED ? (
        <a {...navLinkProps("blog")} className={linkClass}>
          {tabLabels.blog}
        </a>
      ) : null}
      <a {...navLinkProps("faq")} className={linkClass}>
        {pickLocaleBundle(navShortFaqLabel, language)}
      </a>
      <Link
        href={createLocaleLink("/world-tours")}
        className={worldToursLinkClass}
        aria-current={activePage === "world-tours" ? "page" : undefined}
        onClick={closeMobileMenu}
      >
        {worldToursNav.badge}
      </Link>
      {legalPageTitle ? (
        <Link
          href={legalPageHref}
          className={linkClass}
          onClick={closeMobileMenu}
        >
          {legalPageTitle}
        </Link>
      ) : null}
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
      <a {...navLinkPropsMobile("author-tours")} className={mobileNavLinkClass}>
        {pickLocaleBundle(headerNavAuthorTours, language)}
      </a>
      {BLOG_ENABLED ? (
        <a {...navLinkPropsMobile("blog")} className={mobileNavLinkClass}>
          {tabLabels.blog}
        </a>
      ) : null}
      <a {...navLinkPropsMobile("faq")} className={mobileNavLinkClass}>
        {pickLocaleBundle(navShortFaqLabel, language)}
      </a>
      <Link
        href={createLocaleLink("/world-tours")}
        className={mobileWorldToursClassName}
        aria-current={activePage === "world-tours" ? "page" : undefined}
        onClick={closeMobileMenu}
      >
        {worldToursNav.badge}
      </Link>
      {legalPageTitle ? (
        <Link
          href={legalPageHref}
          className={mobileNavLinkClass}
          onClick={closeMobileMenu}
        >
          {legalPageTitle}
        </Link>
      ) : null}
    </>
  );

  const menuButton = (
    <button
      type="button"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white transition-colors hover:bg-white/10"
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
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 overflow-x-hidden border-b border-white/10 bg-slate-950/55 backdrop-blur-md pt-[env(safe-area-inset-top,0px)]">
      <div className="mx-auto w-full max-w-7xl px-4 min-[400px]:px-5 sm:px-6 lg:px-8">
        {/* Mobile: language + menu */}
        <div className="flex items-center justify-between gap-3 py-2 md:hidden">
          {headerControls}
          {menuButton}
        </div>

        {/* Desktop: nav + language */}
        <div className="hidden min-h-0 items-center gap-3 py-2 md:flex">
          <nav
            className="site-header-desktop-nav flex min-h-0 min-w-0 flex-1 flex-wrap items-center gap-0.5 lg:gap-1"
            aria-label="Page sections"
          >
            {renderNavLinks(headerAnchorClass, worldToursClassName)}
          </nav>
          {headerControls}
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              aria-label="Close menu"
              onClick={closeMobileMenu}
            />
            <nav
              id="site-header-mobile-menu"
              className="relative z-50 -mx-4 max-h-[min(70dvh,28rem)] overflow-y-auto overscroll-contain border-t border-white/10 bg-slate-950/95 px-4 py-2 min-[400px]:-mx-5 min-[400px]:px-5 sm:-mx-6 sm:px-6 md:hidden"
              aria-label="Page sections"
            >
              {renderMobileNavLinks()}
            </nav>
          </>
        ) : null}
      </div>
    </header>
  );
}
