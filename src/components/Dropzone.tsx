import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { MAX_MB } from "@/lib/tools";

export function Dropzone({ accept, multiple, onFiles, label = "Drag & drop files here", hint, large }: {
  accept: string; multiple: boolean; onFiles: (f: File[]) => void; label?: string; hint?: string; large?: boolean;
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
      className={`grid cursor-pointer place-items-center rounded-[20px] border-2 border-dashed px-6 ${large ? "py-14 md:py-20" : "py-10"} text-center transition-colors ${over ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-primary/5"}`}
    >
      <input ref={ref} type="file" hidden accept={accept} multiple={multiple} onChange={(e) => { handle(e.target.files); e.target.value = ""; }} />
      <div className="mb-4 grid size-16 place-items-center rounded-2xl bg-pdf-soft text-pdf"><UploadCloud className="size-8" strokeWidth={1.6} /></div>
      <p className="font-display text-xl font-bold">{label}</p>
      {large ? (<><p className="mt-1 text-muted-foreground">Drag & drop or choose a file from your device</p><span className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">Choose File</span>{hint && <p className="mt-4 text-xs text-muted-foreground">{hint}</p>}</>) : <p className="mt-1 text-sm text-muted-foreground">or <span className="text-primary underline underline-offset-4">browse from your device</span></p>}
      {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
    </div>
  );
}
