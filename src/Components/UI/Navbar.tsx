import {
  LayoutDashboard,
  Package,
  UtensilsCrossed,
  Wallet,
  UserRound,
  BellPlus,
  DollarSign,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/Hooks";
import clsx from "clsx";

const Navbar = () => {
  const location = useLocation();
  const { userData } = useAuth();

  const isAdminRoute = location.pathname.includes("/admin");
  const isRider = userData?.role === "rider";
  const isMerchant = userData?.role === "restaurant" || userData?.role === "merchant";

  const userLinks = isMerchant
    ? [
        {
          name: "Home",
          icon: LayoutDashboard,
          to: "/dashboard",
        },
        {
          name: "Menu",
          icon: UtensilsCrossed,
          to: "/menu",
        },
        {
          name: "Orders",
          icon: Package,
          to: "/orders",
        },
        {
          name: "Earnings",
          icon: Wallet,
          to: "/earnings",
        },
        {
          name: "Profile",
          icon: UserRound,
          to: "/profile",
        },
      ]
    : [
        {
          name: "Home",
          icon: LayoutDashboard,
          to: "/dashboard",
        },
        {
          name: "Orders",
          icon: Package,
          to: isRider ? "/orders/available" : "/orders",
        },
        {
          name: "Earnings",
          icon: Wallet,
          to: "/earnings",
        },
        {
          name: "Profile",
          icon: UserRound,
          to: "/profile",
        },
      ];

  const adminLinks = [
    {
      name: "Home",
      icon: LayoutDashboard,
      to: "/admin",
    },
    {
      name: "Flat Rates",
      icon: DollarSign,
      to: "/admin/settings/flat-rates",
    },
    {
      name: "Notifications",
      icon: BellPlus,
      to: "/admin/settings/notifications",
    },
    {
      name: "Profile",
      icon: UserRound,
      to: "/profile",
    },
  ];

  const links = isAdminRoute ? adminLinks : userLinks;

  const isLinkActive = (to: string) => {
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 px-4 md:hidden z-40">
        <nav className="bg-background/80 backdrop-blur-lg border border-line rounded-2xl px-4 py-3 shadow-lg shadow-black/5">
          <ul className="flex items-center gap-3">
            {links.map((link) => {
              const active = isLinkActive(link.to);
              return (
                <li key={link.name}>
                  <NavLink
                    to={link.to}
                    className={clsx(
                      "p-3 rounded-xl flex items-center justify-center transition-all duration-300 relative",
                      active
                        ? "text-primary scale-110 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary"
                        : "text-sub hover:text-main hover:bg-background-2"
                    )}
                  >
                    <link.icon
                      size={20}
                      className={clsx(
                        "transition-transform",
                        active && "transform rotate-[360deg] duration-500"
                      )}
                    />
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <aside className="hidden md:flex fixed left-4 top-[76px] bottom-4 z-40">
        <nav className="w-20 lg:w-56 bg-background/80 backdrop-blur-lg border border-line rounded-2xl p-3 shadow-lg shadow-black/5">
          <ul className="flex flex-col gap-2 h-full">
            {links.map((link) => {
              const active = isLinkActive(link.to);
              return (
                <li key={link.name}>
                  <NavLink
                    to={link.to}
                    className={clsx(
                      "h-12 rounded-xl px-3 flex items-center gap-3 transition-all duration-300",
                      active
                        ? "text-primary bg-primary/10"
                        : "text-sub hover:text-main hover:bg-background-2"
                    )}
                  >
                    <link.icon size={20} className="shrink-0" />
                    <span className="hidden lg:inline text-sm font-medium font-sora">
                      {link.name}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
