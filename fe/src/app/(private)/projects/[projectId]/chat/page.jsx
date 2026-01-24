"use client";
import { useState } from "react";
import { Message } from "@/components/chat/Message";
import ChatInputField from "@/components/common/ChatInputFeild";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatPage() {
    const [menuOpenId, setMenuOpenId] = useState(null);

    const messages = [
        {
            id: 1,
            text: "Hey! How's it going?",
            timestamp: "10:00 AM",
            isSender: false,
            name: "Alice",
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        },
        {
            id: 2,
            text: "All good, just working on the project. The new requirements look interesting!",
            timestamp: "10:02 AM",
            isSender: true,
            name: "You",
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        },
        {
            id: 3,
            text: "Nice! Let me know if you need help with the implementation. I've got some experience with similar features.",
            timestamp: "10:03 AM",
            isSender: false,
            name: "Alice",
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        },
        {
            id: 4,
            text: "Sure thing, appreciate it 👍",
            timestamp: "10:05 AM",
            isSender: true,
            name: "You",
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        },
    ];

    return (
        <ProtectedRoute allowedRoles={["manager", "client", "requirements_engineer"]}>
            <div className="flex flex-col h-full bg-background">
                {/* Chat Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b bg-card">
                    <div>
                        <h2 className="font-semibold font-display text-lg">Group Chat</h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Search messages..."
                                className="pl-9 w-[200px] h-8 text-sm bg-muted/50 border-0 focus-visible:bg-background transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                        {messages.map((msg, index) => (
                            <div
                                key={msg.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <Message
                                    {...msg}
                                    menuOpenId={menuOpenId}
                                    setMenuOpenId={setMenuOpenId}
                                />
                            </div>
                        ))}

                        {/* Typing indicator */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground ml-1">
                            <span className="text-xs italic opacity-70">Alice is typing...</span>
                        </div>
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 bg-background border-t">
                    <ChatInputField />
                </div>
            </div>
        </ProtectedRoute>
    );
}
