import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { auth, db } from "@/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Droplets, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminLogin,
});

function AdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleForgotPassword = async () => {
    if (!identifier) {
      toast.error("Please enter your email or Tech ID first.");
      return;
    }
    if (!identifier.includes("@")) {
      toast.error("Technicians: Please contact an Administrator to reset your password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, identifier);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset email.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let isAdmin = false;
      let loginSuccess = false;

      // Try Admin Login First if it looks like an email
      if (identifier.includes("@")) {
        try {
          await signInWithEmailAndPassword(auth, identifier, password);
          isAdmin = true;
          loginSuccess = true;
        } catch (adminErr) {
          // Might not be an admin, fall through to check technician just in case
        }
      }

      if (isAdmin && loginSuccess) {
        toast.success("Welcome back, Admin!");
        navigate({ to: "/admin/dashboard" });
        return;
      }

      // Try Technician Login
      const q = query(
        collection(db, "technicians"), 
        where("id", "==", identifier),
        where("password", "==", password)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const techData = snapshot.docs[0].data();
        localStorage.setItem("tech_user", JSON.stringify({
          firestoreId: snapshot.docs[0].id,
          ...techData
        }));

        toast.success(`Welcome back, ${techData.name}!`);
        navigate({ to: "/technician/dashboard" });
        return;
      }

      // If we reach here, both failed
      throw new Error("Invalid Email/ID or Password");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign in. Please check your credentials.");
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-3xl border border-border shadow-elegant overflow-hidden">
          {/* Header */}
          <div className="bg-foreground p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" aria-hidden="true">
              <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-white/20 -translate-x-1/2 -translate-y-1/2" />
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="h-12 w-12 rounded-2xl bg-gradient-primary grid place-items-center mb-4 shadow-drop">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-white">Staff Portal</h1>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1">Admin & Technician Login</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3 text-sm text-red-600">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-1">
                  Email or Tech ID
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-50 border border-border rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="admin@ropurify.com or TECH-001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-border rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                  Remember me
                </label>
                <button type="button" onClick={handleForgotPassword} className="text-xs font-bold text-primary hover:underline">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-sm font-bold shadow-drop disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Sign In to Dashboard"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>

          <div className="p-6 bg-slate-50 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Authorized access only. All activities are logged.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            ← Back to Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}
