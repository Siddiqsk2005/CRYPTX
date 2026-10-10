import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, ScanSearch, Shield, Sparkles } from "lucide-react";
import { AnalysisReport } from "@/components/AnalysisReport";
import { AppHeader } from "@/components/AppHeader";
import { CyberBackground } from "@/components/CyberBackground";
import { ThreatResponsePreview } from "@/components/ThreatResponsePreview";
import { ClassificationBadge } from "@/components/ClassificationBadge";
import { MessageInput } from "@/components/MessageInput";
import { RiskBadge } from "@/components/RiskBadge";
import { RiskMeter } from "@/components/RiskMeter";
import { ScanningAnimation } from "@/components/ScanningAnimation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyzeThreat } from "@/hooks/useAnalyzeThreat";
import { useAuth } from "@/hooks/useAuth";
import { useScanHistory } from "@/hooks/useScanHistory";
import { useVoiceAlert } from "@/hooks/useVoiceAlert";

const Index = () => {
  const { analyze, error, isAnalyzing, reset, result } = useAnalyzeThreat();
  const { user } = useAuth();
  const { alertDangerous, alertSafe, alertSuspicious } = useVoiceAlert();
  const { data: historyData } = useScanHistory(3);

  useEffect(() => {
    if (!result) {
      return;
    }

    if (result.classification === "dangerous") {
      alertDangerous();
    } else if (result.classification === "suspicious") {
      alertSuspicious();
    } else {
      alertSafe();
    }
  }, [alertDangerous, alertSafe, alertSuspicious, result]);

  const recentScans = historyData?.records ?? [];

  return (
    <div className="app-console-shell relative min-h-screen overflow-hidden bg-background">
      <CyberBackground variant="app" />
      <div className="relative z-10">
        <AppHeader />

        <main className="mx-auto max-w-[1700px] space-y-8 px-4 py-6 lg:ml-[18rem] lg:px-8 lg:py-8">
          <section className="hero-surface rounded-[2rem] border border-border/60 p-6 shadow-[0_24px_60px_hsl(var(--foreground)/0.06)]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Threat Intelligence
              </div>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
                  Analyze suspicious text and URLs inside the Sentinel security console.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                  After login or registration, you can move between the analyzer, dashboard, personal details,
                  logout, and full message history from one cyber-themed workspace.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild className="rounded-full">
                  <Link to="/dashboard">
                    Open dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                {!user ? (
                  <Button asChild variant="outline" className="rounded-full border-border/60">
                    <Link to="/register">Create account</Link>
                  </Button>
                ) : null}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.7rem] border border-border/60 bg-background/55 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Profile</p>
                      <p className="font-medium">{user ? user.username : "Awaiting login"}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.7rem] border border-border/60 bg-background/55 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <ScanSearch className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recent scans</p>
                      <p className="font-medium">{recentScans.length}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.7rem] border border-border/60 bg-background/55 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Clock3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Storage mode</p>
                      <p className="font-medium">{user ? "Local profile history" : "Protected until login"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          <section className="space-y-6">
            <Card className="modern-card border-border/60">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Threat analyzer</CardTitle>
                <CardDescription>
                  Paste a suspicious message, email, or URL and Sentinel will analyze it across the full workspace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MessageInput
                  onAnalyze={analyze}
                  onReset={reset}
                  isAnalyzing={isAnalyzing}
                  hasResult={!!result}
                  isAuthenticated={!!user}
                />
              </CardContent>
            </Card>

            {isAnalyzing ? <ScanningAnimation /> : null}

            {error && !isAnalyzing ? (
              <div className="rounded-3xl border border-dangerous/30 bg-dangerous/10 px-5 py-4 text-sm text-dangerous">
                {error}
              </div>
            ) : null}

            {result && !isAnalyzing ? (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <ClassificationBadge classification={result.classification} category={result.category} />

                <Card className="modern-card border-border/60">
                  <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">Threat assessment</CardTitle>
                      <CardDescription>Threat score, confidence, and the source used for this analysis.</CardDescription>
                    </div>
                    <RiskBadge riskLevel={result.riskLevel} />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-3xl border border-border/60 bg-background/70 p-4">
                        <p className="text-sm text-muted-foreground">Threat score</p>
                        <p className="mt-2 font-mono text-3xl font-semibold">{result.threatScore}</p>
                      </div>
                      <div className="rounded-3xl border border-border/60 bg-background/70 p-4">
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p className="mt-2 font-mono text-3xl font-semibold">{result.confidence}%</p>
                      </div>
                      <div className="rounded-3xl border border-border/60 bg-background/70 p-4">
                        <p className="text-sm text-muted-foreground">Analyzer source</p>
                        <p className="mt-2 font-medium capitalize">{result.source}</p>
                      </div>
                    </div>

                    <RiskMeter score={result.threatScore} classification={result.classification} />
                  </CardContent>
                </Card>

                <ThreatResponsePreview isVisible={result.classification === "dangerous"} />

                <Card className="modern-card border-border/60">
                  <CardHeader>
                    <CardTitle className="text-xl">Explanation</CardTitle>
                    <CardDescription>Why this input was classified the way it was.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalysisReport
                      explanation={result.explanation}
                      trustIndicators={result.trustIndicators}
                      riskIndicators={result.riskIndicators}
                      recommendedAction={result.recommendedAction}
                      confidence={result.confidence}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ) : null}

            {recentScans.length > 0 ? (
            <Card className="modern-card border-border/60">
              <CardHeader>
                <CardTitle className="text-xl">Recent scans</CardTitle>
                <CardDescription>Your most recent saved analyses.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentScans.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border/70 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                    Run a scan to see your recent history here.
                  </div>
                ) : (
                  recentScans.map((scan) => (
                    <div key={scan.id} className="rounded-3xl border border-border/60 bg-background/70 p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <RiskBadge riskLevel={scan.riskLevel} />
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(scan.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="max-h-10 overflow-hidden text-sm font-medium text-foreground">{scan.input}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{scan.explanation}</p>
                    </div>
                  ))
                )}
                <Button asChild variant="outline" className="w-full rounded-full border-border/60">
                  <Link to="/dashboard">View full dashboard</Link>
                </Button>
              </CardContent>
            </Card>
            ) : null}
          </section>
        </main>

        <footer className="border-t border-border/50 lg:ml-[18rem]">
          <div className="mx-auto flex max-w-[1700px] flex-col gap-3 px-4 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Sentinel AI Pro combines secure access, message history, and explainable threat scoring.</span>
            </div>
            <span>{user ? "Your history stays attached to the current user." : "Login or register to enter the console."}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
