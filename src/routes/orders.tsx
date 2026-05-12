import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Truck, CheckCircle2, Clock, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/orders")({
  component: Orders,
  head: () => ({
    meta: [{ title: "My Orders — RO Purify" }],
  }),
});

const DEMO_ORDERS = [
  {
    id: "ROP-84729",
    date: "12 Oct 2023",
    total: 18500,
    status: "Delivered",
    items: [
      { name: "RO Purify Pro 8", qty: 1, image: "https://images.unsplash.com/photo-1527018263358-7ca29af5e5d3?w=200&h=200&fit=crop" }
    ]
  },
  {
    id: "ROP-91234",
    date: "04 May 2026",
    total: 2500,
    status: "Processing",
    items: [
      { name: "Alkaline Filter Replacement", qty: 2, image: "https://images.unsplash.com/photo-1527018263358-7ca29af5e5d3?w=200&h=200&fit=crop" }
    ]
  }
];

function Orders() {
  return (
    <div className="bg-secondary/20 min-h-screen py-12">
      <div className="container-xl max-w-5xl">
        <div className="flex items-center justify-between mb-8">
           <h1 className="font-display text-4xl font-bold text-foreground">Order History</h1>
           <Link to="/products" className="text-sm font-bold text-primary hover:underline">
             Continue Shopping
           </Link>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-primary/5">
           {DEMO_ORDERS.length === 0 ? (
             <div className="text-center py-12">
               <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
               <h2 className="text-xl font-bold mb-2">No orders found</h2>
               <p className="text-muted-foreground">You haven't placed any orders yet.</p>
             </div>
           ) : (
             <div className="space-y-6">
               {DEMO_ORDERS.map((order, i) => (
                 <div key={order.id} className="border border-border rounded-2xl overflow-hidden hover:border-primary/20 transition-all animate-fadeUp" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="bg-secondary px-6 py-4 flex flex-wrap justify-between items-center border-b border-border gap-4">
                       <div className="flex gap-8">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Order Placed</div>
                            <div className="text-sm font-bold">{order.date}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Amount</div>
                            <div className="text-sm font-bold text-primary">₹{order.total.toLocaleString("en-IN")}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Order ID</div>
                            <div className="text-sm font-bold">{order.id}</div>
                          </div>
                       </div>
                       <div>
                         <Link to="/orders" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-1">
                           View Details <ChevronRight className="h-3 w-3" />
                         </Link>
                       </div>
                    </div>

                    <div className="p-6 bg-white">
                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 pb-6 border-b border-border/50">
                         <div className="flex items-center gap-3">
                           {order.status === 'Delivered' ? (
                             <CheckCircle2 className="h-6 w-6 text-green-500" />
                           ) : order.status === 'Processing' ? (
                             <Clock className="h-6 w-6 text-amber-500" />
                           ) : (
                             <Truck className="h-6 w-6 text-primary" />
                           )}
                           <div>
                             <div className="font-bold text-lg">{order.status}</div>
                             <div className="text-xs text-muted-foreground">
                               {order.status === 'Delivered' ? 'Your package has been delivered.' : 'We are preparing your order.'}
                             </div>
                           </div>
                         </div>
                         <button className="px-4 py-2 rounded-xl border border-border text-sm font-bold hover:bg-secondary transition-colors">
                           Track Package
                         </button>
                       </div>

                       <div className="space-y-4">
                         {order.items.map((item, idx) => (
                           <div key={idx} className="flex gap-4 items-center">
                             <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-xl border border-border" />
                             <div className="flex-1">
                               <div className="font-bold">{item.name}</div>
                               <div className="text-xs text-muted-foreground mt-1">Qty: {item.qty}</div>
                             </div>
                             <button className="text-xs font-bold text-primary hover:underline">Write a Review</button>
                           </div>
                         ))}
                       </div>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
