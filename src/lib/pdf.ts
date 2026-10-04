import { PDFDocument, degrees } from "pdf-lib";

export type Out = { name: string; blob: Blob };
const pdfBlob = (b: Uint8Array) => new Blob([b as BlobPart], { type: "application/pdf" });
const base = (n: string) => n.replace(/\.[^.]+$/, "");

async function pdfjs() {
  const lib = await import("pdfjs-dist");
  const worker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  lib.GlobalWorkerOptions.workerSrc = worker;
  return lib;
}

export async function openJs(file: File) {
  const lib = await pdfjs();
  return lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
}

export async function renderPage(doc: Awaited<ReturnType<typeof openJs>>, n: number, scale: number) {
  const page = await doc.getPage(n);
  const vp = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(vp.width);
  canvas.height = Math.ceil(vp.height);
  await page.render({ canvas, canvasContext: canvas.getContext("2d")!, viewport: vp }).promise;
  return { canvas, width: vp.width / scale, height: vp.height / scale };
}

const load = async (f: File) => PDFDocument.load(await f.arrayBuffer());

export async function pageCount(f: File) { return (await load(f)).getPageCount(); }

export async function merge(files: File[]): Promise<Out[]> {
  const out = await PDFDocument.create();
  for (const f of files) {
    const src = await load(f);
    (await out.copyPages(src, src.getPageIndices())).forEach((p) => out.addPage(p));
  }
  return [{ name: "merged.pdf", blob: pdfBlob(await out.save()) }];
}

export async function pick(file: File, indexes: number[], suffix: string): Promise<Out[]> {
  const src = await load(file);
  const out = await PDFDocument.create();
  (await out.copyPages(src, indexes)).forEach((p) => out.addPage(p));
  return [{ name: `${base(file.name)}-${suffix}.pdf`, blob: pdfBlob(await out.save()) }];
}

export async function split(file: File): Promise<Out[]> {
  const src = await load(file);
  const res: Out[] = [];
  for (const i of src.getPageIndices()) {
    const out = await PDFDocument.create();
    out.addPage((await out.copyPages(src, [i]))[0]);
    res.push({ name: `${base(file.name)}-page-${i + 1}.pdf`, blob: pdfBlob(await out.save()) });
  }
  return res;
}

export async function rotate(file: File, angles: number[]): Promise<Out[]> {
  const doc = await load(file);
  doc.getPages().forEach((p, i) => {
    if (angles[i]) p.setRotation(degrees((p.getRotation().angle + angles[i]) % 360));
  });
  return [{ name: `${base(file.name)}-rotated.pdf`, blob: pdfBlob(await doc.save()) }];
}

export async function imagesToPdf(files: File[]): Promise<Out[]> {
  const doc = await PDFDocument.create();
  for (const f of files) {
    const bytes = await f.arrayBuffer();
    const img = f.type === "image/png" ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    const page = doc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  return [{ name: "images.pdf", blob: pdfBlob(await doc.save()) }];
}

const toBlob = (c: HTMLCanvasElement, type: string, q?: number) =>
  new Promise<Blob>((r) => c.toBlob((b) => r(b!), type, q));

export async function pdfToImages(file: File): Promise<Out[]> {
  const doc = await openJs(file);
  const res: Out[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const { canvas } = await renderPage(doc, i, 2);
    res.push({ name: `${base(file.name)}-page-${i}.png`, blob: await toBlob(canvas, "image/png") });
  }
  return res;
}

export async function compress(file: File, level: "low" | "medium" | "high"): Promise<Out[]> {
  const cfg = ({ low: [1.6, 0.8], medium: [1.25, 0.6], high: [1, 0.4] } as const)[level];
  const doc = await openJs(file);
  const out = await PDFDocument.create();
  for (let i = 1; i <= doc.numPages; i++) {
    const { canvas, width, height } = await renderPage(doc, i, cfg[0]);
    const jpg = await out.embedJpg(await (await toBlob(canvas, "image/jpeg", cfg[1])).arrayBuffer());
    out.addPage([width, height]).drawImage(jpg, { x: 0, y: 0, width, height });
  }
  return [{ name: `${base(file.name)}-compressed.pdf`, blob: pdfBlob(await out.save()) }];
}

export async function pdfToWord(file: File): Promise<Out[]> {
  const { Document, Packer, Paragraph, TextRun, PageBreak } = await import("docx");
  const doc = await openJs(file);
  const children: InstanceType<typeof Paragraph>[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const content = await (await doc.getPage(i)).getTextContent();
    let line = "";
    let lastY: number | null = null;
    const lines: string[] = [];
    for (const it of content.items as { str: string; transform: number[]; hasEOL?: boolean }[]) {
      const y = it.transform[5] ?? 0;
      if (lastY !== null && Math.abs(y - lastY) > 2) { lines.push(line); line = ""; }
      line += it.str;
      lastY = y;
    }
    if (line) lines.push(line);
    lines.forEach((l) => children.push(new Paragraph({ children: [new TextRun(l)] })));
    if (i < doc.numPages) children.push(new Paragraph({ children: [new PageBreak()] }));
  }
  const blob = await Packer.toBlob(new Document({ sections: [{ children }] }));
  return [{ name: `${base(file.name)}.docx`, blob }];
}

export async function readMeta(file: File) {
  const d = await load(file);
  return { title: d.getTitle() ?? "", author: d.getAuthor() ?? "", subject: d.getSubject() ?? "", keywords: d.getKeywords() ?? "" };
}

export async function writeMeta(file: File, m: { title: string; author: string; subject: string; keywords: string }): Promise<Out[]> {
  const d = await load(file);
  d.setTitle(m.title); d.setAuthor(m.author); d.setSubject(m.subject);
  d.setKeywords(m.keywords.split(",").map((s) => s.trim()).filter(Boolean));
  d.setModificationDate(new Date());
  return [{ name: `${base(file.name)}-edited.pdf`, blob: pdfBlob(await d.save()) }];
}
