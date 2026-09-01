export const srsExpectationsPrompt = `Generate a complete Software Requirements Specification (SRS) document.
- Must include all standard SRS sections: 1. Introduction (1.1 Purpose, 1.2 Document Conventions, 1.3 Intended Audience, 1.4 Product Scope), 2. Overall Description (2.1 Product Perspective, 2.2 Product Functions, 2.3 User Classes), 3. Specific Requirements (3.1 External Interface Requirements, 3.2 Functional Requirements).
- Derive content directly from the provided project requirements.
- Be thorough, precise, and professional.`;

export const srsOutputPrompt = `Return ONLY valid HTML content (no markdown, no code fences). Use proper heading tags (h1, h2, h3), paragraphs (p), ordered/unordered lists (ol, ul, li), and tables where appropriate. The HTML will be rendered directly in a rich text editor. Do NOT include <!DOCTYPE>, <html>, <head>, or <body> tags — only the inner content.`;

export const useCaseExpectationsPrompt = `You are generating a Textual Use Case Specification. Your job is to intelligently select ONE specific use case scenario from the project requirements that has NOT yet been covered by the existing use case documents listed above.

Steps to follow:
1. Analyse all provided project requirements carefully.
2. Review the already-covered scenarios listed under "ALREADY COVERED USE CASE DOCS". Do NOT generate a use case that overlaps with any of those.
3. If the current document title hints at a specific scenario (e.g. "User Login", "UC-002"), use that as a guide. Otherwise pick the most important uncovered scenario.
4. Generate a complete Textual Use Case Specification for that chosen scenario, including: Use Case Name, Primary Actor, Secondary Actors, Goal in Context, Preconditions, Main Success Scenario (step-by-step numbered flow), Extensions/Alternate Flows, Postconditions, and Exceptions.
5. Use a structured HTML table format for the use case fields.`;

export const useCaseOutputPrompt = `Return ONLY valid HTML content (no markdown, no code fences). Use an HTML table with <table>, <tbody>, <tr>, <td>, <th> tags for the use case structure. Use <h1> for the title (the chosen use case name) and <hr> as a separator. The HTML will be rendered directly in a rich text editor. Do NOT include <!DOCTYPE>, <html>, <head>, or <body> tags — only the inner content.`;

export const buildUseCaseContentPrompt = (coveredScenariosText, allRequirementsLength, requirementsText) => `
ALREADY GENERATED USE CASES (DO NOT duplicate these):
${coveredScenariosText}

PROJECT REQUIREMENTS (${allRequirementsLength} total):
${requirementsText}
`;

export const buildSrsContentPrompt = (allRequirementsLength, requirementsText, docTitle) => `
PROJECT REQUIREMENTS (${allRequirementsLength} total):
${requirementsText}

DOCUMENT TITLE: ${docTitle}
`;

export const editDocumentContentPrompt = (docTitle, docType, editInstructions, currentContent) => `
DOCUMENT TITLE: ${docTitle}
DOCUMENT TYPE: ${docType}

EDIT INSTRUCTIONS FROM USER:
${editInstructions}

CURRENT DOCUMENT CONTENT (HTML):
${currentContent}
`;

export const editDocumentExpectationsPrompt = (docType, templateExpectations) => `Apply the user's edit instructions to the current document content while strictly maintaining the ${docType} template structure. ${templateExpectations}`;
