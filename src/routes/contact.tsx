import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Send, Droplets, Clock, MessageSquare, CheckCircle2, Beaker } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SparkleShop — Book Free Water Test & Installation" },
      {
        name: "description",
        content:
          "Contact SparkleShop for free water testing, RO installation booking, AMC service, and product enquiries. 24/7 support across 500+ cities.",
      },
    ],
  }),
  component: Contact,
});

const CONTACT_DETAILS = [
  {
    icon:  Phone,
    title: "24/7 Helpline",
    text:  "1800-123-456",
    sub:   "Toll-free · Mon–Sun, 6 am–10 pm",
    href:  "tel:+911800123456",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon:  Mail,
    title: "Email Support",
    text:  "hello@sparkleshop.in",
    sub:   "Response within 4 hours",
    href:  "mailto:hello@sparkleshop.in",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon:  MapPin,
    title: "Head Office",
    text:  "SparkleShop Towers, Bengaluru",
    sub:   "Karnataka, India — 560 001",
    href:  "https://maps.google.com",
    color: "text-teal-600 bg-teal-50",
  },
  {
    icon:  Clock,
    title: "Service Hours",
    text:  "Mon–Sat: 8 am–8 pm",
    sub:   "Sunday: 9 am–5 pm",
    href:  "#",
    color: "text-sky-600 bg-sky-50",
  },
] as const;

const ENQUIRY_TYPES = [
  "New RO Purchase",
  "Book Free Water Test",
  "Installation / Demo",
  "AMC / Service Contract",
  "Filter Replacement",
  "Other",
] as const;

function Contact() {
  const [sending,      setSending]      = useState(false);
  const [enquiryType,  setEnquiryType]  = useState("");
  const [errors,       setErrors]       = useState<Record<string, string>>({});
  const [isAnimating,  setIsAnimating]  = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    message: ""
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    
    const cleanPhone = formData.phone.replace(/\D/g, ""); // Remove all non-digits
    if (!cleanPhone) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(cleanPhone)) newErrors.phone = "Please enter a valid 10-digit mobile number";
    
    if (!formData.email.trim()) newErrors.email = "Email address is required";
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) newErrors.email = "Please enter a valid email address (e.g. name@example.com)";
    
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!enquiryType) newErrors.enquiryType = "Please select an enquiry type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover" 
            alt="Support Center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/80 to-blue-800/40" />
        </div>

        <div className="container-xl relative z-10 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-400/20 border border-blue-400/30 text-blue-300 font-bold tracking-widest uppercase text-[10px] mb-6 animate-in slide-in-from-top duration-700">
              <MessageSquare className="h-3 w-3" />
              Get in Touch
            </div>
            <h1 id="contact-hero-heading" className="font-display text-4xl md:text-7xl font-bold leading-tight mb-6 animate-in slide-in-from-bottom duration-1000 px-4">
              We're Here to <br className="hidden md:block" />
              <span className="text-blue-400 italic font-serif ml-2 md:ml-0">Help You</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-300">
              Book a free water test, schedule installation, or raise a service request — our team responds in under 4 hours.
            </p>
          </div>
        </div>
      </section>


      <div className="container-xl section-pad">

        {/* ── Contact info cards ────────────────────────── */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 -mt-16 relative z-20 mb-12 md:mb-20 px-4 md:px-0">
          {CONTACT_DETAILS.map((c, i) => (
            <a
              key={c.title}
              href={c.href}
              className="group p-8 rounded-[2rem] bg-white border border-blue-100 hover:border-blue-300 shadow-soft hover:shadow-floating hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500 mb-6">
                <c.icon className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-2">
                  {c.title}
                </div>
                <div className="font-display text-lg md:text-xl font-bold text-blue-950 leading-snug mb-1 break-words">{c.text}</div>
                <div className="text-xs text-blue-900/60 font-medium">{c.sub}</div>
              </div>
            </a>
          ))}
        </div>


        {/* ── Contact form ──────────────────────────────── */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* Left info panel */}
          <aside className="lg:col-span-4 space-y-6" aria-label="Why contact us">
            <div className="rounded-[2.5rem] bg-blue-50 border border-blue-100 p-8 shadow-soft overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/5 rounded-full" />
              <Droplets className="h-12 w-12 text-blue-600 mb-6" aria-hidden="true" />
              <h2 className="font-display text-2xl font-bold mb-4 text-blue-950">
                Book a Free <br />Water Test
              </h2>
              <p className="text-blue-900/70 text-sm leading-relaxed mb-8">
                Our certified technician will visit your home, test your water's quality completely free of charge.
              </p>
              <ul className="space-y-4">
                {[
                  "TDS & pH testing",
                  "Hardness analysis",
                  "Chlorine analysis",
                  "Product recommendation",
                  "100% Free Service",
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <span className="font-bold text-blue-900/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2.5rem] bg-blue-900 text-white p-8 shadow-floating relative overflow-hidden">
              <div className="absolute bottom-0 right-0 opacity-10 translate-x-1/4 translate-y-1/4">
                <MessageSquare className="h-32 w-32" />
              </div>
              <p className="text-[10px] font-bold mb-1 text-blue-300 uppercase tracking-widest">Average response time</p>
              <p className="text-4xl font-display font-bold">&lt; 4 Hours</p>
              <p className="text-xs text-white/60 mt-3 font-medium">Available 24/7 for you</p>
            </div>
          </aside>


          {/* Form */}
          <form
            id="contact-form"
            aria-label="Contact SPARKLE"
            className="lg:col-span-8 rounded-[2rem] md:rounded-[2.5rem] bg-white border border-blue-50 p-5 md:p-10 shadow-floating mx-2 md:mx-0"
            noValidate
            onSubmit={async (e) => {
              e.preventDefault();
              
              if (!validate()) {
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 500);
                toast.error("Please fix the errors in the form.");
                return;
              }

              setSending(true);
              
              const data = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                address: formData.city,
                productName: enquiryType || "General Inquiry",
                message: formData.message,
                status: "New",
                createdAt: new Date().toISOString()
              };

              try {
                await addDoc(collection(db, "contacts"), data);
                toast.success("Request received! Our team will contact you within 4 hours.");
                setFormData({
                  name: "",
                  phone: "",
                  email: "",
                  city: "",
                  message: ""
                });
                setEnquiryType("");
              } catch (error) {
                console.error("Error submitting inquiry:", error);
                toast.error("Failed to send request. Please try again or call our helpline.");
              } finally {
                setSending(false);
              }
            }}
          >
            <h2 className="font-display text-4xl font-bold mb-10 text-blue-950">Send Us a Message</h2>


            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-6">
              <FormField 
                id="contact-name"  
                label="Full Name"     
                name="name"  
                value={formData.name}
                error={errors.name}
                onChange={handleChange}
              />
              <FormField 
                id="contact-phone" 
                label="Phone Number"  
                name="phone" 
                type="tel" 
                value={formData.phone}
                error={errors.phone}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-4 grid-cols-2 mb-6">
              <FormField 
                id="contact-email" 
                label="Email Address" 
                name="email" 
                type="email" 
                value={formData.email}
                error={errors.email}
                onChange={handleChange}
              />
              <FormField 
                id="contact-city"  
                label="Your City"     
                name="city"  
                value={formData.city}
                error={errors.city}
                onChange={handleChange}
              />
            </div>

            {/* Enquiry type */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                What can we help you with?
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Enquiry type">
                {ENQUIRY_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => { setEnquiryType(type); setErrors(prev => ({ ...prev, enquiryType: "" })); }}
                    aria-pressed={enquiryType === type}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-fast border ${
                      enquiryType === type
                        ? "bg-primary text-white border-primary shadow-drop"
                        : errors.enquiryType 
                          ? "bg-red-50 text-red-600 border-red-200" 
                          : "bg-secondary text-foreground/70 border-border hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {errors.enquiryType && <p className="text-[10px] text-red-500 font-bold mt-2 ml-1 animate-fadeDown">{errors.enquiryType}</p>}
            </div>

            {/* Message */}
            <div className="mb-8">
              <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">
                Message (optional)
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="Tell us more about your water source, current TDS if known, or any specific concerns…"
              />
            </div>

            <button
              type="submit"
              id="contact-submit-btn"
              disabled={sending}
              aria-busy={sending}
              className={`btn-primary w-full py-4 text-base disabled:opacity-60 ${isAnimating ? 'animate-shake' : ''}`}
            >
              {sending ? "Sending…" : "Send Request"}
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              By submitting, you agree to our Privacy Policy. We never share your data.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({
  id, label, name, value, type = "text", error, onChange
}: { id: string; label: string; name: string; value: string; type?: string; error?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="w-full">
      <label htmlFor={id} className={`mb-2 block text-xs font-bold uppercase tracking-widest ${error ? 'text-red-500' : 'text-muted-foreground'}`}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        required
        onChange={onChange}
        aria-required="true"
        autoComplete={type === "email" ? "email" : name === "name" ? "name" : name === "phone" ? "tel" : "off"}
        className={`w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-smooth focus:ring-2 ${
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/15' 
            : 'border-input focus:border-primary focus:ring-primary/15'
        }`}
      />
      {error && <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1 animate-fadeDown">{error}</p>}
    </div>
  );
}
