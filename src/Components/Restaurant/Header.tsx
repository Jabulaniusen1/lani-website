import { useAuth, useNotifications } from "@/Hooks";
import { Link, useLocation } from "react-router-dom";
import { MapPinHouse, Bell } from "lucide-react";
import { Goback, ThemeToggle } from "@/Components/UI";

const Header = () => {
  const {userData} = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const {unreadCount} = useNotifications();
  return (
   <>
   <header className="sticky top-0 z-50 backdrop-blur-sm">
        <nav className="dashboard-layout md:pl-24 lg:pl-64 h-[60px] flex items-center justify-between">
          {!isDashboard ? <Goback />: (
            <div/>
          )}

          <div className="flex items-center gap-2">
            <div className="center gap-2 max-w-24 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium font-sora">
              <MapPinHouse size={18} className="flex-shrink-0"/>
              <span className="truncate">{userData?.location}</span>
            </div>
          <Link 
            to="/notifications" 
            className="h-10 w-10 center hover:bg-background rounded-full relative"
          >
            <Bell size={20} className="text-main" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />}
          </Link>
            <ThemeToggle />
            
          <Link to="/profile" className="h-10 w-10 bg-primary font-sora text-lg rounded-full text-white flex items-center justify-center">
            {userData?.name.split(" ")[0].charAt(0)}{userData?.name.split(" ")[1].charAt(0)}
          </Link>
          </div>
        </nav>
      </header>
   </>
  )
}

export default Header
