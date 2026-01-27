"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LeftSidebar from "./LeftSidebar";
import MainPanel from "./MainPanel";
import useUserStore from "@/store/authStore";
import useProjectsStore from "@/store/projectsStore";
import useSpecbotStore from "@/store/specbotStore";
import {
  downloadSpecbotChat,
  extractSpecbotRequirements,
  summarizeSpecbotChat,
} from "@/api/specbot";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ChatLayout() {
  const { user } = useUserStore();
  const { selectedProject } = useProjectsStore();
  const {
    chats,
    currentChat,
    messages,
    loading,
    error,
    fetchChats,
    setCurrentChat,
    clearCurrentChat,
    clearError,
  } = useSpecbotStore();

  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [downloadedChatIds, setDownloadedChatIds] = useState(new Set());
  const [processing, setProcessing] = useState({
    open: false,
    type: null,
    status: "",
    result: null,
    error: false,
  });
  const [actionLoading, setActionLoading] = useState(false);

  const canAccess = true; // access control is handled by Sidebar and API, but we can double check
  const isClient = user?.role === "client";
  const isManager = user?.role === "manager";
  const isReqEngineer = user?.role === "requirements_engineer";

  // Clients can create/delete chats but not attach files
  // RE/Managers can download/summarize/extract but not create chats (maybe?) 
  // Wait, req said "Client can create SpecBot chat, delete SpecBot chat".
  // Req also said "Requirements Engineer can download chat, summarize it, and extract requirements".

  const canCreateChat = isClient; // "The client can create a specbot chat" - strictly enforcing this based on user feedback.

  const canAnalyze = isManager || isReqEngineer;
  const showAttachments = !isClient; // "Remove the file attachment option from the chat" for Client

  useEffect(() => {
    if (!canAccess) return;
    if (selectedProject?.id) {
      fetchChats(selectedProject.id);
      clearCurrentChat();
      clearError();
      setDownloadedChatIds(new Set());
    }
  }, [
    canAccess,
    selectedProject?.id,
    fetchChats,
    clearCurrentChat,
    clearError,
  ]);

  const downloaded = useMemo(
    () => (currentChat ? downloadedChatIds.has(currentChat.id) : false),
    [currentChat, downloadedChatIds]
  );

  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
  };

  const startProcessing = (type, status) => {
    setProcessing({
      open: true,
      type,
      status,
      result: null,
      error: false,
    });
  };

  const handleActionError = (type, message) => {
    setProcessing({
      open: true,
      type,
      status: message,
      result: null,
      error: true,
    });
  };

  const handleAction = async (type) => {
    if (!currentChat) return;

    const labels = {
      download: "Downloading chat...",
      summarize: "Summarizing chat...",
      extract: "Extracting requirements...",
    };

    startProcessing(type, labels[type]);
    setActionLoading(true);

    try {
      if (type === "download") {
        const response = await downloadSpecbotChat(currentChat.id);
        setDownloadedChatIds((prev) => new Set(prev).add(currentChat.id));
        setProcessing((prev) => ({
          ...prev,
          status: "Chat stored on server",
          result: response?.artifact,
        }));
      } else if (type === "summarize") {
        const response = await summarizeSpecbotChat(currentChat.id);
        setProcessing((prev) => ({
          ...prev,
          status: "Summary ready",
          result: response?.artifact,
        }));
      } else if (type === "extract") {
        const response = await extractSpecbotRequirements(currentChat.id);
        setProcessing((prev) => ({
          ...prev,
          status: "Requirements ready",
          result: response?.artifact,
        }));
      }
    } catch (err) {
      const message =
        err?.message ||
        "Something went wrong while processing this request. Please try again.";
      handleActionError(type, message);
    } finally {
      setActionLoading(false);
    }
  };

  const closeProcessing = () =>
    setProcessing((prev) => ({ ...prev, open: false }));

  const noProjectSelected = !selectedProject?.id;

  return (
    <div className="flex h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <div className={`${leftSidebarCollapsed ? "w-16" : "w-64"} shrink-0 border-r`}>
        <LeftSidebar
          collapsed={leftSidebarCollapsed}
          onToggleCollapse={() =>
            setLeftSidebarCollapsed((prev) => !prev)
          }
          chats={chats}
          onChatSelect={handleChatSelect}
          hideNewChat={!canCreateChat}
          readOnly={!isClient}
          activeChatId={currentChat?.id}
        />
      </div>

      <div className="flex-1 min-h-0 max-h-full overflow-hidden">
        <MainPanel
          hasProject={!noProjectSelected}
          canAccess={canAccess}
          currentChat={currentChat}
          messages={messages}
          loading={loading}
          error={error}
          onDismissError={clearError}
          onDownload={canAnalyze ? () => handleAction("download") : undefined}
          onSummarize={canAnalyze ? () => handleAction("summarize") : undefined}
          onExtract={canAnalyze ? () => handleAction("extract") : undefined}
          actionsDisabled={actionLoading}
          downloaded={downloaded}
          showAttachments={showAttachments}
        />
      </div>

      <Dialog open={processing.open} onOpenChange={closeProcessing}>
        <DialogContent className="max-h-[85vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {processing.type || "Processing"}
            </DialogTitle>
            <DialogDescription className={processing.error ? "text-destructive" : ""}>
              {processing.status}
            </DialogDescription>
          </DialogHeader>
          {processing.result?.data?.summary_text && (
            <div className="mt-4 space-y-2 min-h-0 flex-1 overflow-hidden flex flex-col">
              <p className="text-sm font-medium shrink-0">Summary</p>
              <div className="rounded-md bg-muted p-3 text-sm leading-relaxed max-h-64 overflow-y-auto">
                <div className="prose prose-sm max-w-none prose-p:mb-2 last:prose-p:mb-0 prose-li:my-0 dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {processing.result.data.summary_text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
          {processing.result?.data?.requirements && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Extracted Requirements</p>
              <div className="space-y-2 rounded-md bg-muted p-3 text-sm leading-relaxed max-h-64 overflow-y-auto">
                {processing.result.data.requirements.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No requirements were extracted.
                  </p>
                ) : (
                  processing.result.data.requirements.map((req) => (
                    <div key={req.id || req.title} className="space-y-1">
                      <p className="font-semibold">{req.title}</p>
                      <p className="text-muted-foreground">{req.description}</p>
                      {req.acceptance_criteria && (
                        <p className="text-xs text-muted-foreground">
                          Acceptance: {req.acceptance_criteria}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {processing.result && !processing.result.data && (
            <div className="mt-2 space-y-1 rounded-md bg-muted p-3 text-sm">
              <p>{processing.status}</p>
              {processing.result.path && (
                <p className="text-xs text-muted-foreground break-all">
                  Saved at: {processing.result.path}
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={closeProcessing}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
