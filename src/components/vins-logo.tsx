type Props = {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  tone?: "gold" | "light" | "dark";
};

// Vins Watch brand mark: open circle with checkmark forming the "V"
export function VinsLogo({ size = 36, className, showWordmark = false, tone = "gold" }: Props) {
  const stroke =
    tone === "light"
      ? "var(--color-cream)"
      : tone === "dark"
      ? "var(--color-espresso)"
      : "var(--color-gold)";

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.45))" }}
      >
        {/* Open circle (broken at top-right where the check exits) */}
        <path
          d="M32 6 a26 26 0 1 0 22 12"
          stroke={stroke}
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Check / V */}
        <path
          d="M18 30 L30 44 L54 14"
          stroke={stroke}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showWordmark && (
        <span className="leading-none flex items-baseline gap-1.5">
          <span className="font-display text-xl tracking-[0.04em]" style={{ color: stroke }}>
            INS WATCH
          </span>
          <span className="text-[8px] tracking-[0.2em] text-[var(--color-gold-soft)] uppercase">
            est. 1980
          </span>
        </span>
      )}
    </span>
  );
}
