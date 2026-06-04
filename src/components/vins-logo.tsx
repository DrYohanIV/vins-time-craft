type Props = {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  tone?: "gold" | "light" | "dark";
};

export function VinsLogo({ className, showWordmark = false }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <img
        src="/asset/Vins logo 01ss.png"
        alt="Vins Watch"
        width={200}
        height={200}
        style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.45))" }}
        className="object-contain"
      />

    </span>
  );
}
