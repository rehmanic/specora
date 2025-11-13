"use client";

import { Plus, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const recentChats = [
  { id: 1, title: "Project Discussion", time: "2m ago" },
  { id: 2, title: "Design Review", time: "1h ago" },
  { id: 3, title: "Team Meeting Notes", time: "3h ago" },
  { id: 4, title: "Client Feedback", time: "1d ago" },
  { id: 5, title: "Sprint Planning", time: "2d ago" },
  { id: 6, title: "Bug Fixes", time: "3d ago" },
  { id: 8, title: "Feature Requests", time: "1w ago" },
  { id: 9, title: "Feature Requests", time: "1w ago" },
  { id: 10, title: "Feature Requests", time: "1w ago" },
  { id: 11, title: "Feature Requests", time: "1w ago" },
];

export default function LeftSidebar({ collapsed, onToggleCollapse }) {
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
        <Button className="w-full justify-start gap-2" size="lg">
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
            {recentChats.map((chat) => (
              <button
                key={chat.id}
                className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary"
              >
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {chat.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{chat.time}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
