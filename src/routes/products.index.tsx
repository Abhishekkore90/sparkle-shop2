import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Filter, Droplets } from "lucide-react";
import { categories, type Category } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      category: (search.category as string) || "all",
    };
  },
  component: ProductsIndex,
});

const SORT_OPTIONS = [
  { value: "default",    label: "Featured Systems" },
  { value: "price-asc",  label: "Price: Low to High"},
  { value: "price-desc", label: "Price: High to Low"},
  { value: "stages",     label: "Clinical Stages"   },
] as const;

type SortKey = typeof SORT_OPTIONS[number]["value"];

function ProductsIndex() {
  const { products, loading } = useProducts();
  const { category: searchCategory } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [filter, setFilter] = useState<"all" | Category>((searchCategory as any) || "all");
  const [sort,   setSort]   = useState<SortKey>("default");

  const dynamicCategories = useMemo(() => {
    const knownIds = new Set(categories.map(c => c.id));
    const otherIds = Array.from(new Set(products.map(p => p.category))).filter(id => !knownIds.has(id as any));
    
    return [
      ...categories,
      ...otherIds.map(id => ({
        id: id as any,
        name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        desc: "Custom product collection"
      }))
    ];
  }, [products]);

  useEffect(() => {
    if (searchCategory) {
      setFilter(searchCategory as any);
    }
  }, [searchCategory]);

  const handleFilterChange = (newFilter: "all" | Category) => {
    setFilter(newFilter);
    navigate({
      search: (prev: any) => ({ ...prev, category: newFilter }),
    });
  };

  let list = filter === "all"
    ? [...products]
    : products.filter(p => p.category === filter);

  if (sort === "price-asc")  list = list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = list.sort((a, b) => b.price - a.price);
  if (sort === "stages")     list = list.sort((a, b) => b.stages - a.stages);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-sm font-bold text-primary animate-pulse">Analyzing inventory...</p>
          </div>
        </div>
      )}

      {/* ── Page header ─────────────────────────────────── */}
      <section
        aria-labelledby="products-heading"
        className="relative min-h-[50vh] flex items-center pt-32 pb-20 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover" 
            alt="Purity Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/70 to-blue-800/30" />
        </div>

        <div className="container-xl relative z-10 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-400/20 border border-blue-400/30 text-blue-300 font-bold tracking-widest uppercase text-[10px] mb-6 animate-in slide-in-from-top duration-700">
              <Droplets className="h-3 w-3" />
              Precision Engineering
            </div>
            <h1
              id="products-heading"
              className="font-display text-5xl md:text-7xl font-bold leading-tight mb-8 animate-in slide-in-from-bottom duration-1000"
            >
              Filtration <br />
              <span className="text-blue-400 italic font-serif">Catalog</span>
            </h1>
            <p className="mx-auto max-w-xl text-white/80 text-lg md:text-xl leading-relaxed mb-10 animate-in fade-in duration-1000 delay-300">
              Select the optimal purification strategy for your home. Every model meets clinical-grade purity standards.
            </p>

            <div className="flex flex-wrap justify-center gap-3 animate-in fade-in duration-1000 delay-500">
              {["Certified Molecular Mesh", "0.001% TDS Output", "Bio-Safe Mineral Guard"].map(b => (
                <div key={b} className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider text-white/90">
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter & sort bar ────────────────────────────── */}
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl border-b border-blue-50 py-5">
        <div className="container-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide no-scrollbar">
            <div className="flex gap-2 flex-nowrap">
              <FilterPill
                id="filter-all"
                active={filter === "all"}
                onClick={() => handleFilterChange("all")}
                icon={<Droplets className="h-3.5 w-3.5" />}
              >
                All Systems
              </FilterPill>
              {dynamicCategories.map(c => (
                <FilterPill
                  key={c.id}
                  id={`filter-${c.id}`}
                  active={filter === c.id}
                  onClick={() => handleFilterChange(c.id)}
                >
                  <span className="whitespace-nowrap">{c.name}</span>
                </FilterPill>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-blue-50/50 border border-blue-100">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-900/40">Sort By</span>
            </div>
            <select
              id="sort-select"
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              className="text-sm font-bold text-blue-950 bg-transparent outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Product grid ────────────────────────────────── */}
      <section className="container-xl py-14">
        {filter === "all" ? (
          <div className="space-y-20">
            {dynamicCategories.map(cat => {
              const catProducts = products.filter(p => p.category === cat.id);
              if (catProducts.length === 0) return null;

              return (
                <div key={cat.id} id={`section-${cat.id}`} className="scroll-mt-32">
                  <div className="mb-8 flex items-end justify-between border-b border-blue-50 pb-4">
                    <div>
                      <h2 className="font-display text-3xl font-bold text-blue-950">{cat.name}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{cat.desc}</p>
                    </div>
                    <div className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
                      {catProducts.length} Systems
                    </div>
                  </div>

                  <ul className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label={`${cat.name} listings`}>
                    {catProducts.map(p => (
                      <li key={p.id} className="h-full">
                        <ProductCard product={p} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground" role="status" aria-live="polite">
                Showing <span className="text-primary font-bold">{list.length}</span> purifier{list.length !== 1 ? "s" : ""}
                in <span className="text-foreground font-semibold">{dynamicCategories.find(c => c.id === filter)?.name}</span>
              </p>
            </div>

            {list.length === 0 ? (
              <div className="text-center py-24">
                <Droplets className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No products found in this category.</p>
              </div>
            ) : (
              <ul className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Filtered purifier listings">
                {list.map(p => (
                  <li key={p.id} className="h-full">
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <div className="mt-24 grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
          {dynamicCategories.map(c => (
            <button
              key={c.id}
              onClick={() => handleFilterChange(c.id)}
              className={`group text-left p-8 rounded-[2rem] border transition-all duration-500 relative overflow-hidden ${
                filter === c.id
                  ? "border-blue-200 bg-blue-50/50 shadow-floating"
                  : "border-slate-100 bg-white hover:border-blue-200 hover:shadow-elegant"
              }`}
            >
              <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full transition-all duration-500 ${
                filter === c.id ? "bg-blue-500/10" : "bg-slate-50 group-hover:bg-blue-500/5"
              }`} />
              <h3 className={`font-display text-xl font-bold mb-3 transition-colors ${
                filter === c.id ? "text-blue-600" : "text-blue-950"
              }`}>
                {c.name}
              </h3>
              <p className="text-xs font-medium text-blue-900/60 leading-relaxed">{c.desc}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function FilterPill({
  id, active, onClick, children, icon,
}: {
  id: string; active: boolean; onClick: () => void;
  children: React.ReactNode; icon?: React.ReactNode;
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
        active
          ? "bg-blue-600 text-white border-blue-600 shadow-drop scale-105"
          : "bg-white text-blue-900/60 border-blue-100 hover:border-blue-400 hover:text-blue-600"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
