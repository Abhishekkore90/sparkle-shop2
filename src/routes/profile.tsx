import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { User, MapPin, Lock, Save, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({
    meta: [{ title: "My Profile — RO Purify" }],
  }),
});

function Profile() {
  const [activeTab, setActiveTab] = useState("general");
  
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
    address: "123 Water Puriifer Street, Tech City",
    city: "Bangalore",
    pin: "560001",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    toast.success("Password updated successfully!");
    setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  return (
    <div className="bg-secondary/20 min-h-screen py-12">
      <div className="container-xl max-w-5xl">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-primary/5 sticky top-24">
               <div className="flex items-center gap-4 mb-8">
                 <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                   JD
                 </div>
                 <div>
                   <div className="font-bold text-foreground">John Doe</div>
                   <div className="text-xs text-muted-foreground">Premium Member</div>
                 </div>
               </div>

               <nav className="space-y-2">
                 <button onClick={() => setActiveTab('general')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'general' ? 'bg-primary text-white shadow-md' : 'text-foreground/70 hover:bg-secondary hover:text-primary'}`}>
                   <User className="h-4 w-4" /> General Info
                 </button>
                 <button onClick={() => setActiveTab('address')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'address' ? 'bg-primary text-white shadow-md' : 'text-foreground/70 hover:bg-secondary hover:text-primary'}`}>
                   <MapPin className="h-4 w-4" /> Manage Address
                 </button>
                 <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'security' ? 'bg-primary text-white shadow-md' : 'text-foreground/70 hover:bg-secondary hover:text-primary'}`}>
                   <Lock className="h-4 w-4" /> Security
                 </button>
                 <Link to="/orders" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-foreground/70 hover:bg-secondary hover:text-primary transition-all">
                   <Lock className="h-4 w-4 opacity-0" /> My Orders
                 </Link>
                 <div className="my-4 border-t border-border"></div>
                 <Link to="/login" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all">
                   <LogOut className="h-4 w-4" /> Logout
                 </Link>
               </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-primary/5">
              
              {activeTab === 'general' && (
                <div className="animate-fadeUp">
                  <h2 className="text-2xl font-bold mb-6 border-b border-border pb-4">General Information</h2>
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Full Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Email Address</label>
                        <input name="email" value={formData.email} onChange={handleChange} readOnly className="w-full p-3 rounded-xl border border-border bg-secondary text-muted-foreground outline-none cursor-not-allowed" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Phone Number</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button type="submit" className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-md hover:bg-primary/90 transition-all">
                        <Save className="h-4 w-4" /> Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'address' && (
                <div className="animate-fadeUp">
                  <h2 className="text-2xl font-bold mb-6 border-b border-border pb-4">Manage Address</h2>
                  <form onSubmit={handleSave} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Street Address</label>
                      <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full p-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">City</label>
                        <input name="city" value={formData.city} onChange={handleChange} className="w-full p-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">PIN Code</label>
                        <input name="pin" value={formData.pin} onChange={handleChange} className="w-full p-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button type="submit" className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-md hover:bg-primary/90 transition-all">
                        <Save className="h-4 w-4" /> Update Address
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="animate-fadeUp">
                  <h2 className="text-2xl font-bold mb-6 border-b border-border pb-4">Change Password</h2>
                  <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Current Password</label>
                      <input name="currentPassword" type="password" value={formData.currentPassword} onChange={handleChange} className="w-full p-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="••••••••" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">New Password</label>
                      <input name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} className="w-full p-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="••••••••" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Confirm New Password</label>
                      <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="w-full p-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="••••••••" required />
                    </div>
                    <div className="pt-4">
                      <button type="submit" className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-md hover:bg-primary/90 transition-all">
                        <Lock className="h-4 w-4" /> Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
