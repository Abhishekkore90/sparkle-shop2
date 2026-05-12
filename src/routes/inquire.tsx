import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "sonner";
import { CheckCircle2, ArrowLeft, Droplets, Phone, Mail, MapPin } from "lucide-react";

export const Route = createFileRoute("/inquire")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      product: search.product as string | undefined,
    };
  },
  component: InquirePage,
});

function InquirePage() {
  const { product: productId } = useSearch({ from: "/inquire" });
  const { products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    productName: ""
  });

  useEffect(() => {
    if (productId && products.length > 0) {
      const p = products.find(item => item.id === productId);
      if (p) {
        setSelectedProduct(p);
        setFormData(prev => ({ ...prev, productName: p.name }));
      }
    }
  }, [productId, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "inquiries"), {
        ...formData,
        productId: productId || "General",
        status: "New",
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
      toast.success("Inquiry sent successfully!");
    } catch (err) {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center container-xl py-20">
        <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl border border-border shadow-elegant animate-in zoom-in-95 duration-500">
          <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-4">Inquiry Received!</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Thank you for reaching out. Our water specialist will contact you within 24 hours to discuss your requirements.
          </p>
          <Link to="/" className="btn-primary w-full py-4">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      <div className="container-xl">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-border shadow-elegant">
              <h1 className="font-display text-3xl font-bold mb-2">Product Inquiry</h1>
              <p className="text-muted-foreground mb-8">Fill out the form below and we'll get back to you with a custom quote.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Full Name*</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Phone Number*</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" placeholder="+91 98765 43210" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Email Address</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Installation Address</label>
                  <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors h-24 resize-none" placeholder="Enter your full address"></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Selected Product</label>
                  <input 
                    readOnly 
                    type="text" 
                    value={formData.productName || "General Inquiry"} 
                    className="w-full bg-slate-100 border border-border rounded-xl px-4 py-3 outline-none cursor-not-allowed text-slate-900 font-bold" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Special Requirements</label>
                  <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors h-32 resize-none" placeholder="Any specific questions or requirements?"></textarea>
                </div>

                <button disabled={isSubmitting} type="submit" className="btn-primary w-full py-4 text-base font-bold shadow-lg shadow-primary/20">
                  {isSubmitting ? "Sending Inquiry..." : "Submit Inquiry"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            {selectedProduct && (
              <div className="bg-white p-6 rounded-3xl border border-border shadow-soft overflow-hidden">
                <img src={selectedProduct.image} className="w-full h-48 object-cover rounded-2xl mb-6 bg-slate-100" alt={selectedProduct.name} />
                <h2 className="font-display text-xl font-bold mb-2">{selectedProduct.name}</h2>
                <div className="text-primary font-bold text-lg mb-4">₹{selectedProduct.price.toLocaleString("en-IN")}</div>
                <ul className="space-y-3">
                  {(selectedProduct.features || []).slice(0, 3).map((f: string) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-foreground rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="font-display text-2xl font-bold mb-6">Need Instant Help?</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-white/50 uppercase font-bold tracking-widest">Call Us 24/7</div>
                      <div className="font-bold">+91 1800-123-4567</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-white/50 uppercase font-bold tracking-widest">Email Support</div>
                      <div className="font-bold">care@RO Purify.com</div>
                    </div>
                  </div>
                </div>
              </div>
              <Droplets className="absolute -bottom-8 -right-8 h-32 w-32 text-white/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
