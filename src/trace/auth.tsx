import { createContext, useContext, useState, type ReactNode } from "react";
import { DEMO_USERS, type Role } from "./demo";

type Session = { email: string; name: string; role: Role };
type AuthContext = { session: Session | null; login: (email: string, password: string) => boolean; logout: () => void };
const Context = createContext<AuthContext | null>(null);
const key = "tracechain-in-session";

export function TraceAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; } });
  const login = (email: string, password: string) => {
    const user = DEMO_USERS.find((item) => item.email === email.trim().toLowerCase() && item.password === password);
    if (!user) return false;
    const next = { email: user.email, name: user.name, role: user.role }; localStorage.setItem(key, JSON.stringify(next)); setSession(next); return true;
  };
  const logout = () => { localStorage.removeItem(key); setSession(null); };
  return <Context.Provider value={{ session, login, logout }}>{children}</Context.Provider>;
}
export function useTraceAuth() { const context = useContext(Context); if (!context) throw new Error("Trace authentication is unavailable"); return context; }
