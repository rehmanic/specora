/**
 * Export a doc directly as a PDF download (no print dialog).
 * Uses jsPDF + html2canvas to render the HTML and produce a PDF blob.
 * Both packages are dynamically imported to avoid SSR issues.
 */
export async function exportAsPDF(doc) {
  // Dynamic import — safe for Next.js SSR, only loads in browser
  const [{ jsPDF }, html2canvasModule] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);
  const html2canvas = html2canvasModule.default;

  const typeLabel =
    doc.type === "srs"
      ? "Software Requirements Specification (SRS)"
      : "Textual Use Case Specification";

  const formattedDate = doc.updated_at
    ? new Date(doc.updated_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  // Build a styled render container (off-screen, fixed width = A4 at 96dpi)
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed;
    top: -99999px;
    left: -99999px;
    width: 794px;
    background: #ffffff;
    padding: 48px 56px;
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.65;
    color: #000000;
    box-sizing: border-box;
  `;

  container.innerHTML = `
    <style>
      * { box-sizing: border-box; }
      h1 { font-size: 20pt; margin: 0 0 4px; }
      h2 { font-size: 15pt; margin: 20px 0 6px; }
      h3 { font-size: 12pt; margin: 16px 0 4px; }
      p  { margin: 6px 0; }
      ul, ol { margin: 6px 0; padding-left: 22px; }
      li { margin: 3px 0; }
      table { border-collapse: collapse; width: 100%; margin: 14px 0; font-size: 11pt; }
      td, th { border: 1px solid #000; padding: 6px 10px; vertical-align: top; text-align: left; }
      th { background: #eeeeee; font-weight: bold; width: 38%; }
      hr { border: none; border-top: 1px solid #aaa; margin: 18px 0; }
      em { font-style: italic; }
      strong { font-weight: bold; }
      .doc-header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 22px; }
      .doc-meta { font-size: 10pt; color: #555; margin-top: 4px; }
    </style>
    <div class="doc-header">
      <h1>${doc.title || "Untitled Document"}</h1>
      <div class="doc-meta">${typeLabel} &nbsp;·&nbsp; ${formattedDate}</div>
    </div>
    ${doc.content || "<p><em>This document has no content yet.</em></p>"}
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pageWidth = pdf.internal.pageSize.getWidth();   // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    const imgWidthMM = pageWidth;
    const imgHeightMM = (canvas.height / canvas.width) * pageWidth;

    let remainingHeight = imgHeightMM;
    let yOffset = 0;

    while (remainingHeight > 0) {
      if (yOffset > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, -yOffset, imgWidthMM, imgHeightMM);
      yOffset += pageHeight;
      remainingHeight -= pageHeight;
    }

    const slug = (doc.title || "document").replace(/[^a-z0-9]+/gi, "_").toLowerCase();
    pdf.save(`${slug}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Download the doc as a .doc file using the Word-HTML format.
 * No external library needed — Word recognises the mso namespace markup
 * and renders it natively. Google Docs also imports .doc files correctly.
 */
export function exportAsWord(doc) {
  const typeLabel =
    doc.type === "srs"
      ? "Software Requirements Specification (SRS)"
      : "Textual Use Case Specification";

  const formattedDate = doc.updated_at
    ? new Date(doc.updated_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const wordHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${doc.title || "Document"}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.65;
      color: #000;
      margin: 1in;
    }
    h1 { font-size: 20pt; margin: 0 0 6pt; }
    h2 { font-size: 15pt; margin: 18pt 0 6pt; }
    h3 { font-size: 12pt; margin: 14pt 0 4pt; font-weight: bold; }
    p  { margin: 6pt 0; }
    ul, ol { margin: 6pt 0; padding-left: 20pt; }
    li { margin: 3pt 0; }
    table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
    td, th {
      border: 1pt solid #000;
      padding: 6pt 8pt;
      vertical-align: top;
      font-size: 11pt;
    }
    th { background: #eeeeee; font-weight: bold; width: 38%; }
    hr { border: none; border-top: 1pt solid #aaa; margin: 16pt 0; }
    .doc-header { border-bottom: 2pt solid #000; padding-bottom: 10pt; margin-bottom: 20pt; }
    .doc-meta { font-size: 10pt; color: #555; }
  </style>
</head>
<body>
  <div class="doc-header">
    <h1>${doc.title || "Untitled Document"}</h1>
    <div class="doc-meta">${typeLabel} &nbsp;·&nbsp; ${formattedDate}</div>
  </div>
  ${doc.content || "<p><em>This document has no content yet.</em></p>"}
</body>
</html>`;

  const slug = (doc.title || "document").replace(/[^a-z0-9]+/gi, "_").toLowerCase();
  const blob = new Blob(["\ufeff", wordHtml], {
    type: "application/msword",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
