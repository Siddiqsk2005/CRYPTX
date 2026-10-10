import { motion } from "framer-motion";

const dataStreams = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  left: `${2 + index * 7.1}%`,
  delay: index * 0.35,
  duration: 10 + (index % 4) * 1.8,
  opacity: 0.12 + (index % 4) * 0.05,
  content: "01101001 11010010 00110111 10110001 01010110 11001010",
}));

const scanBeams = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  left: `${4 + index * 6.1}%`,
  delay: (index % 5) * 0.28,
  duration: 4.5 + (index % 6) * 0.45,
  opacity: 0.18 + (index % 3) * 0.08,
}));

const hudPanels = [
  "absolute left-[3%] top-[14%] hidden h-40 w-60 lg:block",
  "absolute left-[7%] bottom-[16%] hidden h-32 w-52 xl:block",
  "absolute right-[4%] top-[18%] hidden h-36 w-56 lg:block",
  "absolute right-[8%] bottom-[16%] hidden h-28 w-48 xl:block",
];

export function CyberBackground({ variant = "app" }: { variant?: "auth" | "app" }) {
  const isAuth = variant === "auth";

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${isAuth ? "opacity-100" : "opacity-95"}`}>
      <div className={`edex-stage absolute inset-0 ${isAuth ? "edex-stage-auth" : "edex-stage-app"}`} />
      <div className="edex-vignette absolute inset-0" />
      <div className="edex-grid absolute inset-0 opacity-80" />
      <div className="edex-floor absolute inset-0 opacity-90" />
      <div className="edex-noise absolute inset-0 opacity-40" />

      <motion.div
        className="absolute -left-20 top-[10%] h-72 w-72 rounded-full bg-cyan-400/16 blur-3xl"
        animate={{ x: [0, 28, 0], y: [0, -24, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10%] top-[16%] h-80 w-80 rounded-full bg-sky-400/14 blur-3xl"
        animate={{ x: [0, -34, 0], y: [0, 18, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[22%] h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl"
        animate={{ x: [0, 18, 0], y: [0, -22, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {hudPanels.map((panel, index) => (
        <motion.div
          key={panel}
          className={`${panel} edex-panel rounded-[1.8rem]`}
          animate={{ opacity: [0.28, 0.74, 0.28], scale: [1, 1.02, 1] }}
          transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="edex-panel-frame absolute inset-0 rounded-[1.8rem]" />
          <div className="absolute inset-x-5 top-5 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
          <div className="absolute inset-x-7 bottom-5 h-px bg-gradient-to-r from-transparent via-cyan-300/65 to-transparent" />
          <div className="absolute left-5 top-6 font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-100/70">
            {index % 2 === 0 ? "Threat Feed" : "Signal Trace"}
          </div>
          <div className="absolute left-5 right-5 top-14 h-20 rounded-2xl border border-cyan-300/15 bg-cyan-300/5">
            <div className="absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
            <div className="absolute inset-y-3 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/40 to-transparent" />
          </div>
          <div className="absolute bottom-7 left-5 flex gap-2">
            <span className="h-2 w-14 rounded-full bg-cyan-300/45" />
            <span className="h-2 w-8 rounded-full bg-emerald-300/35" />
            <span className="h-2 w-5 rounded-full bg-cyan-100/25" />
          </div>
        </motion.div>
      ))}

      <div className="absolute left-[50%] top-[50%] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10">
        <div className="edex-radar absolute inset-[10%] rounded-full border border-cyan-300/12" />
        <div className="edex-radar absolute inset-[22%] rounded-full border border-cyan-300/12" />
        <div className="edex-radar absolute inset-[34%] rounded-full border border-cyan-300/12" />
      </div>

      {dataStreams.map((stream) => (
        <motion.div
          key={stream.id}
          className="edex-stream absolute top-[-30%] hidden max-w-[88px] whitespace-pre-wrap break-words font-mono text-[10px] leading-5 text-cyan-100/25 md:block"
          style={{ left: stream.left, opacity: stream.opacity }}
          animate={{ y: ["-12%", "118%"] }}
          transition={{ duration: stream.duration, delay: stream.delay, repeat: Infinity, ease: "linear" }}
        >
          {stream.content}
        </motion.div>
      ))}

      {scanBeams.map((beam) => (
        <motion.span
          key={beam.id}
          className="edex-beam absolute top-[-16%] h-[140%] w-[2px] bg-gradient-to-b from-transparent via-cyan-300/70 to-transparent"
          style={{ left: beam.left, opacity: beam.opacity }}
          animate={{ y: ["-10%", "12%", "-10%"], scaleY: [0.8, 1.08, 0.8] }}
          transition={{ duration: beam.duration, delay: beam.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}

      <motion.div
        className="absolute inset-x-0 top-[18%] h-px bg-gradient-to-r from-transparent via-cyan-300/75 to-transparent"
        animate={{ opacity: [0.16, 0.85, 0.16], scaleX: [0.92, 1, 0.92] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-[22%] h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent"
        animate={{ opacity: [0.12, 0.7, 0.12], scaleX: [0.9, 1, 0.9] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
