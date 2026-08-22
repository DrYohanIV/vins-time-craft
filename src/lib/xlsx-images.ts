import { unzipSync } from "fflate";

export type EmbeddedImage = { rowIndex: number; blob: Blob; ext: string };

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
};

/**
 * Pulls images embedded in the first worksheet of an .xlsx file and maps them
 * to the zero-based data row they are anchored to (assuming a single header row).
 */
export function extractSheetImages(buffer: ArrayBuffer): Map<number, EmbeddedImage> {
  const result = new Map<number, EmbeddedImage>();
  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(new Uint8Array(buffer));
  } catch {
    return result;
  }

  const parser = new DOMParser();
  const text = (name: string) => {
    const f = files[name];
    return f ? new TextDecoder().decode(f) : null;
  };

  const drawingNames = Object.keys(files).filter((n) => /^xl\/drawings\/drawing\d+\.xml$/.test(n));

  for (const drawingName of drawingNames) {
    const xml = text(drawingName);
    if (!xml) continue;
    const relsXml = text(drawingName.replace("drawings/", "drawings/_rels/") + ".rels");
    const rels: Record<string, string> = {};
    if (relsXml) {
      const relDoc = parser.parseFromString(relsXml, "application/xml");
      for (const rel of Array.from(relDoc.getElementsByTagName("Relationship"))) {
        const target = rel.getAttribute("Target") ?? "";
        rels[rel.getAttribute("Id") ?? ""] = "xl/" + target.replace(/^\.\.\//, "");
      }
    }

    const doc = parser.parseFromString(xml, "application/xml");
    const anchors = [
      ...Array.from(doc.getElementsByTagName("xdr:oneCellAnchor")),
      ...Array.from(doc.getElementsByTagName("xdr:twoCellAnchor")),
      ...Array.from(doc.getElementsByTagName("xdr:absoluteAnchor")),
    ];

    for (const anchor of anchors) {
      const rowEl = anchor.getElementsByTagName("xdr:row")[0];
      if (!rowEl) continue;
      const anchorRow = Number(rowEl.textContent ?? "");
      if (!Number.isFinite(anchorRow)) continue;
      const blip = anchor.getElementsByTagName("a:blip")[0];
      const embed =
        blip?.getAttribute("r:embed") ??
        blip?.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "embed");
      if (!embed) continue;
      const path = rels[embed];
      const data = path ? files[path] : undefined;
      if (!data) continue;

      const ext = (path!.split(".").pop() ?? "png").toLowerCase();
      const rowIndex = Math.max(0, anchorRow - 1); // skip header row
      if (result.has(rowIndex)) continue;
      result.set(rowIndex, {
        rowIndex,
        blob: new Blob([data.slice() as unknown as BlobPart], { type: MIME[ext] ?? "image/png" }),
        ext: ext === "jpeg" ? "jpg" : ext,
      });
    }
  }

  return result;
}
