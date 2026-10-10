import { motion } from "framer-motion";
import { Shield, Scan, Binary } from "lucide-react";

export function ScanningAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      {/* Central scanning icon */}
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary w-32 h-32"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-accent/30 border-b-accent w-28 h-28"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative flex items-center justify-center w-32 h-32"
        >
          <Shield className="w-12 h-12 text-primary" />
        </motion.div>
      </div>

      {/* Scanning text */}
      <div className="text-center space-y-2">
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="font-mono text-xl text-primary text-glow-primary"
        >
          ANALYZING THREAT...
        </motion.div>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-accent"
            />
          ))}
        </div>
      </div>

      {/* Scanning lines */}
      <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="flex items-center gap-1"
        >
          <Scan className="w-3 h-3" />
          <span>Pattern Analysis</span>
        </motion.div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
          className="flex items-center gap-1"
        >
          <Binary className="w-3 h-3" />
          <span>Intent Detection</span>
        </motion.div>
      </div>
    </div>
  );
}
