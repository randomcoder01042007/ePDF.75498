import {
  ArrowUpDown, FileDown, FileImage, FileOutput, FileText, Image, Info, Eye, Layers, Lock, Minimize2,
  PenLine, RotateCw, Scissors, Sparkles, Trash2, Type, Unlock, ImagePlus, Signature, MessageSquare, ListChecks, NotebookPen,
  type LucideIcon,
} from "lucide-react";
import type { ToolId } from "@/lib/tools";

const BY_ID: Record<ToolId, LucideIcon> = {
  "word-to-pdf": FileText, "pdf-to-word": FileOutput, "images-to-pdf": FileImage, "pdf-to-images": Image,
  merge: Layers, split: Scissors, extract: FileDown, delete: Trash2, reorder: ArrowUpDown, rotate: RotateCw,
  compress: Minimize2, protect: Lock, unlock: Unlock, preview: Eye, metadata: Info,
};
const BY_NAME: Record<string, LucideIcon> = {
  "Edit PDF": PenLine, "Add Text": Type, "Add Images": ImagePlus, "Sign PDF": Signature,
  "Summarize PDF": Sparkles, "Ask PDF": MessageSquare, "Extract Key Points": ListChecks, "Generate Study Notes": NotebookPen,
};
const PDF_RED: ToolId[] = ["word-to-pdf", "images-to-pdf", "compress", "merge"];

export function ToolIcon({ id, name, muted }: { id?: ToolId; name?: string; muted?: boolean }) {
  const Icon = (id && BY_ID[id]) || (name && BY_NAME[name]) || FileText;
  const red = id && PDF_RED.includes(id);
  const cls = muted ? "bg-muted text-muted-foreground" : red ? "bg-pdf-soft text-pdf" : "bg-primary/10 text-primary";
  return (
    <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${cls}`}>
      <Icon className="size-5" strokeWidth={1.8} />
    </span>
  );
}
