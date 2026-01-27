"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export function TypingIndicator({ isVisible }) {
    if (!isVisible) return null;

    return (
        <div className="flex gap-3 flex-row items-center">
            {/* Bot Avatar */}
            <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                </AvatarFallback>
            </Avatar>

            {/* Typing Bubble */}
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md flex items-center space-x-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></span>
            </div>
        </div>
    );
}
