import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { AllTools } from "@/components/AllTools";

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "All PDF Tools — PDFyi" },
      { name: "description", content: "Convert, organize, optimize and edit PDFs. Every PDFyi tool, grouped by category." },
      { property: "og:title", content: "All PDF Tools — PDFyi" },
      { property: "og:description", content: "Every PDFyi tool, grouped by category." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <SiteShell>
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-14">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">All PDF tools</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight md:text-5xl">Every tool, by category</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">Pick a tool, add your file, download the result.</p>
        <div className="mt-10"><AllTools /></div>
      </main>
    </SiteShell>
  );
}
