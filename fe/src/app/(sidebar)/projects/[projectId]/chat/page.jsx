"use client";
import { useState } from "react";
import { Message } from "@/components/chat/Message";
import ChatInputField from "@/components/common/ChatInputFeild";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Search, Users, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  // Team members for the header
  const teamMembers = [
    { name: "Alice", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
    { name: "Bob", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
    { name: "Charlie", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie" },
  ];

  return (
    <ProtectedRoute
      allowedRoles={["manager", "client", "requirements_engineer"]}
    >
      <section className="flex flex-col h-full w-full bg-background">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {teamMembers.slice(0, 3).map((member, idx) => (
                <Avatar key={idx} className="h-8 w-8 border-2 border-card">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {teamMembers.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium">
                  +{teamMembers.length - 3}
                </div>
              )}
            </div>
            <div>
              <h2 className="font-semibold font-display">Team Chat</h2>
              <p className="text-xs text-muted-foreground">
                {teamMembers.length} members • 2 online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-9 w-[200px] h-9"
              />
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="h-6 w-6">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1 px-3 py-2 bg-muted rounded-full">
              <span className="text-xs">Alice is typing</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full typing-dot" />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full typing-dot" />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full typing-dot" />
              </span>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t bg-card p-4">
          <ChatInputField />
        </div>
      </section>
    </ProtectedRoute>
  );
}
