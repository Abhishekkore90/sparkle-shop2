import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Filter, Droplets, Search, X } from "lucide-react";
import { categories, type Category } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): { category?: string; q?: string } => {
    return {
      category: (search.category as string) || "all",
      q: (search.q as string) || "",
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
  console.log("PRODUCTS_INDEX_RELOADED");
  const { products, loading } = useProducts();
  const { category: searchCategory, q: searchQuery } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [filter, setFilter] = useState<"all" | Category>((searchCategory as any) || "all");
  const [searchTerm, setSearchTerm] = useState(searchQuery || "");
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
    if (searchQuery !== undefined) {
      setSearchTerm(searchQuery);
    }
  }, [searchCategory, searchQuery]);

  const handleFilterChange = (newFilter: "all" | Category) => {
    setFilter(newFilter);
    navigate({
      search: (prev: any) => ({ ...prev, category: newFilter }),
    });
  };

  let list = filter === "all"
    ? [...products]
    : products.filter(p => p.category === filter);

  if (searchTerm) {
    const q = (searchTerm || "").toLowerCase();
    list = list.filter(p => 
      (p?.name || "").toLowerCase().includes(q) || 
      (p?.tagline || "").toLowerCase().includes(q) ||
      (p?.description || "").toLowerCase().includes(q)
    );
  }

  if (sort === "price-asc")  list = list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = list.sort((a, b) => b.price - a.price);
  if (sort === "stages")     list = list.sort((a, b) => b.stages - a.stages);

  return (
    <div>
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-sm font-bold text-primary animate-pulse">Analyzing inventory...</p>
          </div>
        </div>
      )}

      {/* ── Page header ─────────────────────────────────── */}
      <section className="relative min-h-[45vh] md:min-h-[60vh] flex items-center bg-blue-950 py-10 md:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-blue-950">
          <img 
            src="https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-80" 
            alt="Purity Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-blue-950/95 via-blue-900/80 to-blue-800/40" />
        </div>
        </div>

        <div className="container-xl relative z-10 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-400/20 border border-blue-400/30 text-blue-300 font-bold tracking-widest uppercase text-[10px] mb-6 animate-in slide-in-from-top duration-700">
              <Droplets className="h-3 w-3" />
              Precision Engineering
            </div>
            <h1
              id="products-heading"
              className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] mb-4 md:mb-8 animate-in slide-in-from-bottom duration-1000 px-2"
            >
              Filtration <br className="hidden md:block" />
              <span className="text-blue-400 italic font-serif ml-2 md:ml-0">Catalog</span>
            </h1>
            <p className="mx-auto max-w-xl text-white/80 text-[13px] md:text-xl leading-relaxed mb-8 md:mb-10 animate-in fade-in duration-1000 delay-300 px-4 md:px-0">
              Select the optimal purification strategy for your home. Every model meets clinical-grade purity standards.
            </p>

            {searchTerm && (
              <div className="flex justify-center mb-8 animate-in zoom-in duration-500">
                <div className="px-6 py-3 rounded-2xl bg-blue-500/20 border border-blue-400/40 backdrop-blur-xl flex items-center gap-3">
                  <Search className="h-4 w-4 text-blue-300" />
                  <span className="text-sm font-bold text-white">
                    Showing results for <span className="text-blue-300 italic">"{searchTerm}"</span>
                  </span>
                  <button 
                    onClick={() => { setSearchTerm(""); navigate({ search: (prev: any) => ({ ...prev, q: "" }) }); }}
                    className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3 text-white/60" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 lg:gap-3 animate-in fade-in duration-1000 delay-500">
              {["Certified Molecular Mesh", "0.001% TDS Output", "Bio-Safe Mineral Guard"].map(b => (
                <div key={b} className="px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-white/90">
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter & sort bar ────────────────────────────── */}
      <div id="scrollable-filter-bar" className="bg-white border-b border-blue-50 py-4 md:py-8 mt-4 md:mt-20">
        <div className="container-xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto no-scrollbar mask-fade-right">
            <div className="flex gap-2 flex-nowrap px-4 md:px-0">
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

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-blue-50/50 border border-blue-100 mx-4 md:mx-0">
            <div className="flex items-center gap-2 shrink-0">
              <Filter className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-900/40">Sort By</span>
            </div>
            <select
              id="sort-select"
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              className="text-xs sm:text-sm font-bold text-blue-950 bg-transparent outline-none cursor-pointer w-full"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Product grid ────────────────────────────────── */}
      <section className="container-xl py-10 md:py-16">
        {filter === "all" ? (
          <div className="space-y-20">
            {dynamicCategories.map(cat => {
              let catProducts = products.filter(p => p.category === cat.id);
              
              if (searchTerm) {
                const q = (searchTerm || "").toLowerCase();
                catProducts = catProducts.filter(p => 
                  (p?.name || "").toLowerCase().includes(q) || 
                  (p?.tagline || "").toLowerCase().includes(q) ||
                  (p?.description || "").toLowerCase().includes(q)
                );
              }

              if (catProducts.length === 0) return null;

              return (
                <div key={cat.id} id={`section-${cat.id}`} className="scroll-mt-32">
                  <div className="mb-8 flex items-end justify-between border-b border-blue-50 pb-4">
                    <div>
                      <h2 className="font-display text-2xl lg:text-3xl font-bold text-blue-950">{cat.name}</h2>
                      <p className="text-xs lg:text-sm text-muted-foreground mt-1">{cat.desc}</p>
                    </div>
                    <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 lg:px-4 lg:py-1.5 rounded-full shrink-0">
                      {catProducts.length} <span className="hidden sm:inline">Systems</span>
                    </div>
                  </div>

                  <ul className="grid gap-3 md:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label={`${cat.name} listings`}>
                    {catProducts.map(p => (
                      <li key={p.id} className="h-full">
                        <ProductCard product={p} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {products.filter(p => {
              const q = searchTerm.toLowerCase();
              return (p?.name || "").toLowerCase().includes(q) || 
                     (p?.tagline || "").toLowerCase().includes(q) ||
                     (p?.description || "").toLowerCase().includes(q);
            }).length === 0 && (
              <div className="text-center py-24">
                <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No systems match your search for "<span className="font-semibold text-foreground">{searchTerm}</span>"</p>
                <button 
                  onClick={() => { setSearchTerm(""); navigate({ search: (prev: any) => ({ ...prev, q: "" }) }); }}
                  className="mt-6 text-primary font-bold hover:underline"
                >
                  Clear search and view all systems
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground" role="status" aria-live="polite">
                Showing <span className="text-primary font-bold">{list.length}</span> purifier{list.length !== 1 ? "s" : ""}
                {searchTerm && <> for "<span className="text-foreground font-semibold">{searchTerm}</span>"</>}
                <> in <span className="text-foreground font-semibold">{(dynamicCategories as any[]).find(c => c.id === (filter as any))?.name}</span></>
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

        <div className="mt-12 md:mt-24 grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 md:px-0">
          {dynamicCategories.map(c => (
            <button
              key={c.id}
              onClick={() => handleFilterChange(c.id)}
              className={`group text-left p-6 md:p-8 rounded-[2rem] border transition-all duration-500 relative overflow-hidden ${
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
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 md:px-6 md:py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
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
