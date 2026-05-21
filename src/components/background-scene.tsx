import { WatchFace } from "@/components/watch-face";

/** A gear SVG used as a decorative floating element */
function Gear({ size = 120, opacity = 0.08 }: { size?: number; opacity?: number }) {
  const teeth = 12;
  const r = size / 2;
  const innerR = r * 0.55;
  const toothLen = r * 0.18;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ opacity }}>
      <defs>
        <linearGradient id={`gearGrad-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.86 0.09 85)" />
          <stop offset="100%" stopColor="oklch(0.6 0.12 70)" />
        </linearGradient>
      </defs>
      <g transform={`translate(${r} ${r})`}>
        {Array.from({ length: teeth }).map((_, i) => {
          const a = (i * 360) / teeth;
          return (
            <rect
              key={i}
              x={-toothLen / 2}
              y={-r}
              width={toothLen}
              height={toothLen * 1.5}
              rx={2}
              transform={`rotate(${a})`}
              fill={`url(#gearGrad-${size})`}
            />
          );
        })}
        <circle r={r * 0.78} fill="none" stroke={`url(#gearGrad-${size})`} strokeWidth="6" />
        <circle r={innerR} fill="none" stroke={`url(#gearGrad-${size})`} strokeWidth="3" />
        <circle r={r * 0.15} fill={`url(#gearGrad-${size})`} />
        {Array.from({ length: 5 }).map((_, i) => (
          <rect
            key={i}
            x={-2}
            y={-innerR + 4}
            width={4}
            height={innerR - r * 0.18}
            transform={`rotate(${i * 72})`}
            fill={`url(#gearGrad-${size})`}
          />
        ))}
      </g>
    </svg>
  );
}

export function BackgroundScene() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Soft gold orbs */}
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />

      {/* Floating gears */}
      <div className="float-slow absolute top-[8%] left-[4%]" style={{ animationDuration: "22s" }}>
        <div className="spin-slow" style={{ animationDuration: "60s" }}>
          <Gear size={160} opacity={0.07} />
        </div>
      </div>

      <div className="float-slow absolute top-[60%] left-[78%]" style={{ animationDuration: "28s", animationDelay: "-6s" }}>
        <div className="spin-rev" style={{ animationDuration: "80s" }}>
          <Gear size={220} opacity={0.06} />
        </div>
      </div>

      <div className="float-slow absolute top-[78%] left-[10%]" style={{ animationDuration: "24s", animationDelay: "-3s" }}>
        <div className="spin-slow" style={{ animationDuration: "45s" }}>
          <Gear size={110} opacity={0.08} />
        </div>
      </div>

      <div className="float-slow absolute top-[18%] left-[68%]" style={{ animationDuration: "30s", animationDelay: "-12s" }}>
        <div className="spin-rev" style={{ animationDuration: "55s" }}>
          <Gear size={90} opacity={0.1} />
        </div>
      </div>

      {/* Giant transparent live watch — centerpiece behind hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 mix-blend-screen">
        <div className="float-slow" style={{ animationDuration: "16s" }}>
          <WatchFace size={720} transparent />
        </div>
      </div>

      {/* Twinkling particles */}
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            top: `${(i * 37) % 100}%`,
            left: `${(i * 53) % 100}%`,
            animationDelay: `${(i % 8) * -1.3}s`,
            animationDuration: `${4 + (i % 5)}s`,
          }}
        />
      ))}
    </div>
  );
}
