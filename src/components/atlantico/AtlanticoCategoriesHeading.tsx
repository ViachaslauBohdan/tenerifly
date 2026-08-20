import { getAtlanticoUiCopy } from "./atlanticoCopy";

type AtlanticoCategoriesHeadingProps = {
  locale: string;
  as?: "h1" | "h2";
};

export function AtlanticoCategoriesHeading({
  locale,
  as: Tag = "h1",
}: AtlanticoCategoriesHeadingProps) {
  const copy = getAtlanticoUiCopy(locale);

  return (
    <div className="mb-10 text-center">
      <Tag className="text-3xl font-bold uppercase tracking-wide md:text-4xl">
        <span className="text-gray-900">{copy.mainCategoriesLead} </span>
        <span className="text-blue-600">{copy.mainCategoriesAccent}</span>
      </Tag>
      <p className="mx-auto mt-3 max-w-3xl text-base text-gray-600 md:text-lg">
        {copy.categoriesSubtitle}
      </p>
    </div>
  );
}
