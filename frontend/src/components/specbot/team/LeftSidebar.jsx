"use client";

import { Plus, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export default function LeftSidebar({
  collapsed,
  onToggleCollapse,
  chats = [],
  onChatSelect,
  onNewChat,
  activeChatId
}) {
  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };
  if (collapsed) {
    return (
      <div className="flex h-full flex-col items-center border-r border-border bg-card py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Chats
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button className="w-full justify-start gap-2" size="lg" onClick={onNewChat}>
          <Plus className="h-5 w-5" />
          <span className="font-medium">New Chat</span>
        </Button>
      </div>

      {/* Recent Chats */}
      <div className="flex-1 overflow-hidden">
        <div className="px-4 py-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recent Chats
          </h2>
        </div>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-1 px-2 pb-4">
            {chats.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                No chats yet. Start a new conversation!
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onChatSelect(chat)}
                  className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary ${activeChatId === chat.id ? "bg-secondary" : ""
                    }`}
                >
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {chat.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(chat.updated_at || chat.created_at)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
