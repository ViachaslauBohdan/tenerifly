import { heroTitleClass } from "@/lib/heroSearchLayout";

type ExcursionsIntermediaryNoticeProps = {
  text: string;
  as?: "h1" | "h2";
  variant?: "hero" | "section" | "page" | "card";
  className?: string;
};

export function ExcursionsIntermediaryNotice({
  text,
  as: Tag = "h2",
  variant = "section",
  className = "",
}: ExcursionsIntermediaryNoticeProps) {
  if (!text.trim()) return null;

  const variantClass =
    variant === "hero"
      ? `${heroTitleClass} mb-0 text-center`
      : variant === "page"
        ? "mb-3 text-center text-3xl font-bold text-gray-900"
        : variant === "card"
          ? "mb-2 text-xl font-bold text-gray-900"
          : "mb-4 text-4xl font-bold text-gray-900";

  return (
    <Tag className={`leading-snug ${variantClass} ${className}`.trim()}>
      {text}
    </Tag>
  );
}
