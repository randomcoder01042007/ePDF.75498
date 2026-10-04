import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — PDFyi" },
      { name: "description", content: "How PDFyi handles your documents: processed in your browser, never uploaded." },
      { property: "og:title", content: "Privacy — PDFyi" },
      { property: "og:description", content: "PDFyi processes your files in your browser. They are never uploaded." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <SiteShell>
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Privacy</h1>
        <div className="mt-6 space-y-4 text-muted-foreground">
          <p>Every PDFyi tool runs inside your web browser. The files you choose are read and processed on your own device and are never sent to our servers.</p>
          <p>Your processed files exist only in your browser until you download them or close the tab. We don't keep copies, because we never receive them.</p>
          <p>We don't require an account to use any tool.</p>
        </div>
      </main>
    </SiteShell>
  ),
});
