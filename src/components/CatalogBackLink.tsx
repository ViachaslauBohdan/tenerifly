import Link from "next/link";

type CatalogBackLinkProps = {
  href: string;
  label: string;
};

export function CatalogBackLink({ href, label }: CatalogBackLinkProps) {
  return (
    <div className="mb-6">
      <Link
        href={href}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {label}
      </Link>
    </div>
  );
}
