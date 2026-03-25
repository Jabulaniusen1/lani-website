import { useEffect } from "react"
import { X } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const navLinks = [
  { title: "About", path: "about" },
  { title: "Vendors", path: "/vendors" },
  { title: "Riders", path: "/riders" },
]

const menuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -25 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

const SideMenu = ({
  onClose,
  isOpen,
}: {
  onClose: () => void
  isOpen: boolean
}) => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onClose()
    if (location.pathname === "/") {
      setTimeout(() => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
      }, 300)
    } else {
      navigate("/")
      setTimeout(() => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
      }, 400)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 0 }}
        transition={{ duration: 0.3 }}
        style={{ originX: 1 }}
        className="w-[300px] h-full flex flex-col bg-secondary p-4 z-20"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            <img src="/logo-orange.png" alt="Lani" width={28} />
            <span className="font-sora font-bold text-lg text-main">Lani</span>
          </div>
          <button onClick={onClose} className="text-sub hover:text-main transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Nav Links */}
        <motion.ul
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="flex flex-col gap-1 flex-1"
        >
          {navLinks.map((link) => (
            <motion.li key={link.title} variants={itemVariants}>
              {link.path === "about" ? (
                <a
                  href="#about"
                  onClick={handleAboutClick}
                  className="text-main font-sora text-base block p-3 hover:bg-background rounded-xl font-medium transition-colors"
                >
                  {link.title}
                </a>
              ) : (
                <Link
                  to={link.path}
                  onClick={onClose}
                  className={`text-main font-sora text-base block p-3 hover:bg-background rounded-xl font-medium transition-colors ${
                    location.pathname === link.path ? "bg-background text-primary" : ""
                  }`}
                >
                  {link.title}
                </Link>
              )}
            </motion.li>
          ))}
        </motion.ul>

        {/* Bottom CTA */}
        <div className="pt-4 border-t border-line">
          <p className="text-sub text-xs font-dm text-center mb-3">
            Download the Lani app — coming soon
          </p>
          <div className="flex gap-2">
            <div className="flex-1 bg-[#0d0d0d] text-white rounded-xl px-3 py-2.5 text-center">
              <div className="text-[9px] opacity-60">Get it on</div>
              <div className="font-sora font-semibold text-xs">Google Play</div>
            </div>
            <div className="flex-1 bg-[#0d0d0d] text-white rounded-xl px-3 py-2.5 text-center">
              <div className="text-[9px] opacity-60">Download on</div>
              <div className="font-sora font-semibold text-xs">App Store</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SideMenu
