import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  orderBy,
  onSnapshot,
  addDoc
} from "firebase/firestore";
import { 
  Droplets, 
  LogOut, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User,
  LayoutDashboard,
  ClipboardList,
  AlertTriangle,
  ChevronRight,
  Activity,
  Calendar,
  TrendingUp,
  Map,
  Zap,
  Info,
  CalendarDays,
  ShieldCheck,
  ReceiptText,
  Eye,
  Download,
  X
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/technician/dashboard")({
  component: TechnicianDashboard,
});

function TechnicianDashboard() {
  const [techUser, setTechUser] = useState<any>(null);
  const [assignedServices, setAssignedServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); 
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    customerName: "",
    taxType: "with_gst",
    technicianName: "",
    items: [{ description: "", amount: "" }]
  });
  const [previewInvoice, setPreviewInvoice] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("tech_user");
    if (!storedUser) {
      navigate({ to: "/admin" });
      return;
    }
    setTechUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (!techUser?.id || !techUser?.name) return;

    // 1. Dynamic Task Listener
    // Removed orderBy from query to avoid missing index errors in Firestore
    const tasksQuery = query(
      collection(db, "serviceRequests"), 
      where("assignedTo", "==", techUser.name)
    );

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const tasks = snapshot.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
      // Sort in memory instead of on server
      tasks.sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setAssignedServices(tasks);
      setLoading(false);
    }, (err) => {
      console.error("Failed to fetch services", err);
      toast.error("Error syncing tasks. Please check your connection.");
      setLoading(false);
    });

    // 2. Dynamic Profile Listener (Syncs zone, specialization, etc. from Admin)
    const techQuery = query(collection(db, "technicians"), where("id", "==", techUser.id));
    const unsubscribeProfile = onSnapshot(techQuery, (snapshot) => {
      if (!snapshot.empty) {
        const updatedData = snapshot.docs[0].data();
        setTechUser((prev: any) => ({ ...prev, ...updatedData }));
      }
    });

    return () => {
      unsubscribeTasks();
      unsubscribeProfile();
    };
  }, [techUser?.id, techUser?.name]);

  const handleUpdateStatus = async (firestoreId: string, newStatus: string, svc?: any) => {
    try {
      await updateDoc(doc(db, "serviceRequests", firestoreId), { status: newStatus });
      toast.success(`Job marked as ${newStatus}`);
      if (newStatus === "Completed" && svc) {
        handleCreateInvoice(svc);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleCreateInvoice = (svc: any) => {
    setInvoiceData({
      customerName: svc.customerName,
      taxType: "with_gst",
      technicianName: techUser.name,
      items: [
        { description: `${svc.serviceType} - ${svc.productName}`, amount: "" }
      ]
    });
    setIsInvoiceModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("tech_user");
    navigate({ to: "/admin" });
  };

  const filteredServices = useMemo(() => {
    if (activeTab === "active") {
      return assignedServices.filter(s => s.status !== "Completed");
    }
    return assignedServices.filter(s => s.status === "Completed");
  }, [assignedServices, activeTab]);

  const stats = useMemo(() => {
    const total = assignedServices.length;
    const pending = assignedServices.filter(s => s.status !== "Completed").length;
    const completed = total - pending;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, pending, completed, rate };
  }, [assignedServices]);

  if (!techUser || loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <Droplets className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-primary/10">
      {/* Premium Glass Header */}
      <header className="bg-[#0f172a]/95 backdrop-blur-md text-white border-b border-white/5 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-5">
            <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-primary/40 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 grid place-items-center relative z-10 shadow-lg border border-white/10">
                <Wrench className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-lg md:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 truncate">
                Tech Hub
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none truncate">
                  Live • {techUser.id}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-white tracking-wide">{techUser.name}</p>
              <p className="text-[10px] text-primary-300 font-bold uppercase tracking-widest mt-0.5">{techUser.zone}</p>
            </div>
            <div className="h-8 md:h-10 w-px bg-white/10"></div>
            <button 
              onClick={handleLogout}
              className="group h-9 w-9 md:h-10 md:w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all duration-300 shadow-sm"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4 text-slate-300 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-10">
        
        {/* Welcome & High-Level Summary */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Service Overview</p>
              <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">
                {new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 17 ? "Good Afternoon" : "Good Evening"}
              </h2>
            </div>
            
            <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm self-start">
              <button 
                onClick={() => setActiveTab("active")}
                className={`px-8 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === "active" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                <Zap className={`h-3.5 w-3.5 ${activeTab === "active" ? "text-primary-300" : ""}`} />
                ACTIVE JOBS
              </button>
              <button 
                onClick={() => setActiveTab("history")}
                className={`px-8 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === "history" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                HISTORY
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Assigned", val: stats.total, icon: ClipboardList, color: "bg-blue-50 text-blue-600" },
              { label: "Remaining", val: stats.pending, icon: Clock, color: "bg-amber-50 text-amber-600" },
              { label: "Fulfilled", val: stats.completed, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
              { label: "Reliability", val: `${stats.rate}%`, icon: ShieldCheck, color: "bg-indigo-50 text-indigo-600" }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 rounded-full opacity-0 group-hover:opacity-10 transition-opacity ${stat.color.split(' ')[0]}`}></div>
                <div className={`${stat.color} h-10 w-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-display font-bold text-slate-900 leading-none">{stat.val}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Task Grid */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">{activeTab === 'active' ? 'Your Active Queue' : 'Completed Assignments'}</h3>
            <div className="h-1 flex-1 bg-slate-200 rounded-full"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {filteredServices.length} Results
            </span>
          </div>

          {filteredServices.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200">
              <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <LayoutDashboard className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900">Queue looks clean!</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto font-medium leading-relaxed">
                When an administrator assigns a new service request to you, it will appear here instantly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8">
              {filteredServices.map((svc, idx) => (
                <div 
                  key={svc.firestoreId} 
                  className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col group relative overflow-hidden"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
                    <Droplets className="h-24 w-24 text-primary" />
                  </div>

                  <div className="p-8 border-b border-slate-50 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          svc.status === "In Progress" ? "bg-blue-50 text-blue-700 border-blue-100" : 
                          svc.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          {svc.status}
                        </span>
                        <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                          {svc.serviceType}
                        </span>
                      </div>
                      <div className="text-right bg-slate-50 px-3 py-2 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{svc.scheduledDate ? new Date(svc.scheduledDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : 'TBD'}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Target</p>
                      </div>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 group-hover:text-primary transition-colors">{svc.customerName}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                      <Wrench className="h-3.5 w-3.5 text-primary" />
                      {svc.productName}
                    </p>
                  </div>

                  <div className="px-8 py-6 space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary shrink-0">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contact</p>
                          <a href={`tel:${svc.phone}`} className="text-sm font-bold text-slate-700 hover:text-primary transition-colors">{svc.phone}</a>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary shrink-0">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Address</p>
                          <p className="text-sm font-bold text-slate-700 truncate">{svc.address}</p>
                        </div>
                      </div>
                    </div>

                    {svc.notes && (
                      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 relative group/notes">
                        <div className="flex items-center gap-2 mb-1.5">
                           <Info className="h-3 w-3 text-amber-500" />
                           <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Admin Note</p>
                        </div>
                        <p className="text-xs text-amber-900 italic font-medium leading-relaxed">"{svc.notes}"</p>
                      </div>
                    )}
                  </div>

                  <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                    <button 
                      onClick={() => setSelectedTask(svc)}
                      className="flex-1 py-3 px-6 rounded-2xl text-xs font-black bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all uppercase tracking-widest"
                    >
                      Profile
                    </button>
                    {svc.status === "Completed" ? (
                      <button 
                        onClick={() => handleCreateInvoice(svc)}
                        className="flex-[1.5] py-3 px-6 rounded-2xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-widest"
                      >
                        <ReceiptText className="h-4 w-4" />
                        Invoice
                      </button>
                    ) : (
                      <div className="flex gap-2 flex-[1.5]">
                        {svc.status !== "In Progress" && (
                          <button 
                            onClick={() => handleUpdateStatus(svc.firestoreId, "In Progress")}
                            className="flex-1 py-3 px-6 rounded-2xl text-xs font-black bg-white border-2 border-primary text-primary hover:bg-primary/5 transition-all uppercase tracking-widest"
                          >
                            Start
                          </button>
                        )}
                        <button 
                          onClick={() => handleUpdateStatus(svc.firestoreId, "Completed", svc)}
                          className="flex-[2] py-3 px-6 rounded-2xl text-xs font-black bg-slate-900 text-white hover:bg-primary transition-all shadow-[0_8px_20px_-5px_rgba(0,0,0,0.3)] hover:shadow-primary/30 uppercase tracking-widest"
                        >
                          Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modern Detail View Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedTask(null)}></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2 inline-block">Service Profile</span>
                <h2 className="text-3xl font-display font-bold text-slate-900 leading-tight">Job Analysis</h2>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="h-12 w-12 rounded-2xl bg-white border border-slate-200 grid place-items-center hover:bg-slate-50 transition-colors shadow-sm"
              >
                <XIcon className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              {/* Customer Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-1 w-8 bg-primary rounded-full"></div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Client Overview</p>
                </div>
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
                   <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary border border-slate-100">
                         <User className="h-7 w-7" />
                      </div>
                      <div>
                         <p className="text-xl font-display font-bold text-slate-900">{selectedTask.customerName}</p>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Primary Point of Contact</p>
                      </div>
                   </div>
                   <div className="h-px bg-slate-200/60"></div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase">Mobile Number</p>
                         <p className="text-sm font-bold text-slate-700">{selectedTask.phone}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase">Current Zone</p>
                         <p className="text-sm font-bold text-slate-700">{techUser.zone}</p>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Registered Address</p>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed">{selectedTask.address}</p>
                   </div>
                </div>
              </div>

              {/* Technical Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-1 w-8 bg-primary rounded-full"></div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Technical Specs</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-[#0f172a] rounded-[1.5rem] p-6 text-white col-span-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Appliance Model</p>
                      <h4 className="text-lg font-bold text-primary-300">{selectedTask.productName}</h4>
                      <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                         <ShieldCheck className="h-3 w-3" />
                         Category: {selectedTask.serviceType}
                      </p>
                   </div>
                   <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Warranty Status</p>
                      <p className={`text-sm font-black ${new Date(selectedTask.warrantyExpiry) > new Date() ? 'text-emerald-600' : 'text-rose-600'}`}>
                         {new Date(selectedTask.warrantyExpiry) > new Date() ? 'PROTECTED' : 'EXPIRED'}
                      </p>
                   </div>
                   <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Service ID</p>
                      <p className="text-sm font-black text-slate-900">{selectedTask.firestoreId.slice(0, 8).toUpperCase()}</p>
                   </div>
                </div>
              </div>

              {selectedTask.notes && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="h-1 w-8 bg-amber-400 rounded-full"></div>
                     <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em]">Field Notes</p>
                  </div>
                  <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100">
                    <p className="text-sm text-amber-900 font-medium italic leading-relaxed">
                      "{selectedTask.notes}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
              <button 
                onClick={() => setSelectedTask(null)}
                className="flex-1 py-4 px-6 rounded-2xl text-xs font-black text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-all uppercase tracking-[0.2em]"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Invoice Modal ──────────────────────────────── */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-display font-bold text-xl text-slate-900">Generate Service Invoice</h2>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="h-10 w-10 rounded-xl bg-white border border-slate-200 grid place-items-center hover:bg-slate-50 transition-colors">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Customer Name</label>
                  <input type="text" readOnly value={invoiceData.customerName} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 outline-none" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Invoice Items</label>
                    <button 
                      onClick={() => setInvoiceData({
                        ...invoiceData, 
                        items: [...invoiceData.items, { description: "", amount: "" }]
                      })}
                      className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                      + Add Item
                    </button>
                  </div>
                  
                  {invoiceData.items.map((item, index) => (
                    <div key={index} className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                      <div className="flex justify-between items-start mb-1">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Item #{index + 1}</span>
                         {invoiceData.items.length > 1 && (
                           <button 
                             onClick={() => {
                               const newItems = invoiceData.items.filter((_, i) => i !== index);
                               setInvoiceData({...invoiceData, items: newItems});
                             }}
                             className="text-red-400 hover:text-red-600 transition-colors"
                           >
                             <Trash2 className="h-3.5 w-3.5" />
                           </button>
                         )}
                      </div>
                      <input 
                        type="text" 
                        value={item.description} 
                        onChange={e => {
                          const newItems = [...invoiceData.items];
                          newItems[index].description = e.target.value;
                          setInvoiceData({...invoiceData, items: newItems});
                        }}
                        placeholder="Description"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-primary"
                      />
                      <input 
                        type="number" 
                        value={item.amount} 
                        onChange={e => {
                          const newItems = [...invoiceData.items];
                          newItems[index].amount = e.target.value;
                          setInvoiceData({...invoiceData, items: newItems});
                        }}
                        placeholder="Amount (₹)"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-primary"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Billing Type</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer">
                      <input type="radio" name="taxType" value="with_gst" checked={invoiceData.taxType === "with_gst"} onChange={e => setInvoiceData({...invoiceData, taxType: e.target.value})} className="h-4 w-4 accent-primary" />
                      With GST (18%)
                    </label>
                    <label className="flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer">
                      <input type="radio" name="taxType" value="without_gst" checked={invoiceData.taxType === "without_gst"} onChange={e => setInvoiceData({...invoiceData, taxType: e.target.value})} className="h-4 w-4 accent-primary" />
                      No Tax
                    </label>
                  </div>
                </div>

                {(() => {
                  const subtotal = invoiceData.items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
                  const gst = invoiceData.taxType === "with_gst" ? subtotal * 0.18 : 0;
                  const total = subtotal + gst;
                  
                  if (subtotal <= 0) return null;

                  return (
                    <div className="mt-8 bg-slate-900 rounded-[1.5rem] p-6 text-white shadow-xl">
                      <div className="flex justify-between text-xs mb-3 text-slate-400 font-bold uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      {invoiceData.taxType === "with_gst" && (
                        <div className="flex justify-between text-xs mb-3 text-slate-400 font-bold uppercase tracking-widest">
                          <span>GST (18%)</span>
                          <span>₹{gst.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="h-px bg-white/10 my-4"></div>
                      <div className="flex justify-between text-xl font-display font-bold text-primary-300">
                        <span>Total Due</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            
            <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-4">
              <button onClick={() => setIsInvoiceModalOpen(false)} className="px-8 py-3 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all">
                Discard
              </button>
              <button 
                onClick={async () => {
                  const subtotal = invoiceData.items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
                  if(!invoiceData.customerName || subtotal <= 0) {
                    toast.error("Please enter the service amount and description");
                    return;
                  }
                  const newInv = {
                    id: `SRV-${Date.now().toString().slice(-6)}`,
                    customerName: invoiceData.customerName,
                    items: invoiceData.items.map(it => ({ ...it, amount: Number(it.amount) })),
                    baseAmount: subtotal,
                    taxType: invoiceData.taxType,
                    technicianName: invoiceData.technicianName,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    status: "Paid",
                    createdAt: new Date().toISOString()
                  };
                  
                  try {
                    await addDoc(collection(db, "invoices"), newInv);
                    toast.success("Invoice generated successfully!");
                    setIsInvoiceModalOpen(false);
                    setPreviewInvoice(newInv);
                  } catch (err) {
                    toast.error("Failed to generate invoice");
                  }
                }}
                className="px-10 py-3 rounded-2xl text-xs font-black bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview Invoice Modal (Printable) ────────────────── */}
      {previewInvoice && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md print:bg-white print:p-0 print:block">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-h-none print:w-full print:rounded-none">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 print:hidden">
              <h2 className="font-display font-bold text-xl">Service Receipt</h2>
              <div className="flex gap-3">
                <button onClick={() => window.print()} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black flex items-center gap-2 uppercase tracking-widest shadow-lg">
                  <Download className="h-4 w-4" /> Print
                </button>
                <button onClick={() => setPreviewInvoice(null)} className="h-10 w-10 rounded-xl bg-white border border-slate-200 grid place-items-center hover:bg-slate-50 transition-colors">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>
            </div>
            
            <div className="p-10 overflow-y-auto flex-1 print:overflow-visible bg-white">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <div className="flex items-center gap-3 text-primary mb-3">
                    <Droplets className="h-10 w-10" />
                    <span className="font-display text-3xl font-bold tracking-tighter text-slate-900">SPARKLE SHOP</span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Premium Water Solutions<br />
                    Indiranagar, Bangalore<br />
                    GST: 29AABCR1234D1Z5
                  </p>
                </div>
                <div className="text-right">
                  <h1 className="text-5xl font-black text-slate-100 uppercase tracking-tighter mb-4">INVOICE</h1>
                  <p className="text-sm font-black text-slate-900 tracking-tight">{previewInvoice.id}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{previewInvoice.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 border-b border-slate-100 pb-2">Client Information</h3>
                  <p className="text-lg font-bold text-slate-900">{previewInvoice.customerName}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Service Recipient</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 border-b border-slate-100 pb-2">Technician Information</h3>
                  <p className="text-lg font-bold text-primary">{previewInvoice.technicianName}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Certified Field Agent</p>
                </div>
              </div>

              <table className="w-full text-left mb-12">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <th className="py-4">Service Description</th>
                    <th className="py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewInvoice.items && previewInvoice.items.length > 0 ? (
                    previewInvoice.items.map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-4">
                          <p className="font-bold text-slate-900 text-base">{item.description}</p>
                        </td>
                        <td className="py-4 text-right font-bold text-slate-900">₹{Number(item.amount).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-6">
                        <p className="font-bold text-slate-900 text-base">{previewInvoice.productName}</p>
                        <p className="text-xs font-medium text-slate-400 mt-1">Professional on-site technical support</p>
                      </td>
                      <td className="py-6 text-right font-bold text-slate-900">₹{Number(previewInvoice.baseAmount).toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex justify-end pt-6 border-t-2 border-slate-900">
                <div className="w-72 space-y-4">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>₹{Number(previewInvoice.baseAmount).toLocaleString()}</span>
                  </div>
                  {previewInvoice.taxType === "with_gst" && (
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span>GST (18%)</span>
                      <span>₹{(Number(previewInvoice.baseAmount) * 0.18).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-3xl font-display font-bold text-slate-900 pt-4 border-t border-slate-100">
                    <span>Total</span>
                    <span>₹{(Number(previewInvoice.baseAmount) * (previewInvoice.taxType === "with_gst" ? 1.18 : 1)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-24 text-center">
                <div className="inline-block px-10 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Electronic Receipt</p>
                   <p className="text-xs font-bold text-slate-600">No signature required. Thank you for your business!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="p-8 text-center bg-slate-50 border-t border-slate-200">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
           <Droplets className="h-4 w-4 text-primary" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">© 2026 Sparkle Shop Tech Hub</p>
        </div>
      </footer>
    </div>
  );
}

// Simple Icon fix for the X button
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
