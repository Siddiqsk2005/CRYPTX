import { CalendarDays, Mail, Phone, ShieldCheck, UserCircle2 } from "lucide-react";
import { format } from "date-fns";
import { AppHeader } from "@/components/AppHeader";
import { CyberBackground } from "@/components/CyberBackground";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="app-console-shell relative min-h-screen overflow-hidden bg-background">
      <CyberBackground variant="app" />
      <div className="relative z-10">
        <AppHeader />

        <main className="mx-auto max-w-[1700px] space-y-8 px-4 py-6 lg:ml-[18rem] lg:px-8 lg:py-8">
          <section className="hero-surface rounded-[2rem] border border-border/60 p-6 shadow-[0_24px_60px_hsl(var(--foreground)/0.06)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-primary">
                  <UserCircle2 className="h-3.5 w-3.5" />
                  Personal Details
                </div>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{user.username}</h1>
                <p className="max-w-2xl text-muted-foreground">{user.bio}</p>
              </div>

              <Card className="modern-card w-full max-w-sm border-border/60">
                <CardContent className="space-y-3 p-6">
                  <div className="rounded-3xl border border-border/60 bg-background/70 px-4 py-3">
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="mt-1 font-medium">{user.role}</p>
                  </div>
                  <div className="rounded-3xl border border-border/60 bg-background/70 px-4 py-3">
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="mt-1 font-medium">{format(new Date(user.joinedAt), "dd MMM yyyy")}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="modern-card border-border/60">
              <CardHeader>
                <CardTitle className="text-xl">Contact profile</CardTitle>
                <CardDescription>Account information currently stored for this user.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-3xl border border-border/60 bg-background/70 px-4 py-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email ID</p>
                    <p className="font-medium">{user.email || "Not set for this profile"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-3xl border border-border/60 bg-background/70 px-4 py-4">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile Number</p>
                    <p className="font-medium">{user.mobile || "Not set for this profile"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-3xl border border-border/60 bg-background/70 px-4 py-4">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joined Date</p>
                    <p className="font-medium">{format(new Date(user.joinedAt), "dd MMM yyyy, hh:mm a")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card border-border/60">
              <CardHeader>
                <CardTitle className="text-xl">Account notes</CardTitle>
                <CardDescription>This profile is part of the current application flow and remains local to this session.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3 rounded-3xl border border-border/60 bg-background/70 px-4 py-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                  <p>User sessions are stored locally so the app can move between login, analyzer, dashboard, and history pages.</p>
                </div>
                <div className="flex items-start gap-3 rounded-3xl border border-border/60 bg-background/70 px-4 py-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                  <p>Registration accepts flexible details and OTP verification is simulated to keep the flow smooth.</p>
                </div>
                <div className="flex items-start gap-3 rounded-3xl border border-border/60 bg-background/70 px-4 py-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                  <p>The analyzer and message history continue to work after login and remain associated with this profile.</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;
