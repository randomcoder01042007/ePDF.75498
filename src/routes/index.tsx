import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight, BookOpen, ClipboardCheck, FolderKanban, GraduationCap, Laptop, MonitorSmartphone, Sparkles,
  ShieldCheck, Upload, Wand2, Wrench, Zap, Download, MousePointerClick, FileCheck2,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Dropzone } from "@/components/Dropzone";
import { AllTools, Soon } from "@/components/AllTools";
import { ToolIcon } from "@/components/ToolIcon";
import { COMING_SOON, MAX_MB, getTool, setPending, type ToolId } from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PDFyi — Your simple PDF workspace for students" },
      { name: "description", content: "Compress, convert, merge, split and manage your study documents quickly and easily, right in your browser." },
      { property: "og:title", content: "PDFyi — Your simple PDF workspace for students" },
      { property: "og:description", content: "Compress, convert, merge, split and manage your study documents quickly and easily." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

const POPULAR: { id?: ToolId; name: string; short: string }[] = [
  { id: "word-to-pdf", name: "Word to PDF", short: "Turn .docx files into PDFs." },
  { id: "compress", name: "Compress PDF", short: "Shrink heavy scans for upload." },
  { id: "merge", name: "Merge PDF", short: "Combine several PDFs into one." },
  { id: "split", name: "Split PDF", short: "Break a PDF into single pages." },
  { id: "images-to-pdf", name: "JPG to PDF", short: "Bundle photos into one PDF." },
  { id: "pdf-to-word", name: "PDF to Word", short: "Extract text into editable .docx." },
  { id: "pdf-to-images", name: "PDF to Images", short: "Export every page as an image." },
  { id: "rotate", name: "Rotate PDF", short: "Turn sideways pages upright." },
  { id: "reorder", name: "Reorder PDF", short: "Change the order of pages." },
  { id: "extract", name: "Extract Pages", short: "Pull chosen pages into a new PDF." },
  { name: "Edit PDF", short: "Change text and layout on a page." },
  { name: "Sign PDF", short: "Draw or type your signature." },
];

const Eyebrow = ({ children }: { children: string }) => (
  <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">{children}</p>
);
const SectionHead = ({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) => (
  <div className="mb-8 max-w-2xl">
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
    <p className="mt-2 text-muted-foreground">{sub}</p>
  </div>
);

function Mockup() {
  return (
    <div className="glass relative rounded-3xl p-4" aria-hidden>
      <div className="mb-4 flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-pdf/70" /><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" />
        <span className="ml-3 rounded-md bg-surface px-3 py-1 text-[11px] text-muted-foreground">lecture-notes.pdf · 12 pages</span>
      </div>
      <div className="grid grid-cols-[1fr_140px] gap-4">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className={`rounded-lg border bg-card p-2 ${n === 2 ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
              <div className="mb-1.5 h-1.5 w-2/3 rounded bg-foreground/15" />
              {[0, 1, 2, 3, 4].map((l) => <div key={l} className="mb-1 h-1 rounded bg-foreground/8" style={{ width: `${90 - l * 9}%` }} />)}
              <div className="mt-2 h-6 rounded bg-surface" />
              <p className="mt-1.5 text-center text-[9px] text-muted-foreground">{n}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {(["compress", "merge", "pdf-to-word", "rotate"] as ToolId[]).map((id) => (
            <div key={id} className="flex items-center gap-2 rounded-xl border border-border bg-card p-2">
              <span className="scale-75"><ToolIcon id={id} /></span>
              <span className="text-[11px] font-semibold leading-tight">{getTool(id)!.name}</span>
            </div>
          ))}
          <div className="mt-auto rounded-xl bg-primary/10 p-2.5">
            <p className="text-[10px] font-semibold text-primary">Compressed</p>
            <p className="text-sm font-bold">8.4 MB → 1.9 MB</p>
            <div className="mt-1.5 h-1.5 rounded-full bg-primary/20"><div className="h-full w-4/5 rounded-full bg-primary" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-12 pt-14 md:pt-20 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Eyebrow>PDFyi · PDF toolkit for students</Eyebrow>
          <h1 className="mt-4 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[3.4rem] xl:text-[3.75rem]">
            Everything you need <br className="hidden sm:block" />to <span className="text-primary">work with PDFs.</span>
          </h1>
          <p className="mt-5 max-w-[48ch] text-lg text-muted-foreground">
            Compress, convert, merge, split and manage your study documents quickly and easily.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#upload" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              <Upload className="size-4" /> Upload PDF
            </a>
            <Link to="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 font-semibold transition-colors hover:border-primary/50">
              Explore All Tools <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">Built by a Malviyan, for students.</p>
        </div>
        <Mockup />
      </section>

      {/* Upload */}
      <section id="upload" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-8">
        <div className="glass rounded-3xl p-3 md:p-4">
          <Dropzone large accept="application/pdf,image/jpeg,image/png" multiple onFiles={onFiles}
            label="Drop your PDF here" hint={`PDF, JPG, PNG · Max ${MAX_MB} MB`} />
        </div>
        <p className="mt-3 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" /> Files are processed in your browser and never uploaded to a server.
        </p>
      </section>

      <main className="mx-auto max-w-6xl space-y-24 px-5 py-16">
        {/* Popular */}
        <section>
          <SectionHead eyebrow="Popular" title="Popular PDF Tools" sub="The tools students use most." />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR.map((p) => p.id ? (
              <Link key={p.name} to="/tools/$toolId" params={{ toolId: p.id }} className="glass card-hover flex flex-col gap-3 rounded-2xl p-5">
                <div className="flex items-center justify-between"><ToolIcon id={p.id} />{!getTool(p.id)!.available && <Soon />}</div>
                <div><p className="font-semibold">{p.name}</p><p className="mt-0.5 text-sm text-muted-foreground">{p.short}</p></div>
              </Link>
            ) : (
              <div key={p.name} aria-disabled className="flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-surface/50 p-5">
                <div className="flex items-center justify-between"><ToolIcon name={p.name} muted /><Soon /></div>
                <div><p className="font-semibold text-muted-foreground">{p.name}</p><p className="mt-0.5 text-sm text-muted-foreground">{p.short}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* All tools */}
        <section id="tools" className="scroll-mt-24">
          <SectionHead eyebrow="Toolkit" title="All PDF Tools" sub="Grouped so you always know where a task lives." />
          <AllTools />
        </section>

        {/* Student life */}
        <section id="about" className="scroll-mt-24">
          <SectionHead eyebrow="For students" title="Built for student life" sub="PDFyi makes everyday academic document work faster and simpler." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: BookOpen, t: "Study Materials", d: "Compress and organize lecture notes and study PDFs." },
              { i: ClipboardCheck, t: "Assignments", d: "Convert assignments and documents into submission-ready PDFs." },
              { i: FolderKanban, t: "Projects & Reports", d: "Merge multiple documents and organize project reports easily." },
              { i: GraduationCap, t: "College Applications", d: "Convert, organize and prepare important documents quickly." },
            ].map(({ i: I, t, d }) => (
              <div key={t} className="glass rounded-2xl p-6">
                <I className="size-6 text-pdf" strokeWidth={1.8} />
                <h3 className="mt-4 font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why */}
        <section id="features" className="scroll-mt-24">
          <SectionHead eyebrow="Features" title="Why students choose PDFyi" sub="Simple tools that do what they say." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { i: Zap, t: "Fast PDF processing", d: "Get your documents ready quickly — no upload wait." },
              { i: ShieldCheck, t: "Privacy-focused", d: "Files are processed on your device, not on our servers." },
              { i: GraduationCap, t: "Made for students", d: "Designed around everyday academic needs." },
              { i: MonitorSmartphone, t: "Works everywhere", d: "Use PDFyi on desktop, tablet or mobile." },
              { i: Wand2, t: "Simple interface", d: "No complicated PDF software." },
              { i: Wrench, t: "Everything in one place", d: "Access your essential PDF tools from one workspace." },
            ].map(({ i: I, t, d }) => (
              <div key={t} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><I className="size-5" /></span>
                <div><h3 className="font-semibold">{t}</h3><p className="mt-0.5 text-sm text-muted-foreground">{d}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section>
          <SectionHead eyebrow="How it works" title="Get your PDF ready in three steps" sub="Upload, pick a tool, download. That's it." />
          <ol className="grid gap-4 md:grid-cols-3">
            {[
              { n: "01", i: Upload, t: "Upload", d: "Choose your document." },
              { n: "02", i: MousePointerClick, t: "Choose a tool", d: "Compress, convert, merge or organize." },
              { n: "03", i: Download, t: "Download", d: "Get your finished document." },
            ].map(({ n, i: I, t, d }) => (
              <li key={n} className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-extrabold text-primary/30">{n}</span>
                  <I className="size-5 text-primary" />
                </div>
                <h3 className="mt-3 font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* AI */}
        <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="max-w-md">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-semibold text-primary"><Sparkles className="size-3.5" /> AI · Coming Soon</span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight">Your PDFs, made smarter.</h2>
              <p className="mt-2 text-muted-foreground">Turn long documents into useful summaries, notes and answers with AI.</p>
            </div>
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              {COMING_SOON.AI.map((a) => (
                <div key={a.name} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                  <ToolIcon name={a.name} />
                  <div className="min-w-0 flex-1"><p className="font-semibold">{a.name}</p><Soon /></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="grid items-center gap-6 rounded-3xl border border-border bg-card p-6 md:grid-cols-[auto_1fr] md:p-10">
          <span className="grid size-14 place-items-center rounded-2xl bg-pdf-soft text-pdf"><FileCheck2 className="size-7" /></span>
          <div>
            <h2 className="font-display text-2xl font-bold">Your documents deserve privacy.</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Every available tool runs inside your browser. Your files are read on your own device and are never sent to our servers — so there's nothing of yours for us to store. <Link to="/privacy" className="font-semibold text-primary hover:underline">Read more</Link>
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground"><Laptop className="size-4" /> No account needed.</p>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
