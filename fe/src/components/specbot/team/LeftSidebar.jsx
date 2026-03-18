"use client";

import { Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight, Loader2, Edit2, Bot } from "lucide-react";
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
    <div className={cn("flex h-full flex-col bg-transparent transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b p-3">
        <div className={cn("flex items-center gap-2", collapsed && "w-full justify-center")}>
          <div className="bg-primary/10 text-primary rounded-lg p-1.5">
            <Bot className="h-5 w-5" />
          </div>
          {!collapsed && <span className="text-sm font-semibold tracking-tight">SpecBot</span>}
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-8 w-8 shrink-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* New Chat Button */}
      {!hideNewChat && (
        <div className="p-3">
          <Button onClick={onNewChat} className={cn("gradient-primary w-full gap-2 border-0", collapsed && "px-0")}>
            <Plus className="h-4 w-4" />
            {!collapsed && <span>New Chat</span>}
          </Button>
        </div>
      )}

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {chats.length === 0
            ? !collapsed && (
                <p className="text-muted-foreground p-4 text-center text-xs">
                  No chats yet. Create one to get started!
                </p>
              )
            : chats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "group flex cursor-pointer items-center gap-2 rounded-lg transition-all",
                    collapsed ? "justify-center p-2" : "px-3 py-2",
                    activeChatId === chat.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                  onClick={() => onChatSelect(chat)}
                >
                  <div onClick={(e) => editingChatId === chat.id && e.stopPropagation()}>
                    <MessageSquare className="h-4 w-4 shrink-0" />
                  </div>

                  {!collapsed && (
                    <>
                      {editingChatId === chat.id ? (
                        <div className="flex flex-1 items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            autoFocus
                            className="bg-background h-6 min-w-0 flex-1 rounded border px-1 text-sm"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit(chat.id);
                              if (e.key === "Escape") setEditingChatId(null);
                            }}
                            onBlur={() => handleSaveEdit(chat.id)}
                          />
                        </div>
                      ) : (
                        <span className="flex-1 truncate text-sm">{chat.title || "Untitled Chat"}</span>
                      )}

                      {/* Actions */}
                      {!readOnly && editingChatId !== chat.id && (
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground h-6 w-6"
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
                            className="text-muted-foreground hover:text-destructive h-6 w-6"
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
              ))}
        </div>
      </ScrollArea>

      {/* Footer info */}
      {!collapsed && (
        <div className="border-border border-t p-3">
          <p className="text-muted-foreground text-center text-[10px]">Powered by AI • Use responsibly</p>
        </div>
      )}
    </div>
  );
}
