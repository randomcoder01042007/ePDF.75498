import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { CATEGORIES, TOOLS } from "@/lib/tools";

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "All PDF Tools — PDFyi" },
      { name: "description", content: "Convert, organize, optimize and inspect PDFs. Every PDFyi tool, grouped by category." },
      { property: "og:title", content: "All PDF Tools — PDFyi" },
      { property: "og:description", content: "Every PDFyi tool, grouped by category." },
    ],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-14">
        <span className="font-mono text-[11px] uppercase tracking-[.2em] text-primary"></span>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight md:text-5xl">Every tool, by category</h1>
        <div className="mt-10 space-y-10">
          {CATEGORIES.map((c) => (
            <section key={c} id={c.toLowerCase()} className="scroll-mt-24">
              <h2 className="mb-4 font-mono text-xs uppercase tracking-[.2em] text-violet">{c}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {TOOLS.filter((t) => t.category === c).map((t) => (
                  <div key={t.id} className="glass flex flex-col rounded-[22px] p-5">
                    <div className="flex items-center justify-between">
                      <span className="grid size-10 place-items-center rounded-lg bg-primary/15 font-mono text-[11px] text-primary">{t.glyph}</span>
                      {!t.available && <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">Unavailable</span>}
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold">{t.name}</h3>
                    <p className="mt-1 flex-1 text-sm text-muted-foreground">{t.short}</p>
                    <Link to="/tools/$toolId" params={{ toolId: t.id }} className="mt-4 self-start rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">Open Tool →</Link>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
