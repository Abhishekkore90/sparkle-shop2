import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sparkles, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { auth, db } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — SparkleShop" },
      { name: "description", content: "Sign in or create your SparkleShop account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAnimating, setIsAnimating] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !submitted) {
        navigate({ to: "/" });
      }
    });
    return () => unsubscribe();
  }, [navigate, submitted]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (mode === "login") {
      if (!loginForm.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(loginForm.email)) newErrors.email = "Please enter a valid email";
      if (!loginForm.password) newErrors.password = "Password is required";
      else if (loginForm.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    } else {
      if (!registerForm.name.trim()) newErrors.name = "Full name is required";
      if (!registerForm.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(registerForm.email)) newErrors.email = "Please enter a valid email";
      if (!registerForm.password) newErrors.password = "Password is required";
      else if (registerForm.password.length < 6) newErrors.password = "At least 6 characters required";
      if (registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      } else if (!registerForm.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
      return;
    }
    
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
        toast.success("Welcome back!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, registerForm.email, registerForm.password);
        const user = userCredential.user;
        
        // Update display name
        await updateProfile(user, { displayName: registerForm.name });
        
        // Create user doc in Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: registerForm.name,
          email: registerForm.email,
          createdAt: new Date().toISOString()
        });
        
        toast.success("Account created successfully!");
      }
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'facebook') => {
    const provider = providerName === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Sync with Firestore if new
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        lastLogin: new Date().toISOString()
      }, { merge: true });
      
      toast.success(`Signed in with ${providerName}`);
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "Social login failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-emerald-50 text-emerald-500 shadow-sm border border-emerald-100">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h2 className="mt-8 font-display text-3xl font-bold text-slate-900">
            {mode === "login" ? "Welcome Back!" : "Success!"}
          </h2>
          <p className="mt-3 text-slate-500 max-w-xs mx-auto">
            {mode === "login"
              ? "Your clinical purity dashboard is ready. Redirecting you to the home page..."
              : "Your premium account has been created. Start exploring our purification systems."}
          </p>
          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95"
          >
            Explore Catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* ── Left Side: Visual Experience (Desktop Only) ───── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          alt="Luxury Living"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 via-blue-900/40 to-transparent" />
        
        <div className="relative z-10 w-full p-20 flex flex-col justify-between text-white">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 grid place-items-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-2xl font-black tracking-tight">SPARKLE</span>
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              Clinical Purity Standards
            </div>
            <h1 className="font-display text-6xl font-bold leading-tight mb-8">
              Purity at its <br />
              <span className="text-blue-400 italic">Finest</span>
            </h1>
            <p className="text-xl text-white/70 max-w-lg leading-relaxed">
              Experience the next generation of molecular-mesh filtration. Sign in to manage your precision systems and tracking.
            </p>
          </div>

          <div className="flex gap-12">
            {[
              { val: "99.9%", label: "Purity Level" },
              { val: "50k+", label: "Active Users" },
              { val: "24/7", label: "Smart Monitoring" }
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-display font-bold">{s.val}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Side: Auth Interface ───────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50/50">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-10 duration-700">
          
          {/* Header (Mobile Logo) */}
          <div className="lg:hidden mb-12 text-center">
            <Link to="/" className="inline-flex items-center gap-3 mx-auto">
              <div className="h-10 w-10 rounded-xl bg-primary grid place-items-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl font-black tracking-tight text-slate-900">SPARKLE</span>
            </Link>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="font-display text-3xl font-bold text-slate-900">
              {mode === "login" ? "Welcome Back" : "Join the Standard"}
            </h2>
            <p className="mt-3 text-slate-500 font-medium">
              {mode === "login" 
                ? "Enter your credentials to access your dashboard." 
                : "Create your clinical-grade account in minutes."}
            </p>
          </div>

          <div className="mb-8 p-1.5 rounded-[1.25rem] bg-slate-200/50 backdrop-blur-sm flex border border-slate-200">
            <button
              onClick={() => { setMode("login"); setErrors({}); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
                mode === "login"
                  ? "bg-white text-primary shadow-elegant"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("register"); setErrors({}); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
                mode === "register"
                  ? "bg-white text-primary shadow-elegant"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-elegant p-8 md:p-10">
            {mode === "login" ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input
                      name="email"
                      type="email"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      placeholder="name@example.com"
                      className={`w-full bg-slate-50/50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all ${
                        errors.email 
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/5 bg-red-50/30" 
                          : "border-slate-200 focus:bg-white focus:border-primary focus:ring-primary/5"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[10px] font-bold text-red-500 mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                    <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot?</button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      placeholder="••••••••"
                      className={`w-full bg-slate-50/50 border rounded-2xl py-4 pl-12 pr-12 text-sm font-medium outline-none transition-all ${
                        errors.password 
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/5 bg-red-50/30" 
                          : "border-slate-200 focus:bg-white focus:border-primary focus:ring-primary/5"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-300' : 'text-slate-300 hover:text-slate-600'}`}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[10px] font-bold text-red-500 mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed ${isAnimating ? 'animate-shake' : 'hover:-translate-y-0.5'}`}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In to Dashboard"}
                  {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input
                      name="name"
                      type="text"
                      value={registerForm.name}
                      onChange={handleRegisterChange}
                      placeholder="Enter your name"
                      className={`w-full bg-slate-50/50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all ${
                        errors.name 
                          ? "border-red-300 focus:border-red-500 bg-red-50/30" 
                          : "border-slate-200 focus:bg-white focus:border-primary"
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input
                      name="email"
                      type="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      placeholder="name@example.com"
                      className={`w-full bg-slate-50/50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all ${
                        errors.email 
                          ? "border-red-300 focus:border-red-500 bg-red-50/30" 
                          : "border-slate-200 focus:bg-white focus:border-primary"
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input
                        name="password"
                        type="password"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        placeholder="••••••••"
                        className={`w-full bg-slate-50/50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all ${
                          errors.password 
                            ? "border-red-300 focus:border-red-500 bg-red-50/30" 
                            : "border-slate-200 focus:bg-white focus:border-primary"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input
                        name="confirmPassword"
                        type="password"
                        value={registerForm.confirmPassword}
                        onChange={handleRegisterChange}
                        placeholder="••••••••"
                        className={`w-full bg-slate-50/50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all ${
                          errors.confirmPassword 
                            ? "border-red-300 focus:border-red-500 bg-red-50/30" 
                            : "border-slate-200 focus:bg-white focus:border-primary"
                        }`}
                      />
                    </div>
                  </div>
                </div>
                {(errors.password || errors.confirmPassword) && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">
                    {errors.password || errors.confirmPassword}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-4 disabled:opacity-70 disabled:cursor-not-allowed ${isAnimating ? 'animate-shake' : 'hover:-translate-y-0.5'}`}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Premium Account"}
                  {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            )}

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span className="bg-white px-4">Social Access</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all font-bold text-xs text-slate-700 disabled:opacity-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /></svg>
                Google
              </button>
              <button 
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
                className="flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all font-bold text-xs text-slate-700 disabled:opacity-50"
              >
                <svg className="h-4 w-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                Facebook
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            Secure connection enabled. Your data is encrypted with AES-256 standards.
          </p>
        </div>
      </div>
    </div>
  );
}
