"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Copy, Reply, Trash2, Check, Download, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
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
  setMenuOpenId = () => {},
  onDelete,
  metadata,
  allowedActions = ["copy", "delete", "reply"],
}) {
  const [copied, setCopied] = useState(false);
  const isDeleted = metadata?.is_deleted;

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (e, url, filename) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to opening in new tab
      window.open(url, "_blank");
    }
  };

  return (
    <div className={cn("group flex gap-3", isSender ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback
          className={cn(
            "text-xs font-bold shadow-sm ring-1 ring-white/10",
            name === "SpecBot"
              ? "bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-violet-500/20"
              : "bg-muted"
          )}
        >
          {name === "SpecBot" ? (
            <Bot className="animate-in fade-in zoom-in h-4 w-4 duration-500" />
          ) : (
            name?.charAt(0).toUpperCase()
          )}
        </AvatarFallback>
      </Avatar>

      {/* Message content */}
      <div className={cn("flex max-w-[70%] flex-col", isSender ? "items-end" : "items-start")}>
        {/* Bubble container */}
        <div className="relative">
          <div
            className={cn(
              "flex flex-col gap-2 rounded-2xl px-5 py-3 text-sm leading-relaxed transition-all",
              isSender
                ? "bg-primary text-primary-foreground shadow-primary/10 border-primary/10 rounded-br-sm border shadow-md"
                : "bg-card/90 text-foreground border-border/30 rounded-bl-sm border shadow-sm backdrop-blur-md",
              isDeleted && "text-muted-foreground bg-muted/50 border-dashed italic opacity-80"
            )}
          >
            {/* Text content */}
            {text && (
              <div className={cn("prose prose-sm max-w-none", !isSender && "dark:prose-invert")}>
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                    a: ({ href, children }) => (
                      <a href={href} className="underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {text}
                </ReactMarkdown>
              </div>
            )}

            {/* Attachments inside bubble */}
            {metadata?.attachments?.length > 0 && (
              <div className={cn("mt-1 flex max-w-full flex-wrap gap-2", isSender ? "justify-end" : "justify-start")}>
                {metadata.attachments.map((file, i) =>
                  file.mimeType?.startsWith("image/") ? (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-background/50 block overflow-hidden rounded-lg border transition-opacity hover:opacity-90"
                    >
                      <div className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="bg-background/80 hover:bg-background h-6 w-6 rounded-full shadow-sm"
                          onClick={(e) => handleDownload(e, file.url, file.originalName)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                      <img
                        src={file.url}
                        alt={file.originalName}
                        className="h-32 w-auto max-w-[200px] object-cover"
                        loading="lazy"
                      />
                    </a>
                  ) : (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-background/40 hover:bg-background/60 flex max-w-[200px] items-center gap-2 rounded-lg border p-2 text-xs transition-colors"
                    >
                      <div className="bg-muted/50 text-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="text-foreground min-w-0 flex-1 overflow-hidden">
                        <p className="truncate font-medium">{file.originalName}</p>
                        <p className="text-muted-foreground/80">
                          {file.size ? (file.size / 1024).toFixed(1) + " KB" : "File"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground h-6 w-6 shrink-0"
                        onClick={(e) => handleDownload(e, file.url, file.originalName)}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  )
                )}
              </div>
            )}

            {/* Name & timestamp inside bubble */}
            {!isDeleted && (
              <div
                className={cn(
                  "mt-1 flex items-center gap-2 text-[10px]",
                  isSender ? "text-primary-foreground/80 justify-end" : "text-muted-foreground justify-start"
                )}
              >
                <span className="font-semibold">{name}</span>
                <span className="italic">{timestamp}</span>
              </div>
            )}
          </div>

          {/* Actions menu */}
          {!isDeleted && (
            <div
              className={cn(
                "absolute top-0 opacity-0 transition-opacity group-hover:opacity-100",
                isSender ? "-left-10" : "-right-10"
              )}
            >
              <DropdownMenu
                open={menuOpenId === id}
                onOpenChange={(open) => typeof setMenuOpenId === "function" && setMenuOpenId(open ? id : null)}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-muted h-8 w-8 rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isSender ? "start" : "end"}>
                  {allowedActions.includes("copy") && (
                    <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
                      {copied ? <Check className="text-success mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </DropdownMenuItem>
                  )}

                  {isSender && allowedActions.includes("delete") && (
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={() => onDelete && onDelete(id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
