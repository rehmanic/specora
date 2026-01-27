import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../../config/db/prismaClient.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// In-memory cache for chat sessions
const chatSessions = new Map();
const SESSION_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

// Store session timestamps for cleanup
const sessionTimestamps = new Map();

/**
 * Build chat history from database messages
 * @param {string} chatId - The chat ID to fetch history for
 * @param {number} maxMessages - Maximum number of messages to include
 * @returns {Array} - Array of message objects in Gemini format
 */
async function buildChatHistory(chatId, maxMessages = 20) {
    try {
        const messages = await prisma.specbot_message.findMany({
            where: { specbot_chat_id: chatId },
            orderBy: { created_at: 'desc' }, // Get latest messages
            take: maxMessages,
            select: {
                content: true,
                metadata: true,
                sender_type: true, // Select new field
                created_at: true
            }
        });

        // Reverse to chronological order (oldest -> newest) for Gemini
        const chronologicalMessages = messages.reverse();

        // Convert to Gemini chat history format
        let history = chronologicalMessages.map(msg => {
            const senderType = msg.sender_type || msg.metadata?.sender_type || (msg.metadata ? "bot" : "user");
            return {
                role: senderType === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            };
        });

        // Gemini restriction: History must start with 'user'.
        // If the starting message is 'model', remove it.
        while (history.length > 0 && history[0].role === 'model') {
            history.shift();
        }

        return history;
    } catch (error) {
        console.error("Error building chat history:", error);
        return [];
    }
}

/**
 * Clean up expired chat sessions
 */
function cleanupExpiredSessions() {
    const now = Date.now();
    for (const [chatId, timestamp] of sessionTimestamps.entries()) {
        if (now - timestamp > SESSION_TTL) {
            chatSessions.delete(chatId);
            sessionTimestamps.delete(chatId);
            console.log(`🧹 Cleaned up expired session for chat: ${chatId}`);
        }
    }
}

/**
 * Get or create a chat session for the given chat ID
 * @param {string} chatId - The chat ID
 * @param {object} instructions - Custom instructions/context
 * @returns {object} - Gemini chat session
 */
async function getChatSession(chatId, instructions = {}) {
    // Clean up expired sessions periodically
    cleanupExpiredSessions();

    // Check if session exists and is still valid
    if (chatSessions.has(chatId)) {
        const timestamp = sessionTimestamps.get(chatId);
        if (Date.now() - timestamp < SESSION_TTL) {
            // Update timestamp to extend session
            sessionTimestamps.set(chatId, Date.now());
            return chatSessions.get(chatId);
        } else {
            // Session expired, remove it
            chatSessions.delete(chatId);
            sessionTimestamps.delete(chatId);
        }
    }

    // Create new chat session with history
    const history = await buildChatHistory(chatId);

    const systemInstructionText = `You are a senior software requirements engineer. Stay strictly on requirements analysis: elicit, refine, and validate requirements. If a prompt is off-topic or irrelevant to the product/project scope, politely redirect the user back to requirements gathering.

Context/Instructions:
${JSON.stringify(instructions, null, 2)}

Guidelines:
- Keep responses concise and structured
- Prefer numbered or bulleted requirements with clear acceptance notes
- Ask for missing constraints, edge cases, and dependencies
- Do NOT answer generic chit-chat; remind the user you focus only on requirements`;

    const chat = model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 2000,
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
        },
        systemInstruction: {
            parts: [{ text: systemInstructionText }]
        }
    });

    // Cache the session
    chatSessions.set(chatId, chat);
    sessionTimestamps.set(chatId, Date.now());

    console.log(`✨ Created new chat session for chat: ${chatId} with ${history.length} messages in history`);

    return chat;
}

/**
 * Generate a response using Gemini's Chat Session API
 * @param {string} chatId - The chat ID for context
 * @param {string} content - The user's message
 * @param {object} instructions - Custom instructions/context
 * @returns {string} - The AI's response
 */
export const generateGeminiResponse = async (chatId, content, instructions = {}) => {
    try {
        // Get or create chat session with context
        const chat = await getChatSession(chatId, instructions);

        // Send message and get response
        const result = await chat.sendMessage(content);
        const response = result.response;

        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);

        // If there's an error, try to clear the session and retry once
        if (chatSessions.has(chatId)) {
            console.log(`⚠️ Clearing session for chat ${chatId} due to error, will retry...`);
            chatSessions.delete(chatId);
            sessionTimestamps.delete(chatId);

            try {
                const chat = await getChatSession(chatId, instructions);
                const result = await chat.sendMessage(content);
                return result.response.text();
            } catch (retryError) {
                console.error("Gemini API Retry Error:", retryError);
                throw new Error("Failed to generate response from Gemini");
            }
        }

        throw new Error("Failed to generate response from Gemini");
    }
};

/**
 * Generate a one-off response without using chat session (stateless).
 * Use this for analysis tasks like extraction or summarization where
 * you want to analyze a full transcript independently.
 * @param {string} content - The content to analyze
 * @param {object} instructions - Task-specific instructions
 * @returns {string} - The AI's response
 */
export const generateStatelessResponse = async (content, instructions = {}) => {
    try {
        const systemPrompt = `You are a senior software requirements engineer performing analysis tasks.

Task: ${instructions.task || "analyze"}
Expectations: ${instructions.expectations || "Provide a structured response."}
Output Format: ${instructions.output || "Return structured JSON when possible."}

Important: Analyze the ENTIRE content provided below. Do not treat this as a conversation continuation.`;

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: `${systemPrompt}\n\n---\n\nCONTENT TO ANALYZE:\n\n${content}` }]
                }
            ],
            generationConfig: {
                maxOutputTokens: 4000,
                temperature: 0.3,  // Lower temperature for more consistent output
                topP: 0.8,
                topK: 40,
            },
        });

        return result.response.text();
    } catch (error) {
        console.error("Gemini Stateless API Error:", error);
        throw new Error("Failed to generate stateless response from Gemini");
    }
};

/**
 * Clear a specific chat session from cache
 * @param {string} chatId - The chat ID to clear
 */
export const clearChatSession = (chatId) => {
    if (chatSessions.has(chatId)) {
        chatSessions.delete(chatId);
        sessionTimestamps.delete(chatId);
        console.log(`🗑️ Cleared chat session for chat: ${chatId}`);
        return true;
    }
    return false;
};

/**
 * Clear all chat sessions from cache
 */
export const clearAllChatSessions = () => {
    const count = chatSessions.size;
    chatSessions.clear();
    sessionTimestamps.clear();
    console.log(`🗑️ Cleared all ${count} chat sessions`);
};

// Run cleanup every 10 minutes
setInterval(cleanupExpiredSessions, 10 * 60 * 1000);
