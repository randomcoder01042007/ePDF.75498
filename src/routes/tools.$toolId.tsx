import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { Dropzone } from "@/components/Dropzone";
import { getTool, parseRanges, takePending, type Tool } from "@/lib/tools";
import type { Out } from "@/lib/pdf";

export const Route = createFileRoute("/tools/$toolId")({
  loader: ({ params }) => {
    const tool = getTool(params.toolId);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Tool not found — StudyPDF" }, { name: "robots", content: "noindex" }] };
    const t = loaderData.tool;
    const title = `${t.name} — StudyPDF`;
    return {
      meta: [
        { title },
        { name: "description", content: `${t.short} Free, private and runs in your browser.` },
        { property: "og:title", content: title },
        { property: "og:description", content: t.short },
      ],
    };
  },
  component: ToolPage,
});

const PAGE_TOOLS = ["extract", "delete", "reorder", "rotate", "preview"];

function ToolPage() {
  const { tool } = Route.useLoaderData();
  return (
    <SiteShell>
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-12">
        <Link to="/tools" className="font-mono text-[11px] uppercase tracking-[.2em] text-muted-foreground hover:text-primary">← All tools · {tool.category}</Link>
        <div className="mt-4 flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-xl bg-primary/15 font-mono text-xs text-primary">{tool.glyph}</span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight">{tool.name}</h1>
        </div>
        <p className="mt-3 max-w-[60ch] text-muted-foreground">{tool.short}</p>
        {tool.note && <p className="mt-2 max-w-[70ch] text-sm text-violet">{tool.note}</p>}
        <div className="mt-8">{tool.available ? <Workspace key={tool.id} tool={tool} /> : <Unavailable />}</div>
      </main>
    </SiteShell>
  );
}

function Unavailable() {
  return (
    <div className="glass rounded-[26px] p-10 text-center">
      <p className="font-display text-xl font-bold">This tool isn't available yet</p>
      <p className="mt-2 text-sm text-muted-foreground">We'd rather tell you than fake it. Try another tool in the meantime.</p>
      <Link to="/tools" className="mt-6 inline-block rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground">Browse tools</Link>
    </div>
  );
}

function Workspace({ tool }: { tool: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [order, setOrder] = useState<number[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [angles, setAngles] = useState<number[]>([]);
  const [ranges, setRanges] = useState("");
  const [level, setLevel] = useState<"low" | "medium" | "high">("medium");
  const [meta, setMeta] = useState({ title: "", author: "", subject: "", keywords: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<Out[]>([]);

  useEffect(() => {
    const p = takePending().filter((f) => tool.accept.split(",").some((a) => a === f.type || f.name.endsWith(a)));
    if (p.length) addFiles(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => results.forEach((r) => URL.revokeObjectURL((r as Out & { url?: string }).url ?? "")), [results]);

  async function addFiles(f: File[]) {
    setResults([]); setError("");
    const next = tool.multiple ? [...files, ...f] : f;
    setFiles(next);
    const file = next[0];
    if (!file || file.type !== "application/pdf") return;
    try {
      if (tool.id === "metadata") setMeta(await (await import("@/lib/pdf")).readMeta(file));
      if (PAGE_TOOLS.includes(tool.id)) {
        setBusy(true);
        const { openJs, renderPage } = await import("@/lib/pdf");
        const doc = await openJs(file);
        const urls: string[] = [];
        for (let i = 1; i <= doc.numPages; i++) urls.push((await renderPage(doc, i, tool.id === "preview" ? 1.3 : 0.35)).canvas.toDataURL("image/jpeg", 0.8));
        setThumbs(urls);
        setOrder(urls.map((_, i) => i));
        setAngles(urls.map(() => 0));
        setSelected(new Set());
      }
    } catch {
      setError("This file couldn't be read. It may be damaged or password-protected.");
    } finally { setBusy(false); }
  }

  async function run() {
    setBusy(true); setError(""); setResults([]);
    try {
      const pdf = await import("@/lib/pdf");
      const f = files[0]!;
      const sel = [...selected].sort((a, b) => a - b);
      const fromRanges = () => (ranges.trim() ? parseRanges(ranges, thumbs.length) : sel);
      let out: Out[] = [];
      switch (tool.id) {
        case "merge": if (files.length < 2) throw new Error("Add at least two PDFs."); out = await pdf.merge(files); break;
        case "split": out = await pdf.split(f); break;
        case "extract": { const idx = fromRanges(); if (!idx.length) throw new Error("Select pages to extract."); out = await pdf.pick(f, idx, "extract"); break; }
        case "delete": { const idx = new Set(fromRanges()); if (!idx.size) throw new Error("Select pages to delete."); const keep = order.filter((i) => !idx.has(i)); if (!keep.length) throw new Error("You can't delete every page."); out = await pdf.pick(f, keep.sort((a, b) => a - b), "trimmed"); break; }
        case "reorder": out = await pdf.pick(f, order, "reordered"); break;
        case "rotate": out = await pdf.rotate(f, angles); break;
        case "images-to-pdf": out = await pdf.imagesToPdf(files); break;
        case "pdf-to-images": out = await pdf.pdfToImages(f); break;
        case "compress": out = await pdf.compress(f, level); break;
        case "pdf-to-word": out = await pdf.pdfToWord(f); break;
        case "metadata": out = await pdf.writeMeta(f, meta); break;
      }
      setResults(out.map((o) => Object.assign(o, { url: URL.createObjectURL(o.blob) })));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  const move = (pos: number, d: number) => {
    const n = [...order]; const t = pos + d;
    if (t < 0 || t >= n.length) return;
    const a = n[pos]!; n[pos] = n[t]!; n[t] = a; setOrder(n);
  };
  const toggle = (i: number) => { const s = new Set(selected); s.has(i) ? s.delete(i) : s.add(i); setSelected(s); };
  const kb = (b: number) => (b / 1024 > 1024 ? `${(b / 1048576).toFixed(2)} MB` : `${Math.round(b / 1024)} KB`);
  const totalIn = files.reduce((a, f) => a + f.size, 0);

  if (!files.length) return (
    <div className="glass rounded-[26px] p-7">
      <Dropzone accept={tool.accept} multiple={tool.multiple} onFiles={addFiles} label={tool.multiple ? "Drop your files here" : "Drop your file here"} />
    </div>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="glass rounded-[26px] p-6 lg:col-span-2">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[.2em] text-muted-foreground">{files.length} file{files.length > 1 ? "s" : ""} · {kb(totalIn)}</span>
          <button onClick={() => { setFiles([]); setThumbs([]); setResults([]); }} className="text-sm text-muted-foreground hover:text-destructive">Clear</button>
        </div>

        {(tool.multiple) && (
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-border bg-secondary px-3 py-2 text-sm">
                <span className="font-mono text-xs text-primary">{i + 1}</span>
                <span className="flex-1 truncate">{f.name}</span>
                <span className="font-mono text-[11px] text-muted-foreground">{kb(f.size)}</span>
                <button aria-label="Move up" onClick={() => i > 0 && setFiles(files.map((x, j) => (j === i - 1 ? files[i]! : j === i ? files[i - 1]! : x)))} className="px-1 text-muted-foreground hover:text-foreground">↑</button>
                <button aria-label="Remove" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="px-1 text-muted-foreground hover:text-destructive">✕</button>
              </li>
            ))}
            <li className="pt-2"><Dropzone accept={tool.accept} multiple onFiles={addFiles} label="Add more files" /></li>
          </ul>
        )}

        {!tool.multiple && !PAGE_TOOLS.includes(tool.id) && (
          <p className="rounded-xl border border-border bg-secondary px-4 py-3 text-sm">{files[0]!.name}</p>
        )}

        {busy && !thumbs.length && PAGE_TOOLS.includes(tool.id) && <p className="text-sm text-muted-foreground">Rendering pages…</p>}

        {tool.id === "preview" ? (
          <div className="max-h-[75vh] space-y-4 overflow-y-auto pr-1">
            {thumbs.map((src, i) => (
              <figure key={i}><img src={src} alt={`Page ${i + 1}`} className="w-full rounded-lg" /><figcaption className="mt-1 text-center font-mono text-[11px] text-muted-foreground">Page {i + 1} of {thumbs.length}</figcaption></figure>
            ))}
          </div>
        ) : PAGE_TOOLS.includes(tool.id) && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {order.map((pi, pos) => {
              const on = selected.has(pi);
              return (
                <div key={pi} className={`rounded-xl border p-2 transition-colors ${on ? (tool.id === "delete" ? "border-destructive" : "border-primary") : "border-border"}`}>
                  <button onClick={() => (tool.id === "extract" || tool.id === "delete") && toggle(pi)} className="block w-full">
                    <img src={thumbs[pi]} alt={`Page ${pi + 1}`} className={`mx-auto max-h-40 rounded transition-transform ${tool.id === "delete" && on ? "opacity-30" : ""}`} style={{ transform: `rotate(${angles[pi] ?? 0}deg)` }} />
                  </button>
                  <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                    <span>{pi + 1}</span>
                    {tool.id === "reorder" && <span className="flex gap-1"><button aria-label="Move left" onClick={() => move(pos, -1)} className="hover:text-primary">←</button><button aria-label="Move right" onClick={() => move(pos, 1)} className="hover:text-primary">→</button></span>}
                    {tool.id === "rotate" && <button aria-label="Rotate page" onClick={() => setAngles(angles.map((a, j) => (j === pi ? (a + 90) % 360 : a)))} className="hover:text-primary">↻ {angles[pi]}°</button>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <aside className="glass flex flex-col gap-4 rounded-[26px] p-6">
        <span className="font-mono text-[11px] uppercase tracking-[.2em] text-violet">Options</span>
        {(tool.id === "extract" || tool.id === "delete") && (
          <label className="text-sm">Click pages or type ranges
            <input value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="e.g. 1-3, 6" className="mt-2 w-full rounded-xl border border-input bg-secondary px-3 py-2 font-mono text-sm outline-none focus:border-primary" />
          </label>
        )}
        {tool.id === "rotate" && <button onClick={() => setAngles(angles.map((a) => (a + 90) % 360))} className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm hover:border-primary">Rotate all 90°</button>}
        {tool.id === "compress" && (
          <div className="grid gap-2">
            {(["low", "medium", "high"] as const).map((l) => (
              <button key={l} onClick={() => setLevel(l)} className={`rounded-xl border px-3 py-2 text-left text-sm capitalize ${level === l ? "border-primary text-primary" : "border-border"}`}>{l} compression</button>
            ))}
          </div>
        )}
        {tool.id === "metadata" && (["title", "author", "subject", "keywords"] as const).map((k) => (
          <label key={k} className="text-sm capitalize">{k}
            <input value={meta[k]} onChange={(e) => setMeta({ ...meta, [k]: e.target.value })} className="mt-1 w-full rounded-xl border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary" />
          </label>
        ))}
        {tool.id === "preview" ? (
          <p className="text-sm text-muted-foreground">{thumbs.length} pages · {kb(totalIn)}</p>
        ) : (
          <button disabled={busy} onClick={run} className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/85 disabled:opacity-50">
            {busy ? "Processing…" : `Run ${tool.name}`}
          </button>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results.length > 0 && (
          <div className="space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[.2em] text-primary">Ready · {kb(results.reduce((a, r) => a + r.blob.size, 0))}</span>
            <div className="max-h-72 space-y-2 overflow-y-auto">
              {results.map((r) => (
                <a key={r.name} href={(r as Out & { url: string }).url} download={r.name} className="flex items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm hover:bg-primary/20">
                  <span className="truncate">{r.name}</span><span className="text-primary">↓</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
