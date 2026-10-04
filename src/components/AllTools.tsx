import { Link } from "@tanstack/react-router";
import { COMING_SOON, TOOLS, type Category, type ToolId } from "@/lib/tools";
import { ToolIcon } from "@/components/ToolIcon";

const GROUPS: { title: string; ids?: ToolId[]; soon?: readonly { name: string; short: string }[] }[] = [
  { title: "Convert", ids: ["word-to-pdf", "pdf-to-word", "images-to-pdf", "pdf-to-images"] },
  { title: "Organize", ids: ["merge", "split", "rotate", "reorder", "extract", "delete"] },
  { title: "Optimize", ids: ["compress"] },
  { title: "Edit", ids: ["metadata"], soon: COMING_SOON.Edit },
  { title: "Security", ids: ["protect", "unlock"] },
  { title: "View", ids: ["preview"] },
  { title: "AI PDF Tools", soon: COMING_SOON.AI },
];

export const Soon = () => (
  <span className="rounded-full bg-pdf-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-pdf">Coming Soon</span>
);

export function AllTools() {
  return (
    <div className="space-y-10">
      {GROUPS.map((g) => (
        <section key={g.title} id={g.title.split(" ")[0].toLowerCase()} className="scroll-mt-24">
          <h3 className="mb-4 font-display text-lg font-bold">{g.title}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(g.ids ?? []).map((id) => {
              const t = TOOLS.find((x) => x.id === id)!;
              return (
                <Link key={id} to="/tools/$toolId" params={{ toolId: id }} className="glass card-hover flex items-start gap-3 rounded-2xl p-4">
                  <ToolIcon id={id} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{t.name}</span>
                      {!t.available && <Soon />}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{t.short}</p>
                  </div>
                </Link>
              );
            })}
            {(g.soon ?? []).map((s) => (
              <div key={s.name} aria-disabled className="flex items-start gap-3 rounded-2xl border border-dashed border-border bg-surface/50 p-4">
                <ToolIcon name={s.name} muted />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-muted-foreground">{s.name}</span>
                    <Soon />
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{s.short}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export type { Category };
