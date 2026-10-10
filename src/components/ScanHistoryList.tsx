import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RiskBadge } from "@/components/RiskBadge";
import type { StoredScanRecord } from "@/lib/analysis";

function formatTimestamp(value: string) {
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

function trimInput(value: string) {
  return value.length > 80 ? `${value.slice(0, 80)}...` : value;
}

export function ScanHistoryList({
  records,
  title = "Recent scans",
  description = "Your latest analysis activity appears here.",
}: {
  records: StoredScanRecord[];
  title?: string;
  description?: string;
}) {
  return (
    <Card className="modern-card border-border/60">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/70 bg-muted/20 px-6 py-10 text-center text-sm text-muted-foreground">
            No scans yet. Run an analysis to populate your history.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Input</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="max-w-[420px]">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{trimInput(record.input)}</p>
                      <p className="text-xs text-muted-foreground">{record.explanation}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-base font-semibold">{record.threatScore}</TableCell>
                  <TableCell>
                    <RiskBadge riskLevel={record.riskLevel} />
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">{record.source}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatTimestamp(record.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
