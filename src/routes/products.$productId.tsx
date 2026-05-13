import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { Check, ArrowLeft, MessageCircle, Truck, Shield, RefreshCw, Droplets, Layers, Gauge, Zap } from "lucide-react";
import { useState } from "react";
import { products } from "@/data/products";
import { InquiryModal } from "@/components/InquiryModal";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useProducts } from "@/hooks/useProducts";

export const Route = createFileRoute("/products/$productId")({
  loader: async ({ params }) => {
    let product: any = null;

    try {
      // 1. Try fetching from Firestore first (this ensures admin edits take precedence)
      const docRef = doc(db, "products", params.productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.isDeleted) {
          product = { ...data, id: docSnap.id };
        }
      } else {
        // Fallback: Query by 'id' field (for older products added with addDoc)
        const { collection, query, where, getDocs } = await import("firebase/firestore");
        const q = query(collection(db, "products"), where("id", "==", params.productId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0];
          const data = firstDoc.data();
          if (!data.isDeleted) {
            product = { ...data, id: firstDoc.id };
          }
        }
      }
    } catch (e) {
      console.error("Failed to fetch product from firestore", e);
    }

    // 2. If not found in Firestore (or if it failed), fallback to static data
    if (!product) {
      product = products.find((p) => p.id === params.productId);
    }

    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — RO Purify RO` },
          { name: "description", content: loaderData.product.tagline },
          { property: "og:title",       content: loaderData.product.name    },
          { property: "og:description", content: loaderData.product.tagline },
          { property: "og:image",       content: loaderData.product.image   },
        ]
      : [],
  }),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="container-xl py-24 text-center">
        <p className="text-destructive mb-4">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="container-xl py-24 text-center">
      <Droplets className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
      <h1 className="font-display text-3xl font-bold mb-4">Product not found</h1>
      <Link to="/products" className="btn-primary inline-flex">
        Back to Products
      </Link>
    </div>
  ),
  component: Detail,
});

function Detail() {
  const { product }    = Route.useLoaderData();
  const { products: allProducts } = useProducts();
  const [showInquiry, setShowInquiry] = useState(false);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const categoryLabel: Record<string, string> = {
    "ro-purifiers": "RO Purifiers",
    "water-softeners": "Water Softeners",
    "kitchen-appliances": "Kitchen Appliances",
    "air-purifiers": "Air Purifiers",
  };

  const displayCategory = categoryLabel[product.category] || 
    product.category.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  const displayImage = product.image || "https://images.unsplash.com/photo-1595080838612-42da65022201?auto=format&fit=crop&q=80&w=400";

  return (
    <article className="container-xl py-10 pb-20">

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/" className="hover:text-primary transition-fast">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/products" className="hover:text-primary transition-fast">Products</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground font-medium truncate max-w-[200px]">{product.name}</li>
        </ol>
      </nav>

      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-fast mb-8"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Products
      </Link>

      <div className="mt-4 grid gap-8 md:gap-14 lg:grid-cols-2 items-start">

        {/* Image */}
        <div className="lg:sticky lg:top-28">
          <div className="relative rounded-3xl bg-secondary border border-primary/5 overflow-hidden shadow-md p-6 md:p-8 flex items-center justify-center min-h-[300px] md:min-h-[450px]">
            {discount > 0 && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-accent text-primary px-4 py-1.5 text-sm font-bold shadow-sm">
                -{discount}% OFF
              </span>
            )}
            {product.badge && (
              <span className="absolute right-4 top-4 z-10 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-white shadow-sm">
                {product.badge}
              </span>
            )}
            <img
              src={displayImage}
              alt={product.name}
              className="mx-auto w-full max-w-sm object-contain drop-shadow-xl"
              style={{ maxHeight: "400px" }}
            />
          </div>

          {/* Quick specs below image */}
          <div className="mt-4 md:mt-5 grid grid-cols-3 gap-2 md:gap-3">
            {[
              { icon: Layers, label: "Stages",   value: `${product.stages}-Stage`    },
              { icon: Gauge,  label: "Flow Rate", value: product.capacity              },
              { icon: Droplets, label: "Max TDS", value: product.tds   },
            ].map(s => (
              <div key={s.label} className="rounded-2xl bg-white border border-primary/5 shadow-sm p-4 text-center hover:border-primary/20 transition-all">
                <div className="w-8 h-8 mx-auto bg-secondary rounded-full flex items-center justify-center mb-2">
                  <s.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">{s.label}</div>
                <div className="text-sm font-bold mt-0.5 text-primary">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>

          {/* Category + name */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="tds-badge">{displayCategory}</span>
            {product.warranty && (
              <span className="inline-flex items-center rounded-full bg-amber-400 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-amber-950 shadow-sm border border-amber-500">
                {product.warranty} Warranty
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 leading-tight">{product.name}</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6">{product.tagline}</p>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-4 mb-6">
            <span className="text-3xl md:text-4xl font-display font-bold text-foreground">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.oldPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  ₹{product.oldPrice.toLocaleString("en-IN")}
                </span>
                <span className="rounded-full bg-green-50 text-green-700 px-3 py-1 text-sm font-bold">
                  Save ₹{(product.oldPrice - product.price).toLocaleString("en-IN")}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-foreground/75 leading-relaxed mb-8 text-base">{product.description}</p>

          {/* RO Specs box */}
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5 md:p-6 mb-8">
            <h2 className="font-display text-base font-bold text-primary mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4" aria-hidden="true" />
              Purification Specifications
            </h2>
            <dl className="grid gap-4 grid-cols-2 md:grid-cols-3">
              {[
                { label: "Purification Stages", value: `${product.stages}-Stage` },
                { label: "Flow Rate",            value: product.capacity          },
                { label: "Max Input TDS",        value: product.tds               },
                { label: "Warranty",             value: product.warranty || "1 Year" },
              ].map(spec => (
                <div key={spec.label}>
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{spec.label}</dt>
                  <dd className="text-sm font-bold mt-1">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="font-display text-lg font-bold mb-4">Key Features</h2>
            <ul className="grid gap-2.5 grid-cols-1 sm:grid-cols-2">
              {(product.features || []).map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <Link
            to="/inquire"
            search={{ product: product.id }}
            id={`detail-enquire-${product.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-primary/90 transition-all uppercase tracking-widest w-full sm:w-auto mb-4"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Enquire / Book Installation
          </Link>

          <InquiryModal
            productName={product.name}
            isOpen={showInquiry}
            onClose={() => setShowInquiry(false)}
          />

          {/* Badges */}
          <div className="grid gap-4 border-t border-border pt-6 grid-cols-2 md:grid-cols-3 mt-6">
            {[
              { icon: Truck,    label: "Free Delivery & Installation" },
              { icon: Shield,   label: `${product.warranty || "1 Year"} Comprehensive Warranty` },
              { icon: RefreshCw, label: "7-Day Money-Back Guarantee"  },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <b.icon className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

    </article>
  );
}
