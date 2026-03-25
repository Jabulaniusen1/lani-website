import { SquareMousePointer } from "lucide-react"
import { Link } from "react-router-dom"

const banner = () => {
  return (
      <div data-aos="fade-up" className="flex items-center md:flex-row flex-col p-4 pt-10 bg-gradient-to-br from-orange-500 to-orange-300 min-h-[450px] rounded-3xl">
          <div className="flex-1">
              <div className="">
                  <h1 className="text-4xl md:text-6xl font-sora text-white font-semibold">Built for Customers, Merchants, and Riders</h1>
                  <p className="font-dm text-main text-sm mt-4">One platform for ordering, store management, and fast delivery across key daily categories.</p>
              </div>
              <div className="w-[200px] mt-10">
                  <Link to="/app" className="btn bg-white h-[60px] text-primary rounded-full">
                      <span>Get Started</span>
                      <SquareMousePointer size={18}/>
                  </Link>
              </div>
          </div>
          <div className="flex-1 center">
              <img src="/banner.png" />
          </div>
    </div>
  )
}

export default banner
