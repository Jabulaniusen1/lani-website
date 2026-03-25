import { useState } from "react"
import { Header, Footer } from "@/Components/Home"
import {
  ChevronDown,
  ChevronUp,
  Bike,
  Clock,
  Shield,
  MapPin,
  Banknote,
  Smartphone,
  ArrowRight,
  Star,
} from "lucide-react"

const faqs = [
  {
    q: "What vehicle do I need to ride with Lani?",
    a: "Currently, we accept motorcycles and bicycles for city deliveries. Your vehicle must be in good working condition and roadworthy.",
  },
  {
    q: "How old do I need to be?",
    a: "You must be at least 18 years old and hold a valid rider's license (for motorcycle riders).",
  },
  {
    q: "How do I get paid?",
    a: "Earnings are credited to your Lani wallet after each delivery. You can withdraw to your bank account at any time — no waiting period.",
  },
  {
    q: "What happens if there's an issue during a delivery?",
    a: "Our 24/7 rider support team is always available to help resolve delivery issues quickly so you can keep moving.",
  },
  {
    q: "Can I ride part-time?",
    a: "Absolutely. Many of our riders work part-time alongside other jobs. You're in full control of your schedule.",
  },
  {
    q: "Is there a registration fee?",
    a: "No. Signing up as a Lani rider is completely free. We only earn when you earn.",
  },
  {
    q: "Which cities does Lani operate in?",
    a: "We currently operate in Uyo and Port Harcourt, with expansion to more cities soon.",
  },
]

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

const testimonials = [
  {
    name: "Emeka O.",
    city: "Port Harcourt",
    quote:
      "I cleared ₦80k in my first month. The orders come in fast and the app never gives me trouble.",
    stars: 5,
  },
  {
    name: "Sunday A.",
    city: "Uyo",
    quote:
      "I do deliveries in the morning before my main job. The extra cash has been a lifesaver.",
    stars: 5,
  },
  {
    name: "Blessing I.",
    city: "Uyo",
    quote:
      "Withdrawals are instant. I've never had to wait for my money — that's why I love Lani.",
    stars: 5,
  },
]

const requirements = [
  { icon: Bike, label: "Motorcycle or bicycle" },
  { icon: Shield, label: "Valid rider's license" },
  { icon: Smartphone, label: "A smartphone" },
  { icon: MapPin, label: "Located in our operating cities" },
  { icon: Clock, label: "Minimum 18 years old" },
  { icon: Banknote, label: "Active bank account for payouts" },
]

const timeline = [
  {
    time: "8:00 AM",
    action: "You go online",
    detail: "Open the app and tap Go Online. Orders in your area start coming in.",
  },
  {
    time: "8:15 AM",
    action: "First order accepted",
    detail: "Pick up a breakfast order from a nearby restaurant and deliver it within minutes.",
  },
  {
    time: "10:30 AM",
    action: "₦4,500 earned",
    detail: "6 deliveries done. Take a break, grab a drink, or keep going — your call.",
  },
  {
    time: "2:00 PM",
    action: "Lunch rush kicks in",
    detail: "Bonus multiplier activates during peak hours. More orders, higher rates.",
  },
  {
    time: "6:00 PM",
    action: "Go offline & withdraw",
    detail: "Tap to end your shift. Withdraw today's earnings straight to your bank.",
  },
]

const stats = [
  { value: "₦150k+", label: "Top monthly earnings" },
  { value: "2", label: "Cities & growing" },
  { value: "24/7", label: "Rider support" },
  { value: "0₦", label: "To sign up" },
]

const Riders = () => {
  return (
    <>
      <Header />

      <main>
        {/* HERO — Split layout */}
        <section className="main pt-16 pb-10 md:pt-24 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div>
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-sora text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                <Bike size={13} /> For Riders
              </span>
              <h1
                data-aos="fade-right"
                className="text-5xl md:text-6xl font-sora font-bold text-main leading-tight"
              >
                Your bike.
                <br />
                Your time.
                <br />
                <span className="text-primary">Your money.</span>
              </h1>
              <p
                data-aos="fade-right"
                className="text-sub font-dm mt-5 text-sm md:text-base leading-relaxed max-w-md"
              >
                Lani riders earn great money making local deliveries — food,
                pharmacy, groceries, and parcels. Work when you want, stop when
                you want.
              </p>
              <div
                data-aos="fade-right"
                className="flex items-center gap-3 mt-8 flex-wrap"
              >
                <a
                  href="/app"
                  className="inline-flex items-center gap-2 bg-primary text-white font-sora font-semibold px-7 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  Start Riding <ArrowRight size={16} />
                </a>
                <a
                  href="#a-day"
                  className="inline-flex items-center gap-2 text-main font-sora text-sm font-medium hover:text-primary transition-colors"
                >
                  See a day in the life →
                </a>
              </div>
            </div>

            {/* Right — stats stack */}
            <div
              data-aos="fade-left"
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((s, i) => (
                <div
                  key={i}
                  className={`rounded-3xl p-7 flex flex-col justify-end gap-1 ${
                    i === 0
                      ? "bg-primary text-white"
                      : "bg-background border border-line"
                  }`}
                >
                  <div
                    className={`text-3xl md:text-4xl font-sora font-bold ${
                      i === 0 ? "text-white" : "text-main"
                    }`}
                  >
                    {s.value}
                  </div>
                  <div
                    className={`text-xs font-dm ${
                      i === 0 ? "text-white/75" : "text-sub"
                    }`}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* A DAY IN THE LIFE — Timeline */}
        <section id="a-day" className="main py-20 line">
          <div data-aos="fade-up" className="mb-14">
            <span className="text-primary font-sora text-xs font-semibold uppercase tracking-widest">
              What your day looks like
            </span>
            <h2 className="text-3xl md:text-4xl font-sora font-bold text-main mt-2">
              A day in the life of a Lani rider
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[52px] top-0 bottom-0 w-px bg-line hidden md:block" />

            <div className="flex flex-col gap-0">
              {timeline.map((t, i) => (
                <div
                  key={i}
                  data-aos="fade-up"
                  className="flex gap-6 md:gap-10 items-start group py-6 border-b border-line last:border-0"
                >
                  {/* Time badge */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="w-[105px] text-right">
                      <span className="font-sora text-xs text-sub font-medium">
                        {t.time}
                      </span>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="hidden md:flex flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-primary border-2 border-secondary z-10" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <h3 className="font-sora font-semibold text-main text-base mb-1">
                      {t.action}
                    </h3>
                    <p className="font-dm text-sub text-sm leading-relaxed">
                      {t.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT YOU NEED — Horizontal cards */}
        <section className="py-20 bg-background">
          <div className="main">
            <div data-aos="fade-up" className="mb-10">
              <span className="text-primary font-sora text-xs font-semibold uppercase tracking-widest">
                Requirements
              </span>
              <h2 className="text-3xl md:text-4xl font-sora font-bold text-main mt-2">
                What you need to get started
              </h2>
              <p className="text-sub font-dm text-sm mt-2">
                That's it. Just 6 things.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {requirements.map((r, i) => (
                <div
                  key={i}
                  data-aos="fade-up"
                  className="bg-secondary border border-line rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:border-primary/30 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <r.icon size={20} className="text-primary" />
                  </div>
                  <span className="font-dm text-main text-xs leading-snug">{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW TO JOIN — Numbered large text */}
        <section className="main py-20 line">
          <div data-aos="fade-up" className="mb-14">
            <span className="text-primary font-sora text-xs font-semibold uppercase tracking-widest">
              Getting started
            </span>
            <h2 className="text-3xl md:text-4xl font-sora font-bold text-main mt-2">
              Sign up in minutes
            </h2>
          </div>

          <div className="flex flex-col gap-0 divide-y divide-line">
            {[
              {
                n: "01",
                title: "Download the Lani Rider app",
                body: "Available on Android and iOS. Search for 'Lani Rider' and install for free.",
              },
              {
                n: "02",
                title: "Create your account",
                body: "Fill in your personal details, upload a valid ID, and add your vehicle information.",
              },
              {
                n: "03",
                title: "Get verified in 48 hours",
                body: "Our team reviews your profile and approves your account. You'll get a notification when you're cleared.",
              },
              {
                n: "04",
                title: "Go online & start earning",
                body: "Tap 'Go Online' in the app. Accept nearby orders and watch the money add up.",
              },
            ].map((step, i) => (
              <div
                key={i}
                data-aos="fade-up"
                className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-8 group"
              >
                <div className="text-7xl font-sora font-bold text-primary/10 leading-none w-24 flex-shrink-0">
                  {step.n}
                </div>
                <div className="flex-1">
                  <h3 className="font-sora font-semibold text-main text-lg mb-1">
                    {step.title}
                  </h3>
                  <p className="font-dm text-sub text-sm leading-relaxed">
                    {step.body}
                  </p>
                </div>
                <div className="hidden md:flex">
                  <ArrowRight
                    size={20}
                    className="text-sub group-hover:text-primary transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 bg-[#0d0d0d]">
          <div className="main">
            <div data-aos="fade-up" className="text-center mb-12">
              <span className="text-primary font-sora text-xs font-semibold uppercase tracking-widest">
                Rider voices
              </span>
              <h2 className="text-3xl md:text-4xl font-sora font-bold text-white mt-2">
                Hear from our riders
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  data-aos="fade-up"
                  className="bg-white/5 border border-white/10 rounded-3xl p-7 flex flex-col gap-4"
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star
                        key={s}
                        size={14}
                        className="text-primary fill-primary"
                      />
                    ))}
                  </div>
                  <p className="font-dm text-white/80 text-sm leading-relaxed flex-1">
                    "{t.quote}"
                  </p>
                  <div>
                    <div className="font-sora font-semibold text-white text-sm">
                      {t.name}
                    </div>
                    <div className="font-dm text-white/40 text-xs">{t.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="main py-20 line">
          <div
            data-aos="fade-up"
            className="flex flex-col md:flex-row md:items-start md:justify-between gap-10"
          >
            {/* Left sticky heading */}
            <div className="md:sticky md:top-28 md:w-72 flex-shrink-0">
              <span className="text-primary font-sora text-xs font-semibold uppercase tracking-widest">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-sora font-bold text-main mt-2">
                Questions?
                <br />
                We've got answers.
              </h2>
              <a
                href="/app"
                className="inline-flex items-center gap-2 mt-8 bg-primary text-white font-sora font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity text-sm"
              >
                Join Now <ArrowRight size={15} />
              </a>
            </div>

            {/* Right accordion */}
            <div className="flex-1 max-w-xl">
              {faqs.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA — dark, bold */}
        <section className="bg-[#0d0d0d] py-24">
          <div className="main text-center">
            <div data-aos="fade-up">
              <Bike size={40} className="text-primary mx-auto mb-6 opacity-80" />
              <h2 className="text-4xl md:text-6xl font-sora font-bold text-white leading-tight mb-5">
                Ready to ride?
              </h2>
              <p className="font-dm text-white/50 text-sm md:text-base max-w-md mx-auto mb-10">
                Join the growing network of Lani riders and start earning from
                day one — on your schedule, in your city.
              </p>
              <a
                href="/app"
                className="inline-flex items-center gap-2 bg-primary text-white font-sora font-bold px-10 py-4 rounded-full text-base hover:opacity-90 transition-opacity"
              >
                Become a Rider <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Riders
