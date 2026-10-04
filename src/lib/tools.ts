export type ToolId =
  | "word-to-pdf" | "pdf-to-word" | "images-to-pdf" | "pdf-to-images"
  | "merge" | "split" | "extract" | "delete" | "reorder" | "rotate"
  | "compress" | "protect" | "unlock" | "preview" | "metadata";

export type Category = "Convert" | "Organize" | "Optimize" | "Security" | "Other";

export interface Tool {
  id: ToolId;
  name: string;
  short: string;
  glyph: string;
  category: Category;
  accept: string;
  multiple: boolean;
  available: boolean;
  note?: string;
}

export const TOOLS: Tool[] = [
  { id: "word-to-pdf", name: "Word to PDF", short: "Turn .docx essays into PDFs.", glyph: "W→P", category: "Convert", accept: ".docx", multiple: false, available: false, note: "Faithful Word layout rendering needs a server-side office engine, which isn't available yet." },
  { id: "pdf-to-word", name: "PDF to Word", short: "Extract text into an editable .docx.", glyph: "P→W", category: "Convert", accept: "application/pdf", multiple: false, available: true, note: "Text and paragraphs are kept; images and complex layouts are not." },
  { id: "images-to-pdf", name: "Images to PDF", short: "Bundle JPG and PNG photos into a PDF.", glyph: "I→P", category: "Convert", accept: "image/jpeg,image/png", multiple: true, available: true },
  { id: "pdf-to-images", name: "PDF to Images", short: "Export every page as a PNG.", glyph: "P→I", category: "Convert", accept: "application/pdf", multiple: false, available: true },
  { id: "merge", name: "Merge PDF", short: "Combine several PDFs into one.", glyph: "⊕", category: "Organize", accept: "application/pdf", multiple: true, available: true },
  { id: "split", name: "Split PDF", short: "Break a PDF into single pages.", glyph: "⊘", category: "Organize", accept: "application/pdf", multiple: false, available: true },
  { id: "extract", name: "Extract Pages", short: "Pull chosen pages into a new PDF.", glyph: "⇱", category: "Organize", accept: "application/pdf", multiple: false, available: true },
  { id: "delete", name: "Delete Pages", short: "Remove pages you don't need.", glyph: "⌫", category: "Organize", accept: "application/pdf", multiple: false, available: true },
  { id: "reorder", name: "Reorder Pages", short: "Change the order of pages.", glyph: "⇅", category: "Organize", accept: "application/pdf", multiple: false, available: true },
  { id: "rotate", name: "Rotate Pages", short: "Turn sideways pages upright.", glyph: "↻", category: "Organize", accept: "application/pdf", multiple: false, available: true },
  { id: "compress", name: "Compress PDF", short: "Shrink heavy scans for upload.", glyph: "⇊", category: "Optimize", accept: "application/pdf", multiple: false, available: true, note: "Pages are re-rendered as images, so text becomes non-selectable. Best for scans." },
  { id: "protect", name: "Add Password", short: "Lock a PDF before sharing.", glyph: "⚿", category: "Security", accept: "application/pdf", multiple: false, available: false, note: "PDF encryption isn't supported yet." },
  { id: "unlock", name: "Remove Password", short: "Unlock a PDF you own.", glyph: "⚷", category: "Security", accept: "application/pdf", multiple: false, available: false, note: "PDF decryption isn't supported yet." },
  { id: "preview", name: "PDF Preview", short: "Flip through pages instantly.", glyph: "◉", category: "Other", accept: "application/pdf", multiple: false, available: true },
  { id: "metadata", name: "PDF Metadata", short: "Edit title, author and subject.", glyph: "ℹ", category: "Other", accept: "application/pdf", multiple: false, available: true },
];

export const CATEGORIES: Category[] = ["Convert", "Organize", "Optimize", "Security", "Other"];
export const POPULAR: ToolId[] = ["word-to-pdf", "compress", "merge", "split", "images-to-pdf", "pdf-to-word"];
export const MAX_MB = 50;
export const getTool = (id: string) => TOOLS.find((t) => t.id === id);

/** Parse "1-3, 5" into zero-based page indexes within [0,total). */
export function parseRanges(input: string, total: number): number[] {
  const out = new Set<number>();
  for (const part of input.split(",").map((s) => s.trim()).filter(Boolean)) {
    const m = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) throw new Error(`Invalid range "${part}"`);
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    if (a < 1 || b > total || a > b) throw new Error(`Range "${part}" is outside 1–${total}`);
    for (let i = a; i <= b; i++) out.add(i - 1);
  }
  return [...out].sort((x, y) => x - y);
}

// Files dropped on the homepage, handed to the tool page.
let pending: File[] = [];
export const setPending = (f: File[]) => { pending = f; };
export const takePending = () => { const f = pending; pending = []; return f; };

/** Tools shown in the UI but not built yet — always rendered as "Coming Soon", never linked. */
export const COMING_SOON = {
  Edit: [
    { name: "Edit PDF", short: "Change text and layout on a page." },
    { name: "Add Text", short: "Type notes onto any page." },
    { name: "Add Images", short: "Place pictures or stamps on pages." },
    { name: "Sign PDF", short: "Draw or type your signature." },
  ],
  AI: [
    { name: "Summarize PDF", short: "Get the gist of long readings." },
    { name: "Ask PDF", short: "Ask questions, get answers from the file." },
    { name: "Extract Key Points", short: "Pull out the important bits." },
    { name: "Generate Study Notes", short: "Turn chapters into revision notes." },
  ],
} as const;
