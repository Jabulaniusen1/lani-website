import { motion } from "framer-motion";
import Title from "./Title";

const cities = [
  {
    name: "Enugu",
    state: "Enugu State",
    x: 50,
    y: 22,
    delay: 0,
    active: false,
  },
  {
    name: "Asaba",
    state: "Delta State",
    x: 22,
    y: 38,
    delay: 0.3,
    active: false,
  },
  {
    name: "Uyo",
    state: "Akwa Ibom",
    x: 65,
    y: 72,
    delay: 0.6,
    active: true,
  },
  {
    name: "Calabar",
    state: "Cross River",
    x: 80,
    y: 80,
    delay: 0.9,
    active: false,
  },
  {
    name: "Aba",
    state: "Abia State",
    x: 60,
    y: 52,
    delay: 1.2,
    active: false,
  },
];

// SVG connections between cities [from index, to index]
const connections = [
  [0, 1],
  [0, 4],
  [1, 2],
  [2, 3],
  [4, 2],
  [4, 3],
];

const MapDot = ({ city }: { city: (typeof cities)[0] }) => {
  const isRight = city.x > 55;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${city.x}%`,
        top: `${city.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: city.active ? 10 : 1,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: city.active ? 1 : 0.35, scale: 1 }}
      transition={{ delay: city.delay + 0.6, duration: 0.5, type: "spring" }}
    >
      {/* Outer pulse rings — only for active city */}
      {city.active &&
        [1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border border-primary/40"
            style={{
              width: ring * 22,
              height: ring * 22,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: city.delay + ring * 0.4,
              ease: "easeOut",
            }}
          />
        ))}

      {/* Core dot */}
      <div
        className={`relative z-10 w-3 h-3 rounded-full shadow-lg ${
          city.active ? "bg-primary shadow-primary/60" : "bg-sub/50 shadow-sub/20"
        }`}
      />

      {/* City label */}
      <motion.div
        className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap ${
          isRight ? "right-full mr-4" : "left-full ml-4"
        }`}
        initial={{ opacity: 0, x: isRight ? 10 : -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: city.delay + 1.0, duration: 0.4 }}
      >
        <div
          className={`bg-background/90 backdrop-blur-sm border rounded-lg px-3 py-1.5 shadow-md ${
            city.active ? "border-primary/40" : "border-line"
          }`}
        >
          <p className="text-main font-sora font-bold text-xs leading-tight">{city.name}</p>
          {!city.active && (
            <p className="text-[9px] font-dm text-amber-500 font-semibold">Coming soon</p>
          )}
        </div>
        {/* Connector line from label to dot */}
        <div
          className={`absolute top-1/2 -translate-y-px h-px w-3 ${
            city.active ? "bg-primary/40" : "bg-line"
          } ${isRight ? "left-full" : "right-full"}`}
        />
      </motion.div>
    </motion.div>
  );
};

const Cities = () => {
  return (
    <section id="cities" className="py-16 line">
      <Title main="Cities We" sub="Operate In" />

      <div data-aos="fade-up" className="mt-10 flex md:flex-row flex-col gap-10 items-center">
        {/* Map container */}
        <div className="relative flex-1 w-full md:min-h-[420px] min-h-[320px] rounded-2xl overflow-hidden border border-line bg-background">
          {/* Grid background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.07]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Radial glow center */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_55%_55%,rgba(var(--color-primary-rgb,99,102,241),0.08),transparent)]" />

          {/* SVG connection lines */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {connections.map(([from, to], i) => {
              const a = cities[from];
              const b = cities[to];
              return (
                <motion.line
                  key={i}
                  x1={`${a.x}%`}
                  y1={`${a.y}%`}
                  x2={`${b.x}%`}
                  y2={`${b.y}%`}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="5 4"
                  className="text-primary/30"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.2, duration: 0.8, ease: "easeInOut" }}
                />
              );
            })}
          </svg>

          {/* City dots */}
          {cities.map((city) => (
            <MapDot key={city.name} city={city} />
          ))}
        </div>

        {/* City cards list */}
        <div className="flex flex-col gap-4 md:w-64 w-full">
          {[...cities].sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0)).map((city, i) => (
            <motion.div
              key={city.name}
              className={`flex items-center gap-4 border rounded-xl px-4 py-3 bg-background transition-colors ${
                city.active
                  ? "border-primary/40 hover:border-primary"
                  : "border-line hover:border-line/70 opacity-40"
              }`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: city.active ? 1 : 0.4, x: 0 }}
              transition={{ delay: city.delay + 1.2, duration: 0.4 }}
            >
              <div className="relative shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full ${city.active ? "bg-primary" : "bg-sub/40"}`} />
                {city.active && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary"
                    animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4 }}
                  />
                )}
              </div>
              <div>
                <p className="text-main font-sora font-semibold text-sm">{city.name}</p>
                <p className="text-sub text-xs font-dm">{city.state}</p>
              </div>
              <div className="ml-auto">
                {city.active ? (
                  <span className="text-[10px] font-dm font-bold bg-primary text-white px-2.5 py-1 rounded-full shadow-sm shadow-primary/40">
                    Active
                  </span>
                ) : (
                  <span className="text-[10px] font-dm bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">
                    Coming soon
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cities;
