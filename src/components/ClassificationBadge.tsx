import { Shield, AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface ClassificationBadgeProps {
  classification: "safe" | "suspicious" | "dangerous";
  category: string;
}

export function ClassificationBadge({ classification, category }: ClassificationBadgeProps) {
  const config = {
    safe: {
      icon: ShieldCheck,
      label: "SAFE / USEFUL",
      emoji: "🟢",
      bgClass: "bg-safe/10 border-safe/50",
      textClass: "text-safe",
      glowClass: "glow-safe",
    },
    suspicious: {
      icon: AlertTriangle,
      label: "SUSPICIOUS",
      emoji: "🟡",
      bgClass: "bg-suspicious/10 border-suspicious/50",
      textClass: "text-suspicious",
      glowClass: "glow-suspicious",
    },
    dangerous: {
      icon: ShieldAlert,
      label: "DANGEROUS",
      emoji: "🔴",
      bgClass: "bg-dangerous/10 border-dangerous/50",
      textClass: "text-dangerous",
      glowClass: "glow-dangerous",
    },
  };

  const { icon: Icon, label, emoji, bgClass, textClass, glowClass } = config[classification];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={`relative p-6 rounded-xl border-2 ${bgClass} ${glowClass}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            animate={classification === "dangerous" ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: classification === "dangerous" ? Infinity : 0 }}
          >
            <Icon className={`w-12 h-12 ${textClass}`} strokeWidth={1.5} />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{emoji}</span>
              <span className={`font-mono font-bold text-xl ${textClass}`}>
                {label}
              </span>
            </div>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              Category: {category}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
