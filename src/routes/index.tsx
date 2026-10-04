import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Dropzone } from "@/components/Dropzone";
import { CATEGORIES, MAX_MB, POPULAR, getTool, setPending } from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudyPDF — Everything you need to work with PDFs" },
      { name: "description", content: "Compress, convert, merge, split and manage your study documents — quickly and easily, right in your browser." },
      { property: "og:title", content: "StudyPDF — PDF toolkit for students" },
      { property: "og:description", content: "Compress, convert, merge, split and manage your study documents — quickly and easily." },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const onFiles = (files: File[]) => {
    setPending(files);
    const isImg = files.every((f) => f.type.startsWith("image/"));
    const toolId = isImg ? "images-to-pdf" : files.length > 1 ? "merge" : "preview";
    navigate({ to: "/tools/$toolId", params: { toolId } });
  };
  return (
    <SiteShell>
      <header className="mx-auto max-w-6xl px-5 pb-10 pt-16">
        <div className="max-w-3xl">
          <span className="rise mb-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.2em] text-primary">
            <span className="size-1.5 rounded-full bg-primary" />StudyPDF · PDF toolkit for students
          </span>
          <h1 className="text-balance font-display text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
            Everything you need to <span className="draw text-primary">work with PDFs.</span>
          </h1>
          <p className="rise mt-6 max-w-[52ch] text-pretty text-lg text-muted-foreground">
            Compress, convert, merge, split and manage your study documents — quickly and easily.
          </p>
          <div className="rise mt-8 flex flex-wrap items-center gap-3">
            <a href="#upload" className="rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/85">Start Using PDF Tools</a>
            <Link to="/tools" className="glass rounded-full px-6 py-3.5 font-semibold transition-colors hover:bg-secondary">Explore Tools</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div id="upload" className="glass flex flex-col justify-between rounded-[26px] p-7 lg:col-span-2 lg:row-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[.2em] text-muted-foreground">Upload</span>
              <span className="font-mono text-[11px] text-muted-foreground">PDF · JPG · PNG · max {MAX_MB} MB</span>
            </div>
            <div className="my-6 flex-1">
              <Dropzone accept="application/pdf,image/jpeg,image/png" multiple onFiles={onFiles} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {["PDF", "JPG", "PNG"].map((t) => (
                <span key={t} className="rounded-full border border-border bg-secondary px-2.5 py-1 font-mono text-[10px] text-muted-foreground">{t}</span>
              ))}
              <span className="ml-auto text-xs text-muted-foreground">Processed on your device — nothing is uploaded.</span>
            </div>
          </div>

          <div className="glass flex flex-col rounded-[26px] p-6">
            <span className="font-mono text-[11px] uppercase tracking-[.2em] text-violet">Popular</span>
            <h2 className="mt-2 font-display text-2xl font-bold">Start with a tool</h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">The six students reach for most.</p>
            <div className="grid grid-cols-2 gap-3">
              {POPULAR.map((id) => {
                const t = getTool(id)!;
                return (
                  <Link key={id} to="/tools/$toolId" params={{ toolId: id }} className="flex items-center gap-3 rounded-2xl border border-border bg-secondary p-3 transition-colors hover:border-primary/40">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 font-mono text-[10px] text-primary">{t.glyph}</span>
                    <span className="text-sm font-semibold leading-tight">{t.name}</span>
                  </Link>
                );
              })}
            </div>
            <Link to="/tools" className="mt-4 self-start text-sm font-semibold text-primary underline-offset-4 hover:underline">Open a tool →</Link>
          </div>

          <div className="glass flex flex-col justify-between gap-6 rounded-[26px] p-7 md:flex-row md:items-center lg:col-span-3">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[.2em] text-primary">/tools</span>
              <h2 className="mt-2 font-display text-2xl font-bold">Browse every tool by category</h2>
              <p className="mt-1 max-w-[46ch] text-sm text-muted-foreground">Find the right one fast — grouped so you always know where a task lives.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Link key={c} to="/tools" hash={c.toLowerCase()} className="rounded-full border border-border bg-secondary px-3.5 py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">{c}</Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
