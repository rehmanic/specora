import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateGeminiResponse = async (content, instructions) => {
    try {
        const prompt = `
      You are a helpful AI assistant.
      
      Context/Instructions:
      ${JSON.stringify(instructions, null, 2)}
      
      User Message:
      ${content}
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate response from Gemini");
    }
};
