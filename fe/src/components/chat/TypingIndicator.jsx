"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export function TypingIndicator({ isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="flex flex-row items-center gap-3">
      {/* Bot Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      {/* Typing Bubble */}
      <div className="bg-muted flex items-center space-x-1 rounded-2xl rounded-bl-md px-4 py-3">
        <span className="bg-muted-foreground/40 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]"></span>
        <span className="bg-muted-foreground/40 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]"></span>
        <span className="bg-muted-foreground/40 h-2 w-2 animate-bounce rounded-full"></span>
      </div>
    </div>
  );
}
