import { Link, useLocation, useNavigate } from "react-router-dom"
import { ThemeToggle } from "../UI"
import { Menu } from "lucide-react"
import SideMenu from "./Menu"
import { useState } from "react"
import { AnimatePresence } from "framer-motion"

const navLinks = [
  { title: "About", path: "about" },
  { title: "Vendors", path: "/vendors" },
  { title: "Riders", path: "/riders" },
]

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const toggleMenu = () => setIsOpen((prev) => !prev)

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (location.pathname === "/") {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
    } else {
      navigate("/")
      setTimeout(() => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
      }, 150)
    }
  }

  const renderLink = (link: (typeof navLinks)[0]) => {
    const className =
      "text-sub font-light hover:bg-background hover:text-main transition-all duration-300 px-3 py-2 rounded-md text-sm"

    if (link.path === "about") {
      return (
        <a href="#about" onClick={handleAboutClick} className={className}>
          {link.title}
        </a>
      )
    }
    return (
      <Link
        to={link.path}
        className={`${className} ${location.pathname === link.path ? "text-main font-medium" : ""}`}
      >
        {link.title}
      </Link>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-sm">
        <nav className="main flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo-orange.png" alt="logo" width={35} />
            <h3 className="text-2xl font-sora font-bold">Lani</h3>
          </Link>

          {/* Desktop nav */}
          <div className="items-center gap-8 hidden md:flex">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.title}>{renderLink(link)}</li>
              ))}
            </ul>

            <div className="h-9 w-[1px] bg-line" />
            <ThemeToggle />
          </div>

          {/* Mobile nav */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button onClick={toggleMenu} className="text-main">
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isOpen && <SideMenu isOpen={isOpen} onClose={toggleMenu} />}
      </AnimatePresence>
    </>
  )
}

export default Header
