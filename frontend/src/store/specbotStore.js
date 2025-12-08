import { create } from "zustand";
import {
    createSpecbotChat,
    deleteSpecbotChat,
    getAllSpecbotChats,
    updateSpecbotChat,
    createMessage,
    getAllMessages,
} from "@/api/specbot";

const useSpecbotStore = create((set, get) => ({
    // State
    chats: [],
    currentChat: null,
    messages: [],
    loading: false,
    error: null,
    sendingMessage: false,

    // ======================
    // Fetch All Chats
    // ======================
    fetchChats: async (projectId) => {
        set({ loading: true, error: null });
        try {
            const data = await getAllSpecbotChats(projectId);
            set({ chats: data.chats || [], loading: false });
        } catch (err) {
            set({ loading: false, error: err.message });
            throw err;
        }
    },

    // ======================
    // Create New Chat
    // ======================
    createChat: async (chatData) => {
        set({ loading: true, error: null });
        try {
            const data = await createSpecbotChat(chatData);
            const newChat = data.chat;
            set((state) => ({
                chats: [newChat, ...state.chats],
                currentChat: newChat,
                messages: [],
                loading: false,
            }));
            return newChat;
        } catch (err) {
            set({ loading: false, error: err.message });
            throw err;
        }
    },

    // ======================
    // Update Chat
    // ======================
    updateChat: async (chatId, updateData) => {
        set({ error: null });
        try {
            const data = await updateSpecbotChat(chatId, updateData);
            const updatedChat = data.chat;
            set((state) => ({
                chats: state.chats.map((chat) =>
                    chat.id === chatId ? updatedChat : chat
                ),
                currentChat:
                    state.currentChat?.id === chatId ? updatedChat : state.currentChat,
            }));
            return updatedChat;
        } catch (err) {
            set({ error: err.message });
            throw err;
        }
    },

    // ======================
    // Delete Chat
    // ======================
    deleteChat: async (chatId) => {
        set({ error: null });
        try {
            await deleteSpecbotChat(chatId);
            set((state) => ({
                chats: state.chats.filter((chat) => chat.id !== chatId),
                currentChat: state.currentChat?.id === chatId ? null : state.currentChat,
                messages: state.currentChat?.id === chatId ? [] : state.messages,
            }));
        } catch (err) {
            set({ error: err.message });
            throw err;
        }
    },

    // ======================
    // Set Current Chat
    // ======================
    setCurrentChat: async (chat) => {
        set({ currentChat: chat, loading: true, error: null, messages: [] });
        if (chat) {
            try {
                const data = await getAllMessages(chat.id);
                set({ messages: data.messages || [], loading: false });
            } catch (err) {
                set({ loading: false, error: err.message });
            }
        } else {
            set({ loading: false });
        }
    },

    // ======================
    // Fetch Messages
    // ======================
    fetchMessages: async (chatId) => {
        set({ loading: true, error: null });
        try {
            const data = await getAllMessages(chatId);
            set({ messages: data.messages || [], loading: false });
        } catch (err) {
            set({ loading: false, error: err.message });
            throw err;
        }
    },

    // ======================
    // Send Message
    // ======================
    sendMessage: async (messageData) => {
        set({ sendingMessage: true, error: null });
        try {
            const data = await createMessage(messageData);

            // Add user message and bot response to messages
            const newMessages = [data.data];
            if (data.botMessage) {
                newMessages.push(data.botMessage);
            }

            set((state) => ({
                messages: [...state.messages, ...newMessages],
                sendingMessage: false,
            }));

            return data;
        } catch (err) {
            const friendlyMessage =
                err?.message &&
                    err.message.toLowerCase().includes("internal server error")
                    ? "Specbot ran into an issue. Please try again in a moment."
                    : err?.message || "Specbot could not send your message.";
            set({ sendingMessage: false, error: friendlyMessage });
            throw err;
        }
    },

    // ======================
    // Clear Current Chat
    // ======================
    clearCurrentChat: () => {
        set({ currentChat: null, messages: [] });
    },

    // ======================
    // Clear Error
    // ======================
    clearError: () => {
        set({ error: null });
    },
}));

export default useSpecbotStore;
