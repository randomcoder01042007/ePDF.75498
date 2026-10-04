import { Link } from "@tanstack/react-router";
import { Heart, Menu, Upload, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import logoAsset from "@/assets/pdfyi-logo.png.asset.json";

const NAV = [
  { label: "Tools", to: "/tools" as const },
  { label: "Features", to: "/" as const, hash: "features" },
  { label: "About", to: "/" as const, hash: "about" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <nav className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link to="/" className="flex shrink-0 items-center" aria-label="PDFyi home">
            <img src={logoAsset.url} alt="PDFyi" className="h-9 w-auto md:h-10" />
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <Link key={n.label} to={n.to} hash={n.hash} className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">{n.label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" hash="upload" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              <Upload className="size-4" /> <span>Upload PDF</span>
            </Link>
            <button onClick={() => setOpen(!open)} aria-label="Menu" className="grid size-10 place-items-center rounded-xl border border-border md:hidden">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-border bg-background px-5 py-3 md:hidden">
            {NAV.map((n) => (
              <Link key={n.label} to={n.to} hash={n.hash} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 font-medium hover:bg-surface">{n.label}</Link>
            ))}
          </div>
        )}
      </nav>
      <div>{children}</div>
      <footer className="border-t border-border bg-surface/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <img src={logoAsset.url} alt="PDFyi" className="h-9 w-auto" />
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">Your simple PDF workspace for students.</p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
              Made by Malviyan <Heart className="size-4 fill-pdf text-pdf" aria-hidden="true" /> with love
            </span>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
              {NAV.map((n) => <Link key={n.label} to={n.to} hash={n.hash} className="text-muted-foreground hover:text-foreground">{n.label}</Link>)}
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
            </div>
            <p className="text-sm text-muted-foreground">Built by a Malviyan, for students.</p>
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} PDFyi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
