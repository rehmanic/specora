import { useState } from "react";
import { Loader2, Download, FileText, ListChecks, Bot } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Message } from "@/components/chat/Message";
import { TypingIndicator } from "@/components/chat/TypingIndicator";

export default function MainPanel({
  hasProject,
  canAccess,
  currentChat,
  messages,
  loading,
  error,
  onDismissError,
  onDownload,
  onSummarize,
  onExtract,
  actionsDisabled = false,
  downloaded = false,
  showAttachments = false,
}) {
  const [menuOpenId, setMenuOpenId] = useState(null);

  if (!canAccess) {
    return (
      <div className="bg-background flex h-full flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl font-semibold">Access limited</h2>
        <p className="text-muted-foreground mt-2">
          This Specbot workspace is restricted to authorized project members.
        </p>
      </div>
    );
  }

  if (!hasProject) {
    return (
      <div className="bg-background flex h-full flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl font-semibold">Select a project</h2>
        <p className="text-muted-foreground mt-2">Choose a project to view its Specbot chats.</p>
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="bg-background flex h-full flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl font-semibold">Pick a chat to review</h2>
        <p className="text-muted-foreground mt-2">Chats for this project appear in the sidebar.</p>
      </div>
    );
  }

  const actions = [
    {
      key: "download",
      label: "Download",
      icon: <Download className="h-4 w-4" />,
      onClick: onDownload,
      disabled: actionsDisabled,
    },
    {
      key: "extract",
      label: "Extract requirements",
      icon: <ListChecks className="h-4 w-4" />,
      onClick: onExtract,
      disabled: actionsDisabled || !downloaded,
    },
    {
      key: "summarize",
      label: "Summarize",
      icon: <FileText className="h-4 w-4" />,
      onClick: onSummarize,
      disabled: actionsDisabled || !downloaded,
    },
  ];

  return (
    <div className="relative z-10 flex h-full flex-col bg-transparent">
      <div className="border-border/50 bg-background/60 sticky top-0 z-20 flex items-center justify-between border-b px-6 py-4 shadow-sm backdrop-blur-xl">
        <div>
          <p className="text-lg leading-tight font-semibold">{currentChat?.title}</p>
          <p className="text-muted-foreground text-xs">
            {downloaded
              ? "Downloaded to server. You can summarize or extract."
              : "Download this chat to enable summarize and extract."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            {actions.map((action) => (
              <Tooltip key={action.key} delayDuration={100}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className="border-border bg-card text-foreground hover:bg-accent flex h-9 w-9 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={action.label}
                  >
                    {action.icon}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{action.label}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto bg-transparent px-6 py-8">
        {loading && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            No messages in this chat yet.
          </div>
        ) : (
          messages.map((msg) => {
            const formattedTime = new Date(msg.created_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <Message
                key={msg.id}
                id={msg.id}
                text={msg.content}
                timestamp={formattedTime}
                isSender={msg.sender_type === "user"}
                name={
                  msg.sender_type === "bot" ? "SpecBot" : msg.sender?.display_name || msg.sender?.username || "User"
                }
                avatarUrl={msg.sender_type === "user" ? msg.sender?.profile_pic_url : null}
                metadata={msg.metadata}
                allowedActions={["copy"]}
                menuOpenId={menuOpenId}
                setMenuOpenId={setMenuOpenId}
              />
            );
          })
        )}
        <TypingIndicator isVisible={loading && messages.length > 0} />
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive flex items-center justify-between px-4 py-2 text-sm">
          <span>{error}</span>
          <button className="text-xs underline" onClick={onDismissError}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
