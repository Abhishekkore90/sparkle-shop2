import { createFileRoute } from "@tanstack/react-router";
import { Droplets, Award, Leaf, Users, Lightbulb, CheckCircle2, Beaker } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SparkleShop — 25 Years of Pure Water Excellence" },
      {
        name: "description",
        content:
          "Since 1999, SparkleShop has delivered safe, pure drinking water to millions of Indian families through advanced RO technology and committed service.",
      },
    ],
  }),
  component: About,
});

const VALUES = [
  { icon: Lightbulb, title: "Innovation",    text: "Proprietary RO membrane tech"     },
  { icon: Leaf,      title: "Eco-Efficiency", text: "70% water recovery rate"          },
  { icon: Users,     title: "Service",        text: "10,000+ certified technicians"    },
  { icon: Award,     title: "Quality",        text: "ISO 9001 & NSF certified systems" },
] as const;

const CERTIFICATIONS = [
  "ISO 9001:2015",
  "NSF/ANSI 58 Certified",
  "BIS Approved",
  "WHO Guidelines Compliant",
  "WQA Gold Seal",
] as const;

const STATS = [
  { n: "5M+",   l: "Homes Purified"      },
  { n: "25+",   l: "Years of Excellence" },
  { n: "98.7%", l: "Customer Satisfaction"},
  { n: "10K+",  l: "Service Technicians" },
] as const;

const TIMELINE = [
  { year: "1999", event: "Founded in Bengaluru with a mission to make pure water accessible." },
  { year: "2005", event: "Launched our first 7-stage RO+UV system for Indian households."    },
  { year: "2012", event: "Expanded to 500+ cities with dedicated service centres."            },
  { year: "2018", event: "Introduced smart IoT-enabled RO with real-time TDS monitoring."    },
  { year: "2024", event: "Serving 5M+ families. India's #1 RO purifier brand by trust."      },
] as const;

function About() {
  return (
    <article>

      {/* ── Hero ────────────────────────────────────────── */}
      <section
        aria-labelledby="about-heading"
        className="relative min-h-[80vh] flex items-center pt-32 pb-20 overflow-hidden"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover" 
            alt="Clinical Purity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/70 to-blue-800/30" />
        </div>

        <div className="container-xl relative z-10">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-400/20 border border-blue-400/30 text-blue-300 font-bold tracking-widest uppercase text-[10px] mb-6 animate-in slide-in-from-left duration-700">

              <Droplets className="h-3 w-3" />
              Our Story
            </div>
            <h1
              id="about-heading"
              className="font-display text-3xl sm:text-5xl md:text-7xl font-bold leading-[1.1] mb-8 animate-in slide-in-from-left duration-1000"
            >
              25 Years of <br />
              <span className="text-accent italic font-serif">Clinical Purity</span>
            </h1>
            <p className="text-white/80 text-xl leading-relaxed mb-10 animate-in slide-in-from-bottom duration-1000 delay-300">
              Since 1999, SPARKLE has been on a single mission: to give every family access to water that is not just clean, but scientifically proven safe and healthy.
            </p>
            <div className="flex flex-wrap gap-4 animate-in fade-in duration-1000 delay-500">
              <div className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <div className="text-2xl font-bold text-white">5M+</div>
                <div className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Families Served</div>
              </div>
              <div className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <div className="text-2xl font-bold text-white">25+</div>
                <div className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Stats ───────────────────────────────────── */}
      <section className="bg-white -mt-10 relative z-20">
        <div className="container-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={s.l} className="bg-white p-8 rounded-3xl shadow-soft border border-border text-center hover:shadow-elegant transition-all duration-300">
                <div className="font-display text-4xl font-bold text-primary mb-2">{s.n}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section aria-labelledby="mission-heading" className="py-24 container-xl overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl" />
            <span className="text-blue-600 font-bold tracking-[0.2em] uppercase text-[10px] mb-5 block">Our Core Mission</span>
            <h2 id="mission-heading" className="font-display text-4xl md:text-5xl font-bold mb-8 text-blue-950 leading-tight">
              Clean Water Is a <br />
              <span className="text-blue-500">Human Right</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Over 200 million individuals in India consume contaminated water daily. Waterborne diseases claim thousands of lives every year. At SPARKLE, we believe this is preventable.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our advanced RO systems are engineered specifically for tough Indian water conditions — whether it's high TDS groundwater, chlorinated municipal supply, or industrial-contaminated sources.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "High TDS Tolerance (up to 3000 ppm)",
                "Advanced Molecular Extraction",
                "Clinical-grade BPA-free parts",
                "International Quality Standards",
              ].map(item => (
                <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-blue-900/80">{item}</span>
                </div>
              ))}
            </div>
          </div>


          <div className="grid gap-5">
            <div className="rounded-3xl bg-blue-50 p-8 border border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all">
              <Droplets className="h-10 w-10 text-blue-600 mb-5" aria-hidden="true" />
              <h3 className="font-display text-2xl font-bold mb-3 text-blue-900">Our Mission</h3>
              <p className="text-blue-800/70 leading-relaxed font-medium">
                To make scientifically pure, mineral-balanced drinking water available and affordable for every family through state-of-the-art filtration engineering.
              </p>
            </div>
            <div className="rounded-3xl bg-blue-900 text-white p-8 shadow-2xl">
              <Beaker className="h-10 w-10 text-blue-300 mb-5" aria-hidden="true" />
              <h3 className="font-display text-2xl font-bold mb-3">Our Vision</h3>
              <p className="text-white/80 leading-relaxed">
                A future where no child falls sick from contaminated water. Where every tap delivers water that meets clinical standards. That's the SPARKLE promise.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ── Timeline ────────────────────────────────────── */}
      <section aria-labelledby="timeline-heading" className="py-24 bg-blue-50/50 border-y border-blue-100">
        <div className="container-xl">
          <div className="text-center mb-20">
            <span className="text-blue-600 font-bold tracking-[0.2em] uppercase text-[10px] mb-3 block">Evolution of Purity</span>
            <h2 id="timeline-heading" className="font-display text-4xl md:text-5xl font-bold text-blue-950">Milestones of Innovation</h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-[2px] bg-blue-200 -translate-x-1/2" />

            <div className="space-y-16">
              {TIMELINE.map((t, idx) => (
                <div key={t.year} className={`relative flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-[27px] md:left-1/2 top-0 w-14 h-14 rounded-full bg-white border-4 border-accent shadow-lg flex items-center justify-center font-display font-black text-primary -translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  
                  <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-12 text-left md:text-right">
                    {idx % 2 !== 0 && <div className="hidden md:block" />}
                    <div className={idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}>
                      <div className="font-display text-3xl font-bold text-accent mb-2">{t.year}</div>
                      <p className="text-muted-foreground leading-relaxed text-lg">{t.event}</p>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ── Values ──────────────────────────────────────── */}
      <section aria-labelledby="values-heading" className="py-24 container-xl overflow-hidden">
        <div className="text-center mb-20">
          <span className="text-accent font-bold tracking-[0.2em] uppercase text-[10px] mb-3 block">What We Stand For</span>
          <h2 id="values-heading" className="font-display text-4xl md:text-5xl font-bold text-primary">Our Core Values</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">These principles guide every decision we make, from engineering to customer service.</p>
        </div>
        <div className="grid gap-4 md:gap-8 grid-cols-2 lg:grid-cols-4">
          {VALUES.map(v => (
            <div key={v.title} className="group p-8 text-center rounded-[2.5rem] bg-white border border-blue-100 hover:border-blue-400/50 shadow-soft hover:shadow-floating hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-blue-500/10" />
              <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:rotate-6 transition-all duration-500">
                <v.icon className="h-10 w-10 text-blue-600 group-hover:text-white transition-colors" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 text-blue-950">{v.title}</h3>
              <p className="text-blue-900/70 leading-relaxed font-medium">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Certifications ──────────────────────────────── */}
      <section aria-labelledby="cert-heading" className="py-24 bg-primary relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container-xl relative z-10 text-center">
          <h2 id="cert-heading" className="font-display text-3xl md:text-4xl font-bold mb-12 text-white">
            Internationally Certified. <br className="sm:hidden" />
            <span className="text-accent">Trusted Worldwide.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4" aria-label="Certifications">
            {CERTIFICATIONS.map(cert => (
              <div
                key={cert}
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-8 py-4 text-sm font-bold text-white hover:bg-white/20 transition-colors"
              >
                {cert}
              </div>
            ))}
          </div>
          <p className="text-white/60 mt-12 text-sm font-medium tracking-wide uppercase">Meeting Clinical standards since 1999</p>
        </div>
      </section>


    </article>
  );
}
