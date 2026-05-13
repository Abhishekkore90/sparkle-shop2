import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const categoryLabel: Record<string, string> = {
    residential: "Home Solutions",
    commercial: "Professional",
    "under-sink": "Kitchen Systems",
    softener: "Wellness",
  };

  const displayImage =
    product.image ||
    "https://images.unsplash.com/photo-1595080838612-42da65022201?auto=format&fit=crop&q=80&w=400";
  const displayCategory = categoryLabel[product.category] || product.category;

  return (
    <article className="group relative flex flex-col h-full rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,84,166,0.12)] hover:border-primary/25 transition-all duration-500 overflow-hidden">
      {/* ── Image Section ── */}
      <Link
        to="/products/$productId"
        params={{ productId: product.id }}
        className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 to-[#E1EBF4]/60 flex items-center justify-center p-6 shrink-0"
        aria-label={`View ${product.name}`}
      >
        {/* Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="inline-flex items-center gap-1 bg-emerald-500 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wide shadow-sm">
                <Zap className="h-3 w-3" />
                {discount}% OFF
              </span>
            )}
          </div>
          {product.badge && (
            <span className="bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wide shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Image */}
        <img
          src={displayImage}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105 drop-shadow-md"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1595080838612-42da65022201?auto=format&fit=crop&q=80&w=400";
          }}
        />
      </Link>

      {/* ── Content Section ── */}
      <div className="flex flex-1 flex-col px-3.5 pt-4 pb-4 md:px-5 md:pt-5 md:pb-5">
        {/* Category Label */}
        <span className="text-[10px] font-semibold text-primary/70 uppercase tracking-[0.15em] mb-1.5">
          {displayCategory}
        </span>

        {/* Title */}
        <Link to="/products/$productId" params={{ productId: product.id }}>
          <h3 className="font-serif text-[15px] md:text-lg font-bold leading-tight text-slate-900 transition-colors duration-300 group-hover:text-primary line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Tagline */}
        <p className="mt-1 text-[11px] md:text-[13px] text-slate-500 leading-relaxed line-clamp-2 min-h-[2.5em]">
          {product.tagline}
        </p>

        {/* Specs Row */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600">
            {product.stages}-Stage
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600">
            {product.capacity}
          </span>
          {product.warranty && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-[10px] font-bold text-amber-700 border border-amber-200/60">
              <ShieldCheck className="h-3 w-3 text-amber-500" />
              {product.warranty}
            </span>
          )}
        </div>

        {/* Spacer to push price to bottom */}
        <div className="flex-1" />

        {/* ── Price + CTA ── */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-end justify-between">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-[11px] text-slate-400 line-through mb-0.5">
                ₹{product.oldPrice.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-xl font-black text-slate-900 tracking-tight">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>

          <Link
            to="/products/$productId"
            params={{ productId: product.id }}
            className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-primary text-white text-[10px] md:text-xs font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group/btn"
          >
            View
            <ArrowRight className="h-3 w-3 md:h-3.5 md:w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
