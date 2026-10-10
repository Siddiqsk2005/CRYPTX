import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { History as HistoryIcon, MessagesSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { CyberBackground } from "@/components/CyberBackground";
import { ScanHistoryList } from "@/components/ScanHistoryList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useScanHistory } from "@/hooks/useScanHistory";
import { clearScanHistory } from "@/lib/scan-history";

const History = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data } = useScanHistory(50);
  const [isClearing, setIsClearing] = useState(false);
  const records = data?.records ?? [];

  const handleClearHistory = async () => {
    setIsClearing(true);

    try {
      await clearScanHistory(user?.id);
      await queryClient.invalidateQueries({ queryKey: ["scan-history", user?.id ?? "guest"] });
      toast.success("History cleared");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to clear history right now.";
      toast.error(message);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="app-console-shell relative min-h-screen overflow-hidden bg-background">
      <CyberBackground variant="app" />
      <div className="relative z-10">
        <AppHeader />

        <main className="mx-auto max-w-[1700px] space-y-8 px-4 py-6 lg:ml-[18rem] lg:px-8 lg:py-8">
          <section className="hero-surface rounded-[2rem] border border-border/60 p-6 shadow-[0_24px_60px_hsl(var(--foreground)/0.06)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-primary">
                  <HistoryIcon className="h-3.5 w-3.5" />
                  Message History
                </div>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Full history of analyzed messages</h1>
                <p className="max-w-2xl text-muted-foreground">
                  Review every saved message, its threat score, explanation, and when it was scanned.
                </p>
              </div>

              <Card className="modern-card w-full max-w-sm border-border/60">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Stored messages</p>
                    <p className="mt-2 text-3xl font-semibold">{records.length}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <MessagesSquare className="h-5 w-5" />
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-2xl border-dangerous/30 text-dangerous hover:bg-dangerous/10 hover:text-dangerous"
                          disabled={records.length === 0 || isClearing}
                        >
                          <Trash2 className="h-4 w-4" />
                          Clear History
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove every saved scan for the current user from the history page.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-dangerous text-dangerous-foreground hover:bg-dangerous/90"
                            onClick={handleClearHistory}
                          >
                            {isClearing ? "Clearing..." : "Clear History"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <ScanHistoryList
            records={records}
            title="Message history"
            description="Each saved item is tied to the current user profile and can be cleared any time from this page."
          />
        </main>
      </div>
    </div>
  );
};

export default History;
