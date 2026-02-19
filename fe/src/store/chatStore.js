import { create } from "zustand";
import { io } from "socket.io-client";
import { getProjectGroupChat, getGroupMessages, deleteMessageRequest } from "@/api/chat";

// Helper to get socket instance
let socket;

const useChatStore = create((set, get) => ({
    messages: [],
    currentChatId: null,
    loading: false,
    error: null,
    socketConnected: false,

    // Initialize Socket Connection
    connectSocket: () => {
        if (socket) return;

        // When NEXT_PUBLIC_API_URL is a full URL (e.g. http://localhost:5000/api),
        // extract its origin for Socket.IO.
        // When it's a relative path (e.g. "/api" in Docker), connect directly to
        // the backend on port 5000 — Next.js rewrites can't proxy WebSockets.
        const envUrl = process.env.NEXT_PUBLIC_API_URL;
        const isFullUrl = envUrl && /^https?:\/\//.test(envUrl);
        let baseUrl;
        if (isFullUrl) {
            baseUrl = new URL(envUrl).origin;
        } else if (typeof window !== "undefined") {
            baseUrl = `http://${window.location.hostname}:5000`;
        } else {
            baseUrl = "http://localhost:5000";
        }

        socket = io(baseUrl, {
            path: "/socket.io/",
            transports: ["websocket", "polling"],
        });

        socket.on("connect", () => {
            set({ socketConnected: true });
            console.log("Socket connected");
        });

        socket.on("disconnect", () => {
            set({ socketConnected: false });
            console.log("Socket disconnected");
        });

        socket.on("receive_group_message", (newMessage) => {
            const currentMessages = get().messages;
            // Avoid duplicates if any
            if (!currentMessages.find(m => m.id === newMessage.id)) {
                set({ messages: [...currentMessages, newMessage] });
            }
        });

        socket.on("receive_delete_message", (messageId) => {
            set((state) => ({
                messages: state.messages.filter((m) => m.id !== messageId)
            }));
        });

        socket.on("receive_message_update", (updatedMessage) => {
            set((state) => ({
                messages: state.messages.map((m) =>
                    m.id === updatedMessage.id ? updatedMessage : m
                )
            }));
        });
    },

    // Join Project Room
    joinProjectRoom: (projectId) => {
        if (!socket) get().connectSocket();
        socket.emit("join_project", projectId);
    },

    // Fetch Group Chat ID and Messages
    fetchGroupChat: async (projectId) => {
        set({ loading: true, error: null });
        try {
            console.log("Fetching chat for project:", projectId);
            const chatRes = await getProjectGroupChat(projectId);
            console.log("Chat Response:", chatRes);
            const chat = chatRes.chat;
            set({ currentChatId: chat.id });

            // Fetch messages for this chat
            const msgRes = await getGroupMessages(chat.id);
            console.log("Messages Response:", msgRes);
            set({ messages: msgRes.messages || [], loading: false });

        } catch (error) {
            console.error("Error fetching group chat:", error);
            set({ error: "Failed to load chat", loading: false });
        }
    },

    // Send Message
    sendMessage: (projectId, content, senderId, metadata = null) => {
        const { currentChatId } = get();
        if (!socket || !currentChatId) return;

        // Emit event to server (optimistic update could be added here)
        socket.emit("send_group_message", {
            chatId: currentChatId,
            content,
            senderId,
            projectId,
            metadata // Pass metadata (attachments)
        });
    },

    // Delete Message (Soft Delete)
    deleteMessage: async (messageId, projectId) => {
        const { currentChatId } = get();
        if (!socket || !currentChatId) return;

        try {
            // 1. Call API to delete from DB (returns updated soft-deleted message)
            const response = await deleteMessageRequest(messageId);
            const updatedMessage = response.data;

            // 2. Emit event to notify other users
            socket.emit("update_group_message", {
                projectId,
                message: updatedMessage
            });

            // 3. Optimistic local update
            set((state) => ({
                messages: state.messages.map((m) =>
                    m.id === messageId ? updatedMessage : m
                )
            }));

        } catch (error) {
            console.error("Failed to delete message", error);
            // Optionally show toast error
        }
    },

    disconnectSocket: () => {
        if (socket) {
            socket.disconnect();
            socket = null;
            set({ socketConnected: false });
        }
    }
}));

export default useChatStore;
