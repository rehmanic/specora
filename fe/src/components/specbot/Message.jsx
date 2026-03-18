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
    <div className={cn("group animate-fade-in flex gap-3", isSender ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <Avatar className={cn("h-8 w-8 shrink-0", !isSender && "gradient-primary")}>
        <AvatarFallback
          className={cn("text-xs", isSender ? "bg-muted text-foreground" : "text-primary-foreground bg-transparent")}
        >
          {isSender ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message content */}
      <div className={cn("flex max-w-[80%] flex-col lg:max-w-[70%]", isSender ? "items-end" : "items-start")}>
        {/* Bubble */}
        <div className="group/bubble relative">
          <div
            className={cn(
              "flex flex-col gap-1 rounded-2xl px-5 py-3 text-sm leading-relaxed transition-all",
              isSender
                ? "bg-primary text-primary-foreground shadow-primary/10 border-primary/10 rounded-br-sm border shadow-md"
                : "bg-card/90 border-border/30 rounded-bl-sm border shadow-sm backdrop-blur-md"
            )}
          >
            {/* Format AI responses with markdown-like styling */}
            <div
              className={cn(
                "whitespace-pre-wrap",
                !isSender && "[&>code]:bg-muted [&>code]:rounded [&>code]:px-1 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-4"
              )}
            >
              {text}
            </div>

            {/* Name & timestamp */}
            <div
              className={cn(
                "mt-1 flex items-center gap-2 text-[10px]",
                isSender ? "text-primary-foreground/80 justify-end" : "text-muted-foreground justify-start"
              )}
            >
              <span className="font-semibold">{isSender ? "You" : "SpecBot"}</span>
              <span className="italic">{timestamp}</span>
            </div>

            {/* Copy button for AI messages */}
            {!isSender && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="bg-card absolute right-2 -bottom-2 h-7 w-7 border opacity-0 shadow-sm transition-opacity group-hover/bubble:opacity-100"
              >
                {copied ? <Check className="text-success h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
