import { Loader2, Download, FileText, ListChecks } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Message } from "../Message";

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
}) {
  if (!canAccess) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-background px-6 text-center">
        <h2 className="text-2xl font-semibold">Access limited</h2>
        <p className="mt-2 text-muted-foreground">
          Specbot workspace is available for managers and requirements engineers.
        </p>
      </div>
    );
  }

  if (!hasProject) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-background px-6 text-center">
        <h2 className="text-2xl font-semibold">Select a project</h2>
        <p className="mt-2 text-muted-foreground">
          Choose a project to view its Specbot chats.
        </p>
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-background px-6 text-center">
        <h2 className="text-2xl font-semibold">Pick a chat to review</h2>
        <p className="mt-2 text-muted-foreground">
          Chats for this project appear in the sidebar.
        </p>
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
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="text-lg font-semibold leading-tight">{currentChat?.title}</p>
          <p className="text-xs text-muted-foreground">
            {downloaded ? "Downloaded to server. You can summarize or extract." : "Download this chat to enable summarize and extract."}
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
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
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

      <div className="flex-1 min-h-0 overflow-y-auto bg-muted/30 px-4 py-3 space-y-3">
        {loading && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
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
                text={msg.content}
                timestamp={formattedTime}
                isSender={msg.sender_type === "user"}
              />
            );
          })
        )}
      </div>

      {error && (
        <div className="flex items-center justify-between bg-destructive/10 px-4 py-2 text-sm text-destructive">
          <span>{error}</span>
          <button className="text-xs underline" onClick={onDismissError}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
