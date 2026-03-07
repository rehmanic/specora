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
  setMenuOpenId,
  onDelete,
  metadata,
  allowedActions = ["copy", "delete", "reply"]
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
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to opening in new tab
      window.open(url, '_blank');
    }
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
        <AvatarFallback className={cn("text-xs", name === "SpecBot" && "bg-primary text-primary-foreground")}>
          {name === "SpecBot" ? <Bot className="h-4 w-4" /> : name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Message content */}
      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isSender ? "items-end" : "items-start"
        )}
      >
        {/* Bubble container */}
        <div className="relative">
          <div
            className={cn(
              "px-5 py-3 rounded-2xl text-sm leading-relaxed transition-all flex flex-col gap-2",
              isSender
                ? "bg-primary text-primary-foreground rounded-br-sm shadow-md shadow-primary/10 border border-primary/10"
                : "bg-card/90 backdrop-blur-md text-foreground rounded-bl-sm shadow-sm border border-border/30",
              isDeleted && "italic text-muted-foreground opacity-80 bg-muted/50 border-dashed"
            )}
          >
            {/* Text content */}
            {text && (
              <div className={cn("prose prose-sm max-w-none", !isSender && "dark:prose-invert")}>
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                    a: ({ href, children }) => <a href={href} className="underline" target="_blank" rel="noopener noreferrer">{children}</a>
                  }}
                >
                  {text}
                </ReactMarkdown>
              </div>
            )}

            {/* Attachments inside bubble */}
            {metadata?.attachments?.length > 0 && (
              <div className={cn(
                "mt-1 flex flex-wrap gap-2 max-w-full",
                isSender ? "justify-end" : "justify-start"
              )}>
                {metadata.attachments.map((file, i) => (
                  file.mimeType?.startsWith("image/") ? (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg overflow-hidden border bg-background/50 hover:opacity-90 transition-opacity"
                    >
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-6 w-6 rounded-full shadow-sm bg-background/80 hover:bg-background"
                          onClick={(e) => handleDownload(e, file.url, file.originalName)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                      <img
                        src={file.url}
                        alt={file.originalName}
                        className="h-32 w-auto object-cover max-w-[200px]"
                        loading="lazy"
                      />
                    </a>
                  ) : (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border bg-background/40 hover:bg-background/60 transition-colors text-xs max-w-[200px]"
                    >
                      <div className="h-8 w-8 bg-muted/50 flex items-center justify-center rounded shrink-0 text-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden text-foreground">
                        <p className="truncate font-medium">{file.originalName}</p>
                        <p className="text-muted-foreground/80">{file.size ? (file.size / 1024).toFixed(1) + " KB" : "File"}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={(e) => handleDownload(e, file.url, file.originalName)}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  )
                ))}
              </div>
            )}

            {/* Name & timestamp inside bubble */}
            {!isDeleted && (
              <div
                className={cn(
                  "flex items-center gap-2 text-[10px] mt-1",
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
                  {allowedActions.includes("copy") && (
                    <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
                      {copied ? (
                        <Check className="mr-2 h-4 w-4 text-success" />
                      ) : (
                        <Copy className="mr-2 h-4 w-4" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </DropdownMenuItem>
                  )}

                  {isSender && allowedActions.includes("delete") && (
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
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
