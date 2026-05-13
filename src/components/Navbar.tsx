import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Menu, X, Search, UserCircle2, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";


const NAV_LINKS = [
  { to: "/",        label: "Home"     },
  { to: "/products", label: "Products" },
  { to: "/about",   label: "About"    },
  { to: "/contact", label: "Contact"  },
] as const;

export function Navbar() {
  const { products } = useProducts();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query,      setQuery]      = useState("");
  const [scrolled,   setScrolled]   = useState(false);
  const [user,       setUser]       = useState<any>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const navigate  = useNavigate();
  const location  = useLocation();
  const isHome    = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false); setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    setMobileOpen(false); setSearchOpen(false); setQuery("");
  }, [location.pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setMobileOpen(false); setSearchOpen(false); setQuery(""); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const results = query.length >= 2
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tagline.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleProductClick = (productId: string) => {
    setSearchOpen(false); setQuery("");
    navigate({ to: "/products/$productId", params: { productId } });
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      navigate({ to: "/products", search: { q: query.trim() } });
      setSearchOpen(false);
      setQuery("");
    }
  };

  // Transparent on hero, frosted-blue on scroll / inner pages
  const isTransparent = isHome && !scrolled && !mobileOpen;

  const headerCls = "relative z-50 w-full transition-ultra";

  return (
    <header className={`${isTransparent ? "absolute" : "relative"} z-50 w-full transition-ultra`} role="banner">

      {/* ── Main Header ─────────────────────────────────── */}
      <div className={`${isTransparent ? "bg-transparent" : "bg-white/95 backdrop-blur-md shadow-sm"} h-16 md:h-20 transition-all border-b border-transparent pt-2 md:pt-0`}>
        <div className="container-xl flex h-full items-center justify-between">
          {/* ── Brand ─────────────────────────────────────── */}
          <Link to="/" className="group flex items-center gap-3 outline-none" aria-label="SPARKLE — Home">
            <div className={`grid h-8 w-8 md:h-11 md:w-11 shrink-0 place-items-center rounded-full ${isTransparent ? "bg-white text-primary" : "bg-primary text-white"} shadow-md transition-smooth group-hover:scale-105`}>
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="text-left">
              <span className={`block font-display text-[16px] md:text-[22px] font-black leading-none tracking-tight text-primary`}>SPARKLE</span>
              <span className={`block text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mt-0.5 md:mt-1`}>SHOP</span>
            </div>
          </Link>

          {/* ── Desktop nav ───────────────────────────────── */}
          <nav aria-label="Primary navigation" className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "text-primary after:scale-x-100" }}
                activeOptions={{ exact: l.to === "/" }}
                aria-current={location.pathname === l.to ? "page" : undefined}
                className={`relative text-[13px] font-bold tracking-wide uppercase transition-all after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:transition-transform hover:after:scale-x-100 ${
                  isTransparent 
                    ? "text-slate-600 hover:text-primary after:bg-primary" 
                    : "text-slate-600 hover:text-primary after:bg-primary"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ── Actions ───────────────────────────────────── */}
          <div className="flex items-center gap-2">

          {/* Search */}
          <div ref={searchRef} className="relative">
            {searchOpen ? (
              <div className="flex items-center" role="search">
                <form onSubmit={handleSearch} className="group relative flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    placeholder="Search RO systems…"
                    aria-label="Search RO systems"
                    className="w-52 rounded-xl border border-border bg-white py-2 pl-9 pr-10 text-sm outline-none transition-all focus:w-68 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-soft group-focus-within:border-primary"
                  />
                  <button 
                    type="submit"
                    title="Search"
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-primary transition-all z-10 hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <Search className="h-4 w-4 transition-colors group-focus-within:text-primary" aria-hidden="true" />
                  </button>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
                    {query.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="p-1 text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Clear query"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => { setSearchOpen(false); setQuery(""); }}
                      aria-label="Close search"
                      className="p-1 text-muted-foreground hover:text-foreground border-l border-border ml-1"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </form>

                {query.length >= 2 && (
                  <div
                    id="search-results"
                    role="listbox"
                    aria-label="Search results"
                    className="absolute right-0 top-full mt-2 w-76 overflow-hidden rounded-2xl border border-border bg-white shadow-elegant animate-slideDown"
                  >
                    {results.length > 0 ? (
                      <ul className="max-h-72 overflow-y-auto py-2">
                        {results.map((p) => (
                          <li key={p.id}>
                            <button
                              onClick={() => handleProductClick(p.id)}
                              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-fast hover:bg-secondary"
                            >
                              <img src={p.image} alt="" aria-hidden="true" className="h-10 w-10 rounded-lg object-cover" />
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-semibold">{p.name}</div>
                                <div className="truncate text-xs text-muted-foreground">{p.tagline}</div>
                              </div>
                              <span className="shrink-0 text-sm font-bold text-primary">
                                ₹{p.price.toLocaleString("en-IN")}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="px-4 py-5 text-center text-sm text-muted-foreground">
                        No results for &ldquo;{query}&rdquo;
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className={`btn-icon transition-smooth hover:bg-primary/10 hover:text-primary ${
                  isTransparent ? "text-foreground/60" : "text-foreground/60"
                }`}
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="View cart"
            className={`btn-icon relative transition-smooth hover:bg-primary/10 hover:text-primary ${
              isTransparent ? "text-foreground/60" : "text-foreground/60"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white ring-2 ring-white">
              {/* Note: In a real app we would use items.length from CartContext here */}
              !
            </span>
          </Link>

          {/* Login / Profile */}
          <Link
            to={user ? "/profile" : "/login"}
            aria-label={user ? "View Profile" : "Login or register"}
            id="navbar-login-btn"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-smooth hover:bg-primary/10 hover:text-primary ${
              isTransparent ? "text-foreground/60" : "text-foreground/60"
            }`}
          >
            <UserCircle2 className="h-5 w-5" aria-hidden="true" />
            {user && (
              <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest truncate max-w-[80px]">
                {user.displayName?.split(' ')[0] || "Profile"}
              </span>
            )}
          </Link>
          


          {/* Get a Quote CTA */}
          <Link
            to="/contact"
            id="navbar-quote-btn"
            className="hidden md:inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all"
          >
            Request Quote
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className={`btn-icon md:hidden ${isTransparent ? "text-foreground/60" : "text-foreground/60"}`}
          >
            {mobileOpen
              ? <X className="h-5 w-5" aria-hidden="true" />
              : <Menu className="h-5 w-5" aria-hidden="true" />
            }
          </button>
        </div>
      </div>
    </div>

      {/* ── Mobile panel ────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="fixed top-16 left-0 right-0 bottom-0 bg-white dark:bg-card md:hidden animate-slideDown overflow-y-auto z-40"
        >
          <nav aria-label="Mobile navigation" className="container-xl flex flex-col py-8 gap-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                activeProps={{ className: "text-primary bg-primary/5 font-bold" }}
                activeOptions={{ exact: l.to === "/" }}
                className="rounded-2xl px-6 py-4 text-lg font-bold hover:bg-secondary transition-fast border border-transparent hover:border-blue-100"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-6 pt-6 border-t border-border">
              <Link 
                to="/contact" 
                onClick={() => setMobileOpen(false)} 
                className="btn-primary w-full text-base py-4 shadow-xl"
              >
                Get a Free Quote
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
