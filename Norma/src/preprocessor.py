import pdfplumber
import json
from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

PDF_PATH = Path(os.getenv("PDF_PATH"))
OUTPUT_PATH = Path(os.getenv("OUTPUT_PATH"))

SECTIONS = [
    "1798.100. General Duties of Businesses that Collect Personal Information",
    "1798.105. Consumers’ Right to Delete Personal Information",
    "1798.106. Consumers’ Right to Correct Inaccurate Personal Information",
    "1798.110. Consumers’ Right to Know What Personal Information is Being Collected. Right to Access Personal Information",
    "1798.115. Consumers’ Right to Know What Personal Information is Sold or Shared and to Whom",
    "1798.120. Consumers’ Right to Opt Out of Sale or Sharing of Personal Information",
    "1798.121. Consumers’ Right to Limit Use and Disclosure of Sensitive Personal Information",
    "1798.125. Consumers’ Right of No Retaliation Following Opt Out or Exercise of Other Rights",
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
    "1798.199.100. "
]

def extract_text_by_section():
    full_text = ""
    # Map character indices to page numbers
    char_to_page_map = []

    print("Reading PDF...")
    with pdfplumber.open(PDF_PATH) as pdf:
        # Ignore first 2 pages, start from page 3
        for i, page in enumerate(pdf.pages[2:]):
            current_page_num = i + 3
            
            page_text = page.extract_text()
            
            if page_text:
                page_text += "\n"
                full_text += page_text
                char_to_page_map.extend([current_page_num] * len(page_text))

    # Create a searchable version with spaces instead of newlines 
    # to catch multi-line headers
    searchable_text = full_text.replace('\n', ' ')
    
    processed_data = []
    
    print("Processing Sections...")
    for i, section_title in enumerate(SECTIONS):
        
        start_index = -1

        # --- HARDCODED FIX FOR 1798.199.95. ---
        if "1798.199.95." in section_title:
            # Look for the instance of this string that appears on Page 63
            cursor = 0
            while True:
                found_idx = searchable_text.find(section_title, cursor)
                if found_idx == -1:
                    break # Not found at all
                
                # Check the page number for this specific match
                if char_to_page_map[found_idx] == 63:
                    start_index = found_idx
                    break # Found the correct one on page 63
                
                # If not page 63, keep searching
                cursor = found_idx + 1
        else:
            # --- STANDARD LOGIC FOR ALL OTHER SECTIONS ---
            start_index = searchable_text.find(section_title)

        if start_index == -1:
            print(f"Warning: Section '{section_title}' not found in text.")
            continue

        # Determine the end index
        if i + 1 < len(SECTIONS):
            next_section_title = SECTIONS[i + 1]
            end_index = searchable_text.find(next_section_title)
            
            # Note: If the next section also has duplicates (like .95 did), 
            # this might pick the wrong one, but you mentioned only .95 was failing.
            # We simply find the first occurrence of the next section title.
            if end_index == -1:
                end_index = len(full_text)
        else:
            end_index = len(full_text)

        # Extract content from the ORIGINAL text (preserves formatting)
        section_content = full_text[start_index:end_index].strip()
        start_page = char_to_page_map[start_index]

        processed_data.append({
            "section": section_title,
            "text": section_content,
            "start_page": start_page
        })

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(processed_data, f, indent=4, ensure_ascii=False)

    print(f"Successfully processed {len(processed_data)} sections to {OUTPUT_PATH}")

if __name__ == "__main__":
    extract_text_by_section()