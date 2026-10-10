import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";
import { CyberBackground } from "@/components/CyberBackground";
import { ThemeToggle } from "@/components/ThemeToggle";

type AuthLayoutProps = {
  title: string;
  description: string;
  alternateLabel: string;
  alternateHref: string;
  alternateAction: string;
  children: ReactNode;
};

export function AuthLayout({
  title,
  description,
  alternateLabel,
  alternateHref,
  alternateAction,
  children,
}: AuthLayoutProps) {
  return (
    <div className="auth-console-shell relative min-h-screen overflow-hidden bg-[#010811]">
      <CyberBackground variant="auth" />

      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="auth-panel-frame relative w-full max-w-[33rem] rounded-[2.2rem] p-[2px]"
        >
          <div className="auth-panel glass-panel relative overflow-hidden rounded-[2.1rem] border border-cyan-300/30 px-7 py-8 text-center shadow-[0_0_70px_rgba(34,211,238,0.25)] sm:px-10">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
            <div className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />

            <Link to="/login" className="mb-6 flex flex-col items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.7rem] border border-cyan-300/45 bg-cyan-300/10 text-cyan-200 shadow-[0_0_45px_rgba(34,211,238,0.28)]">
                <Shield className="h-10 w-10" />
              </div>
              <div>
                <p className="font-mono text-[2rem] font-bold tracking-[0.08em] text-white sm:text-[2.35rem]">
                  SENTINEL AI PRO
                </p>
                <p className="mt-1 text-base text-cyan-100/85 sm:text-lg">Cyber Threat Monitoring</p>
              </div>
            </Link>

            <div className="mb-6 space-y-4">
              <div className="auth-chip mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] text-cyan-100">
                <Sparkles className="h-3.5 w-3.5" />
                Secure Access
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
                <p className="mx-auto max-w-md text-sm leading-6 text-cyan-50/75">{description}</p>
              </div>
            </div>

            {children}

            <p className="mt-6 text-center text-sm text-cyan-50/72">
              {alternateLabel}{" "}
              <Link to={alternateHref} className="font-medium text-cyan-200 transition hover:text-white">
                {alternateAction}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
