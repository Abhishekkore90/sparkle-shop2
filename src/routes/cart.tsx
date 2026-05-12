import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Your Cart — PureNest" }],
  }),
  component: Cart,
});

function Cart() {
  const { items, remove, setQty, total, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-secondary">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Discover our premium range and add your favorites.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-gradient-primary"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Shopping Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((it) => (
            <div
              key={it.product.id}
              className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
            >
              <img
                src={it.product.image}
                alt={it.product.name}
                width={128}
                height={128}
                className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28"
              />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col items-start gap-1">
                    <h3 className="font-semibold">{it.product.name}</h3>
                    <p className="text-xs text-muted-foreground">{it.product.tagline}</p>
                    {it.product.warranty && (
                      <span className="mt-1 inline-flex items-center rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-950 shadow-sm border border-amber-500">
                        {it.product.warranty} Warranty
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => remove(it.product.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-border">
                    <button
                      onClick={() => setQty(it.product.id, it.qty - 1)}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{it.qty}</span>
                    <button
                      onClick={() => setQty(it.product.id, it.qty + 1)}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="font-bold">
                    ₹{(it.product.price * it.qty).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xl font-bold">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-primary">Free</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <Link
            to="/checkout"
            className="mt-6 flex w-full justify-center rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-gradient-primary hover:shadow-glow"
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
