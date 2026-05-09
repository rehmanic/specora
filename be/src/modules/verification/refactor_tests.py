import os
import re

tests_dir = "/home/rehman/s8/fyp/codebase/specora/tests"
files = [f for f in os.listdir(tests_dir) if f.endswith(".tex")]

for filename in files:
    filepath = os.path.join(tests_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract everything between \section and \end{document}
    # Or just find the first \section and keep everything until \end{document}
    
    match = re.search(r"(\\section\{.*\}[\s\S]*)\\end\{document\}", content)
    if match:
        new_content = match.group(1).strip()
        
        # Also remove \maketitle if it's there
        new_content = new_content.replace("\\maketitle", "").strip()
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Refactored {filename}")
    else:
        print(f"Could not refactor {filename} - Pattern not found")
