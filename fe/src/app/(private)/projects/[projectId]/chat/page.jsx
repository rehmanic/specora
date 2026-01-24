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

    const handleSendMessage = (content) => {
        if (content.trim()) {
            sendMessage(projectId, content, user.id);
        }
    };

    const handleDeleteMessage = (messageId) => {
        if (confirm("Are you sure you want to delete this message?")) {
            deleteMessage(messageId, projectId);
        }
    };

    return (
        <ProtectedRoute allowedRoles={["manager", "client", "requirements_engineer"]}>
            <div className="flex flex-col h-full bg-background">
                {/* Messages Area */}
                <div className="flex-1 min-h-0 overflow-hidden">
                    <ScrollArea className="h-full w-full">
                        <div className="p-4 space-y-4">
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
                <div className="p-4 bg-background border-t">
                    <ChatInputField onSend={handleSendMessage} />
                </div>
            </div>
        </ProtectedRoute>
    );
}
