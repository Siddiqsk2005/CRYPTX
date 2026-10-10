import { motion } from "framer-motion";
import { Ban, ShieldOff, AlertOctagon } from "lucide-react";

interface ThreatResponsePreviewProps {
  isVisible: boolean;
}

export function ThreatResponsePreview({ isVisible }: ThreatResponsePreviewProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-xl bg-dangerous/10 border-2 border-dangerous glow-dangerous"
    >
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
        >
          <AlertOctagon className="w-10 h-10 text-dangerous" />
        </motion.div>
        <div>
          <h3 className="font-mono font-bold text-lg text-dangerous">
            AUTO-BLOCK TRIGGERED
          </h3>
          <p className="text-sm text-muted-foreground">
            Response preview showing automated threat containment
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-background/50"
        >
          <Ban className="w-5 h-5 text-dangerous" />
          <span className="font-mono text-sm">Sender blocked from contact list</span>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-background/50"
        >
          <ShieldOff className="w-5 h-5 text-dangerous" />
          <span className="font-mono text-sm">Message quarantined for review</span>
        </motion.div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground font-mono border-t border-border/50 pt-4">
        Threat containment is displayed here as a guided preview of how Sentinel AI Pro responds to high-risk activity.
      </p>
    </motion.div>
  );
}
