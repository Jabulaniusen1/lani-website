import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const services = [
  { emoji: "🍔", label: "Food Delivery" },
  { emoji: "💊", label: "Pharmaceuticals" },
  { emoji: "🛒", label: "Supermarket" },
];

const Splash = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 600);

    const timeout = setTimeout(() => {
      clearInterval(cycleInterval);
      navigate("/home");
    }, 2000);

    return () => {
      clearTimeout(timeout);
      clearInterval(cycleInterval);
    };
  }, [navigate]);

  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center bg-primary gap-6 px-6">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl">
        <img src="/logo-orange.png" alt="logo" width={40} />
        <h3 className="text-2xl text-main font-sora font-bold">Lani</h3>
      </div>

      {/* Tagline */}
      <p className="text-white text-sm font-medium tracking-wide opacity-90">
        Everything delivered to your door
      </p>

      {/* Service pills */}
      <div className="flex gap-3 mt-2">
        {services.map((service, i) => (
          <div
            key={service.label}
            className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-all duration-300 ${
              i === activeIndex
                ? "bg-white scale-110 shadow-lg"
                : "bg-white/20"
            }`}
          >
            <span className="text-2xl">{service.emoji}</span>
            <span
              className={`text-xs font-semibold ${
                i === activeIndex ? "text-main" : "text-white"
              }`}
            >
              {service.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Splash;
