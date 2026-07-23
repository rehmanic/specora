#!/usr/bin/env node

/**
 * preprocess.js — Extracts text sections from the CCPA PDF and outputs chunks.json.
 * Node.js port of norma/src/preprocessor.py
 * 
 * Usage:
 *   node scripts/preprocess.js
 *   node scripts/preprocess.js --pdf ./data/norma/raw/ccpa.pdf --output ./data/norma/processed/chunks.json
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import pdf from "pdf-parse/lib/pdf-parse.js";
import dotenv from "dotenv";

dotenv.config();

// -----------------------
// Config
// -----------------------
const args = process.argv.slice(2);
function getArg(name, fallback) {
    const idx = args.indexOf(name);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const PDF_PATH = resolve(getArg("--pdf", process.env.PDF_PATH || "./data/norma/raw/ccpa.pdf"));
const OUTPUT_PATH = resolve(getArg("--output", process.env.OUTPUT_PATH || "./data/norma/processed/chunks.json"));

// -----------------------
// Section Headers (matching Python preprocessor exactly)
// -----------------------
const SECTIONS = [
    "1798.100. General Duties of Businesses that Collect Personal Information",
    "1798.105. Consumers' Right to Delete Personal Information",
    "1798.106. Consumers' Right to Correct Inaccurate Personal Information",
    "1798.110. Consumers' Right to Know What Personal Information is Being Collected. Right to Access Personal Information",
    "1798.115. Consumers' Right to Know What Personal Information is Sold or Shared and to Whom",
    "1798.120. Consumers' Right to Opt Out of Sale or Sharing of Personal Information",
    "1798.121. Consumers' Right to Limit Use and Disclosure of Sensitive Personal Information",
    "1798.125. Consumers' Right of No Retaliation Following Opt Out or Exercise of Other Rights",
    "1798.130. Notice, Disclosure, Correction, and Deletion Requirements",
    "1798.135. Methods of Limiting Sale, Sharing, and Use of Personal Information and Use of Sensitive Personal Information",
    "1798.140. Definitions",
    "1798.145. Exemptions",
    "1798.146.",
    "1798.148.",
    "1798.150. Personal Information Security Breaches",
    "1798.155. Administrative Enforcement",
    "1798.160. Consumer Privacy Fund",
    "1798.175. Conflicting Provisions",
    "1798.180. Preemption",
    "1798.185. Regulations",
    "1798.190. Anti-Avoidance",
    "1798.192. Waiver",
    "1798.194. ",
    "1798.196. ",
    "1798.198.",
    "1798.199. ",
    "1798.199.10.",
    "1798.199.15. ",
    "1798.199.20. ",
    "1798.199.25. ",
    "1798.199.30. ",
    "1798.199.35. ",
    "1798.199.40. ",
    "1798.199.45.",
    "1798.199.50. ",
    "1798.199.55.",
    "1798.199.60. ",
    "1798.199.65. ",
    "1798.199.70. ",
    "1798.199.75.",
    "1798.199.80.",
    "1798.199.85. ",
    "1798.199.90.",
    "1798.199.95. ",
    "1798.199.100. ",
];

// -----------------------
// Main
// -----------------------
async function main() {
    console.log("Reading PDF:", PDF_PATH);
    const pdfBuffer = readFileSync(PDF_PATH);

    // pdf-parse extracts all text; we need per-page info for page mapping
    const data = await pdf(pdfBuffer, {
        // Custom page renderer to get per-page text
        pagerender: function (pageData) {
            return pageData.getTextContent().then(function (textContent) {
                return textContent.items.map((item) => item.str).join(" ");
            });
        },
    });

    // Reconstruct per-page text for page mapping
    // Re-parse to get individual page texts
    const pageTexts = [];
    await pdf(pdfBuffer, {
        pagerender: function (pageData) {
            return pageData.getTextContent().then(function (textContent) {
                const text = textContent.items.map((item) => item.str).join(" ");
                pageTexts.push(text);
                return text;
            });
        },
    });

    // Build full text from pages 3+ (skip first 2 pages, matching Python)
    let fullText = "";
    const charToPageMap = [];

    for (let i = 2; i < pageTexts.length; i++) {
        const currentPageNum = i + 1; // 1-indexed
        const pageText = pageTexts[i] + "\n";
        fullText += pageText;
        for (let j = 0; j < pageText.length; j++) {
            charToPageMap.push(currentPageNum);
        }
    }

    // Create searchable version (spaces instead of newlines)
    const searchableText = fullText.replace(/\n/g, " ");

    const processedData = [];
    console.log("Processing Sections...");

    for (let i = 0; i < SECTIONS.length; i++) {
        const sectionTitle = SECTIONS[i];
        let startIndex = -1;

        // Hardcoded fix for 1798.199.95. (matching Python behavior)
        if (sectionTitle.includes("1798.199.95.")) {
            let cursor = 0;
            while (true) {
                const foundIdx = searchableText.indexOf(sectionTitle, cursor);
                if (foundIdx === -1) break;
                if (charToPageMap[foundIdx] === 63) {
                    startIndex = foundIdx;
                    break;
                }
                cursor = foundIdx + 1;
            }
        } else {
            startIndex = searchableText.indexOf(sectionTitle);
        }

        if (startIndex === -1) {
            console.log(`Warning: Section '${sectionTitle}' not found in text.`);
            continue;
        }

        // Determine end index
        let endIndex;
        if (i + 1 < SECTIONS.length) {
            const nextSectionTitle = SECTIONS[i + 1];
            endIndex = searchableText.indexOf(nextSectionTitle);
            if (endIndex === -1) endIndex = fullText.length;
        } else {
            endIndex = fullText.length;
        }

        // Extract content from original text
        const sectionContent = fullText.slice(startIndex, endIndex).trim();
        const startPage = charToPageMap[startIndex];

        processedData.push({
            section: sectionTitle,
            text: sectionContent,
            start_page: startPage,
        });
    }

    // Write output
    mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
    writeFileSync(OUTPUT_PATH, JSON.stringify(processedData, null, 4), "utf-8");
    console.log(`Successfully processed ${processedData.length} sections to ${OUTPUT_PATH}`);
}

main().catch((err) => {
    console.error("Preprocessing failed:", err);
    process.exit(1);
});
