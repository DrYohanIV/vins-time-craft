import { useEffect, useRef, useState } from "react";

export function WatchFace({
  size = 280,
  transparent = false,
  animatedHands = false,
}: {
  size?: number;
  transparent?: boolean;
  animatedHands?: boolean;
}) {
  const [now, setNow] = useState(new Date());
  const secRef = useRef<SVGGElement>(null);
  const minRef = useRef<SVGGElement>(null);
  const hrRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (animatedHands) return;
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, [animatedHands]);

  // Continuous smooth animation for decorative mode
  useEffect(() => {
    if (!animatedHands) return;
    let raf = 0;
    const start = performance.now();
    const c2 = size / 2;
    const tick = (t: number) => {
      const elapsed = (t - start) / 1000;
      // Sped-up time: 1s real = 1 minute on the watch
      const secDeg = (elapsed * 6) % 360;
      const minDeg = (elapsed * 0.1 * 60) % 360;
      const hrDeg = (elapsed * 0.5) % 360;
      if (secRef.current) secRef.current.setAttribute("transform", `rotate(${secDeg} ${c2} ${c2})`);
      if (minRef.current) minRef.current.setAttribute("transform", `rotate(${minDeg} ${c2} ${c2})`);
      if (hrRef.current) hrRef.current.setAttribute("transform", `rotate(${hrDeg} ${c2} ${c2})`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animatedHands, size]);

  const s = now.getSeconds();
  const m = now.getMinutes();
  const h = now.getHours() % 12;
  const secDeg = s * 6;
  const minDeg = m * 6 + s * 0.1;
  const hrDeg = h * 30 + m * 0.5;

  const c = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {!transparent && (
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-50"
          style={{ background: "var(--gradient-gold)" }}
        />
      )}
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
        <circle
          cx={c}
          cy={c}
          r={c - 4}
          fill={transparent ? "none" : "url(#bezel)"}
          stroke={transparent ? "oklch(0.78 0.13 82 / 0.5)" : "none"}
          strokeWidth={transparent ? 1.5 : 0}
        />
        <circle
          cx={c}
          cy={c}
          r={c - 14}
          fill={transparent ? "none" : "url(#dial)"}
          stroke={transparent ? "oklch(0.78 0.13 82 / 0.25)" : "none"}
          strokeWidth={transparent ? 0.8 : 0}
        />

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

        {!transparent && (
          <>
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
          </>
        )}

        {/* Hour hand */}
        <g ref={hrRef} transform={`rotate(${hrDeg} ${c} ${c})`}>
          <rect x={c - 2.5} y={c - (c - 60)} width="5" height={c - 60} rx="2" fill="oklch(0.86 0.09 85)" />
        </g>
        {/* Minute hand */}
        <g ref={minRef} transform={`rotate(${minDeg} ${c} ${c})`}>
          <rect x={c - 1.8} y={c - (c - 40)} width="3.6" height={c - 40} rx="2" fill="oklch(0.92 0.06 85)" />
        </g>
        {/* Second hand */}
        <g ref={secRef} transform={`rotate(${secDeg} ${c} ${c})`} style={animatedHands ? undefined : { transition: "transform 0.1s" }}>
          <rect x={c - 0.6} y={c - (c - 25)} width="1.2" height={c - 18} fill="oklch(0.78 0.18 35)" />
          <circle cx={c} cy={c} r="5" fill="oklch(0.78 0.18 35)" />
        </g>
        <circle cx={c} cy={c} r="2.5" fill="oklch(0.16 0.012 60)" />
      </svg>
    </div>
  );
}
