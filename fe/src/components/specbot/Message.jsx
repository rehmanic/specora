"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Message({ text, timestamp, isSender }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 group animate-fade-in",
        isSender ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <Avatar className={cn(
        "h-8 w-8 shrink-0",
        !isSender && "gradient-primary"
      )}>
        <AvatarFallback className={cn(
          "text-xs",
          isSender ? "bg-muted text-foreground" : "bg-transparent text-white"
        )}>
          {isSender ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message content */}
      <div
        className={cn(
          "flex flex-col max-w-[80%] lg:max-w-[70%]",
          isSender ? "items-end" : "items-start"
        )}
      >
        {/* Name & timestamp */}
        <div
          className={cn(
            "flex items-center gap-2 mb-1 text-xs text-muted-foreground",
            isSender && "flex-row-reverse"
          )}
        >
          <span className="font-medium">{isSender ? "You" : "SpecBot"}</span>
          <span>•</span>
          <span>{timestamp}</span>
        </div>

        {/* Bubble */}
        <div className="relative group/bubble">
          <div
            className={cn(
              "px-4 py-3 rounded-2xl text-sm leading-relaxed",
              isSender
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-card border border-border rounded-bl-md shadow-sm"
            )}
          >
            {/* Format AI responses with markdown-like styling */}
            <div className={cn(
              "whitespace-pre-wrap",
              !isSender && "[&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>code]:bg-muted [&>code]:px-1 [&>code]:rounded"
            )}>
              {text}
            </div>
          </div>

          {/* Copy button for AI messages */}
          {!isSender && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute -bottom-2 right-2 h-7 w-7 opacity-0 group-hover/bubble:opacity-100 transition-opacity bg-card border shadow-sm"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
