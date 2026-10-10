import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Activity, DatabaseZap, ShieldCheck, TriangleAlert } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CyberBackground } from "@/components/CyberBackground";
import { DashboardCharts } from "@/components/DashboardCharts";
import { RiskBadge } from "@/components/RiskBadge";
import { ScanHistoryList } from "@/components/ScanHistoryList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useScanHistory } from "@/hooks/useScanHistory";

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading } = useScanHistory(24);

  const metrics = useMemo(() => {
    const records = data?.records ?? [];
    const distribution = {
      Low: records.filter((record) => record.riskLevel === "Low").length,
      Medium: records.filter((record) => record.riskLevel === "Medium").length,
      High: records.filter((record) => record.riskLevel === "High").length,
    };

    const averageThreatScore = records.length
      ? Math.round(records.reduce((sum, record) => sum + record.threatScore, 0) / records.length)
      : 0;

    return {
      records,
      distribution,
      totalScans: records.length,
      averageThreatScore,
      highestRiskCount: distribution.High,
    };
  }, [data?.records]);

  return (
    <div className="app-console-shell relative min-h-screen overflow-hidden bg-background">
      <CyberBackground variant="app" />
      <div className="relative z-10">
        <AppHeader />

        <main className="mx-auto max-w-[1700px] space-y-8 px-4 py-6 lg:ml-[18rem] lg:px-8 lg:py-8">
          <section className="hero-surface grid gap-6 rounded-[2rem] border border-border/60 p-6 shadow-[0_24px_60px_hsl(var(--foreground)/0.06)] lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-primary">
                <DatabaseZap className="h-3.5 w-3.5" />
                Dashboard
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Track how your threats are evolving.</h1>
                <p className="max-w-2xl text-muted-foreground">
                  Review total scans, distribution by risk level, and your latest analysis results in one place.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {user ? (
                  <div className="rounded-full border border-border/60 bg-card/70 px-4 py-2 text-sm text-muted-foreground">
                    Signed in as <span className="font-medium text-foreground">{user.username}</span>
                  </div>
                ) : (
                  <div className="rounded-full border border-suspicious/30 bg-suspicious/10 px-4 py-2 text-sm text-suspicious">
                    Session not available.
                  </div>
                )}
                <Button asChild className="rounded-full">
                  <Link to="/analyzer">Run new scan</Link>
                </Button>
              </div>
            </div>

            <Card className="modern-card border-border/60">
              <CardHeader>
                <CardTitle className="text-xl">Storage status</CardTitle>
                <CardDescription>Where your latest activity is currently being saved.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-3xl border border-border/60 bg-background/70 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Current storage</p>
                      <p className="text-sm text-muted-foreground">
                        {data?.storage === "supabase" ? "AI service + local fallback history" : "Local history"}
                      </p>
                    </div>
                  </div>
                  <RiskBadge riskLevel={metrics.highestRiskCount > 0 ? "High" : metrics.totalScans > 0 ? "Medium" : "Low"} />
                </div>

                {!user ? (
                  <div className="rounded-3xl border border-dashed border-border/70 bg-muted/15 p-4 text-sm text-muted-foreground">
                    Login or register to reach the analyzer workflow.
                    <div className="mt-3 flex gap-2">
                      <Button asChild size="sm" className="rounded-full">
                        <Link to="/register">Register</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="rounded-full">
                        <Link to="/login">Login</Link>
                      </Button>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
          <Card className="modern-card border-border/60">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Total scans</p>
                <p className="mt-2 text-3xl font-semibold">{isLoading ? "..." : metrics.totalScans}</p>
              </div>
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <Activity className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card border-border/60">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Average threat score</p>
                <p className="mt-2 text-3xl font-semibold">{isLoading ? "..." : metrics.averageThreatScore}</p>
              </div>
              <div className="rounded-2xl bg-accent/10 p-3 text-accent">
                <DatabaseZap className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="modern-card border-border/60">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">High-risk scans</p>
                <p className="mt-2 text-3xl font-semibold">{isLoading ? "..." : metrics.highestRiskCount}</p>
              </div>
              <div className="rounded-2xl bg-dangerous/10 p-3 text-dangerous">
                <TriangleAlert className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
          </section>

          <DashboardCharts distribution={metrics.distribution} records={metrics.records} />

          <ScanHistoryList
            records={metrics.records}
            title="Recent scan history"
            description="Each entry includes the analyzed input, threat score, risk level, and when it ran."
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
