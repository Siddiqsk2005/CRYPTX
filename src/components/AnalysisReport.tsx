import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { motion } from "framer-motion";

interface AnalysisReportProps {
  explanation: string;
  trustIndicators: string[];
  riskIndicators: string[];
  recommendedAction: string;
  confidence: number;
}

export function AnalysisReport({
  explanation,
  trustIndicators,
  riskIndicators,
  recommendedAction,
  confidence,
}: AnalysisReportProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* AI Explanation */}
      <div className="p-4 rounded-lg cyber-border">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-accent" />
          <span className="font-mono font-semibold text-accent">AI ANALYSIS</span>
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            Confidence: {confidence}%
          </span>
        </div>
        <p className="text-foreground/90 leading-relaxed">{explanation}</p>
      </div>

      {/* Trust Indicators */}
      {trustIndicators.length > 0 && (
        <div className="p-4 rounded-lg bg-safe/5 border border-safe/20">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-safe" />
            <span className="font-mono font-semibold text-safe">TRUST INDICATORS</span>
          </div>
          <ul className="space-y-2">
            {trustIndicators.map((indicator, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-2 text-foreground/80"
              >
                <span className="text-safe mt-1">✓</span>
                <span>{indicator}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* Risk Indicators */}
      {riskIndicators.length > 0 && (
        <div className="p-4 rounded-lg bg-dangerous/5 border border-dangerous/20">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-dangerous" />
            <span className="font-mono font-semibold text-dangerous">RISK INDICATORS</span>
          </div>
          <ul className="space-y-2">
            {riskIndicators.map((indicator, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-2 text-foreground/80"
              >
                <span className="text-dangerous mt-1">✗</span>
                <span>{indicator}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Action */}
      <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-accent" />
          <span className="font-mono font-semibold text-accent">RECOMMENDED ACTION</span>
        </div>
        <p className="text-foreground/90">{recommendedAction}</p>
      </div>
    </motion.div>
  );
}
