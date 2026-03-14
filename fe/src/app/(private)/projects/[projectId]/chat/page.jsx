"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Message } from "@/components/chat/Message";
import ChatInputField from "@/components/common/ChatInputFeild";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import useChatStore from "@/store/chatStore";
import useUserStore from "@/store/authStore";

export default function ChatPage() {
    const { projectId } = useParams();
    const { user } = useUserStore();
    const {
        messages,
        loading,
        fetchGroupChat,
        joinProjectRoom,
        sendMessage,
        connectSocket,
        disconnectSocket,
        deleteMessage
    } = useChatStore();

    const [menuOpenId, setMenuOpenId] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (projectId && user) {
            connectSocket();
            joinProjectRoom(projectId);
            fetchGroupChat(projectId);
        }

        return () => {
            disconnectSocket();
        }
    }, [projectId, user, connectSocket, joinProjectRoom, fetchGroupChat, disconnectSocket]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (content, metadata = null) => {
        if (content.trim() || (metadata?.attachments?.length > 0)) {
            sendMessage(projectId, content, user.id, metadata);
        }
    };

    const handleDeleteMessage = (messageId) => {
        if (confirm("Are you sure you want to delete this message?")) {
            deleteMessage(messageId, projectId);
        }
    };

    return (
        <ProtectedRoute allowedRoles={["manager", "client", "requirements_engineer"]}>
            <div className="flex flex-col h-full bg-background relative z-0">
                {/* Dynamic Background Pattern */}
                <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none -z-10 dark:opacity-20 transition-opacity"></div>
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>

                {/* Static Glassmorphic Header */}
                <div className="flex items-center justify-between border-b border-border/50 bg-background/60 backdrop-blur-xl px-6 py-4 sticky top-0 z-20 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold leading-tight">Team Chat</p>
                            <span className="flex h-2 w-2 rounded-full bg-primary pulse-glow"></span>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 min-h-0 overflow-hidden bg-transparent">
                    <ScrollArea className="h-full w-full">
                        <div className="p-6 space-y-6">
                            {loading && messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full pt-10">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full pt-10 text-muted-foreground">
                                    No messages yet. Start the conversation!
                                </div>
                            ) : (
                                messages.map((msg, index) => (
                                    <div
                                        key={msg.id || index}
                                        className="animate-fade-in"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <Message
                                            id={msg.id}
                                            text={msg.content}
                                            timestamp={msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                                            isSender={msg.sender_id === user?.id}
                                            name={msg.sender?.display_name || msg.sender?.username || "Unknown"}
                                            avatarUrl={msg.sender?.profile_pic_url}
                                            metadata={msg.metadata}
                                            menuOpenId={menuOpenId}
                                            setMenuOpenId={setMenuOpenId}
                                            onDelete={handleDeleteMessage}
                                        />
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>
                </div>

                {/* Input Area */}
                <div className="p-4 sm:p-6 pb-6 bg-transparent">
                    <div className="max-w-4xl mx-auto rounded-2xl shadow-2xl shadow-primary/5 dark:shadow-primary/10 border border-primary/10 bg-card/80 backdrop-blur-xl overflow-hidden ring-1 ring-white/10 dark:ring-white/5 transition-all">
                        <ChatInputField onSend={handleSendMessage} />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
