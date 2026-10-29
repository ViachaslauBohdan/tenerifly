import { catalogSearchCopy } from "@/lib/catalogSearch";

type CatalogSearchFieldProps = {
  locale: string;
  value: string;
  onChange: (value: string) => void;
};

export function CatalogSearchField({
  locale,
  value,
  onChange,
}: CatalogSearchFieldProps) {
  const copy = catalogSearchCopy(locale);

  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {copy.label}
      </label>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={copy.placeholder}
        aria-label={copy.label}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
