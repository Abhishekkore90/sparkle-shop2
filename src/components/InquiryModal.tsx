import { useState } from "react";
import { X, Send, User, Phone, Mail, MapPin, MessageSquare, CheckCircle2 } from "lucide-react";

interface InquiryModalProps {
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function InquiryModal({ productName, isOpen, onClose }: InquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    message: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", phone: "", email: "", city: "", message: "" });
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease-out" }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card shadow-elegant"
        style={{ animation: "slideUp 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="relative bg-gradient-primary px-6 py-6 text-primary-foreground">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-background/20 text-primary-foreground transition-smooth hover:bg-background/40"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Enquire Now</h2>
          <p className="mt-1 text-sm opacity-90">
            Interested in <span className="font-semibold">{productName}</span>? Fill in your details and our team will get back to you shortly.
          </p>
        </div>

        {/* Success State */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-foreground">
              Inquiry Submitted!
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you for your interest. Our team will contact you within 24 hours.
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            {/* Name */}
            <div className="relative">
              <label htmlFor="inq-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="inq-name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Phone & Email Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="inq-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="inq-phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="inq-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="inq-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* City */}
            <div>
              <label htmlFor="inq-city" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="inq-city"
                  name="city"
                  type="text"
                  required
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, Pune, Delhi"
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="inq-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Message (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  id="inq-message"
                  name="message"
                  rows={3}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Any specific requirements or questions?"
                  className="w-full resize-none rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-smooth focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-gradient-primary hover:shadow-glow"
            >
              <Send className="h-4 w-4" /> Submit Inquiry
            </button>

            <p className="text-center text-xs text-muted-foreground">
              By submitting, you agree to be contacted by our sales team.
            </p>
          </form>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
