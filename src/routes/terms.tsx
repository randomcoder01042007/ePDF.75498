import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — PDFyi" },
      { name: "description", content: "Terms of use for the PDFyi student PDF toolkit." },
      { property: "og:title", content: "Terms — PDFyi" },
      { property: "og:description", content: "Terms of use for the PDFyi student PDF toolkit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <SiteShell>
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Terms</h1>
        <div className="mt-6 space-y-4 text-muted-foreground">
          <p>PDFyi is free to use for personal and academic work. Only process documents you have the right to use.</p>
          <p>Tools are provided as-is. Always check your finished file before submitting it anywhere.</p>
          <p>Tools marked "Coming Soon" are not available yet.</p>
        </div>
      </main>
    </SiteShell>
  ),
});
