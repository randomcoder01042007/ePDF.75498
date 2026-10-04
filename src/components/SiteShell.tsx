import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed -right-40 -top-40 h-[600px] w-[600px] rounded-full glow-a opacity-40 blur-[100px]" />
      <div className="pointer-events-none fixed -bottom-52 -left-40 h-[560px] w-[560px] rounded-full glow-b opacity-40 blur-[110px]" />
      <nav className="glass sticky top-0 z-20 border-x-0 border-t-0">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
            ePDF
          </Link>
          <div className="flex items-center text-sm text-muted-foreground">
            <Link to="/tools" className="rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/85">Start Creating</Link>
          </div>
        </div>
      </nav>
      <div className="relative z-10">{children}</div>
      <footer className="relative z-10 mx-auto max-w-6xl px-5 pb-10 pt-12">
        <div className="flex flex-col gap-8 border-t border-border pt-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <span className="font-display text-lg font-extrabold tracking-tight text-foreground">ePDF</span>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A free, all-in-one PDF toolkit built for students. Compress, convert, merge, split, rotate and
              tidy up your notes, assignments and scanned pages right in your browser - no sign-up, no
              uploads, no watermark.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm text-foreground">
              Made by Malviyan
              <Heart className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
              <span className="text-muted-foreground">{"\n"}</span>
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              Files never leave your device · Made for students
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
