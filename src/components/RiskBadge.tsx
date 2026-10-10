import { Badge } from "@/components/ui/badge";
import type { RiskLevel } from "@/lib/analysis";
import { cn } from "@/lib/utils";

const styles: Record<RiskLevel, string> = {
  Low: "border-safe/30 bg-safe/10 text-safe",
  Medium: "border-suspicious/30 bg-suspicious/10 text-suspicious",
  High: "border-dangerous/30 bg-dangerous/10 text-dangerous",
};

export function RiskBadge({ riskLevel, className }: { riskLevel: RiskLevel; className?: string }) {
  return (
    <Badge variant="outline" className={cn("rounded-full px-3 py-1 font-mono text-xs", styles[riskLevel], className)}>
      {riskLevel} Risk
    </Badge>
  );
}
