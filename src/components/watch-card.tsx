import { Link } from "@tanstack/react-router";
import { formatLKR } from "@/lib/cart";

type Props = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string | null;
  stock?: number;
};

export function WatchCard({ id, name, brand, price, image_url, stock }: Props) {
  return (
    <Link to="/watch/$id" params={{ id }} className="group glass rounded-2xl overflow-hidden block transition-all hover:-translate-y-1 hover:border-[var(--color-gold)]">
      <div className="aspect-square overflow-hidden relative" style={{ background: "var(--gradient-bg)" }}>
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-32 h-32 rounded-full" style={{ background: "var(--gradient-gold)", opacity: 0.3 }} />
          </div>
        )}
        {stock !== undefined && stock <= 0 && (
          <span className="absolute top-3 right-3 text-xs px-3 py-1 rounded-full bg-black/60 text-white">Sold out</span>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs uppercase tracking-wider text-[var(--color-gold-soft)]">{brand}</div>
        <div className="font-display text-lg mt-0.5 truncate">{name}</div>
        <div className="mt-2 font-semibold text-gradient-gold">{formatLKR(price)}</div>
      </div>
    </Link>
  );
}
