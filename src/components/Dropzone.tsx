import { useRef, useState } from "react";
import { MAX_MB } from "@/lib/tools";

export function Dropzone({ accept, multiple, onFiles, label = "Drag & drop files here" }: {
  accept: string; multiple: boolean; onFiles: (f: File[]) => void; label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [err, setErr] = useState("");
  const handle = (list: FileList | null) => {
    if (!list) return;
    const files = Array.from(list);
    const big = files.find((f) => f.size > MAX_MB * 1024 * 1024);
    if (big) return setErr(`${big.name} is larger than ${MAX_MB} MB.`);
    setErr("");
    onFiles(multiple ? files : files.slice(0, 1));
  };
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files); }}
      onClick={() => ref.current?.click()}
      className={`grid cursor-pointer place-items-center rounded-[20px] border-2 border-dashed px-6 py-10 text-center transition-colors ${over ? "border-primary bg-primary/5" : "border-border"}`}
    >
      <input ref={ref} type="file" hidden accept={accept} multiple={multiple} onChange={(e) => { handle(e.target.files); e.target.value = ""; }} />
      <div className="bob mb-4 grid size-14 place-items-center rounded-2xl border border-primary/30 bg-primary/15 font-mono text-2xl text-primary">↑</div>
      <p className="font-display text-xl font-bold">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">or <span className="text-primary underline underline-offset-4">browse from your device</span></p>
      {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
    </div>
  );
}
