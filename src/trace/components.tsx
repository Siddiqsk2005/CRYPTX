import { Activity, BarChart3, Bell, ChevronRight, ClipboardList, FileText, LayoutDashboard, LogOut, Network, Plus, Search, ShieldCheck, Users, WalletCards } from "lucide-react";
import { Link, Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, type ReactNode } from "react";
import { CASES, riskClass, shortWallet, type Risk } from "./demo";
import { useTraceAuth } from "./auth";

export function RiskPill({ risk }: { risk: Risk }) { return <span className={`risk-pill ${riskClass(risk)}`}>{risk}</span>; }
export function ModeBanner() { return <div className="mode-banner"><span className="pulse-dot" /> DEMO MODE <span>Synthetic blockchain data for demonstration purposes.</span></div>; }

const investigatorNav = [{ to: "/investigator/dashboard", icon: LayoutDashboard, label: "Overview" }, { to: "/investigator/cases", icon: ClipboardList, label: "Cases" }, { to: "/investigator/wallet-investigation", icon: WalletCards, label: "Wallet investigation" }, { to: "/investigator/graph", icon: Network, label: "Fund-flow graph" }, { to: "/investigator/reports", icon: FileText, label: "Reports" }, { to: "/investigator/analytics", icon: BarChart3, label: "Analytics" }];
const victimNav = [{ to: "/victim/dashboard", icon: LayoutDashboard, label: "My dashboard" }, { to: "/victim/complaint/new", icon: Plus, label: "New complaint" }, { to: "/victim/complaints", icon: ClipboardList, label: "My complaints" }];

export function Shell({ children }: { children: ReactNode }) {
  const { session, logout } = useTraceAuth(); const location = useLocation(); const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  if (!session) return <Navigate to="/login" replace />;
  const nav = session?.role === "VICTIM" ? victimNav : session?.role === "ADMIN" ? [{ to: "/admin/dashboard", icon: LayoutDashboard, label: "Control centre" }, { to: "/admin/users", icon: Users, label: "User management" }, { to: "/admin/vasps", icon: WalletCards, label: "VASP intelligence" }, { to: "/admin/audit-logs", icon: Activity, label: "Audit logs" }] : investigatorNav;
  const signOut = () => { logout(); navigate("/login", { replace: true }); };
  const searchableCases = session.role === "VICTIM" ? CASES.slice(0, 1) : CASES;
  const results = searchableCases.filter((item) => `${item.id} ${item.wallet} ${item.fraudType} ${item.vasp}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  const notifications = session.role === "VICTIM" ? [{ title: "Complaint accepted", detail: "TCIN-DEMO-001 is under analysis.", caseId: "TCIN-DEMO-001" }, { title: "Wallet validated", detail: "Your reported Ethereum wallet passed format validation.", caseId: "TCIN-DEMO-001" }] : [{ title: "Critical trace ready", detail: "TCIN-DEMO-001 reached a possible VASP after five layers.", caseId: "TCIN-DEMO-001" }, { title: "Freeze review pending", detail: "TCIN-DEMO-004 has a draft preservation request.", caseId: "TCIN-DEMO-004" }, { title: "New case assigned", detail: "TCIN-DEMO-002 requires investigation review.", caseId: "TCIN-DEMO-002" }];
  const openCase = (caseId: string) => { setSearchOpen(false); setNotificationOpen(false); setQuery(""); navigate(session.role === "VICTIM" ? `/victim/complaints/${caseId}` : `/investigator/cases/${caseId}`); };
  return <div className="trace-app">
    <aside className="trace-sidebar">
      <Link className="brand" to={nav[0].to}><span className="brand-mark"><Network size={20} /></span><span>TRACECHAIN<em>-IN</em><small>INTELLIGENCE PLATFORM</small></span></Link>
      <div className="nav-label">WORKSPACE</div>
      <nav>{nav.map(({ to, icon: Icon, label }) => <NavLink key={to} to={to} className={({ isActive }) => `side-link ${isActive || location.pathname.startsWith(to + "/") ? "active" : ""}`}><Icon size={18} />{label}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="secure-line"><ShieldCheck size={15} /> Role access: {session.role}</div><button className="side-link logout" onClick={signOut}><LogOut size={18} />Sign out</button></div>
    </aside>
    <div className="trace-main">
      <header className="topbar">
        <div className="mobile-brand">TRACECHAIN<em>-IN</em></div>
        <div className="topbar-actions">
          <button className={`icon-button ${searchOpen ? "selected" : ""}`} onClick={() => { setSearchOpen(open => !open); setNotificationOpen(false); }} aria-label="Search cases and wallets" aria-expanded={searchOpen}><Search size={18} /></button>
          <button className={`icon-button ${notificationOpen ? "selected" : ""}`} onClick={() => { setNotificationOpen(open => !open); setSearchOpen(false); setHasUnreadNotifications(false); }} aria-label="Notifications" aria-expanded={notificationOpen}><Bell size={18} />{hasUnreadNotifications && <i />}</button>
          <div className="identity"><span>{session.name.split(" ").map(x => x[0]).join("")}</span><div><strong>{session.name}</strong><small>{session.role}</small></div></div>
        </div>
        {searchOpen && <div className="topbar-panel search-panel"><div className="topbar-panel-title"><Search size={16} /> Search cases and wallets</div><div className="topbar-search-input"><Search size={16} /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Case ID, wallet, fraud type or VASP" /></div><div className="topbar-results">{results.length ? results.map(item => <button key={item.id} onClick={() => openCase(item.id)}><div><strong>{item.id}</strong><small>{shortWallet(item.wallet)} - {item.fraudType}</small></div><span>{item.vasp}</span></button>) : <p>No matching case or wallet found.</p>}</div></div>}
        {notificationOpen && <div className="topbar-panel notification-panel"><div className="topbar-panel-title"><Bell size={16} /> Notifications <span>{notifications.length} updates</span></div><div className="notification-list">{notifications.map(notification => <button key={notification.title} onClick={() => openCase(notification.caseId)}><span className="notification-dot"/><div><strong>{notification.title}</strong><p>{notification.detail}</p><small>Open {notification.caseId}</small></div></button>)}</div></div>}
      </header>
      <main>{children}</main>
    </div>
  </div>;
}

export function PageHead({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) { return <div className="page-head"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p></div>{actions && <div className="page-actions">{actions}</div>}</div>; }
export function SectionCard({ title, children, action }: { title?: string; children: ReactNode; action?: ReactNode }) { return <section className="section-card">{title && <div className="section-title"><h2>{title}</h2>{action}</div>}{children}</section>; }
export function ActionButton({ children, onClick, secondary = false, to }: { children: ReactNode; onClick?: () => void; secondary?: boolean; to?: string }) { const cls = `action-button ${secondary ? "secondary" : ""}`; return to ? <Link className={cls} to={to}>{children}<ChevronRight size={16} /></Link> : <button className={cls} onClick={onClick}>{children}<ChevronRight size={16} /></button>; }
