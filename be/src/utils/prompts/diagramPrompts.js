export const generateDiagramPrompt = (diagram_type, reqText) => `Generate a ${diagram_type.trim()} based on the following requirements:\n\n${reqText}`;

export const generateDiagramTask = (diagram_type) => `Generate a Mermaid.js ${diagram_type.trim()} from the user's requirements.`;

export const generateDiagramExpectations = "Output ONLY valid Mermaid diagram syntax. No explanations, no markdown, no code fences. CRITICAL: Always use double quotes around text labels inside nodes (e.g. A[\"Node Text (with special chars)\"]) to prevent parsing errors.";

export const generateDiagramOutput = "Plain Mermaid code only (e.g. flowchart, sequenceDiagram, etc.).";

export const editDiagramContent = (currentCode, edit_instruction) => `CURRENT MERMAID DIAGRAM:\n\`\`\`mermaid\n${currentCode}\n\`\`\`\n\nUSER EDIT REQUEST: ${edit_instruction.trim()}`;

export const editDiagramTask = "Update the Mermaid diagram according to the user's edit request.";

export const editDiagramExpectations = "Return ONLY the complete updated Mermaid code. No explanations, no markdown code fences. CRITICAL: Always use double quotes around text labels inside nodes (e.g. A[\"Node Text (with special chars)\"]) to prevent parsing errors.";

export const editDiagramOutput = "Plain Mermaid code only.";
