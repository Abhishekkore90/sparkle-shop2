import { Link } from "@tanstack/react-router";

const FOOTER_COLS = [
  {
    heading: "Company",
    links: [
      { label: "Overview", to: "/" },
      { label: "Press Kit", to: "/" },
      { label: "Become a Trade Partner", to: "/" },
      { label: "International Products", to: "/" },
      { label: "Blogs", to: "/" },
    ],
  },
  {
    heading: "Products",
    links: [
      { label: "Water Purifiers", to: "/products" },
      { label: "Water Softeners", to: "/products" },
      { label: "Kitchen Appliances", to: "/products" },
      { label: "Home Appliances", to: "/products" },
    ],
  },
  {
    heading: "Buy Now",
    links: [
      { label: "Terms & Conditions", to: "/" },
      { label: "Return & Refund Policy", to: "/" },
      { label: "Billing & Shipping", to: "/" },
      { label: "Cookie Policy", to: "/" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer role="contentinfo" className="bg-[#142354] text-white py-16">
      <div className="container-xl">
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" aria-label="SPARKLE — homepage">
              <div className="inline-flex flex-col mb-6 border border-white/20 p-2">
                <span className="font-bold text-2xl md:text-3xl leading-none tracking-widest uppercase">SPARKLE</span>
                <span className="text-[8px] md:text-[10px] font-medium tracking-[0.4em] uppercase text-white/50 mt-1">Shop Premium</span>
              </div>
            </Link>

            <p className="text-[13px] text-white/80 leading-relaxed pr-4">
              Bringing you exceptional quality and thoughtful design—crafted to elevate your daily life and deliver inspiration every moment.
            </p>
          </div>

          {/* Nav columns */}
          {FOOTER_COLS.map((col) => (
            <nav key={col.heading} aria-label={`${col.heading} links`} className="col-span-1">
              <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4 md:mb-6">
                {col.heading}
              </h3>
              <ul className="space-y-4">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-[13px] md:text-[15px] font-semibold md:font-bold text-white hover:text-white/70 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Right Column: CTA & Payments */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <p className="text-[13px] font-bold text-white mb-6">
              Join us as a trade partner in the growing water purification market in India.
            </p>
            <button className="bg-white text-[#142354] px-6 py-2.5 rounded-full font-semibold text-sm mb-12 hover:bg-white/90 transition-all">
              Become Partner
            </button>
            
            <div>
              <h2 className="text-[14px] font-bold text-white mb-4">Payment Method</h2>
              <div className="flex gap-2 items-center flex-wrap">
                {/* Simulated payment icons using CSS blocks */}
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center">
                  <div className="flex"><div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-80 -mr-1"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-80"></div></div>
                </div>
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center text-[#142354] font-bold text-[8px] italic">VISA</div>
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center text-[#142354] font-bold text-[8px]">UPI</div>
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center text-[#142354] font-bold text-[10px]">💳</div>
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center text-[#142354] font-bold text-[10px]">🏦</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
