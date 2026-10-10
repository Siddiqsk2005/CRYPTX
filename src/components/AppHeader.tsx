import { Link, useNavigate } from "react-router-dom";
import { History, LayoutDashboard, LogOut, Shield, Sparkles, UserCircle2, ScanSearch } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  {
    to: "/analyzer",
    label: "Analyzer",
    icon: ScanSearch,
  },
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/history",
    label: "History",
    icon: History,
  },
  {
    to: "/profile",
    label: "Personal Details",
    icon: UserCircle2,
  },
];

export function AppHeader() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully.");
      navigate("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign out right now.";
      toast.error(message);
    }
  };

  const userLabel = user?.username || user?.email || user?.mobile || "Secure User";
  const contactLabel = user?.email || user?.mobile || "Secure access";

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-border/50 bg-background/72 px-5 py-6 backdrop-blur-xl lg:flex">
        <Link to="/analyzer" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_30px_hsl(var(--primary)/0.18)]">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold tracking-wide">
              SENTINEL <span className="text-primary">AI</span> PRO
            </div>
            <p className="text-xs text-muted-foreground">Threat monitoring console</p>
          </div>
        </Link>

        <div className="mt-8 rounded-[1.6rem] border border-border/60 bg-card/65 p-4 shadow-[0_16px_40px_hsl(var(--foreground)/0.08)] backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{userLabel}</p>
              <p className="mt-1 truncate text-sm text-muted-foreground">{contactLabel}</p>
            </div>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"
                activeClassName="bg-primary/12 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.18)]"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <ThemeToggle className="w-full justify-center rounded-2xl border border-border/60 bg-card/55 py-6" />
          <Button variant="ghost" className="w-full justify-start rounded-2xl px-4 py-6" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/72 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-4 px-4 py-4">
          <Link to="/analyzer" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_30px_hsl(var(--primary)/0.18)]">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="font-mono text-lg font-bold tracking-wide">
                SENTINEL <span className="text-primary">AI</span> PRO
              </div>
              <p className="text-xs text-muted-foreground">{userLabel}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="inline-flex min-w-fit items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeClassName="border-primary/20 bg-primary/12 text-primary"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </header>
    </>
  );
}
