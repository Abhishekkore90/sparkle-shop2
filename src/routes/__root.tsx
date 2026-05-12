import { Outlet, createRootRoute, HeadContent, Scripts, Link, useLocation } from "@tanstack/react-router";
import { Home, ShoppingBag, UserCircle2 } from "lucide-react";
import { CartProvider } from "@/context/CartContext";
import appCss from "../styles.css?url";
import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";

/* ─── 404 Page ──────────────────────────────────────────────────────────── */
function NotFoundComponent() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <p className="eyebrow mb-6">Page Not Found</p>
        <h1 className="font-display text-8xl font-bold text-foreground tracking-tighter">
          404
        </h1>
        <p className="mt-6 text-lg text-muted-foreground font-light leading-relaxed">
          The page you're looking for has moved or doesn't exist.
        </p>
        <Link
          to="/"
          className="btn-primary mt-10 inline-flex"
          id="not-found-home-link"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}

/* ─── Route definition ──────────────────────────────────────────────────── */
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#b8922a" },

      /* Primary SEO */
      { title: "SparkleShop — Premium Living, Sparkling Elegance" },
      {
        name: "description",
        content:
          "Shop premium RO water purifiers, HEPA air purifiers, and luxury kitchen appliances engineered for healthier, more beautiful homes.",
      },
      { name: "keywords", content: "water purifier, air purifier, kitchen appliances, premium home, sparkle shop" },
      { name: "author", content: "SparkleShop" },
      { name: "robots", content: "index, follow" },

      /* Open Graph */
      { property: "og:type",        content: "website" },
      { property: "og:site_name",   content: "SparkleShop" },
      { property: "og:title",       content: "SparkleShop — Premium Living, Sparkling Elegance" },
      { property: "og:description", content: "Premium home appliances crafted for luxury living." },

      /* Twitter Card */
      { name: "twitter:card",  content: "summary_large_image" },
      { name: "twitter:title", content: "SparkleShop — Premium Living" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

/* ─── HTML Shell ────────────────────────────────────────────────────────── */
function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* Accessibility: skip to main content */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isTechnician = location.pathname.startsWith("/technician");

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/products", label: "Products", icon: ShoppingBag },
    { to: "/profile", label: "Profile", icon: UserCircle2 },
  ] as const;

  return (
    <CartProvider>
      {isAdmin || isTechnician ? (
        <>
          <Outlet />
          <Toaster position="top-right" />
        </>
      ) : (
        <Layout>
          <Outlet />
        </Layout>
      )}

      {/* Global Mobile Bottom Navigation - Visible ONLY on mobile */}
      <nav 
        className="md:hidden flex fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary shadow-[0_-4px_20px_rgba(0,0,0,0.15)] items-center justify-around px-4 z-[99999] h-16"
      >
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ style: { color: '#2563eb', fontWeight: 'bold' } }}
              inactiveProps={{ style: { color: '#64748b' } }}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '4px',
                minWidth: '60px',
                height: '100%',
                textDecoration: 'none',
                transition: 'all 0.3s'
              }}
            >
              <Icon size={24} />
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </CartProvider>
  );
}
