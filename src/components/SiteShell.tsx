import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed -right-40 -top-40 h-[600px] w-[600px] rounded-full glow-a opacity-40 blur-[100px]" />
      <div className="pointer-events-none fixed -bottom-52 -left-40 h-[560px] w-[560px] rounded-full glow-b opacity-40 blur-[110px]" />
      <nav className="glass sticky top-0 z-20 border-x-0 border-t-0">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
            <span className="grid size-7 place-items-center rounded-lg bg-primary font-mono text-[10px] font-medium text-primary-foreground">PDF</span>
            StudyPDF
          </Link>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link to="/tools" className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>Tools</Link>
            <Link to="/tools" className="rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/85">Get started</Link>
          </div>
        </div>
      </nav>
      <div className="relative z-10">{children}</div>
      <footer className="relative z-10 mx-auto flex max-w-6xl items-center justify-between border-t border-border px-5 py-10 text-sm text-muted-foreground">
        <span className="font-display font-bold text-foreground">StudyPDF</span>
        <span className="font-mono text-[11px]">Files never leave your device · Made for students</span>
      </footer>
    </div>
  );
}
