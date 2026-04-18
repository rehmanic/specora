import PDFDocument from "pdfkit";
import { load as $ } from "cheerio";
import HtmlToDocx from "html-to-docx";

// ─── PDF ──────────────────────────────────────────────────────────────────────
// Converts a doc's HTML content to a PDF buffer using pdfkit + cheerio.

export async function generatePDF(doc) {
    return new Promise((resolve, reject) => {
        const pdf = new PDFDocument({ margin: 50, size: "A4" });
        const chunks = [];
        pdf.on("data", (c) => chunks.push(c));
        pdf.on("end", () => resolve(Buffer.concat(chunks)));
        pdf.on("error", reject);

        const typeLabel =
            doc.type === "srs"
                ? "Software Requirements Specification"
                : "Textual Use Case Specification";

        const formattedDate = doc.updated_at
            ? new Date(doc.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              })
            : "";

        // Document header
        pdf.fontSize(20).font("Helvetica-Bold").fillColor("#000").text(doc.title || "Untitled Document");
        pdf.fontSize(10).font("Helvetica").fillColor("#555555")
            .text(`${typeLabel}  ·  ${formattedDate}`);
        pdf.fillColor("#000000");
        pdf.moveDown(0.3);
        pdf.moveTo(50, pdf.y).lineTo(545, pdf.y).lineWidth(1.5).stroke();
        pdf.moveDown(0.6);

        // Parse and render HTML
        const dom = $(doc.content || "<p>This document has no content yet.</p>");

        const renderNode = (el) => {
            const tag = el.tagName?.toLowerCase();
            const text = dom(el).text().trim();

            switch (tag) {
                case "h1":
                    pdf.moveDown(0.4).fontSize(16).font("Helvetica-Bold").text(text || "");
                    pdf.moveDown(0.2);
                    break;
                case "h2":
                    pdf.moveDown(0.35).fontSize(13).font("Helvetica-Bold").text(text || "");
                    pdf.moveDown(0.15);
                    break;
                case "h3":
                    pdf.moveDown(0.25).fontSize(11).font("Helvetica-Bold").text(text || "");
                    break;
                case "p":
                    if (text) {
                        pdf.fontSize(11).font("Helvetica").text(text, { lineGap: 2 });
                        pdf.moveDown(0.2);
                    }
                    break;
                case "ul":
                case "ol": {
                    const items = dom(el).find("li");
                    items.each((i, li) => {
                        const liText = dom(li).text().trim();
                        if (liText) {
                            const bullet = tag === "ol" ? `${i + 1}.` : "•";
                            pdf.fontSize(11).font("Helvetica")
                                .text(`${bullet}  ${liText}`, { indent: 20, lineGap: 1 });
                        }
                    });
                    pdf.moveDown(0.2);
                    break;
                }
                case "table": {
                    const rows = dom(el).find("tr");
                    const colWidths = [160, 330];
                    const rowH = 22;
                    let startY = pdf.y;

                    // Ensure table fits on page or add page
                    if (startY + rows.length * rowH > pdf.page.height - 80) {
                        pdf.addPage();
                        startY = pdf.y;
                    }

                    rows.each((ri, row) => {
                        const cells = dom(row).find("th, td");
                        let startX = 50;
                        const y = startY + ri * rowH;

                        cells.each((ci, cell) => {
                            const isHeader = cell.tagName?.toLowerCase() === "th";
                            const cellText = dom(cell).text().trim();
                            const w = colWidths[ci] || 150;

                            // Fill header cells
                            if (isHeader) {
                                pdf.rect(startX, y, w, rowH).fill("#eeeeee");
                                pdf.fillColor("#000000");
                            }
                            // Border
                            pdf.rect(startX, y, w, rowH).stroke();

                            // Text
                            pdf.fontSize(9)
                                .font(isHeader ? "Helvetica-Bold" : "Helvetica")
                                .fillColor("#000000")
                                .text(cellText, startX + 4, y + 6, {
                                    width: w - 8,
                                    height: rowH - 4,
                                    ellipsis: true,
                                    lineBreak: false,
                                });

                            startX += w;
                        });
                    });

                    pdf.y = startY + rows.length * rowH + 8;
                    pdf.moveDown(0.3);
                    break;
                }
                case "hr":
                    pdf.moveDown(0.3).moveTo(50, pdf.y).lineTo(545, pdf.y)
                        .lineWidth(0.5).strokeColor("#aaaaaa").stroke()
                        .strokeColor("#000000").lineWidth(1);
                    pdf.moveDown(0.3);
                    break;
                default:
                    if (text) {
                        pdf.fontSize(11).font("Helvetica").text(text, { lineGap: 2 });
                        pdf.moveDown(0.1);
                    }
            }
        };

        dom("body").children().each((_, el) => renderNode(el));
        pdf.end();
    });
}

// ─── DOCX ─────────────────────────────────────────────────────────────────────
// Converts a doc's HTML content to a DOCX buffer using html-to-docx.

export async function generateDOCX(doc) {
    const typeLabel =
        doc.type === "srs"
            ? "Software Requirements Specification"
            : "Textual Use Case Specification";

    const formattedDate = doc.updated_at
        ? new Date(doc.updated_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "";

    const htmlContent = `
        <h1>${doc.title || "Untitled Document"}</h1>
        <p><em>${typeLabel} &nbsp;·&nbsp; ${formattedDate}</em></p>
        <hr/>
        ${doc.content || "<p>This document has no content yet.</p>"}
    `;

    const buffer = await HtmlToDocx(htmlContent, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
    });

    return buffer;
}
