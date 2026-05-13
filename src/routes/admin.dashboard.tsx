import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Plus, 
  Search, 
  Bell,
  TrendingUp,
  Droplets,
  MoreVertical,
  Edit,
  Trash2,
  ChevronRight,
  MessageSquare,
  Wrench,
  CheckCircle2,
  Clock,
  Truck,
  CalendarCheck,
  UserCheck,
  AlertTriangle,
  ReceiptText,
  Download,
  Eye,
  Activity,
  BarChart3,
  Settings,
  ArrowRight,
  ClipboardList,
  MapPin,
  Phone,
  ShieldCheck,
  Mail,
  X,
  Menu,
  Image as ImageIcon
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { categories } from "@/data/products";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDocs, query, orderBy, deleteDoc, updateDoc, onSnapshot, getDoc } from "firebase/firestore";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — SparkleShop Admin" },
    ],
  }),
  component: AdminPanel,
});



function AdminPanel() {
  const { products, loading: productsLoading } = useProducts();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [localProducts, setLocalProducts] = useState<any[]>([]);
  const [localInquiries, setLocalInquiries] = useState<any[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  
  useEffect(() => {
    if (!productsLoading) {
      setLocalProducts(products);
    }
  }, [products, productsLoading]);

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const inqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLocalInquiries(inqs);
      } catch (err) {
        console.error("Failed to fetch inquiries", err);
      } finally {
        setInquiriesLoading(false);
      }
    }
    fetchInquiries();
  }, []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "ro-purifiers",
    image: "",
    tagline: "High-quality RO purification system",
    features: ["Advanced RO+UV+UF", "Mineral Retention", "Auto Shut-off"],
    stages: 5,
    capacity: "15 L/hr",
    tds: "Upto 2000 ppm",
    badge: "",
    warranty: "1 Year"
  });
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const navigate = useNavigate();

  const [isAddTechnicianModalOpen, setIsAddTechnicianModalOpen] = useState(false);
  const [newTechnician, setNewTechnician] = useState({
    id: "",
    name: "",
    phone: "",
    zone: "",
    specialization: "",
    password: "Sparkle@Tech1" // Default password — please change after first login
  });
  const [localTechnicians, setLocalTechnicians] = useState<any[]>([]);
  const [techniciansLoading, setTechniciansLoading] = useState(true);
  const [deletingTechId, setDeletingTechId] = useState<string | null>(null);

  // Fetch technicians from Firestore on mount
  useEffect(() => {
    const q = query(collection(db, "technicians"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const techs = snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
      setLocalTechnicians(techs);
      setTechniciansLoading(false);
    }, (err) => {
      console.error("Failed to fetch technicians", err);
      setTechniciansLoading(false);
    });
    return () => unsubscribe();
  }, []);






  // ── Invoices ──────────────────────────────────────────────────
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    customerName: "",
    taxType: "with_gst",
    technicianName: "",
    items: [{ description: "", amount: "" }]
  });
  const [localInvoices, setLocalInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "invoices"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLocalInvoices(snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() })));
      setInvoicesLoading(false);
    }, (err) => {
      console.error("Failed to fetch invoices", err);
      setInvoicesLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ── Contacts ──────────────────────────────────────────────────
  const [localContacts, setLocalContacts] = useState<any[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [deletingContactId, setDeletingContactId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLocalContacts(snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() })));
      setContactsLoading(false);
    }, (err) => {
      console.error("Failed to fetch contacts", err);
      setContactsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteInvoice = async (firestoreId: string) => {
    if (!window.confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) return;
    
    try {
      await deleteDoc(doc(db, "invoices", firestoreId));
      setLocalInvoices(prev => prev.filter(inv => inv.firestoreId !== firestoreId));
      toast.success("Invoice deleted successfully");
    } catch (err) {
      console.error("Failed to delete invoice", err);
      toast.error("Failed to delete invoice");
    }
  };
  const [previewInvoice, setPreviewInvoice] = useState<any>(null);

  // ── Service Requests ──────────────────────────────────────────
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<any>(null);
  const [assignData, setAssignData] = useState({ assignedTo: "", scheduledDate: "" });
  const [newService, setNewService] = useState({
    customerName: "",
    phone: "",
    address: "",
    productName: "",
    warrantyStart: "",
    warrantyExpiry: "",
    serviceType: "",
    assignedTo: "",
    scheduledDate: "",
    notes: ""
  });
  const [localServices, setLocalServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState("");
  const [serviceTypes, setServiceTypes] = useState<string[]>([
    "Installation", "AMC Service", "Filter Replacement", "Repair", "Water Test"
  ]);
  const [isAddServiceTypeModalOpen, setIsAddServiceTypeModalOpen] = useState(false);
  const [newServiceType, setNewServiceType] = useState("");


  // Task Assignment States
  const [viewingTasksTech, setViewingTasksTech] = useState<any>(null);
  const [assigningTasksTech, setAssigningTasksTech] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, "serviceRequests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLocalServices(snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() })));
      setServicesLoading(false);
    }, (err) => {
      console.error("Failed to fetch service requests", err);
      setServicesLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [deletingInquiryId, setDeletingInquiryId] = useState<string | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  // Helper: get warranty status
  function getWarrantyInfo(dateStr: string) {
    if (!dateStr) return { status: "none", daysLeft: 0, label: "", color: "" };
    const today = new Date();
    const expiry = new Date(dateStr);
    const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return { status: "expired", daysLeft, label: "Expired", color: "red" };
    if (daysLeft <= 30) return { status: "expiring", daysLeft, label: `${daysLeft}d left`, color: "orange" };
    return { status: "valid", daysLeft, label: "Valid", color: "green" };
  }

  // Helper: format dates safely (handles strings and Firestore Timestamps)
  const formatDate = (dateValue: any) => {
    if (!dateValue) return "";
    try {
      const d = typeof dateValue.toDate === 'function' ? dateValue.toDate() : new Date(dateValue);
      return isNaN(d.getTime()) ? "" : d.toLocaleDateString();
    } catch (e) {
      return "";
    }
  };

  // Helper: get status badge styles
  function getStatusStyle(status: string) {
    switch(status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "Assigned": return "bg-blue-100 text-blue-700";
      case "Accepted": return "bg-indigo-100 text-indigo-700";
      default: return "bg-amber-100 text-amber-700";
    }
  }

  async function updateServiceStatus(firestoreId: string, updates: Record<string, any>) {
    try {
      await updateDoc(doc(db, "serviceRequests", firestoreId), updates);
      setLocalServices(prev => prev.map(s => s.firestoreId === firestoreId ? { ...s, ...updates } : s));
      return true;
    } catch (err) {
      toast.error("Failed to update service.");
      return false;
    }
  }

  const handleCreateInvoiceFromService = (svc: any) => {
    setInvoiceData({
      customerName: svc.customerName,
      taxType: "with_gst",
      technicianName: svc.assignedTo || "",
      items: [
        { description: `${svc.serviceType} - ${svc.productName}`, amount: "" }
      ]
    });
    setActiveTab("invoices");
    setIsInvoiceModalOpen(true);
  };

  // Computed: services assigned to each technician
  const assignedServicesByTech = useMemo(() => {
    const map: Record<string, any[]> = {};
    localServices.forEach(svc => {
      if (svc.assignedTo) {
        if (!map[svc.assignedTo]) map[svc.assignedTo] = [];
        map[svc.assignedTo].push(svc);
      }
    });
    return map;
  }, [localServices]);



  // Live Telemetry Fluctuations
  const [liveTds, setLiveTds] = useState(45);
  const [liveConsumption, setLiveConsumption] = useState(124);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTds(prev => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        return Math.max(38, Math.min(52, prev + delta));
      });
      setLiveConsumption(prev => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to 2
        return Math.max(110, Math.min(140, prev + delta));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ── Home Settings (Banners) ──────────────────────────
  const [homeBanners, setHomeBanners] = useState({
    hero: "",
    waterSoftener: "",
    kitchen: "",
    cookPure: "",
    airPure: "",
    featured: "",
    catRO: "",
    catUV: "",
    catGravity: ""
  });
  const [bannersLoading, setBannersLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const docRef = doc(db, "settings", "home_banners");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHomeBanners(docSnap.data() as any);
        }
      } catch (err) {
        console.error("Failed to fetch banners", err);
      } finally {
        setBannersLoading(false);
      }
    }
    fetchBanners();
  }, []);

  const handleUpdateBanners = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, "settings", "home_banners"), homeBanners);
      toast.success("Home banners updated successfully!");
    } catch (err) {
      console.error("Failed to update banners", err);
      toast.error("Failed to update banners");
    } finally {
      setIsSubmitting(false);
    }
  };

  const dynamicStats = useMemo(() => {
    const totalRevenue = localInvoices.reduce((acc, inv) => {
      const amt = Number(inv.baseAmount) || 0;
      return acc + (inv.taxType === "with_gst" ? amt * 1.18 : amt);
    }, 0);

    const pendingServices = localServices.filter(s => s.status === "Pending" || !s.assignedTo).length;
    const totalInquiries = localInquiries.length;

    return [
      { 
        label: "Total Revenue", 
        value: `₹${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 
        trend: "+12% this month", 
        icon: ReceiptText,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      { 
        label: "Active Inquiries", 
        value: totalInquiries.toString(), 
        trend: `${localInquiries.filter(i => i.status === "New").length} New`, 
        icon: MessageSquare,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50"
      },
      { 
        label: "Total Products", 
        value: localProducts.length.toString(), 
        trend: "Live Inventory", 
        icon: Package,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50"
      },
      { 
        label: "Pending Services", 
        value: pendingServices.toString(), 
        trend: "Priority Action", 
        icon: Wrench,
        color: "text-amber-600",
        bgColor: "bg-amber-50"
      },
    ];
  }, [localInvoices, localInquiries, localServices, localProducts]);


  const chartData = useMemo(() => {
    // Generate last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    // Map inquiries to days (mocking some distribution if data is sparse)
    const inquiryCounts = days.map((day) => {
      const count = localInquiries.filter(inq => {
        if (!inq.createdAt) return false;
        try {
          const date = typeof inq.createdAt.toDate === 'function' ? inq.createdAt.toDate() : new Date(inq.createdAt);
          if (isNaN(date.getTime())) return false;
          return date.toLocaleDateString('en-US', { weekday: 'short' }) === day;
        } catch (e) { return false; }
      }).length;
      
      // Add some baseline if it's 0 to make chart look better
      return count || Math.floor(Math.random() * 5) + 2;
    });

    return { days, counts: inquiryCounts };
  }, [localInquiries]);

  const recentInquiriesPreview = useMemo(() => {
    return localInquiries.slice(0, 4).map(inq => ({
      id: inq.id.length > 10 ? `#${inq.id.substring(0, 8).toUpperCase()}` : `#${inq.id}`,
      customer: inq.name,
      type: inq.productName || "General Inquiry",
      status: inq.status || "New",
      date: formatDate(inq.createdAt) || "Just now"
    }));
  }, [localInquiries]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate({ to: "/admin" });
      } else {
        setUser(currentUser);
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error("Failed to logout");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Basic validation
      if (!newProduct.id || !newProduct.name || !newProduct.price) {
        throw new Error("Please fill in all required fields.");
      }

      // Add to Firestore using the provided ID as the document ID
      const docRef = doc(db, "products", newProduct.id);
      await setDoc(docRef, newProduct);
      
      // Update local state so it appears immediately
      if (isEditMode) {
        setLocalProducts(prev => prev.map(p => p.id === newProduct.id ? {...newProduct} : p));
      } else {
        setLocalProducts(prev => [{...newProduct} as any, ...prev]);
      }
      
      toast.success(`${newProduct.name} ${isEditMode ? "updated" : "added"} successfully!`);
      setIsAddModalOpen(false);
      setIsEditMode(false);
      
      // Reset form
      setNewProduct({
        id: "", name: "", description: "", price: 0, category: "ro-purifiers",
        image: "",
        tagline: "High-quality RO purification system",
        features: ["Advanced RO+UV+UF", "Mineral Retention", "Auto Shut-off"],
        stages: 5, capacity: "15 L/hr", tds: "Upto 2000 ppm", badge: "",
        warranty: "1 Year"
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (p: any) => {
    setNewProduct({
      ...p,
      features: p.features || ["Advanced RO+UV+UF", "Mineral Retention", "Auto Shut-off"],
      tagline: p.tagline || "High-quality RO purification system",
      warranty: p.warranty || "1 Year"
    });
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete ${productName}?`)) return;
    try {
      // Mark as deleted in Firestore so it persists even for static products
      await setDoc(doc(db, "products", productId), { isDeleted: true }, { merge: true });
      
      setLocalProducts(prev => prev.filter(p => p.id !== productId));
      toast.success(`${productName} deleted successfully`);
    } catch (err: any) {
      console.error("Error deleting product", err);
      toast.error("Failed to delete product");
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (checkingAuth) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary animate-bounce shadow-md grid place-items-center">
            <Droplets className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* ── Sidebar Mobile Overlay ───────────────────── */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-foreground border-r border-white/10 flex flex-col transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-accent">
              <Droplets className="h-4 w-4" />
            </div>
            <div>
              <span className="block font-display text-sm font-bold text-white leading-none">RO Purify</span>
              <span className="block text-[8px] font-bold tracking-widest uppercase text-white/40">Admin Panel</span>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === "dashboard"} 
            onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={Package} 
            label="Products" 
            active={activeTab === "products"} 
            onClick={() => { setActiveTab("products"); setSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={MessageSquare} 
            label="Inquiries" 
            active={activeTab === "inquiries"} 
            onClick={() => { setActiveTab("inquiries"); setSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={Wrench} 
            label="Services" 
            active={activeTab === "services"} 
            onClick={() => { setActiveTab("services"); setSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={Users} 
            label="Technicians" 
            active={activeTab === "technicians"} 
            onClick={() => { setActiveTab("technicians"); setSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={ReceiptText} 
            label="Invoices" 
            active={activeTab === "invoices"} 
            onClick={() => { setActiveTab("invoices"); setSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={MessageSquare} 
            label="Contacts" 
            active={activeTab === "contacts"} 
            onClick={() => { setActiveTab("contacts"); setSidebarOpen(false); }} 
          />
          <SidebarItem 
            icon={ImageIcon} 
            label="Home Banners" 
            active={activeTab === "home-banners"} 
            onClick={() => { setActiveTab("home-banners"); setSidebarOpen(false); }} 
          />
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <SidebarItem icon={LogOut} label="Sign Out" variant="danger" onClick={handleLogout} />
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 md:h-20 bg-white/95 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
          <div className="flex items-center gap-3 lg:gap-4 flex-1">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden h-9 w-9 grid place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search anything..." 
                className="w-full bg-slate-100 border-none rounded-xl py-2 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {globalSearch && (
                <button 
                  onClick={() => setGlobalSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            {/* Small screen brand indicator */}
            <div className="md:hidden flex flex-col items-start ml-1">
              <span className="text-[12px] font-black text-primary leading-none tracking-tighter uppercase">Sparkle</span>
              <span className="text-[9px] font-bold text-slate-400 leading-none uppercase tracking-[0.2em] mt-0.5">Admin</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4">
            <button className="relative h-9 w-9 md:h-10 md:w-10 grid place-items-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
              <Bell className="h-4 w-4 md:h-5 md:w-5 text-slate-600" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-2 md:gap-4 pl-1.5 md:pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <div className="text-xs lg:text-sm font-bold text-foreground">Admin</div>
                <div className="text-[9px] lg:text-[10px] text-muted-foreground font-medium truncate max-w-[80px] lg:max-w-[100px]">{user?.email}</div>
              </div>
              <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-primary/10 border border-primary/20 grid place-items-center shrink-0">
                <span className="text-xs lg:text-sm font-bold text-primary">
                  {user?.email?.[0].toUpperCase() || "A"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-8 overflow-y-auto">
          {activeTab === "dashboard" ? (
            <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
                  <p className="text-muted-foreground mt-1 text-xs lg:text-sm font-medium">Real-time water quality and appliance status monitoring.</p>
                </div>
                <div className="flex gap-2 lg:gap-3">
                  <button 
                    onClick={() => toast.info("Generating report... PDF will be ready shortly.")}
                    className="flex-1 sm:flex-none btn-secondary py-2 lg:py-2.5 px-4 lg:px-5 text-xs lg:text-sm"
                  >
                    Download Report
                  </button>
                  <button 
                    onClick={() => setActiveTab("products")}
                    className="flex-1 sm:flex-none btn-primary py-2 lg:py-2.5 px-4 lg:px-5 text-xs lg:text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add Product
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {dynamicStats.map((stat) => (
                  <div key={stat.label} className="bg-white p-4 lg:p-6 rounded-2xl border border-border shadow-soft hover:border-primary/20 transition-all cursor-default group">
                    <div className="flex justify-between items-start mb-3 lg:mb-4">
                      <div className={`h-8 w-8 lg:h-10 lg:w-10 rounded-xl ${stat.bgColor || 'bg-primary/5'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`h-4 w-4 lg:h-5 lg:w-5 ${stat.color || 'text-primary'}`} />
                      </div>
                      <span className={`text-[8px] lg:text-[10px] font-bold ${stat.label.includes('TDS') ? 'text-green-600 bg-green-50' : 'text-slate-500 bg-slate-50'} px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-lg uppercase tracking-tighter`}>
                        {stat.trend}
                      </span>
                    </div>
                    <div className="text-lg lg:text-2xl font-bold text-foreground tracking-tight">{stat.value}</div>
                    <div className="text-[10px] lg:text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1 opacity-70 leading-none">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-8 bg-white p-5 lg:p-8 rounded-3xl border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="font-bold text-xl tracking-tight text-foreground">Business Growth</h2>
                      <p className="text-xs text-muted-foreground font-medium mt-1">Inquiries & Service requests over the last 7 days</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-end">
                    <div className="flex items-end justify-between gap-2 h-48 mb-2">
                      {chartData.counts.map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative">
                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                            {val} Requests
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
                          </div>
                          {/* Bar */}
                          <div 
                            className="w-full bg-primary/10 rounded-t-xl relative overflow-hidden group-hover:bg-primary/20 transition-all cursor-pointer border-x border-t border-primary/5 group-hover:border-primary/20"
                            style={{ height: `${Math.max(15, (val / Math.max(...chartData.counts || [1])) * 100)}%` }}
                          >
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary shadow-[0_0_12px_rgba(0,84,166,0.8)]"></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{chartData.days[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity / Side Panel */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white p-8 rounded-3xl border border-border shadow-sm flex flex-col relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-bold text-xl tracking-tight">Recent Inquiries</h2>
                      <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-full uppercase tracking-widest">Live</span>
                    </div>
                    
                    <div className="space-y-4">
                      {localInquiries.slice(0, 5).map((inq, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{inq.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium truncate">{inq.productName}</p>
                          </div>
                          <div className="ml-auto text-[10px] font-bold text-slate-400 whitespace-nowrap">
                            Just now
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => setActiveTab("inquiries")}
                      className="w-full mt-6 flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 border-primary/10 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-300 font-bold text-sm"
                    >
                      View All Inquiries
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ) : activeTab === "products" ? (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Products</h1>
                  <p className="text-muted-foreground mt-1 text-sm">Manage your product catalog across all categories.</p>
                </div>
                <button 
                  onClick={() => {
                    setNewProduct({
                      id: "", name: "", description: "", price: 0, category: "residential",
                      image: "",
                      tagline: "High-quality RO purification system",
                      features: ["Advanced RO+UV+UF", "Mineral Retention", "Auto Shut-off"],
                      stages: 5, capacity: "15 L/hr", tds: "Upto 2000 ppm", badge: "", warranty: "1 Year"
                    });
                    setIsEditMode(false);
                    setIsAddModalOpen(true);
                  }}
                  className="btn-primary py-2.5 px-5 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-border shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stats</th>
                        <th className="px-6 py-4 text-right align-middle" style={{minWidth:"130px"}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {localProducts.filter(p => 
                        (p.name || "").toLowerCase().includes(globalSearch.toLowerCase()) ||
                        (p.id || "").toLowerCase().includes(globalSearch.toLowerCase()) ||
                        (p.category || "").toLowerCase().includes(globalSearch.toLowerCase())
                      ).map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img src={p.image} className="h-16 w-16 rounded-xl object-cover bg-slate-100 border border-border shadow-sm" />
                              <div>
                                <div className="text-sm font-bold">{p.name}</div>
                                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{p.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                              {categories.find(c => c.id === p.category)?.name || 
                               p.category.split('-').map((w: any) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold">₹{p.price.toLocaleString("en-IN")}</td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-500">
                             {p.stages} Stages • {p.capacity}
                             {p.warranty && (
                               <div className="mt-1.5 flex items-center gap-1.5">
                                 <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm inline-flex items-center gap-1">
                                   <ShieldCheck className="h-2.5 w-2.5" />
                                   {p.warranty} Warranty
                                 </span>
                               </div>
                             )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Link
                                to="/products/$productId"
                                params={{ productId: p.id }}
                                target="_blank"
                                className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 transition-all"
                                title="View live page"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <button 
                                onClick={() => handleEditProduct(p)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-primary/10 hover:text-primary transition-all"
                                title="Edit product"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 transition-all"
                                title="Delete product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === "inquiries" ? (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Customer Inquiries</h1>
                  <p className="text-muted-foreground mt-1 text-sm">Manage water test bookings and installation requests.</p>
                </div>

              </div>

              <div className="bg-white rounded-3xl border border-border shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Details</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(() => {
                        const filtered = localInquiries.filter(inq => 
                          (inq.name || "").toLowerCase().includes(globalSearch.toLowerCase()) ||
                          ((inq.productName || "").toLowerCase().includes(globalSearch.toLowerCase())) ||
                          ((inq.phone || "").includes(globalSearch))
                        );
                        if (filtered.length === 0) return (
                          <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                              {globalSearch ? `No results for "${globalSearch}"` : "No inquiries found yet."}
                            </td>
                          </tr>
                        );
                        return filtered.map((inq) => (
                          <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                inq.status === "New" ? "bg-blue-100 text-blue-700" :
                                inq.status === "Contacted" ? "bg-amber-100 text-amber-700" :
                                "bg-green-100 text-green-700"
                              }`}>
                                {inq.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-bold">{inq.name}</div>
                              <div className="text-[10px] text-muted-foreground">{inq.phone}</div>
                              <div className="text-[10px] text-muted-foreground line-clamp-1">{inq.address}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              <div className="font-medium">{inq.productName}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {formatDate(inq.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end items-center gap-2">
                                {(() => {
                                  const product = localProducts.find(p => p.name === inq.productName);
                                  return product ? (
                                    <Link
                                      to="/products/$productId"
                                      params={{ productId: product.id }}
                                      target="_blank"
                                      className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 grid place-items-center hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                                      title="View Product Page"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Link>
                                  ) : null;
                                })()}
                                {deletingInquiryId === inq.id ? (
                                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                                    <button
                                      onClick={async () => {
                                        try {
                                          await deleteDoc(doc(db, "inquiries", inq.id));
                                          setLocalInquiries(prev => prev.filter(i => i.id !== inq.id));
                                          toast.success("Inquiry deleted");
                                        } catch (err) {
                                          toast.error("Failed to delete inquiry");
                                        } finally {
                                          setDeletingInquiryId(null);
                                        }
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[10px] font-bold uppercase hover:bg-red-700 transition-colors"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setDeletingInquiryId(null)}
                                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase hover:bg-slate-200 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <select 
                                      className="text-xs font-bold bg-slate-100 border-none rounded-lg px-3 py-2 outline-none cursor-pointer hover:bg-slate-200 transition-colors text-slate-700"
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === "handled") {
                                          toast.success(`Calling ${inq.name}...`);
                                        } else if (val === "selled") {
                                          // Find product details to get warranty
                                          const product = localProducts.find(p => p.name === inq.productName);
                                          const warrantyStr = product?.warranty || "1 Year";
                                          
                                          const today = new Date();
                                          const startStr = today.toISOString().split('T')[0];
                                          
                                          // Simple parser for "X Year" or "X Month"
                                          let expiryDate = new Date(today);
                                          if (warrantyStr.toLowerCase().includes("year")) {
                                            const years = parseInt(warrantyStr) || 1;
                                            expiryDate.setFullYear(expiryDate.getFullYear() + years);
                                          } else if (warrantyStr.toLowerCase().includes("month")) {
                                            const months = parseInt(warrantyStr) || 12;
                                            expiryDate.setMonth(expiryDate.getMonth() + months);
                                          } else {
                                            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                                          }
                                          const endStr = expiryDate.toISOString().split('T')[0];

                                          setActiveTab("services");
                                          setServiceCategoryFilter(product?.category || "");
                                          setNewService({
                                            customerName: inq.name || "",
                                            phone: inq.phone || "",
                                            address: inq.address || "",
                                            productName: inq.productName || "",
                                            warrantyStart: startStr,
                                            warrantyExpiry: endStr,
                                            serviceType: "Installation",
                                            assignedTo: "",
                                            scheduledDate: startStr,
                                            notes: `Converted from Inquiry. Original message: ${inq.message || 'None'}`
                                          });
                                          setIsAddServiceModalOpen(true);
                                        }
                                        e.target.value = ""; // Reset dropdown after action
                                      }}
                                    >
                                      <option value="" disabled selected>Actions</option>
                                      <option value="handled">Mark as Handled</option>
                                      <option value="selled">Mark as Sold (Add Service)</option>
                                    </select>
                                    <button
                                      onClick={() => setDeletingInquiryId(inq.id)}
                                      className="h-8 w-8 rounded-lg bg-red-50 text-red-500 grid place-items-center hover:bg-red-500 hover:text-white transition-all border border-red-100"
                                      title="Delete Inquiry"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === "services" ? (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Services</h1>
                  <p className="text-muted-foreground mt-1 text-sm">Manage service requests and AMC schedules.</p>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button
                    onClick={() => setIsAddServiceTypeModalOpen(true)}
                    className="btn-secondary py-2.5 px-5 text-sm flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Service Types
                  </button>
                  <button
                    onClick={() => setIsAddServiceModalOpen(true)}
                    className="btn-primary py-2.5 px-5 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add Service Request
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-border shadow-soft overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Warranty</th>
                        <th className="px-6 py-4">Service Type</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(() => {
                        const filtered = localServices.filter(svc => 
                          (svc.customerName || "").toLowerCase().includes(globalSearch.toLowerCase()) ||
                          ((svc.productName || "").toLowerCase().includes(globalSearch.toLowerCase())) ||
                          ((svc.phone || "").includes(globalSearch))
                        );
                        if (filtered.length === 0) return (
                          <tr>
                            <td colSpan={5} className="px-6 py-14 text-center">
                              <Wrench className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                              <p className="font-bold text-foreground">{globalSearch ? `No results for "${globalSearch}"` : "No service requests yet"}</p>
                            </td>
                          </tr>
                        );
                        return filtered.map((svc) => (
                          <tr key={svc.firestoreId} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-sm font-bold">{svc.customerName}</div>
                              <div className="text-[10px] text-muted-foreground">{svc.phone}</div>
                              <div className="text-[10px] text-muted-foreground line-clamp-1">{svc.address}</div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">{svc.productName || <span className="text-muted-foreground">—</span>}</td>
                            <td className="px-6 py-4">
                              <div className="space-y-1.5">
                                {svc.warrantyStart && (
                                  <div className="text-[10px] font-medium text-slate-500">
                                    Start: <span className="text-foreground">{formatDate(svc.warrantyStart)}</span>
                                  </div>
                                )}
                                {svc.warrantyExpiry ? (() => {
                                  const today = new Date();
                                  const expiry = typeof svc.warrantyExpiry.toDate === 'function' ? svc.warrantyExpiry.toDate() : new Date(svc.warrantyExpiry);
                                  const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                  if (daysLeft < 0) return (
                                    <div>
                                      <div className="text-[10px] font-medium text-slate-500 mb-1">
                                        End: <span className="text-red-500 font-bold">{expiry.toLocaleDateString()}</span>
                                      </div>
                                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-red-100 text-red-700 flex items-center gap-1 w-fit">
                                        ⚠️ Expired
                                      </span>
                                    </div>
                                  );
                                  if (daysLeft <= 30) return (
                                    <div>
                                      <div className="text-[10px] font-medium text-slate-500 mb-1">
                                        End: <span className="text-orange-500 font-bold">{expiry.toLocaleDateString()}</span>
                                      </div>
                                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-orange-100 text-orange-700 flex items-center gap-1 w-fit">
                                        ⚠️ {daysLeft}d left
                                      </span>
                                    </div>
                                  );
                                  return (
                                    <div>
                                      <div className="text-[10px] font-medium text-slate-500 mb-1">
                                        End: <span className="text-foreground">{expiry.toLocaleDateString()} ({daysLeft}d)</span>
                                      </div>
                                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-green-100 text-green-700 w-fit block">
                                        Valid
                                      </span>
                                    </div>
                                  );
                                })() : <span className="text-muted-foreground text-xs">—</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-primary/10 text-primary">
                                {svc.serviceType}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {deletingServiceId === svc.firestoreId ? (
                                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                                    <button
                                      onClick={async () => {
                                        try {
                                          await deleteDoc(doc(db, "serviceRequests", svc.firestoreId));
                                          setLocalServices(prev => prev.filter(s => s.firestoreId !== svc.firestoreId));
                                          toast.success("Service request deleted");
                                        } catch (err) {
                                          toast.error("Failed to delete service");
                                        } finally {
                                          setDeletingServiceId(null);
                                        }
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[10px] font-bold uppercase hover:bg-red-700 transition-colors"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setDeletingServiceId(null)}
                                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase hover:bg-slate-200 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <select 
                                      value={svc.assignedTo || ""}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        updateServiceStatus(svc.firestoreId, { 
                                          assignedTo: val, 
                                          status: val ? "Assigned" : "Pending" 
                                        });
                                        if (val) toast.success(`Assigned to ${val}`);
                                      }}
                                      className="bg-slate-50/50 border border-border/80 rounded-full px-3 py-1.5 outline-none focus:border-primary w-28 text-xs font-semibold cursor-pointer hover:bg-white hover:shadow-sm transition-all text-slate-700"
                                    >
                                      <option value="">Assigned To</option>
                                      {localTechnicians.map(tech => (
                                        <option key={tech.id} value={tech.name}>{tech.name}</option>
                                      ))}
                                    </select>
                                    <button
                                      onClick={() => handleCreateInvoiceFromService(svc)}
                                      className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 grid place-items-center hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                                      title="Generate Invoice"
                                    >
                                      <ReceiptText className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => setDeletingServiceId(svc.firestoreId)}
                                      className="h-8 w-8 rounded-lg bg-red-50 text-red-500 grid place-items-center hover:bg-red-500 hover:text-white transition-all border border-red-100"
                                      title="Delete Service"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-border">
                  {(() => {
                    const filtered = localServices.filter(svc => 
                      (svc.customerName || "").toLowerCase().includes(globalSearch.toLowerCase()) ||
                      ((svc.productName || "").toLowerCase().includes(globalSearch.toLowerCase())) ||
                      ((svc.phone || "").includes(globalSearch))
                    );
                    if (filtered.length === 0) return (
                      <div className="px-6 py-14 text-center">
                        <Wrench className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="font-bold text-foreground">No service requests found</p>
                      </div>
                    );
                    return filtered.map((svc) => (
                      <div key={svc.firestoreId} className="p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-900 truncate">{svc.customerName}</div>
                            <div className="text-[10px] text-muted-foreground">{svc.phone}</div>
                          </div>
                          <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-primary/10 text-primary shrink-0">
                            {svc.serviceType}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Product</div>
                            <div className="text-[11px] font-bold text-slate-700 truncate">{svc.productName || "—"}</div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Warranty</div>
                            <div className="text-[11px] font-bold text-slate-700">
                              {svc.warrantyExpiry ? (typeof svc.warrantyExpiry.toDate === 'function' ? svc.warrantyExpiry.toDate() : new Date(svc.warrantyExpiry)).toLocaleDateString() : "—"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select 
                            value={svc.assignedTo || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateServiceStatus(svc.firestoreId, { 
                                assignedTo: val, 
                                status: val ? "Assigned" : "Pending" 
                              });
                            }}
                            className="flex-1 bg-slate-100 border-none rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none"
                          >
                            <option value="">Assign To</option>
                            {localTechnicians.map(tech => (
                              <option key={tech.id} value={tech.name}>{tech.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleCreateInvoiceFromService(svc)}
                            className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center border border-emerald-100"
                          >
                            <ReceiptText className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setDeletingServiceId(svc.firestoreId)}
                            className="h-10 w-10 rounded-xl bg-red-50 text-red-500 grid place-items-center border border-red-100"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          ) : activeTab === "technicians" ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Header */}
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground">Technicians</h1>
                  <p className="text-muted-foreground mt-1 text-sm">Manage field technicians and track their service workload.</p>
                </div>
                <button
                  onClick={() => setIsAddTechnicianModalOpen(true)}
                  className="btn-primary py-2.5 px-5 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Technician
                </button>
              </div>

              {/* Summary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-border p-4 lg:p-5 flex items-center gap-4 shadow-sm">
                  <div className="h-10 w-10 lg:h-11 lg:w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl lg:text-2xl font-display font-bold text-foreground">{localTechnicians.length}</div>
                    <div className="text-[9px] lg:text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Total Technicians</div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-border p-4 lg:p-5 flex items-center gap-4 shadow-sm">
                  <div className="h-10 w-10 lg:h-11 lg:w-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-xl lg:text-2xl font-display font-bold text-foreground">
                      {localServices.filter(s => s.status !== "Completed").length}
                    </div>
                    <div className="text-[9px] lg:text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Open Tasks</div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-border p-4 lg:p-5 flex items-center gap-4 shadow-sm">
                  <div className="h-10 w-10 lg:h-11 lg:w-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-xl lg:text-2xl font-display font-bold text-foreground">
                      {localServices.filter(s => s.status === "Completed").length}
                    </div>
                    <div className="text-[9px] lg:text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Completed</div>
                  </div>
                </div>
              </div>

              {/* Technician Cards Grid */}
              {(() => {
                const filtered = localTechnicians.filter(tech => 
                  (tech.name || "").toLowerCase().includes(globalSearch.toLowerCase()) ||
                  ((tech.phone || "").includes(globalSearch)) ||
                  ((tech.zone || "").toLowerCase().includes(globalSearch.toLowerCase()))
                );
                if (filtered.length === 0) return (
                  <div className="bg-white rounded-3xl border border-border border-dashed p-16 text-center shadow-sm">
                    <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                      <Users className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      {globalSearch ? `No results for "${globalSearch}"` : "No Technicians Yet"}
                    </h3>
                  </div>
                );
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((tech) => {
                    const assignedTasks = assignedServicesByTech[tech.name] || [];
                    const completedCount = assignedTasks.filter(t => t.status === "Completed").length;
                    const pendingCount = assignedTasks.filter(t => t.status !== "Completed").length;
                    const completionPct = assignedTasks.length ? Math.round((completedCount / assignedTasks.length) * 100) : 0;
                    const isViewing = viewingTasksTech?.id === tech.id;
                    const avatarColors = [
                      "from-blue-500 to-indigo-600",
                      "from-violet-500 to-purple-600",
                      "from-emerald-500 to-teal-600",
                      "from-orange-500 to-amber-600",
                      "from-rose-500 to-pink-600",
                      "from-cyan-500 to-sky-600",
                    ];
                    const colorIdx = tech.name.charCodeAt(0) % avatarColors.length;

                    return (
                      <div key={tech.id} className="flex flex-col gap-3">
                        {/* Main Card */}
                        <div className="bg-white rounded-3xl border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 overflow-hidden">
                          {/* Avatar + Info */}
                          <div className="p-6 flex items-start gap-4">
                            <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${avatarColors[colorIdx]} flex items-center justify-center shrink-0 shadow-md`}>
                              <span className="text-white text-xl font-display font-bold">
                                {tech.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-display font-bold text-base text-slate-900 leading-tight truncate">{tech.name}</h3>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{tech.id}</p>
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200 shrink-0 whitespace-nowrap">
                                  {tech.specialization}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                                  {tech.zone}
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                                  <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                                  {tech.phone}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="mx-6 h-px bg-border" />

                          {/* Stats Row */}
                          <div className="px-6 py-4 grid grid-cols-3 gap-3">
                            <div className="text-center">
                              <div className="text-xl font-display font-bold text-slate-900">{assignedTasks.length}</div>
                              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total</div>
                            </div>
                            <div className="text-center border-x border-border">
                              <div className="text-xl font-display font-bold text-amber-500">{pendingCount}</div>
                              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Pending</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xl font-display font-bold text-green-600">{completedCount}</div>
                              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Done</div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="px-6 pb-5">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completion Rate</span>
                              <span className="text-[11px] font-bold text-primary">{completionPct}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-700"
                                style={{ width: `${completionPct}%` }}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="px-6 pb-5 flex gap-2">
                            <button
                              onClick={() => setAssigningTasksTech(tech)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 border border-primary/20 hover:border-primary"
                            >
                              <Plus className="h-3.5 w-3.5" /> Assign Task
                            </button>
                            <button
                              onClick={() => setViewingTasksTech(isViewing ? null : tech)}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border ${isViewing ? "bg-indigo-600 text-white border-indigo-600" : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600"}`}
                            >
                              <ClipboardList className="h-3.5 w-3.5" /> {isViewing ? "Hide Tasks" : "View Tasks"}
                            </button>
                          </div>
                          {/* Delete Button — full width, clearly labelled */}
                          <div className="px-6 pb-5">
                            {deletingTechId === tech.firestoreId ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={async () => {
                                    try {
                                      await deleteDoc(doc(db, "technicians", tech.firestoreId));
                                      setLocalTechnicians(prev => prev.filter(t => t.firestoreId !== tech.firestoreId));
                                      toast.success(`${tech.name} removed successfully.`);
                                    } catch (err) {
                                      toast.error("Failed to remove technician.");
                                    } finally {
                                      setDeletingTechId(null);
                                    }
                                  }}
                                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-sm"
                                >
                                  Yes, Delete
                                </button>
                                <button
                                  onClick={() => setDeletingTechId(null)}
                                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all duration-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeletingTechId(tech.firestoreId)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 hover:border-red-600 transition-all duration-300"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Delete Technician
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Expanded Task Panel */}
                        {isViewing && (
                          <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm overflow-hidden animate-in slide-in-from-top-2 duration-200">
                            <div className="px-5 py-3 bg-indigo-50 border-b border-indigo-200 flex justify-between items-center">
                              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Tasks for {tech.name}</span>
                              <span className="text-[10px] font-bold bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full">{assignedTasks.length}</span>
                            </div>
                            {assignedTasks.length === 0 ? (
                              <div className="p-6 text-center text-sm text-muted-foreground">No tasks assigned yet.</div>
                            ) : (
                              <div className="divide-y divide-border max-h-64 overflow-y-auto">
                                {assignedTasks.map((task: any) => (
                                  <div key={task.firestoreId} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${getStatusStyle(task.status)}`}>
                                        <Wrench className="h-3.5 w-3.5" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-sm font-bold text-slate-900 truncate">{task.customerName}</div>
                                        <div className="text-[10px] text-muted-foreground font-medium">{task.serviceType} &middot; {task.productName}</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 ml-3">
                                      <div className="text-right hidden sm:block">
                                        <div className="text-[9px] font-bold text-slate-400 uppercase">Date</div>
                                        <div className="text-[11px] font-bold text-slate-700">{formatDate(task.scheduledDate) || "TBD"}</div>
                                      </div>
                                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${getStatusStyle(task.status)}`}>
                                        {task.status}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          ) : activeTab === "invoices" ? (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex justify-between items-end">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground">Invoices</h1>
                  <p className="text-muted-foreground mt-1 text-sm">Manage billing and print invoices for customers.</p>
                </div>
                <button onClick={() => setIsInvoiceModalOpen(true)} className="btn-primary flex items-center gap-2 py-2.5 px-5">
                  <Plus className="h-4 w-4" /> Create Invoice
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-border shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                        <th className="px-6 py-4">Invoice ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right align-middle" style={{minWidth:"130px"}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(() => {
                        const filtered = localInvoices.filter(inv => 
                          (inv.customerName || "").toLowerCase().includes(globalSearch.toLowerCase()) ||
                          (inv.id || "").toLowerCase().includes(globalSearch.toLowerCase())
                        );
                        if (filtered.length === 0) return (
                          <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                              {globalSearch ? `No results for "${globalSearch}"` : "No invoices found yet."}
                            </td>
                          </tr>
                        );
                        return filtered.map((inv) => {
                        const baseAmt = Number(inv.baseAmount) || 0;
                        const totalAmt = inv.taxType === "with_gst" ? baseAmt * 1.18 : baseAmt;
                        return (
                        <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-slate-700">{inv.id}</td>
                          <td className="px-6 py-4 text-sm font-medium">{inv.customerName}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{inv.date}</td>
                          <td className="px-6 py-4 text-sm font-bold">₹{totalAmt.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setPreviewInvoice(inv)} className="p-2 rounded-lg bg-slate-100 hover:bg-primary/10 hover:text-primary transition-all">
                                <Eye className="h-4 w-4" />
                              </button>
                                <button onClick={() => {
                                  setPreviewInvoice(inv);
                                  setTimeout(() => window.print(), 300);
                                }} className="p-2 rounded-lg bg-slate-100 hover:bg-primary/10 hover:text-primary transition-all">
                                  <Download className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => inv.firestoreId && handleDeleteInvoice(inv.firestoreId)} 
                                  className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 transition-all"
                                  title="Delete Invoice"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                          </td>
                        </tr>
                      );
                    })})()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === "contacts" ? (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex justify-between items-end">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground">User Contacts</h1>
                  <p className="text-muted-foreground mt-1 text-sm">Review and respond to general messages from the contact form.</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-border shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">User Details</th>
                        <th className="px-6 py-4">Message</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(() => {
                        const filtered = localContacts.filter(contact => 
                          (contact.name || "").toLowerCase().includes(globalSearch.toLowerCase()) ||
                          (contact.email || "").toLowerCase().includes(globalSearch.toLowerCase()) ||
                          ((contact.message || "").toLowerCase().includes(globalSearch.toLowerCase()))
                        );
                        if (filtered.length === 0) return (
                          <tr>
                            <td colSpan={5} className="px-6 py-14 text-center">
                              <Mail className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                              <p className="font-bold text-foreground">{globalSearch ? `No results for "${globalSearch}"` : "No contact messages yet"}</p>
                            </td>
                          </tr>
                        );
                        return filtered.map((contact) => (
                          <tr key={contact.firestoreId} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                contact.status === "New" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                              }`}>
                                {contact.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-bold">{contact.name}</div>
                              <div className="text-[10px] text-muted-foreground">{contact.email}</div>
                              <div className="text-[10px] text-muted-foreground">{contact.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-slate-600 line-clamp-2 max-w-xs">{contact.message}</div>
                              <div className="text-[10px] text-primary font-bold mt-1">{contact.productName}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {formatDate(contact.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end items-center gap-2">
                                {deletingContactId === contact.firestoreId ? (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={async () => {
                                        try {
                                          await deleteDoc(doc(db, "contacts", contact.firestoreId));
                                          toast.success("Message deleted");
                                        } catch (err) {
                                          toast.error("Failed to delete");
                                        } finally {
                                          setDeletingContactId(null);
                                        }
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[10px] font-bold uppercase"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setDeletingContactId(null)}
                                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        updateDoc(doc(db, "contacts", contact.firestoreId), { status: "Responded" });
                                        toast.success("Marked as responded");
                                      }}
                                      className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 grid place-items-center hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                                      title="Mark as Responded"
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => setDeletingContactId(contact.firestoreId)}
                                      className="h-8 w-8 rounded-lg bg-red-50 text-red-500 grid place-items-center hover:bg-red-500 hover:text-white transition-all border border-red-100"
                                      title="Delete Message"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === "home-banners" ? (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex justify-between items-end">
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground">Home Banners</h1>
                  <p className="text-muted-foreground mt-1 text-sm">Update the visuals of your main landing page sections.</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-border shadow-soft p-8">
                {bannersLoading ? (
                  <div className="py-20 text-center">
                    <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Loading banner settings...</p>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateBanners} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Hero Banner */}
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 block uppercase tracking-wider">Hero Section Banner</label>
                        <input 
                          type="text" 
                          value={homeBanners.hero}
                          onChange={(e) => setHomeBanners({...homeBanners, hero: e.target.value})}
                          placeholder="Image URL (Direct link)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        />
                        {homeBanners.hero && (
                          <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200">
                            <img src={homeBanners.hero} className="w-full h-full object-cover" alt="Hero Preview" />
                          </div>
                        )}
                      </div>

                      {/* Water Softener Banner */}
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 block uppercase tracking-wider">Water Softener Section</label>
                        <input 
                          type="text" 
                          value={homeBanners.waterSoftener}
                          onChange={(e) => setHomeBanners({...homeBanners, waterSoftener: e.target.value})}
                          placeholder="Image URL"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        />
                        {homeBanners.waterSoftener && (
                          <div className="relative aspect-[3/1] rounded-xl overflow-hidden border border-slate-200">
                            <img src={homeBanners.waterSoftener} className="w-full h-full object-cover" alt="Water Softener Preview" />
                          </div>
                        )}
                      </div>

                      {/* Cook Pure Banner */}
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 block uppercase tracking-wider">Cook Pure (Kitchen)</label>
                        <input 
                          type="text" 
                          value={homeBanners.cookPure}
                          onChange={(e) => setHomeBanners({...homeBanners, cookPure: e.target.value})}
                          placeholder="Image URL"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        />
                        {homeBanners.cookPure && (
                          <div className="relative aspect-[3/1] rounded-xl overflow-hidden border border-slate-200">
                            <img src={homeBanners.cookPure} className="w-full h-full object-cover" alt="Cook Pure Preview" />
                          </div>
                        )}
                      </div>

                      {/* Air Pure Banner */}
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 block uppercase tracking-wider">Air Care Section</label>
                        <input 
                          type="text" 
                          value={homeBanners.airPure}
                          onChange={(e) => setHomeBanners({...homeBanners, airPure: e.target.value})}
                          placeholder="Image URL"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        />
                        {homeBanners.airPure && (
                          <div className="relative aspect-[3/1] rounded-xl overflow-hidden border border-slate-200">
                            <img src={homeBanners.airPure} className="w-full h-full object-cover" alt="Air Pure Preview" />
                          </div>
                        )}
                      </div>

                      {/* Featured Products Banner */}
                      <div className="space-y-4 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700 block uppercase tracking-wider">Featured Products Banner</label>
                        <input 
                          type="text" 
                          value={homeBanners.featured}
                          onChange={(e) => setHomeBanners({...homeBanners, featured: e.target.value})}
                          placeholder="Image URL"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        />
                        {homeBanners.featured && (
                          <div className="relative aspect-[4/1] rounded-xl overflow-hidden border border-slate-200">
                            <img src={homeBanners.featured} className="w-full h-full object-cover" alt="Featured Preview" />
                          </div>
                        )}
                      </div>

                      {/* Category Images */}
                      <div className="md:col-span-2 pt-4 border-t border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Category Thumbnails</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">RO Purifiers</label>
                            <input 
                              type="text" 
                              value={homeBanners.catRO}
                              onChange={(e) => setHomeBanners({...homeBanners, catRO: e.target.value})}
                              placeholder="Image URL"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs"
                            />
                            {homeBanners.catRO && <img src={homeBanners.catRO} className="h-20 w-auto object-contain mx-auto" />}
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">UV Purifiers</label>
                            <input 
                              type="text" 
                              value={homeBanners.catUV}
                              onChange={(e) => setHomeBanners({...homeBanners, catUV: e.target.value})}
                              placeholder="Image URL"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs"
                            />
                            {homeBanners.catUV && <img src={homeBanners.catUV} className="h-20 w-auto object-contain mx-auto" />}
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Gravity Purifiers</label>
                            <input 
                              type="text" 
                              value={homeBanners.catGravity}
                              onChange={(e) => setHomeBanners({...homeBanners, catGravity: e.target.value})}
                              placeholder="Image URL"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs"
                            />
                            {homeBanners.catGravity && <img src={homeBanners.catGravity} className="h-20 w-auto object-contain mx-auto" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="btn-primary w-full md:w-auto px-12 py-4 text-base shadow-xl"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Save All Banner Changes"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <h2 className="font-display text-2xl font-bold text-slate-300">Section Not Found</h2>
              <p className="text-muted-foreground mt-2">The requested admin section could not be located.</p>
              <button onClick={() => setActiveTab("dashboard")} className="btn-secondary mt-6 py-2 px-6">Return to Dashboard</button>
            </div>
          )}
        </div>
      </main>

      {/* ── Add Product Modal ──────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-border shadow-elegant w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-slate-50">
              <h2 className="font-display font-bold text-lg">{isEditMode ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="h-8 w-8 rounded-full bg-white border border-border grid place-items-center hover:bg-slate-100 transition-colors">
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="add-product-form" onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Product ID*</label>
                    <input required type="text" value={newProduct.id} onChange={e => setNewProduct({...newProduct, id: e.target.value})} placeholder="e.g. RO-PRO-8" className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Name*</label>
                    <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="RO Purify RO Pro 8" className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Category*</label>
                  {!isAddingNewCategory ? (
                    <div className="flex gap-2">
                      <select 
                        value={newProduct.category} 
                        onChange={e => setNewProduct({...newProduct, category: e.target.value})} 
                        className="flex-1 bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                      >
                        {/* Always show the core categories */}
                        <option value="ro-purifiers">RO Purifiers</option>
                        <option value="water-softeners">Water Softeners</option>
                        <option value="kitchen-appliances">Kitchen Appliances</option>
                        <option value="air-purifiers">Air Purifiers</option>
                        
                        {/* Dynamically show any other existing categories from the products list */}
                        {Array.from(new Set(localProducts.map(p => p?.category || "")))
                          .filter(cat => cat && !["ro-purifiers", "water-softeners", "kitchen-appliances", "air-purifiers", ""].includes(cat))
                          .map(cat => (
                            <option key={cat} value={cat}>{(cat || "").split('-').map((w: any) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
                          ))
                        }
                      </select>
                      
                      {!["residential", "commercial", "under-sink", "softener", ""].includes(newProduct.category) && (
                        <button 
                          type="button" 
                          onClick={() => setNewProduct({...newProduct, category: "ro-purifiers"})}
                          className="btn-secondary px-3 py-2 text-xs shrink-0 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm flex items-center justify-center"
                          title="Remove custom category"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}

                      <button 
                        type="button" 
                        onClick={() => { setIsAddingNewCategory(true); setNewProduct({...newProduct, category: ""}); }} 
                        className="btn-secondary px-4 py-2 text-xs shrink-0 rounded-xl whitespace-nowrap border-slate-200 hover:border-slate-300 shadow-sm"
                      >
                        + New
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input 
                        required
                        type="text" 
                        autoFocus
                        value={newProduct.category} 
                        onChange={e => setNewProduct({...newProduct, category: e.target.value})} 
                        placeholder="Enter new category name..."
                        className="flex-1 bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          if (!newProduct.category) setNewProduct({...newProduct, category: "ro-purifiers"});
                          setIsAddingNewCategory(false);
                        }} 
                        className="btn-secondary px-4 py-2 text-xs shrink-0 rounded-xl whitespace-nowrap bg-primary text-white border-primary hover:opacity-90 shadow-sm"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Product Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewProduct({...newProduct, image: reader.result as string});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer text-muted-foreground" 
                  />
                  {newProduct.image && (
                    <img src={newProduct.image} alt="Product preview" className="mt-3 h-20 w-20 object-cover rounded-xl border border-border shadow-sm bg-slate-100" />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Tagline*</label>
                  <input required type="text" value={newProduct.tagline} onChange={e => setNewProduct({...newProduct, tagline: e.target.value})} placeholder="e.g. Best for high TDS water" className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Price (₹)*</label>
                  <input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Stages</label>
                    <input type="number" value={newProduct.stages} onChange={e => setNewProduct({...newProduct, stages: Number(e.target.value)})} className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Capacity</label>
                    <input type="text" value={newProduct.capacity} onChange={e => setNewProduct({...newProduct, capacity: e.target.value})} className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Max TDS</label>
                    <input type="text" value={newProduct.tds} onChange={e => setNewProduct({...newProduct, tds: e.target.value})} className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Warranty</label>
                    <input type="text" value={newProduct.warranty} onChange={e => setNewProduct({...newProduct, warranty: e.target.value})} placeholder="e.g. 1 Year" className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Description</label>
                  <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} rows={3} className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary resize-none"></textarea>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-border bg-slate-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
              <button type="submit" form="add-product-form" disabled={isSubmitting} className="btn-primary py-2 px-4 text-sm disabled:opacity-50">
                {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ── Add Technician Modal ──────────────────────────────── */}
      {isAddTechnicianModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-border shadow-elegant w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-slate-50">
              <h2 className="font-display font-bold text-lg">Add New Technician</h2>
              <button onClick={() => setIsAddTechnicianModalOpen(false)} className="h-8 w-8 rounded-full bg-white border border-border grid place-items-center hover:bg-slate-100 transition-colors">
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="add-tech-form" onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  const payload = {
                    ...newTechnician,
                    createdAt: new Date().toISOString()
                  };
                  await addDoc(collection(db, "technicians"), payload);
                  // Note: setLocalTechnicians is NOT called here.
                  // The onSnapshot listener automatically updates the list when Firestore changes.
                  toast.success(`${newTechnician.name} added successfully!`);
                  setNewTechnician({ id: "", name: "", phone: "", zone: "", specialization: "", password: "Sparkle@Tech1" });
                  setIsAddTechnicianModalOpen(false);
                } catch (err: any) {
                  toast.error(err.message || "Failed to save technician");
                } finally {
                  setIsSubmitting(false);
                }
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Technician ID*</label>
                    <input required type="text" value={newTechnician.id} onChange={e => setNewTechnician({...newTechnician, id: e.target.value})} placeholder="e.g. TECH-001" className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Full Name*</label>
                    <input required type="text" value={newTechnician.name} onChange={e => setNewTechnician({...newTechnician, name: e.target.value})} placeholder="e.g. Suresh Kumar" className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Phone Number*</label>
                  <input required type="tel" value={newTechnician.phone} onChange={e => setNewTechnician({...newTechnician, phone: e.target.value})} placeholder="+91 9876543210" className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Assigned Zone*</label>
                    <input required type="text" value={newTechnician.zone} onChange={e => setNewTechnician({...newTechnician, zone: e.target.value})} placeholder="e.g. North Delhi" className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Specialization*</label>
                    <select required value={newTechnician.specialization} onChange={e => setNewTechnician({...newTechnician, specialization: e.target.value})} className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary">
                      <option value="">Select Specialty</option>
                      <option value="RO Expert">RO Expert</option>
                      <option value="Softener Expert">Softener Expert</option>
                      <option value="General Service">General Service</option>
                      <option value="Installation Specialist">Installation Specialist</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Dashboard Password*</label>
                  <input required type="text" value={newTechnician.password} onChange={e => setNewTechnician({...newTechnician, password: e.target.value})} className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  <p className="text-[10px] text-muted-foreground mt-1">Technician will use their ID and this password to login.</p>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-border bg-slate-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAddTechnicianModalOpen(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
              <button type="submit" form="add-tech-form" disabled={isSubmitting} className="btn-primary py-2 px-4 text-sm disabled:opacity-50">
                {isSubmitting ? "Saving..." : "Add Technician"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isAddServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-border shadow-elegant w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-slate-50">
              <h2 className="font-display font-bold text-lg">Add Service Request</h2>
              <button onClick={() => setIsAddServiceModalOpen(false)} className="h-8 w-8 rounded-full bg-white border border-border grid place-items-center hover:bg-slate-100 transition-colors">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="add-service-form" onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  const payload = {
                    ...newService,
                    status: "Pending",
                    createdAt: new Date().toISOString()
                  };
                  const docRef = await addDoc(collection(db, "serviceRequests"), payload);
                  setLocalServices(prev => [{ firestoreId: docRef.id, ...payload }, ...prev]);
                  toast.success(`Service request for ${newService.customerName} added!`);
                  setNewService({ customerName: "", phone: "", address: "", productName: "", warrantyStart: "", warrantyExpiry: "", serviceType: "", assignedTo: "", scheduledDate: "", notes: "" });
                  setServiceCategoryFilter("");
                  setIsAddServiceModalOpen(false);
                } catch (err: any) {
                  toast.error(err.message || "Failed to save service request.");
                } finally {
                  setIsSubmitting(false);
                }
              }} className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Customer Name*</label>
                    <input required type="text" value={newService.customerName} onChange={e => setNewService({...newService, customerName: e.target.value})} placeholder="e.g. Ravi Mehta" className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Phone Number*</label>
                    <input required type="tel" value={newService.phone} onChange={e => setNewService({...newService, phone: e.target.value})} placeholder="+91 9876543210" className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Address</label>
                  <input type="text" value={newService.address} onChange={e => setNewService({...newService, address: e.target.value})} placeholder="Customer address" className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>

                {/* Product & Category Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Product Category</label>
                    <select 
                      value={serviceCategoryFilter} 
                      onChange={e => {
                        setServiceCategoryFilter(e.target.value);
                        setNewService({...newService, productName: ""});
                      }}
                      className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Product Name*</label>
                    <select 
                      required
                      value={newService.productName} 
                      onChange={e => {
                        const prodName = e.target.value;
                        const product = localProducts.find(p => p.name === prodName);
                        const warrantyStr = product?.warranty || "1 Year";
                        const today = new Date();
                        const startStr = today.toISOString().split('T')[0];
                        let expiryDate = new Date(today);
                        if (warrantyStr.toLowerCase().includes("year")) {
                          const years = parseInt(warrantyStr) || 1;
                          expiryDate.setFullYear(expiryDate.getFullYear() + years);
                        } else if (warrantyStr.toLowerCase().includes("month")) {
                          const months = parseInt(warrantyStr) || 12;
                          expiryDate.setMonth(expiryDate.getMonth() + months);
                        } else {
                          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                        }
                        const endStr = expiryDate.toISOString().split('T')[0];

                        if (product?.category) {
                          setServiceCategoryFilter(product.category);
                        }

                        setNewService({
                          ...newService, 
                          productName: prodName,
                          warrantyStart: startStr,
                          warrantyExpiry: endStr
                        });
                      }} 
                      className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                    >
                      <option value="">Select product</option>
                      {localProducts
                        .filter(p => !serviceCategoryFilter || p.category === serviceCategoryFilter)
                        .map(prod => (
                          <option key={prod.id} value={prod.name}>{prod.name}</option>
                        ))
                      }
                      <option value="Other">Other / Custom</option>
                    </select>
                  </div>
                </div>



                {newService.productName === "Other" && (
                  <div className="animate-in slide-in-from-top-2 duration-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Custom Product Name*</label>
                    <input 
                      required
                      type="text" 
                      onChange={e => setNewService({...newService, productName: e.target.value})} 
                      placeholder="Enter product name" 
                      className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" 
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Warranty Start Date</label>
                    <input type="date" value={newService.warrantyStart} onChange={e => setNewService({...newService, warrantyStart: e.target.value})} className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Warranty Expiry Date</label>
                    <input type="date" value={newService.warrantyExpiry} onChange={e => setNewService({...newService, warrantyExpiry: e.target.value})} className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Service Type*</label>
                    <select required value={newService.serviceType} onChange={e => setNewService({...newService, serviceType: e.target.value})} className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary">
                      <option value="">Select type</option>
                      {serviceTypes.map((type, i) => (
                        <option key={i} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Scheduled Date</label>
                    <input type="date" value={newService.scheduledDate} onChange={e => setNewService({...newService, scheduledDate: e.target.value})} className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Assign to Technician</label>
                  <select value={newService.assignedTo} onChange={e => setNewService({...newService, assignedTo: e.target.value})} className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary">
                    <option value="">— Unassigned —</option>
                    {localTechnicians.map(tech => (
                      <option key={tech.id} value={tech.name}>{tech.name} ({tech.zone})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Service Notes / Problem Description</label>
                  <textarea 
                    value={newService.notes} 
                    onChange={e => setNewService({...newService, notes: e.target.value})} 
                    placeholder="e.g. Machine making noise, water flow is low..." 
                    className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary h-20 resize-none"
                  />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-border bg-slate-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAddServiceModalOpen(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
              <button type="submit" form="add-service-form" disabled={isSubmitting} className="btn-primary py-2 px-4 text-sm disabled:opacity-50">
                {isSubmitting ? "Saving..." : "Save Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Service Type Modal ───────────────────────────── */}
      {isAddServiceTypeModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-border shadow-elegant w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-slate-50">
              <h2 className="font-display font-bold text-lg">Manage Service Types</h2>
              <button onClick={() => setIsAddServiceTypeModalOpen(false)} className="h-8 w-8 rounded-full bg-white border border-border grid place-items-center hover:bg-slate-100 transition-colors">
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Current Service Types</label>
                  <div className="flex flex-wrap gap-2">
                    {serviceTypes.map((type, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold flex items-center gap-2">
                        {type}
                        <button 
                          onClick={() => setServiceTypes(prev => prev.filter(t => t !== type))}
                          className="hover:text-red-500"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Add New Type</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newServiceType}
                      onChange={e => setNewServiceType(e.target.value)}
                      placeholder="e.g. Spare Parts Replacement"
                      className="flex-1 bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <button 
                      onClick={() => {
                        if (newServiceType && !serviceTypes.includes(newServiceType)) {
                          setServiceTypes(prev => [...prev, newServiceType]);
                          setNewServiceType("");
                          toast.success("Service type added!");
                        }
                      }}
                      className="btn-primary px-4 py-2 text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border bg-slate-50 flex justify-end">
              <button onClick={() => setIsAddServiceTypeModalOpen(false)} className="btn-secondary py-2 px-6">Close</button>
            </div>
          </div>
        </div>
      )}


      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-border shadow-elegant w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-slate-50">
              <h2 className="font-display font-bold text-lg">Create Billing Invoice</h2>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="h-8 w-8 rounded-full bg-white border border-border grid place-items-center hover:bg-slate-100 transition-colors">
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Customer Name</label>
                    <input type="text" value={invoiceData.customerName} onChange={e => setInvoiceData({...invoiceData, customerName: e.target.value})} placeholder="e.g. Sakshi Mohite" className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Technician (Optional)</label>
                    <select 
                      value={invoiceData.technicianName} 
                      onChange={e => setInvoiceData({...invoiceData, technicianName: e.target.value})} 
                      className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                    >
                      <option value="">Select Technician</option>
                      {localTechnicians.map(tech => (
                        <option key={tech.id} value={tech.name}>{tech.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Invoice Items</label>
                    <button 
                      onClick={() => setInvoiceData({
                        ...invoiceData, 
                        items: [...invoiceData.items, { description: "", amount: "" }]
                      })}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add Item
                    </button>
                  </div>
                  
                  {invoiceData.items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-end animate-in slide-in-from-top-2 duration-200">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                        <input 
                          type="text" 
                          value={item.description} 
                          onChange={e => {
                            const newItems = [...invoiceData.items];
                            newItems[index].description = e.target.value;
                            setInvoiceData({...invoiceData, items: newItems});
                          }}
                          placeholder="Service or Product name"
                          className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Amount (₹)</label>
                        <input 
                          type="number" 
                          value={item.amount} 
                          onChange={e => {
                            const newItems = [...invoiceData.items];
                            newItems[index].amount = e.target.value;
                            setInvoiceData({...invoiceData, items: newItems});
                          }}
                          placeholder="0"
                          className="w-full bg-slate-50 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      {invoiceData.items.length > 1 && (
                        <button 
                          onClick={() => {
                            const newItems = invoiceData.items.filter((_, i) => i !== index);
                            setInvoiceData({...invoiceData, items: newItems});
                          }}
                          className="h-9 w-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors mb-0.5"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Billing Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-slate-600">
                      <input type="radio" name="taxType" value="with_gst" checked={invoiceData.taxType === "with_gst"} onChange={e => setInvoiceData({...invoiceData, taxType: e.target.value})} className="accent-primary" />
                      With GST (18%)
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer font-medium text-slate-600">
                      <input type="radio" name="taxType" value="without_gst" checked={invoiceData.taxType === "without_gst"} onChange={e => setInvoiceData({...invoiceData, taxType: e.target.value})} className="accent-primary" />
                      Without GST
                    </label>
                  </div>
                </div>

                {(() => {
                  const subtotal = invoiceData.items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
                  const gst = invoiceData.taxType === "with_gst" ? subtotal * 0.18 : 0;
                  const total = subtotal + gst;
                  
                  if (subtotal <= 0) return null;

                  return (
                    <div className="mt-6 bg-slate-50 p-6 rounded-2xl border border-border shadow-inner">
                      <div className="flex justify-between text-sm mb-2 text-slate-500 font-medium">
                        <span>Subtotal:</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      {invoiceData.taxType === "with_gst" && (
                        <div className="flex justify-between text-sm mb-2 text-slate-500 font-medium">
                          <span>GST (18%):</span>
                          <span>₹{gst.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-border mt-2">
                        <span>Total Amount:</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            
            <div className="p-6 border-t border-border bg-slate-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsInvoiceModalOpen(false)} className="px-6 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button 
                onClick={async () => {
                  const subtotal = invoiceData.items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
                  if(!invoiceData.customerName || subtotal <= 0) {
                    toast.error("Please provide customer name and at least one item with an amount.");
                    return;
                  }
                  
                  const newInv = {
                    id: `INV-2026-${String(localInvoices.length + 1).padStart(3, '0')}`,
                    customerName: invoiceData.customerName,
                    items: invoiceData.items.map(it => ({ ...it, amount: Number(it.amount) })),
                    baseAmount: subtotal, // For backward compatibility in list views if needed
                    taxType: invoiceData.taxType,
                    technicianName: invoiceData.technicianName,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    status: "Paid",
                    createdAt: new Date().toISOString()
                  };
                  
                  try {
                    await addDoc(collection(db, "invoices"), newInv);
                    setLocalInvoices([newInv, ...localInvoices]);
                    toast.success("Invoice Generated successfully!");
                  } catch (err) {
                    toast.error("Failed to save invoice to database");
                  }
                  setIsInvoiceModalOpen(false);
                  setInvoiceData({ customerName: "", taxType: "with_gst", technicianName: "", items: [{ description: "", amount: "" }] });
                  setPreviewInvoice(newInv);
                }}
                className="px-8 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:opacity-90 transition-all shadow-md shadow-primary/20"
              >
                Generate Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview Invoice Modal ──────────────────────────────── */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm print:bg-white print:p-0 print:block">
          <div className="bg-white rounded-3xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-h-none print:w-full print:rounded-none">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-slate-50 print:hidden">
              <h2 className="font-display font-bold text-lg">Invoice Preview</h2>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold flex items-center gap-2">
                  <Download className="h-4 w-4" /> Download PDF
                </button>
                <button onClick={() => setPreviewInvoice(null)} className="h-9 w-9 rounded-full bg-white border border-border grid place-items-center hover:bg-slate-100 transition-colors">
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 print:overflow-visible bg-white">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Droplets className="h-8 w-8" />
                    <span className="font-display text-2xl font-bold tracking-tight">SPARKLE SHOP</span>
                  </div>
                  <p className="text-sm text-slate-500">123 Aqua Tech Park, Indiranagar</p>
                  <p className="text-sm text-slate-500">Bangalore, Karnataka 560038</p>
                  <p className="text-sm text-slate-500">GSTIN: 29AABCR1234D1Z5</p>
                </div>
                <div className="text-right">
                  <h1 className="text-4xl font-black text-slate-200 uppercase tracking-widest mb-2">Invoice</h1>
                  <p className="text-sm font-bold text-slate-800">{previewInvoice.id}</p>
                  <p className="text-sm text-slate-500">Date: {previewInvoice.date}</p>
                  <div className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-600 border border-border">
                    Status: {previewInvoice.status}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 border-b border-border pb-2">Billed To</h3>
                <p className="text-lg font-bold text-slate-800">{previewInvoice.customerName}</p>
                <p className="text-sm text-slate-500 mt-1">Customer / Client</p>
                {previewInvoice.technicianName && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Serviced By:</span>
                    <span className="text-sm font-bold text-primary">{previewInvoice.technicianName}</span>
                  </div>
                )}
              </div>

              <table className="w-full text-left mb-8">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3">Description</th>
                    <th className="py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewInvoice.items && previewInvoice.items.length > 0 ? (
                    previewInvoice.items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-4">
                          <p className="font-bold text-slate-800">{item.description}</p>
                        </td>
                        <td className="py-4 text-right font-medium">₹{Number(item.amount).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-4">
                        <p className="font-bold text-slate-800">{previewInvoice.productName}</p>
                        <p className="text-xs text-slate-500 mt-1">Standard servicing and maintenance / Purchase</p>
                      </td>
                      <td className="py-4 text-right font-medium">₹{Number(previewInvoice.baseAmount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex justify-end border-t-2 border-slate-200 pt-4">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{Number(previewInvoice.baseAmount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  {previewInvoice.taxType === "with_gst" && (
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>GST (18%)</span>
                      <span>₹{(Number(previewInvoice.baseAmount) * 0.18).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-black text-slate-800 pt-3 border-t border-slate-200">
                    <span>Total</span>
                    <span>₹{(Number(previewInvoice.baseAmount) * (previewInvoice.taxType === "with_gst" ? 1.18 : 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-slate-100 text-center text-sm text-slate-500">
                <p>Thank you for choosing RO Purify!</p>
                <p className="mt-1">For any queries, contact support@ropurify.com | +91 9876543210</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ── Assign Task to Technician Modal ────────────────── */}
      {assigningTasksTech && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-border shadow-elegant w-full max-w-xl max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="font-display font-bold text-lg">Assign Task</h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Assigning to: {assigningTasksTech.name}</p>
              </div>
              <button onClick={() => setAssigningTasksTech(null)} className="h-8 w-8 rounded-full bg-white border border-border grid place-items-center hover:bg-slate-100 transition-colors">
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pending Service Requests</h3>
              {localServices.filter(s => !s.assignedTo || s.status === "Pending").length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">All tasks are currently assigned</p>
                  <p className="text-xs text-muted-foreground mt-1">No unassigned service requests found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {localServices
                    .filter(s => !s.assignedTo || s.status === "Pending")
                    .map((svc) => (
                    <div key={svc.firestoreId} className="p-4 rounded-2xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-pointer" onClick={async () => {
                      const finalNotes = prompt("Add assignment notes?", svc.notes || "");
                      await updateServiceStatus(svc.firestoreId, { 
                        assignedTo: assigningTasksTech.name, 
                        status: "Assigned",
                        notes: finalNotes || svc.notes || ""
                      });
                      toast.success(`Assigned to ${assigningTasksTech.name}`);
                      setAssigningTasksTech(null);
                    }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{svc.customerName}</div>
                          <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{svc.serviceType} • {svc.productName}</div>
                          <div className="flex items-center gap-2 mt-2">
                             <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                             <span className="text-[9px] font-bold text-amber-700 uppercase">{svc.status}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Scheduled For</div>
                          <div className="text-xs font-bold text-slate-700">{formatDate(svc.scheduledDate) || "TBD"}</div>
                          <button className="mt-3 text-[10px] font-bold text-primary bg-white border border-primary/20 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-all">
                            Assign Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-border bg-slate-50 flex justify-end">
              <button onClick={() => setAssigningTasksTech(null)} className="btn-secondary py-2 px-6 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ 
  icon: Icon, 
  label, 
  active = false, 
  variant = "default",
  onClick 
}: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  variant?: "default" | "danger",
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
        active 
          ? "bg-primary text-white shadow-md border border-white/5" 
          : variant === "danger"
            ? "text-red-400 hover:bg-red-500/10"
            : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? "text-white" : variant === "danger" ? "text-red-400" : "text-white/40"}`} />
      {label}
    </button>
  );
}
