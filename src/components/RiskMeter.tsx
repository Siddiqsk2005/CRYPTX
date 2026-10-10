import { motion } from "framer-motion";

interface RiskMeterProps {
  score: number;
  classification: "safe" | "suspicious" | "dangerous";
}

export function RiskMeter({ score, classification }: RiskMeterProps) {
  const getColorClass = () => {
    switch (classification) {
      case "safe":
        return "bg-safe";
      case "suspicious":
        return "bg-suspicious";
      case "dangerous":
        return "bg-dangerous";
      default:
        return "bg-muted";
    }
  };

  const getGlowClass = () => {
    switch (classification) {
      case "safe":
        return "glow-safe";
      case "suspicious":
        return "glow-suspicious";
      case "dangerous":
        return "glow-dangerous";
      default:
        return "";
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-center font-mono text-sm">
        <span className="text-muted-foreground">RISK LEVEL</span>
        <span className={`font-bold ${
          classification === "safe" ? "text-safe" :
          classification === "suspicious" ? "text-suspicious" :
          "text-dangerous"
        }`}>
          {score}%
        </span>
      </div>
      
      <div className="relative h-4 bg-secondary rounded-full overflow-hidden border border-border">
        {/* Background segments */}
        <div className="absolute inset-0 flex">
          <div className="w-[30%] bg-safe/20 border-r border-border/50" />
          <div className="w-[40%] bg-suspicious/20 border-r border-border/50" />
          <div className="w-[30%] bg-dangerous/20" />
        </div>
        
        {/* Animated fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`absolute h-full ${getColorClass()} ${getGlowClass()} rounded-full`}
        />
        
        {/* Scan line effect */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-xs font-mono text-muted-foreground">
        <span>SAFE</span>
        <span>SUSPICIOUS</span>
        <span>DANGEROUS</span>
      </div>
    </div>
  );
}
