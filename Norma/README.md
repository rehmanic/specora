# Setting up virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install --upgrade pip
python.exe -m pip install --upgrade pip
pip install -r requirements.txt

python src/preprocessor.py
python src/ingest.py
streamlit run src/app.py

# App structure
Norma/
│
├── data/
│   ├── raw/
│   │   └── ccpa.pdf
│   └── processed/
│       └── chunks.json
│
├── src/
│   ├── app.py
│   ├── ingest.py
│   └── preprocessor.py
│
├── tests/
├── venv/
│
├── .env
├── .gitignore
├── README.md
├── requirements.txt
└── setup.py


# CCPA Doc structure
*Section* → `xxxx.xxx / xxxx.xxx.xx / xxxx.xxx.xxx`
*Subsection* → `(a, b, c…)`
*Clause* → `(1, 2, 3…)`
*Subclause* → `(A, B, C…)`
*Item* → `(i, ii, iii…)`

# Section headings as they appear in the doc
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