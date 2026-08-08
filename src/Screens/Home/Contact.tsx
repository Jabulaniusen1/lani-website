import { Header, Footer, Contacts } from "@/Components/Home"
import { MessageCircle, Mail, MapPin, Clock } from "lucide-react"

const Contact = () => {
  return (
    <>
      <Header />

      <main>
        {/* ── HERO ── */}
        <section className="main pt-20 pb-10 md:pt-28 md:pb-14 border-b border-line">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle size={18} className="text-primary flex-shrink-0" />
            <span className="font-sora font-semibold text-primary text-sm">Contact Us</span>
          </div>
          <h1 className="font-sora font-bold text-main text-3xl md:text-4xl max-w-xl">
            We'd love to hear from you
          </h1>
          <p className="font-dm text-sub text-sm mt-3 max-w-xl leading-relaxed">
            Questions about an order, becoming a merchant, or riding with Lani? Send us a message
            and our team will get back to you.
          </p>
        </section>

        {/* ── CONTACT INFO ── */}
        <section className="main py-10 md:py-12">
          <div className="grid md:grid-cols-3 gap-4">
            <div
              data-aos="fade-up"
              className="bg-secondary border border-line rounded-2xl p-5 flex items-start gap-3"
            >
              <div className="bg-primary/10 text-primary rounded-xl p-2.5 flex-shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <p className="font-sora font-semibold text-main text-sm">Email</p>
                <a
                  href="mailto:hello@lani.ng"
                  className="font-dm text-sub text-sm hover:text-primary hover:underline"
                >
                  hello@lani.ng
                </a>
              </div>
            </div>

            <div
              data-aos="fade-up"
              className="bg-secondary border border-line rounded-2xl p-5 flex items-start gap-3"
            >
              <div className="bg-primary/10 text-primary rounded-xl p-2.5 flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <p className="font-sora font-semibold text-main text-sm">Location</p>
                <p className="font-dm text-sub text-sm">Uyo, Akwa Ibom State, Nigeria</p>
              </div>
            </div>

            <div
              data-aos="fade-up"
              className="bg-secondary border border-line rounded-2xl p-5 flex items-start gap-3"
            >
              <div className="bg-primary/10 text-primary rounded-xl p-2.5 flex-shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="font-sora font-semibold text-main text-sm">Support Hours</p>
                <p className="font-dm text-sub text-sm">Mon – Sun, 8am – 10pm</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FORM ── */}
        <section className="main pb-16 md:pb-20">
          <Contacts />
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Contact
