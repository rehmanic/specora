"use client";

import { Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight, Loader2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/Logo";
import { useState } from "react";

export default function LeftSidebar({
  collapsed,
  onToggleCollapse,
  chats = [],
  onChatSelect,
  onNewChat,
  activeChatId,
  onDeleteChat,
  onRenameChat,
  deletingChatId,
  hideNewChat,
  readOnly,
}) {
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleStartEdit = (chat) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title || "");
  };

  const handleSaveEdit = (chatId) => {
    if (editTitle.trim()) {
      onRenameChat && onRenameChat(chatId, editTitle.trim());
    }
    setEditingChatId(null);
  };
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
      {!hideNewChat && (
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
      )}

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
                <div onClick={(e) => editingChatId === chat.id && e.stopPropagation()}>
                  <MessageSquare className="h-4 w-4 shrink-0" />
                </div>

                {!collapsed && (
                  <>
                    {editingChatId === chat.id ? (
                      <div className="flex-1 flex gap-1 items-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          autoFocus
                          className="flex-1 bg-background border rounded px-1 text-sm h-6 min-w-0"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(chat.id);
                            if (e.key === 'Escape') setEditingChatId(null);
                          }}
                          onBlur={() => handleSaveEdit(chat.id)}
                        />
                      </div>
                    ) : (
                      <span className="flex-1 truncate text-sm">
                        {chat.title || "Untitled Chat"}
                      </span>
                    )}

                    {/* Actions */}
                    {!readOnly && editingChatId !== chat.id && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(chat);
                          }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
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
                      </div>
                    )}
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
