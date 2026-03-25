import { useState, useEffect } from "react"
import { X } from "lucide-react"

const phrases = [
  "You don chow?",
  "Have you eaten?",
  "Ame dia Mkpo?",
  "Se o ti jeun?",
  "I riela nri?",
  "Kun ci abinci?",
]

const WaitlistModal = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-secondary rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-sub hover:text-main transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <img src="/logo-orange.png" width={32} alt="Lani" />
        </div>

        <h3 className="text-main font-sora font-bold text-xl mb-2">Welcome to Lani</h3>
        <p className="text-sub font-dm text-sm mb-6 leading-relaxed">
          Lani helps customers order, merchants sell, and riders deliver across
          food, pharmacy, supermarket, and dispatch categories.
        </p>

        <input
          type="email"
          placeholder="Enter your email for updates"
          className="w-full border border-line rounded-full px-4 py-3 mb-3 bg-background text-main text-sm outline-none focus:border-primary transition-colors"
        />
        <button className="w-full bg-primary text-white font-sora font-medium rounded-full py-3 hover:opacity-90 transition-opacity">
          Get Updates
        </button>
        <button
          onClick={onClose}
          className="mt-3 text-sub text-sm hover:text-main transition-colors block w-full"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}

const Hero = () => {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length)
        setVisible(true)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {showModal && <WaitlistModal onClose={() => setShowModal(false)} />}

      <section className="flex items-center line py-10 md:flex-row flex-col gap-10 min-h-screen">
        <div data-aos="fade-up" className="flex flex-col gap-10 flex-1 w-full">
          <div className="text-main md:w-[700px] text-center md:text-left w-full">
            {/* Animated phrase */}
            <div className="h-14 md:h-16 overflow-hidden mb-2">
              <p
                className="text-3xl md:text-5xl font-sora font-bold text-primary"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(-14px)",
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                }}
              >
                {phrases[phraseIndex]}
              </p>
            </div>

            <h1 className="text-4xl md:text-6xl font-sora font-bold">
              Order. Sell. Deliver. All on Lani.
            </h1>
            <p className="text-sub font-dm text-sm md:text-base mt-4">
              From meals and essentials to merchant fulfillment and rider
              delivery, Lani keeps the entire order journey in one platform.
            </p>
          </div>

          {/* App store buttons */}
          <div className="flex md:flex-row flex-col gap-4 justify-center md:justify-start w-fit mx-auto md:mx-0">
            {/* Google Play */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-3 bg-[#0d0d0d] text-white rounded-xl px-5 py-3 hover:opacity-80 transition-opacity border border-white/10 min-w-[160px]"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 flex-shrink-0" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.86a1 1 0 010 1.706l-2.26 1.307L13.132 12l2.306-2.306 2.26 1.153zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] opacity-60 leading-none mb-1">Get it on</div>
                <div className="font-sora font-semibold text-sm leading-none">Google Play</div>
              </div>
            </button>

            {/* App Store */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-3 bg-[#0d0d0d] text-white rounded-xl px-5 py-3 hover:opacity-80 transition-opacity border border-white/10 min-w-[160px]"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 flex-shrink-0" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] opacity-60 leading-none mb-1">Download on the</div>
                <div className="font-sora font-semibold text-sm leading-none">App Store</div>
              </div>
            </button>
          </div>
        </div>

        <div
          data-aos="zoom-in"
          className="w-full relative center flex-1 rounded-full overflow-hidden [1024px]:hidden"
        >
          <img src="/parcel2.jpg" className="object-cover" height={50} />
          <div className="flex absolute left-[45%] top-[75%] -translate-x-1/2 -translate-y-1/2 items-center">
            <img src="logo-orange.png" width={40} />
            <h3 className="text-[#222] text-3xl font-bold">Lani</h3>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
