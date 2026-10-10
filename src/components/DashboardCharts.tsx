import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StoredScanRecord } from "@/lib/analysis";

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export function DashboardCharts({
  distribution,
  records,
}: {
  distribution: Record<"Low" | "Medium" | "High", number>;
  records: StoredScanRecord[];
}) {
  const chartColors = {
    low: "rgba(16, 185, 129, 0.85)",
    medium: "rgba(245, 158, 11, 0.85)",
    high: "rgba(239, 68, 68, 0.9)",
    line: "rgba(34, 211, 238, 0.95)",
    fill: "rgba(34, 211, 238, 0.12)",
  };

  const doughnutData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        data: [distribution.Low, distribution.Medium, distribution.High],
        backgroundColor: [chartColors.low, chartColors.medium, chartColors.high],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const trendRecords = [...records]
    .reverse()
    .map((record) => ({
      label: new Date(record.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      score: record.threatScore,
    }));

  const lineData = {
    labels: trendRecords.map((record) => record.label),
    datasets: [
      {
        label: "Threat score",
        data: trendRecords.map((record) => record.score),
        borderColor: chartColors.line,
        backgroundColor: chartColors.fill,
        fill: true,
        tension: 0.32,
        pointRadius: 3,
      },
    ],
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
      <Card className="modern-card border-border/60">
        <CardHeader>
          <CardTitle className="text-xl">Risk distribution</CardTitle>
          <CardDescription>Low, medium, and high-risk scans across your recent activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mx-auto max-w-[280px]">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      color: "#94a3b8",
                      boxWidth: 12,
                    },
                  },
                },
                cutout: "68%",
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="modern-card border-border/60">
        <CardHeader>
          <CardTitle className="text-xl">Threat score trend</CardTitle>
          <CardDescription>Track how risky your recent scans have been over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <Line
            data={lineData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: "#94a3b8",
                  },
                  grid: {
                    color: "rgba(148, 163, 184, 0.12)",
                  },
                },
                y: {
                  beginAtZero: true,
                  suggestedMax: 100,
                  ticks: {
                    color: "#94a3b8",
                  },
                  grid: {
                    color: "rgba(148, 163, 184, 0.12)",
                  },
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
