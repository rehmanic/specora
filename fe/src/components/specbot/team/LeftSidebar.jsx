"use client";

import { Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/Logo";

export default function LeftSidebar({
  collapsed,
  onToggleCollapse,
  chats = [],
  onChatSelect,
  onNewChat,
  activeChatId,
  onDeleteChat,
  deletingChatId,
}) {
  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Logo showText={false} size="sm" />
            <span className="font-semibold font-display text-sm">SpecBot</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 shrink-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          className={cn(
            "w-full gap-2 gradient-primary border-0",
            collapsed && "px-0"
          )}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && <span>New Chat</span>}
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {chats.length === 0 ? (
            !collapsed && (
              <p className="text-xs text-muted-foreground text-center p-4">
                No chats yet. Create one to get started!
              </p>
            )
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "group flex items-center gap-2 rounded-lg transition-all cursor-pointer",
                  collapsed ? "p-2 justify-center" : "px-3 py-2",
                  activeChatId === chat.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
                onClick={() => onChatSelect(chat)}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />

                {!collapsed && (
                  <>
                    <span className="flex-1 truncate text-sm">
                      {chat.title || "Untitled Chat"}
                    </span>

                    {/* Delete button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat);
                      }}
                      disabled={deletingChatId === chat.id}
                    >
                      {deletingChatId === chat.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer info */}
      {!collapsed && (
        <div className="p-3 border-t border-border">
          <p className="text-[10px] text-muted-foreground text-center">
            Powered by AI • Use responsibly
          </p>
        </div>
      )}
    </div>
  );
}
