import { useEffect, useState } from "react";

export function WatchFace({ size = 280 }: { size?: number }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const s = now.getSeconds();
  const m = now.getMinutes();
  const h = now.getHours() % 12;
  const secDeg = s * 6;
  const minDeg = m * 6 + s * 0.1;
  const hrDeg = h * 30 + m * 0.5;

  const c = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-50"
        style={{ background: "var(--gradient-gold)" }}
      />
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="relative">
        <defs>
          <radialGradient id="dial" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="oklch(0.32 0.02 70)" />
            <stop offset="100%" stopColor="oklch(0.16 0.012 60)" />
          </radialGradient>
          <linearGradient id="bezel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.88 0.09 85)" />
            <stop offset="50%" stopColor="oklch(0.65 0.13 70)" />
            <stop offset="100%" stopColor="oklch(0.86 0.09 85)" />
          </linearGradient>
        </defs>

        {/* Bezel */}
        <circle cx={c} cy={c} r={c - 4} fill="url(#bezel)" />
        <circle cx={c} cy={c} r={c - 14} fill="url(#dial)" />
        <circle cx={c} cy={c} r={c - 14} fill="none" stroke="oklch(0.78 0.13 82 / 0.4)" strokeWidth="0.5" />

        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const r1 = c - 22;
          const r2 = i % 3 === 0 ? c - 36 : c - 30;
          const x1 = c + Math.sin(a) * r1;
          const y1 = c - Math.cos(a) * r1;
          const x2 = c + Math.sin(a) * r2;
          const y2 = c - Math.cos(a) * r2;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="oklch(0.86 0.09 85)"
              strokeWidth={i % 3 === 0 ? 3 : 1.5}
              strokeLinecap="round"
            />
          );
        })}

        {/* Brand text */}
        <text
          x={c}
          y={c - 30}
          textAnchor="middle"
          fill="oklch(0.86 0.09 85)"
          style={{ font: '600 8px "Cormorant Garamond", serif', letterSpacing: "3px" }}
        >
          VINS
        </text>
        <text
          x={c}
          y={c + 38}
          textAnchor="middle"
          fill="oklch(0.72 0.025 80)"
          style={{ font: '400 6px Inter, sans-serif', letterSpacing: "2px" }}
        >
          NEGOMBO
        </text>

        {/* Hour hand */}
        <g transform={`rotate(${hrDeg} ${c} ${c})`}>
          <rect x={c - 2.5} y={c - (c - 60)} width="5" height={c - 60} rx="2" fill="oklch(0.86 0.09 85)" />
        </g>
        {/* Minute hand */}
        <g transform={`rotate(${minDeg} ${c} ${c})`}>
          <rect x={c - 1.8} y={c - (c - 40)} width="3.6" height={c - 40} rx="2" fill="oklch(0.92 0.06 85)" />
        </g>
        {/* Second hand */}
        <g transform={`rotate(${secDeg} ${c} ${c})`} style={{ transition: "transform 0.1s" }}>
          <rect x={c - 0.6} y={c - (c - 25)} width="1.2" height={c - 18} fill="oklch(0.78 0.18 35)" />
          <circle cx={c} cy={c} r="5" fill="oklch(0.78 0.18 35)" />
        </g>
        <circle cx={c} cy={c} r="2.5" fill="oklch(0.16 0.012 60)" />
      </svg>
    </div>
  );
}
