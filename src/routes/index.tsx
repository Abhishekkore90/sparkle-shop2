import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, ShieldCheck, Star, Sparkles, ShoppingBag, Globe, Zap, Handshake, ShoppingCart, Hand, Store, ArrowUpRight
} from "lucide-react";
import heroSparkle from "@/assets/kent_banner.webp";
import catKitchen from "@/assets/cat-kitchen.jpg";
import catWater from "@/assets/cat-water.jpg";
import catAir from "@/assets/cat-air.jpg";
import waterSoftenerBanner from "@/assets/water_softener_banner.webp";
import roImage from "@/assets/ro.webp";
import uvImage from "@/assets/uv.webp";
import gravityImage from "@/assets/gravity.webp";
import hydrogenImage from "@/assets/p-ro-pro8.png";
import autosoftImage from "@/assets/autosoft1.png";
import bathroomSoftenerImage from "@/assets/bathroomsoftener.png";
import sandFilterImage from "@/assets/sandfilter.webp";
import kitchenBanner from "@/assets/kitchen_banner.webp";
import cookPureBanner from "@/assets/cook-pure-banner.webp";
import inductionImage from "@/assets/induction.webp";
import multiCookerImage from "@/assets/multicooker.webp";
import airFryer1 from "@/assets/p-kit1.jpg";
import airFryer2 from "@/assets/p-kit2.jpg";
import airPureBanner from "@/assets/airPure-banner.webp";
import alpsImage from "@/assets/alps.webp";
import pAir1 from "@/assets/p-air1.jpg";
import pAir2 from "@/assets/p-air2.jpg";
import featuredBanner from "@/assets/featured-banner.webp";
import featuredBannerClean from "@/assets/featured-banner-clean.png";
import featuredBannerNew from "@/assets/featured-banner-new.png";
import award1 from "@/assets/award1.png";
import award2 from "@/assets/award2.png";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SparkleShop — Premium Living, Sparkling Elegance" },
      {
        name: "description",
        content: "Experience luxury home appliances crafted for modern living. From advanced water purification to clinical air care, discover the sparkle of perfection.",
      },
    ],
  }),
  component: Home,
});

const TESTIMONIALS = [
  {
    name: "Ayesha Vardhan",
    city: "Mumbai",
    rating: 5,
    text: "SparkleShop transformed our kitchen. The elegance of their products is unmatched, and the performance is flawless.",
    product: "Elite Kitchen Suite",
  },
  {
    name: "Vikram Seth",
    city: "Gurgaon",
    rating: 5,
    text: "The premium feel of the AirElegance series is exactly what I was looking for. Highly recommended for luxury homes.",
    product: "AirElegance Pro",
  },
  {
    name: "Meera Reddy",
    city: "Hyderabad",
    rating: 5,
    text: "Exceptional service and stunning designs. The water purifier is a piece of art on our counter.",
    product: "SparklePure RO",
  },
] as const;

function Home() {
  const { products } = useProducts();
  const featured = products.slice(0, 3);
  
  const [banners, setBanners] = useState({
    hero: heroSparkle,
    waterSoftener: waterSoftenerBanner,
    cookPure: cookPureBanner,
    airPure: airPureBanner,
    featured: featuredBannerNew,
    catRO: roImage,
    catUV: uvImage,
    catGravity: gravityImage
  });

  useEffect(() => {
    async function fetchBanners() {
      try {
        const docRef = doc(db, "settings", "home_banners");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBanners({
            hero: data.hero || heroSparkle,
            waterSoftener: data.waterSoftener || waterSoftenerBanner,
            cookPure: data.cookPure || cookPureBanner,
            airPure: data.airPure || airPureBanner,
            featured: data.featured || featuredBannerNew,
            catRO: data.catRO || roImage,
            catUV: data.catUV || uvImage,
            catGravity: data.catGravity || gravityImage
          });
        }
      } catch (err) {
        console.error("Failed to fetch home banners", err);
      }
    }
    fetchBanners();
  }, []);

  return (
    <div className="bg-white font-sans selection:bg-primary/20">
      {/* ── Hero Section (Sparkle Luxury) ─────────────────── */}
      <section className="relative h-auto md:min-h-screen flex items-center bg-white overflow-hidden">
        <div className="relative md:absolute md:inset-0 z-0 w-full h-full flex items-center justify-center pt-16 md:pt-0">
          <img
            src={banners.hero}
            alt="SparkleShop Premium Living"
            className="w-full h-auto md:h-full md:object-cover object-center block"
          />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <div className="h-12 w-px bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* ── Product Categories ───────────────────────────── */}
      <section className="bg-white pt-4 pb-20">
        <div className="container-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { title: "RO Water Purifiers", image: banners.catRO, category: "ro-purifiers" },
              { title: "UV Water Purifier", image: banners.catUV, category: "ro-purifiers" },
              { title: "Gravity Water Purifier", image: banners.catGravity, category: "ro-purifiers" },
              { title: "Nectar Hydrogen Water Maker", image: "https://images.unsplash.com/photo-1585837553281-4d279934216c?auto=format&fit=crop&q=80&w=600", category: "ro-purifiers" }
            ].map((cat, i) => (
              <Link 
                key={i} 
                to="/products" 
                search={{ category: cat.category }}
                className="group relative bg-[#e8f1f8] rounded-xl p-4 md:p-6 flex flex-col items-center justify-between min-h-[180px] md:min-h-[320px] overflow-hidden transition-all hover:shadow-md"
              >
                <div className="w-full text-left z-10">
                  <h3 className="text-[#14348a] font-bold text-[12px] md:text-[15px]">{cat.title}</h3>
                </div>
                
                <div className="flex-1 w-full flex items-center justify-center p-4 z-0">
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className="max-h-[200px] object-contain transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105" 
                    onError={(e) => { 
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1635336184126-72485458da75?auto=format&fit=crop&q=80&w=400'; 
                    }} 
                  />
                </div>
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
                  <span className="bg-[#14348a] text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
                    Explore Now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Showcase Banner ──────────────────────────── */}
      <section className="w-full overflow-hidden">
        <img src={banners.waterSoftener} alt="Sparkle Water Softeners" className="w-full h-auto block" />
      </section>

      {/* ── Water Softener Categories ───────────────────────────── */}
      <section className="bg-white py-12">
        <div className="container-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { title: "SPARKLE AutoSoft", image: autosoftImage, category: "water-softeners" },
              { title: "SPARKLE AutoSoft", image: autosoftImage, category: "water-softeners" },
              { title: "SPARKLE Bathroom Water Softener", image: bathroomSoftenerImage, category: "water-softeners" },
              { title: "Sparkle Sand Filters", image: sandFilterImage, category: "water-softeners" }
            ].map((cat, i) => (
              <Link 
                key={i} 
                to="/products" 
                search={{ category: cat.category }}
                className="group relative bg-[#e8f1f8] rounded-xl p-4 md:p-6 flex flex-col items-center justify-between min-h-[220px] md:min-h-[320px] overflow-hidden transition-all hover:shadow-md"
              >
                <div className="w-full text-left z-10">
                  <h3 className="text-[#14348a] font-bold text-[12px] md:text-[15px]">{cat.title}</h3>
                </div>
                
                <div className="flex-1 w-full flex items-center justify-center p-4 z-0">
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className="max-h-[200px] object-contain transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105" 
                  />
                </div>
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
                  <span className="bg-[#14348a] text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
                    Explore Now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cook Pure Banner (Kitchen Appliances) ───────────────────────────── */}
      <section className="bg-white">
        <div className="w-full overflow-hidden">
          <img src={banners.cookPure} alt="Cook Pure - Smart Kitchen Appliances" className="w-full h-auto block" />
        </div>
      </section>

      {/* ── Kitchen Appliances Categories ───────────────────────────── */}
      <section className="bg-white py-4">
        <div className="container-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { title: "SPARKLE Air Fryers", image: airFryer1, category: "kitchen-appliances" },
              { title: "SPARKLE Air Fryers", image: airFryer2, category: "kitchen-appliances" },
              { title: "SPARKLE Induction Cooktop", image: inductionImage, category: "kitchen-appliances" },
              { title: "SPARKLE Egg Boilers", image: multiCookerImage, category: "kitchen-appliances" }
            ].map((cat, i) => (
              <Link 
                key={i} 
                to="/products" 
                search={{ category: cat.category }}
                className="group relative bg-[#e8f1f8] rounded-xl p-4 md:p-6 flex flex-col items-center justify-between min-h-[220px] md:min-h-[320px] overflow-hidden transition-all hover:shadow-md"
              >
                <div className="w-full text-left z-10">
                  <h3 className="text-[#14348a] font-bold text-[12px] md:text-[15px]">{cat.title}</h3>
                </div>
                
                <div className="flex-1 w-full flex items-center justify-center p-4 z-0 bg-blend-multiply">
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className="max-h-[200px] object-contain mix-blend-multiply transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105" 
                  />
                </div>
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
                  <span className="bg-[#14348a] text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
                    Explore Now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ── Smarter Technology Healthier Living Banner ───────────────────────────── */}
      <section className="bg-white py-16">
        <div className="container-xl">
          <div className="mb-10 text-left">
            <h2 className="text-[#0f172a] text-3xl md:text-[38px] font-bold tracking-tight mb-2">Smarter Technology Healthier Living</h2>
            <p className="text-slate-500 text-base md:text-[18px]">
              With more than two decades of innovation & trusted by millions of families, Sparkle brings certainty to the essentials of life.
            </p>
          </div>
        </div>
        <div className="w-full overflow-hidden">
          <img src={banners.airPure} alt="Smarter Technology Healthier Living" className="w-full h-auto block" />
        </div>
      </section>

      {/* ── Healthier Living Categories ───────────────────────────── */}
      <section className="bg-white py-4">
        <div className="container-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { title: "SPARKLE Air Purifiers", image: alpsImage, category: "air-purifiers" },
              { title: "SPARKLE Vacuum Cleaners", image: pAir1, category: "air-purifiers" },
              { title: "SPARKLE Steam Irons", image: pAir2, category: "air-purifiers" },
              { title: "SPARKLE Dew Humidifier", image: catWater, category: "air-purifiers" }
            ].map((cat, i) => (
              <Link 
                key={i} 
                to="/products" 
                search={{ category: cat.category }}
                className="group relative bg-[#e8f1f8] rounded-xl p-4 md:p-6 flex flex-col items-center justify-between min-h-[220px] md:min-h-[320px] overflow-hidden transition-all hover:shadow-md"
              >
                <div className="w-full text-left z-10">
                  <h3 className="text-[#14348a] font-bold text-[12px] md:text-[15px]">{cat.title}</h3>
                </div>
                
                <div className="flex-1 w-full flex items-center justify-center p-4 z-0 bg-blend-multiply">
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className="max-h-[200px] object-contain mix-blend-multiply transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105" 
                  />
                </div>
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
                  <span className="bg-[#14348a] text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
                    Explore Now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products Banner ───────────────────────────── */}
      <section className="bg-white py-16">
        <div className="container-xl">
          <div className="mb-10 text-left">
            <h2 className="text-[#0f172a] text-3xl md:text-[38px] font-bold tracking-tight mb-2">Featured Products</h2>
            <p className="text-slate-500 text-base md:text-[18px]">
              Discover SPARKLE's latest innovations, engineered to deliver superior purification, smarter performance, and dependable everyday use, designed for modern Indian homes.
            </p>
          </div>
        </div>
        <div className="relative w-full h-auto md:h-[600px] overflow-hidden group">
          <img 
            src={banners.featured} 
            alt="Featured Products" 
            className="relative md:absolute md:inset-0 w-full h-auto md:h-full md:object-cover transition-transform duration-700 group-hover:scale-105 block" 
          />
        </div>
      </section>

      {/* ── Why Millions Choose SPARKLE ───────────────────────────── */}
      <section className="bg-slate-50 py-16 border-b border-slate-200">
        <div className="container-xl">
          <h2 className="text-[#0f172a] text-3xl md:text-[38px] font-bold tracking-tight mb-12">Why Millions Choose SPARKLE</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex gap-3 items-start">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-[#14348a] flex-shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="text-[#0f172a] font-bold text-[15px] md:text-[18px] mb-1 md:mb-2">SPARKLE Advantage</h3>
                <p className="text-slate-500 text-[12px] md:text-[14px] leading-relaxed">
                  Largest Manufacturer & Market Leader in RO Water Purifier with Large Sales and Service Network
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-[#14348a] flex-shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="text-[#0f172a] font-bold text-[15px] md:text-[18px] mb-1 md:mb-2">Trusted Brand</h3>
                <p className="text-slate-500 text-[12px] md:text-[14px] leading-relaxed">
                  Honored with Numerous International Certifications and Awards
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start col-span-2 md:col-span-1">
              <Handshake className="w-8 h-8 md:w-10 md:h-10 text-[#14348a] flex-shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="text-[#0f172a] font-bold text-[15px] md:text-[18px] mb-1 md:mb-2">25 Years of Trust</h3>
                <p className="text-slate-500 text-[12px] md:text-[14px] leading-relaxed">
                  Most Preferred RO & Home Appliances Brands in India
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>




    </div>
  );
}

