const siteSocialLinks = [
  {
    href: "https://www.instagram.com/pana.fera",
    label: "Instagram",
    brand: "instagram",
  },
  {
    href: "https://www.facebook.com/people/TenerifeJoy-PanaFera/61595340874144/",
    label: "Facebook",
    brand: "facebook",
  },
  {
    href: "https://www.tiktok.com/@pana.fera.ru",
    label: "TikTok",
    brand: "tiktok",
  },
  {
    href: "https://maps.app.goo.gl/TBbdVEqmjSkcTLEf6",
    label: "Google Maps",
    brand: "maps",
  },
] as const;

const badgeClassName: Record<(typeof siteSocialLinks)[number]["brand"], string> = {
  instagram: "text-white",
  facebook: "bg-[#1877F2] text-white",
  tiktok: "bg-black text-white",
  maps: "bg-white",
};

const instagramBackground =
  "radial-gradient(circle at 30% 110%, #fdf497 0%, #fd5949 42%, #d6249f 62%, #285aeb 92%)";

function InstagramGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[58%] w-[58%]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" fill="currentColor" aria-hidden>
      <path d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.1C12.2 3 11 4.5 11 6.6v1.9H9v2.7h2V21h3.1v-9.8h2.2l.4-2.7h-2.6z" />
    </svg>
  );
}

function TikTokNote({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function TikTokGlyph() {
  return (
    <span className="relative block h-[62%] w-[62%]" aria-hidden>
      <TikTokNote className="absolute inset-0 text-[#25F4EE] -translate-x-px translate-y-px" />
      <TikTokNote className="absolute inset-0 text-[#FE2C55] translate-x-px -translate-y-px" />
      <TikTokNote className="absolute inset-0 text-white" />
    </span>
  );
}

function MapsGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-[70%] w-[70%]" aria-hidden>
      <path
        fill="#34A853"
        d="M24 4C14.6 4 7 11.6 7 21c0 7.2 4.4 14.6 8.2 19.2L24 47l8.8-6.8C36.6 35.6 41 28.2 41 21 41 11.6 33.4 4 24 4z"
      />
      <path fill="#4285F4" d="M7 21c0 4.4 1.8 9 4.8 13.2L24 21 11 9.6C8.4 12.6 7 16.6 7 21z" />
      <path fill="#FBBC04" d="M24 4c5.4 0 10.2 2.4 13.4 6.2L24 21V4z" />
      <path fill="#EA4335" d="M24 4c4.2 0 8.2 1.7 11.2 4.5L24 21 13.2 9.2C16 5.6 19.8 4 24 4z" />
      <circle cx="24" cy="20" r="6.5" fill="#fff" />
    </svg>
  );
}

function BrandGlyph({ brand }: { brand: (typeof siteSocialLinks)[number]["brand"] }) {
  if (brand === "instagram") return <InstagramGlyph />;
  if (brand === "facebook") return <FacebookGlyph />;
  if (brand === "tiktok") return <TikTokGlyph />;
  return <MapsGlyph />;
}

type SiteSocialLinksProps = {
  className?: string;
  linkClassName?: string;
};

export function SiteSocialLinks({ className, linkClassName }: SiteSocialLinksProps) {
  return (
    <div className={className}>
      {siteSocialLinks.map(({ href, label, brand }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className={`touch-manipulation inline-flex shrink-0 items-center justify-center rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${badgeClassName[brand]} ${linkClassName ?? ""}`}
          style={brand === "instagram" ? { background: instagramBackground } : undefined}
        >
          <BrandGlyph brand={brand} />
        </a>
      ))}
    </div>
  );
}
