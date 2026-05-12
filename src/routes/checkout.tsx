import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircle2, CreditCard, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({
    meta: [{ title: "Checkout — RO Purify" }],
  }),
});

function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // GST calculation (18%)
  const gstAmount = total * 0.18;
  const finalTotal = total + gstAmount;

  if (items.length === 0 && step !== 3) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="mt-6 font-display text-2xl font-bold">No items to checkout</h1>
        <Link to="/products" className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Order Placed Successfully!");
    clear();
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="bg-secondary/30 min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-xl border border-primary/10 animate-fadeUp">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">Thank you for your purchase. Your clinical-grade purifier is being prepared.</p>
          <div className="bg-secondary p-4 rounded-xl mb-8 text-sm flex justify-between items-center border border-primary/5">
            <span className="text-muted-foreground font-medium">Order ID</span>
            <span className="font-bold text-primary">#ROP-{Math.floor(Math.random() * 100000)}</span>
          </div>
          <Link to="/orders" className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Track Order <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary/20 min-h-screen pb-20 pt-10">
      <div className="container-xl max-w-6xl">
        <div className="mb-10 text-center md:text-left">
           <h1 className="font-display text-4xl font-bold text-foreground">Secure Checkout</h1>
           <p className="text-muted-foreground mt-2 font-medium">Complete your purchase safely and securely.</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Form Side */}
          <div className="lg:col-span-2 space-y-8">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Step 1: Address */}
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-primary/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                   <span className="grid place-items-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm">1</span>
                   Delivery Address
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Full Name</label>
                    <input required type="text" className="w-full p-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Phone Number</label>
                    <input required type="tel" className="w-full p-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="+91 98765 43210" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Full Address</label>
                    <textarea required className="w-full p-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" rows={3} placeholder="123 Street Name, Area..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">City</label>
                    <input required type="text" className="w-full p-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="City" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">PIN Code</label>
                    <input required type="text" className="w-full p-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="110001" />
                  </div>
                </div>
              </section>

              {/* Step 2: Payment */}
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-primary/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                   <span className="grid place-items-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm">2</span>
                   Payment Method
                </h2>

                <div className="space-y-4">
                   <label className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                      <div className="flex items-center gap-4">
                         <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="w-5 h-5 text-primary accent-primary" />
                         <div className="grid place-items-center h-10 w-10 bg-white rounded-full shadow-sm border border-border">
                            <CreditCard className="h-5 w-5 text-primary" />
                         </div>
                         <div>
                            <div className="font-bold text-foreground">Pay Online (Dummy)</div>
                            <div className="text-xs text-muted-foreground">Credit Card, UPI, Net Banking</div>
                         </div>
                      </div>
                   </label>

                   <label className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                      <div className="flex items-center gap-4">
                         <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 text-primary accent-primary" />
                         <div className="grid place-items-center h-10 w-10 bg-white rounded-full shadow-sm border border-border">
                            <Truck className="h-5 w-5 text-primary" />
                         </div>
                         <div>
                            <div className="font-bold text-foreground">Cash on Delivery</div>
                            <div className="text-xs text-muted-foreground">Pay when your product arrives</div>
                         </div>
                      </div>
                   </label>
                </div>
              </section>
            </form>
          </div>

          {/* Order Summary Side */}
          <div className="lg:col-span-1">
            <aside className="sticky top-28 bg-white rounded-3xl p-8 shadow-xl border border-primary/10">
               <h2 className="font-display text-xl font-bold border-b border-border pb-4 mb-6">Order Summary</h2>
               
               <div className="space-y-4 mb-6 max-h-[30vh] overflow-y-auto pr-2 scrollbar-hide">
                  {items.map(it => (
                    <div key={it.product.id} className="flex gap-4 items-center">
                       <img src={it.product.image} className="h-16 w-16 object-cover rounded-xl border border-border" alt="" />
                       <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">{it.product.name}</div>
                          <div className="text-xs text-muted-foreground">Qty: {it.qty}</div>
                       </div>
                       <div className="font-bold text-sm">₹{(it.product.price * it.qty).toLocaleString("en-IN")}</div>
                    </div>
                  ))}
               </div>

               <div className="space-y-3 text-sm font-medium border-t border-border pt-6 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
               </div>

               <div className="flex justify-between items-center border-t border-border pt-6 mb-8">
                 <span className="font-bold text-lg">Total Amount</span>
                 <span className="font-display font-extrabold text-2xl text-primary">₹{finalTotal.toLocaleString("en-IN")}</span>
               </div>

               <button 
                 type="submit" 
                 form="checkout-form"
                 className="w-full flex justify-center items-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-xl hover:shadow-[0_10px_25px_rgba(0,84,166,0.3)] hover:-translate-y-1 transition-all"
               >
                 <ShieldCheck className="h-5 w-5" />
                 Confirm Order
               </button>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
