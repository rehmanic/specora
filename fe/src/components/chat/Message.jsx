"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Copy, Reply, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function Message({
  id,
  text,
  timestamp,
  isSender,
  name,
  avatarUrl,
  menuOpenId,
  setMenuOpenId,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 group",
        isSender ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className="text-xs">
          {name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Message content */}
      <div
        className={cn(
          "flex flex-col max-w-[70%]",
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
          <span className="font-medium">{name}</span>
          <span>•</span>
          <span>{timestamp}</span>
        </div>

        {/* Bubble */}
        <div className="relative">
          <div
            className={cn(
              "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
              isSender
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-muted text-foreground rounded-bl-md"
            )}
          >
            {text}
          </div>

          {/* Actions menu */}
          <div
            className={cn(
              "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
              isSender ? "-left-10" : "-right-10"
            )}
          >
            <DropdownMenu
              open={menuOpenId === id}
              onOpenChange={(open) => setMenuOpenId(open ? id : null)}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-muted"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isSender ? "start" : "end"}>
                <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
                  {copied ? (
                    <Check className="mr-2 h-4 w-4 text-success" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Reply className="mr-2 h-4 w-4" />
                  Reply
                </DropdownMenuItem>
                {isSender && (
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
