import roPro8 from "@/assets/p-ro-pro8.png";
import roImage from "@/assets/ro.webp";
import uvImage from "@/assets/uv.webp";
import gravityImage from "@/assets/gravity.webp";
import autosoftImage from "@/assets/autosoft1.png";
import bathroomSoftenerImage from "@/assets/bathroomsoftener.png";
import sandFilterImage from "@/assets/sandfilter.webp";
import inductionImage from "@/assets/induction.webp";
import multiCookerImage from "@/assets/multicooker.webp";
import airFryer1 from "@/assets/p-kit1.jpg";
import airFryer2 from "@/assets/p-kit2.jpg";
import alpsImage from "@/assets/alps.webp";
import pAir1 from "@/assets/p-air1.jpg";
import pAir2 from "@/assets/p-air2.jpg";
import catWater from "@/assets/cat-water.jpg";

export type Product = {
  id: string;
  name: string;
  category: "ro-purifiers" | "water-softeners" | "kitchen-appliances" | "air-purifiers";
  price: number;
  oldPrice?: number;
  image: string;
  tagline: string;
  description: string;
  features: string[];
  tds: string;
  stages: number;
  capacity: string;
  badge?: string;
  warranty?: string;
};

export const products: Product[] = [
  // ── RO Purifiers ──────────────────────────────────────────
  {
    id: "kent-grand-plus",
    name: "KENT Grand+",
    category: "ro-purifiers",
    price: 19500,
    oldPrice: 21000,
    image: roImage,
    tagline: "RO+UV+UF+TDS Control",
    description: "Most trusted RO water purifier with Save Water Technology and Zero Water Wastage.",
    features: ["RO+UV+UF+TDS Control", "Zero Water Wastage", "9L Storage", "20 L/hr Duty Cycle"],
    tds: "Up to 2500 ppm",
    stages: 7,
    capacity: "9 L",
    badge: "Best Seller",
    warranty: "1 Year + 3 Years Service"
  },
  {
    id: "kent-super-plus",
    name: "KENT Super+",
    category: "ro-purifiers",
    price: 15500,
    oldPrice: 17000,
    image: uvImage,
    tagline: "RO+UF+TDS Control",
    description: "Elegant wall-mounted water purifier for purified water that's rich in minerals.",
    features: ["RO+UF+TDS Control", "Wall Mounted", "8L Storage", "Auto-on/off"],
    tds: "Up to 2000 ppm",
    stages: 6,
    capacity: "8 L",
    warranty: "1 Year"
  },
  {
    id: "kent-gold",
    name: "KENT Gold",
    category: "ro-purifiers",
    price: 3500,
    oldPrice: 4200,
    image: gravityImage,
    tagline: "Gravity-based UF Water Purifier",
    description: "First-of-its-kind gravity-based water purifier which uses hollow fiber UF membrane.",
    features: ["Gravity-based UF", "Chemical-free", "20L Storage", "Non-electric"],
    tds: "Low TDS Water",
    stages: 3,
    capacity: "20 L",
    badge: "Budget",
    warranty: "1 Year"
  },
  {
    id: "kent-nectar",
    name: "KENT Nectar Hydrogen Water",
    category: "ro-purifiers",
    price: 32000,
    image: roPro8,
    tagline: "Antioxidant Hydrogen Water Maker",
    description: "Converts regular water into antioxidant-rich hydrogen water.",
    features: ["Hydrogen Rich Water", "Antioxidant Properties", "Touch Interface", "Sleek Design"],
    tds: "Purified Water Only",
    stages: 1,
    capacity: "Instant",
    badge: "New Tech",
    warranty: "1 Year"
  },

  // ── Water Softeners ───────────────────────────────────────
  {
    id: "kent-autosoft-255",
    name: "KENT AutoSoft 255",
    category: "water-softeners",
    price: 55000,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600",
    tagline: "Fully Automatic Water Softener",
    description: "Converts hard water into soft water automatically.",
    features: ["Microprocessor Controlled", "Time-based Regeneration", "High Capacity Resin"],
    tds: "N/A",
    stages: 1,
    capacity: "3000 L/hr",
    warranty: "1 Year"
  },
  {
    id: "kent-autosoft-8l",
    name: "KENT AutoSoft 8L",
    category: "water-softeners",
    price: 35000,
    image: autosoftImage,
    tagline: "Compact Automatic Softener",
    description: "Smaller version of the automatic softener.",
    features: ["Automatic Regeneration", "Compact Size", "High Purity Resin"],
    tds: "N/A",
    stages: 1,
    capacity: "1000 L/hr",
    warranty: "1 Year"
  },
  {
    id: "kent-bathroom-softener",
    name: "KENT Bathroom Softener",
    category: "water-softeners",
    price: 8500,
    image: bathroomSoftenerImage,
    tagline: "Soft water for hair and skin",
    description: "Compact water softener designed specifically for bathroom use.",
    features: ["Compact Design", "Easy Installation", "Manual Regeneration"],
    tds: "N/A",
    stages: 1,
    capacity: "500 L/hr",
    badge: "Essential",
    warranty: "1 Year"
  },
  {
    id: "kent-sand-filter",
    name: "KENT Sand Filter",
    category: "water-softeners",
    price: 12500,
    image: sandFilterImage,
    tagline: "Point of Entry Water Filter",
    description: "High-efficiency sand filter that removes suspended particles.",
    features: ["Deep Bed Filtration", "Backwash Valve", "Corrosion Resistant"],
    tds: "N/A",
    stages: 1,
    capacity: "2000 L/hr",
    warranty: "1 Year"
  },

  // ── Kitchen Appliances ────────────────────────────────────
  {
    id: "kent-air-fryer",
    name: "KENT Air Fryer",
    category: "kitchen-appliances",
    price: 6500,
    oldPrice: 7999,
    image: airFryer1,
    tagline: "Fry, Grill, Roast & Bake with 80% less oil",
    description: "A versatile kitchen appliance that uses rapid air technology.",
    features: ["Rapid Air Technology", "8 Preset Menus", "Large Capacity"],
    tds: "N/A",
    stages: 0,
    capacity: "3.2 L",
    badge: "Popular",
    warranty: "1 Year"
  },
  {
    id: "kent-air-fryer-digi",
    name: "KENT Digital Air Fryer",
    category: "kitchen-appliances",
    price: 9500,
    oldPrice: 11999,
    image: airFryer2,
    tagline: "Large 5L Capacity with Digital Control",
    description: "Advanced digital air fryer with one-touch presets.",
    features: ["Digital Display", "5L Capacity", "10 Preset Menus"],
    tds: "N/A",
    stages: 0,
    capacity: "5 L",
    badge: "Premium",
    warranty: "1 Year"
  },
  {
    id: "kent-induction-cooktop",
    name: "KENT Induction Cooktop",
    category: "kitchen-appliances",
    price: 3200,
    image: inductionImage,
    tagline: "Fast & Flame-free Cooking",
    description: "Safe and efficient induction cooktop.",
    features: ["8 Preset Menus", "Auto Pan Detection", "Overheat Protection"],
    tds: "N/A",
    stages: 0,
    capacity: "N/A",
    warranty: "1 Year"
  },
  {
    id: "kent-egg-boiler",
    name: "KENT Egg Boiler",
    category: "kitchen-appliances",
    price: 1800,
    oldPrice: 2200,
    image: multiCookerImage,
    tagline: "Boils 7 Eggs at a time",
    description: "Compact and efficient egg boiler.",
    features: ["One-touch Operation", "Auto-off Function", "Overheat Protection"],
    tds: "N/A",
    stages: 0,
    capacity: "7 Eggs",
    warranty: "1 Year"
  },

  // ── Air Purifiers / Healthier Living ──────────────────────
  {
    id: "kent-alps-plus",
    name: "KENT Alps+",
    category: "air-purifiers",
    price: 12500,
    oldPrice: 15000,
    image: alpsImage,
    tagline: "HEPA Air Purifier with UV Disinfectant",
    description: "Removes 99.97% of pollutants using HEPA and UV-C.",
    features: ["HEPA Filtration", "UV-C Disinfectant", "PM 2.5 Display"],
    tds: "N/A",
    stages: 4,
    capacity: "400 m³/hr",
    badge: "Clinic Grade",
    warranty: "1 Year"
  },
  {
    id: "kent-robot-vacuum",
    name: "KENT Robot Vacuum Cleaner",
    category: "air-purifiers",
    price: 18500,
    oldPrice: 21999,
    image: pAir1,
    tagline: "Automatic Cleaning with Smart Mapping",
    description: "Advanced robot vacuum that sweeps and mops your home automatically using smart navigation technology.",
    features: ["Smart Navigation", "Sweep & Mop", "Auto-docking", "App Control"],
    tds: "N/A",
    stages: 2,
    capacity: "N/A",
    badge: "Smart Tech",
    warranty: "1 Year"
  },
  {
    id: "kent-garment-steamer",
    name: "KENT Steam Irons / Garment Steamer",
    category: "air-purifiers",
    price: 3200,
    image: pAir2,
    tagline: "Handheld Garment Steamer for Wrinkle-free Clothes",
    description: "Powerful handheld garment steamer that removes wrinkles and sanitizes clothes without an ironing board.",
    features: ["Instant Steam", "Vertical Steaming", "Lightweight Design", "Safe for All Fabrics"],
    tds: "N/A",
    stages: 0,
    capacity: "200 ml",
    warranty: "1 Year"
  },
  {
    id: "kent-dew-humidifier",
    name: "KENT Dew Humidifier",
    category: "air-purifiers",
    price: 4500,
    image: catWater,
    tagline: "Maintain Optimal Humidity Indoors",
    description: "Helps in maintaining the right level of humidity in your room.",
    features: ["Silent Operation", "Adjustable Mist Control", "Large Capacity"],
    tds: "N/A",
    stages: 1,
    capacity: "4 L",
    warranty: "1 Year"
  }
];

export const categories = [
  { id: "ro-purifiers", name: "RO Purifiers", desc: "Advanced water purification for your home" },
  { id: "water-softeners", name: "Water Softeners", desc: "Conditioned water for whole home" },
  { id: "kitchen-appliances", name: "Kitchen Appliances", desc: "Smart technology for healthier cooking" },
  { id: "air-purifiers", name: "Air Purifiers", desc: "Clean air for a healthy environment" },
] as const;

export type Category = typeof categories[number]["id"];
