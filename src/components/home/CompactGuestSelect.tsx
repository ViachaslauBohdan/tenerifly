import { Users } from "lucide-react";

const GUEST_COUNT_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

type CompactGuestSelectProps = {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  ariaLabel: string;
  controlClassName: string;
};

export function CompactGuestSelect({
  id,
  value,
  onChange,
  max = 10,
  ariaLabel,
  controlClassName,
}: CompactGuestSelectProps) {
  const options =
    max === 10
      ? GUEST_COUNT_OPTIONS
      : Array.from({ length: max }, (_, i) => i + 1);
  const safeValue =
    Number.isFinite(value) && value >= 1 ? Math.min(value, max) : 1;

  return (
    <div className="relative flex w-full min-w-0 items-center self-stretch">
      <Users
        className="pointer-events-none absolute left-0 z-10 h-4 w-4 text-gray-400"
        aria-hidden
      />
      <select
        id={id}
        aria-label={ariaLabel}
        className={`${controlClassName} min-h-8 w-full cursor-pointer appearance-none py-0.5 pl-6`}
        value={safeValue}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {options.map((count) => (
          <option key={count} value={count}>
            {count}
          </option>
        ))}
      </select>
    </div>
  );
}
