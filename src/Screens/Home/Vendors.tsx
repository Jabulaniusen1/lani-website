import { useState } from "react"
import { Header, Footer } from "@/Components/Home"
import {
  ChevronDown,
  ChevronUp,
  Store,
  TrendingUp,
  Zap,
  Headphones,
  DollarSign,
  Users,
  ArrowRight,
  BarChart3,
  ShoppingBag,
  Pill,
  UtensilsCrossed,
  Package,
  BadgeCheck,
  Sparkles,
} from "lucide-react"

/* ── data ── */

const categories = [
  { icon: UtensilsCrossed, label: "Restaurants" },
  { icon: ShoppingBag, label: "Supermarkets" },
  { icon: Pill, label: "Pharmacies" },
  { icon: Package, label: "Home Businesses" },
]

const benefits = [
  {
    icon: TrendingUp,
    title: "Increase Your Revenue",
    desc: "Reach thousands of customers in your city who are already searching for what you sell.",
    accent: "bg-orange-50 border-orange-100",
    iconBg: "bg-orange-100",
    iconColor: "text-primary",
  },
  {
    icon: Zap,
    title: "Fast & Reliable Payouts",
    desc: "Get paid after every order. No end-of-month delays — your money moves when your orders do.",
    accent: "bg-yellow-50 border-yellow-100",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    desc: "See real-time data on orders, revenue trends, and customer behaviour from your dashboard.",
    accent: "bg-blue-50 border-blue-100",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "A dedicated vendor success manager is assigned to your account from day one.",
    accent: "bg-purple-50 border-purple-100",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: Users,
    title: "Grow Your Audience",
    desc: "Build loyal repeat customers and grow your brand within your community.",
    accent: "bg-green-50 border-green-100",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Store,
    title: "Easy Store Management",
    desc: "Add products, set prices, toggle availability, and manage orders from one intuitive dashboard.",
    accent: "bg-rose-50 border-rose-100",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-500",
  },
]

const steps = [
  {
    n: "01",
    title: "Create your account",
    body: "Sign up as a vendor in minutes. Add your business name, contact details, and category.",
  },
  {
    n: "02",
    title: "Build your store",
    body: "Upload your products, set prices, and add descriptions. Your store mirrors exactly how you set it up.",
  },
  {
    n: "03",
    title: "Get verified",
    body: "Submit your business documents. Our team reviews and approves your store within 24–48 hours.",
  },
  {
    n: "04",
    title: "Start receiving orders",
    body: "Go live and let Lani bring customers to your door. Manage fulfilment from your dashboard.",
  },
]

const faqs = [
  {
    q: "Who can become a Lani vendor?",
    a: "Any registered business — restaurants, supermarkets, pharmacies, or home-based food sellers. We welcome all sizes, from solo cooks to multi-branch chains.",
  },
  {
    q: "How long does verification take?",
    a: "Verification typically takes 24–48 hours after you submit all required documents.",
  },
  {
    q: "What documents do I need?",
    a: "A valid business registration, a government-issued ID, and bank account details for payouts. Additional documents may be requested depending on your category.",
  },
  {
    q: "What is Lani's commission rate?",
    a: "Our commission is competitive and transparent. Reach out to our vendor team for rates specific to your business type.",
  },
  {
    q: "Can I manage multiple locations?",
    a: "Yes. Lani's merchant dashboard supports multiple outlets under a single vendor account.",
  },
  {
    q: "What can I sell on Lani?",
    a: "Food, pharmacy products, supermarket items, and more. The platform supports a wide range of merchant categories.",
  },
]

const testimonials = [
  {
    name: "Amaka Foods",
    type: "Restaurant · Uyo",
    quote:
      "We went from 20 orders a week to over 150 within two months of joining Lani. The visibility is unreal.",
  },
  {
    name: "HealthPlus Pharmacy",
    type: "Pharmacy · Port Harcourt",
    quote:
      "Managing pharmacy orders through the dashboard is simple. The payout process is even better — very fast.",
  },
  {
    name: "Mama Chidi's Kitchen",
    type: "Home Business · Uyo",
    quote:
      "I was sceptical at first, but Lani literally changed my business. I now have regular customers I'd never have reached on my own.",
  },
]

const mockStats = [
  { label: "Today's Orders", value: "47" },
  { label: "Revenue", value: "₦182,400" },
  { label: "Avg. Rating", value: "4.9 ★" },
  { label: "Pending", value: "3" },
]

/* ── components ── */

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-line py-5">
      <button
        className="flex items-start justify-between w-full text-left gap-4"
        onClick={() => setOpen((p) => !p)}
      >
        <span className="font-sora font-medium text-main text-sm md:text-base leading-snug">
          {q}
        </span>
        <span className="text-sub flex-shrink-0 mt-0.5">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      {open && (
        <p className="text-sub font-dm text-sm mt-3 leading-relaxed">{a}</p>
      )}
    </div>
  )
}

/* ── page ── */

const Vendors = () => {
  return (
    <>
      <Header />

      <main>
        {/* ── HERO ── */}
        <section className="relative overflow-hidden">
          {/* warm gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-white dark:from-orange-950/20 dark:via-background dark:to-background -z-10" />
          {/* decorative circle */}
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/6 blur-3xl -z-10" />

          <div className="main pt-20 pb-16 md:pt-28 md:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-sora text-xs font-semibold px-4 py-1.5 rounded-full mb-7">
                <Sparkles size={12} /> For Vendors
              </div>
              <h1
                data-aos="fade-right"
                className="text-5xl md:text-6xl font-sora font-bold text-main leading-[1.08] tracking-tight"
              >
                Grow your
                <br />
                business{" "}
                <span className="relative inline-block">
                  <span className="text-primary">online.</span>
                  <svg
                    viewBox="0 0 200 12"
                    className="absolute -bottom-1 left-0 w-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 8 C50 2, 150 2, 198 8"
                      stroke="#fa781d"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.4"
                    />
                  </svg>
                </span>
              </h1>
              <p
                data-aos="fade-right"
                className="text-sub font-dm mt-6 text-sm md:text-base leading-relaxed max-w-md"
              >
                Join Lani's merchant network and put your store in front of
                thousands of customers — restaurants, pharmacies, supermarkets,
                and home businesses all welcome.
              </p>

              {/* category pills */}
              <div
                data-aos="fade-right"
                className="flex flex-wrap gap-2 mt-6"
              >
                {categories.map((c) => (
                  <span
                    key={c.label}
                    className="inline-flex items-center gap-1.5 bg-white dark:bg-background border border-line text-main font-dm text-xs px-3 py-1.5 rounded-full shadow-sm"
                  >
                    <c.icon size={12} className="text-primary" />
                    {c.label}
                  </span>
                ))}
              </div>

              <div
                data-aos="fade-right"
                className="flex items-center gap-3 mt-9 flex-wrap"
              >
                <a
                  href="/app"
                  className="inline-flex items-center gap-2 bg-primary text-white font-sora font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
                >
                  Become a Vendor <ArrowRight size={16} />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 text-main font-sora text-sm font-medium hover:text-primary transition-colors"
                >
                  How it works →
                </a>
              </div>

              {/* social proof */}
              <div className="flex items-center gap-3 mt-8">
                <div className="flex -space-x-2">
                  {["bg-orange-400", "bg-yellow-400", "bg-green-400"].map(
                    (c, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full border-2 border-white ${c}`}
                      />
                    )
                  )}
                </div>
                <p className="font-dm text-sub text-xs">
                  200+ vendors already on Lani
                </p>
              </div>
            </div>

            {/* right — mock dashboard card */}
            <div
              data-aos="fade-left"
              className="hidden lg:block"
            >
              <div className="bg-white dark:bg-background border border-line rounded-3xl p-6 shadow-2xl shadow-black/5 max-w-md ml-auto">
                {/* top bar */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="font-sora font-bold text-main">Amaka Foods</p>
                    <p className="text-sub font-dm text-xs mt-0.5">Restaurant · Uyo</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-600 font-sora text-xs font-semibold px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Live
                  </span>
                </div>

                {/* stat grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {mockStats.map((s) => (
                    <div
                      key={s.label}
                      className="bg-background rounded-2xl p-4 flex flex-col gap-1"
                    >
                      <span className="text-sub font-dm text-xs">{s.label}</span>
                      <span className="font-sora font-bold text-main text-lg leading-none">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* recent orders preview */}
                <div className="rounded-2xl bg-background p-4">
                  <p className="font-sora font-semibold text-main text-xs mb-3">
                    Recent Orders
                  </p>
                  {[
                    { name: "Jollof Rice + Chicken", status: "Delivered", amt: "₦3,200" },
                    { name: "Egusi Soup + Pounded Yam", status: "On the way", amt: "₦4,800" },
                    { name: "Fried Rice + Turkey", status: "Preparing", amt: "₦3,500" },
                  ].map((o, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2.5 border-b border-line last:border-0"
                    >
                      <div>
                        <p className="font-dm text-main text-xs font-medium">{o.name}</p>
                        <p
                          className={`font-dm text-[10px] mt-0.5 ${
                            o.status === "Delivered"
                              ? "text-green-500"
                              : o.status === "On the way"
                              ? "text-primary"
                              : "text-yellow-500"
                          }`}
                        >
                          {o.status}
                        </p>
                      </div>
                      <span className="font-sora font-semibold text-main text-xs">
                        {o.amt}
                      </span>
                    </div>
                  ))}
                </div>

                {/* bottom note */}
                <p className="text-center text-sub font-dm text-[10px] mt-4">
                  Your dashboard. Your numbers. Always live.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section className="border-y border-line py-5">
          <div className="main">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              <span className="font-dm text-sub text-xs whitespace-nowrap">
                We work with:
              </span>
              {categories.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-2 text-main font-dm text-sm"
                >
                  <c.icon size={15} className="text-primary" />
                  {c.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section className="main py-20 line">
          <div data-aos="fade-up" className="mb-14">
            <span className="text-primary font-sora text-xs font-semibold uppercase tracking-widest">
              Why Lani?
            </span>
            <h2 className="text-3xl md:text-4xl font-sora font-bold text-main mt-2 max-w-sm">
              Everything your business needs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b, i) => (
              <div
                key={i}
                data-aos="fade-up"
                className={`border rounded-3xl p-7 flex flex-col gap-4 ${b.accent} transition-transform hover:-translate-y-1`}
              >
                <div
                  className={`w-11 h-11 ${b.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0`}
                >
                  <b.icon size={20} className={b.iconColor} />
                </div>
                <div>
                  <h3 className="font-sora font-semibold text-main text-base mb-1.5">
                    {b.title}
                  </h3>
                  <p className="text-sub font-dm text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── connected steps ── */}
        <section id="how-it-works" className="py-20 bg-background">
          <div className="main">
            <div data-aos="fade-up" className="text-center mb-16">
              <span className="text-primary font-sora text-xs font-semibold uppercase tracking-widest">
                The process
              </span>
              <h2 className="text-3xl md:text-4xl font-sora font-bold text-main mt-2">
                How to become a vendor
              </h2>
              <p className="text-sub font-dm text-sm mt-2">
                From sign-up to first order in 4 steps
              </p>
            </div>

            {/* connected step cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
              {/* connector line on desktop */}
              <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-line" />

              {steps.map((s, i) => (
                <div
                  key={i}
                  data-aos="fade-up"
                  className="flex flex-col gap-4 relative"
                >
                  {/* circle */}
                  <div className="w-10 h-10 rounded-full bg-primary text-white font-sora font-bold text-sm flex items-center justify-center z-10 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="bg-secondary border border-line rounded-2xl p-5 flex flex-col gap-2 flex-1">
                    <h3 className="font-sora font-semibold text-main">{s.title}</h3>
                    <p className="text-sub font-dm text-sm leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VENDOR PERKS WIDE BANNER ── */}
        <section className="main py-10">
          <div
            data-aos="fade-up"
            className="relative overflow-hidden bg-[#1a0e00] rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
          >
            {/* bg circles */}
            <div className="absolute -left-16 -top-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <BadgeCheck size={18} className="text-primary" />
                <span className="text-primary font-sora text-xs font-semibold uppercase tracking-widest">
                  No hidden costs
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-sora font-bold text-white leading-tight">
                Zero setup fee.
                <br />
                Start selling today.
              </h2>
              <p className="text-white/60 font-dm text-sm mt-3 max-w-sm leading-relaxed">
                No upfront costs, no monthly subscriptions. You only pay a
                commission on completed orders — so Lani succeeds when you do.
              </p>
            </div>

            <a
              href="/app"
              className="relative z-10 flex-shrink-0 inline-flex items-center gap-2 bg-primary text-white font-sora font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
            >
              Get Started <ArrowRight size={16} />
            </a>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="main py-20 line">
          <div data-aos="fade-up" className="mb-12">
            <span className="text-primary font-sora text-xs font-semibold uppercase tracking-widest">
              Vendor stories
            </span>
            <h2 className="text-3xl md:text-4xl font-sora font-bold text-main mt-2">
              Vendors love Lani
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div
                key={i}
                data-aos="fade-up"
                className={`rounded-3xl p-7 flex flex-col gap-5 ${
                  i === 1
                    ? "bg-primary text-white"
                    : "bg-background border border-line"
                }`}
              >
                {/* quote mark */}
                <span
                  className={`text-5xl font-sora leading-none font-bold ${
                    i === 1 ? "text-white/30" : "text-primary/20"
                  }`}
                >
                  "
                </span>
                <p
                  className={`font-dm text-sm leading-relaxed flex-1 -mt-6 ${
                    i === 1 ? "text-white/90" : "text-sub"
                  }`}
                >
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-sora font-bold text-xs ${
                      i === 1 ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                    }`}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p
                      className={`font-sora font-semibold text-sm ${
                        i === 1 ? "text-white" : "text-main"
                      }`}
                    >
                      {t.name}
                    </p>
                    <p
                      className={`font-dm text-xs ${
                        i === 1 ? "text-white/60" : "text-sub"
                      }`}
                    >
                      {t.type}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQs ── side by side ── */}
        <section className="py-20 bg-background">
          <div className="main">
            <div
              data-aos="fade-up"
              className="flex flex-col md:flex-row md:items-start md:justify-between gap-10"
            >
              {/* sticky left */}
              <div className="md:sticky md:top-28 md:w-72 flex-shrink-0">
                <span className="text-primary font-sora text-xs font-semibold uppercase tracking-widest">
                  FAQ
                </span>
                <h2 className="text-3xl md:text-4xl font-sora font-bold text-main mt-2">
                  Common
                  <br />
                  questions,
                  <br />
                  answered.
                </h2>
                <a
                  href="/app"
                  className="inline-flex items-center gap-2 mt-8 bg-primary text-white font-sora font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity text-sm"
                >
                  Become a Vendor <ArrowRight size={15} />
                </a>
              </div>

              {/* accordion */}
              <div className="flex-1 max-w-xl">
                {faqs.map((faq, i) => (
                  <FaqItem key={i} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="main py-16">
          <div
            data-aos="fade-up"
            className="bg-gradient-to-br from-primary to-orange-600 rounded-3xl p-12 md:p-20 text-center overflow-hidden relative"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white rounded-full blur-2xl" />
            </div>
            <div className="relative z-10">
              <DollarSign
                size={44}
                className="text-white/60 mx-auto mb-6"
              />
              <h2 className="text-3xl md:text-5xl font-sora font-bold text-white leading-tight mb-4">
                Ready to sell more?
              </h2>
              <p className="font-dm text-white/75 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
                Hundreds of vendors across Nigeria are already growing with
                Lani. Your store could be next.
              </p>
              <a
                href="/app"
                className="inline-flex items-center gap-2 bg-white text-primary font-sora font-bold px-10 py-4 rounded-full text-base hover:opacity-90 transition-opacity shadow-lg"
              >
                Start for Free <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Vendors
