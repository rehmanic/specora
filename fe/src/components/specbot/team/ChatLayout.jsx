"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LeftSidebar from "./LeftSidebar";
import MainPanel from "./MainPanel";
import useUserStore from "@/store/authStore";
import { usePermission } from "@/hooks/usePermission";
import useProjectsStore from "@/store/projectsStore";
import useSpecbotStore from "@/store/specbotStore";
import { downloadSpecbotChat, extractSpecbotRequirements, summarizeSpecbotChat } from "@/api/specbot";
import { importRequirements } from "@/api/requirements";
import { ExtractedRequirementsModal } from "@/components/requirements/ExtractedRequirementsModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export default function ChatLayout({
  onAction,
  actionLoading = false,
  downloadedChatIds = new Set(),
  // For extractive reqs modal which might still be needed here or lifted
  onImportRequirements,
  isImporting = false,
}) {
  const { user } = useUserStore();
  const { selectedProject } = useProjectsStore();
  const { chats, currentChat, messages, loading, error, fetchChats, setCurrentChat, clearCurrentChat, clearError } =
    useSpecbotStore();

  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);

  // These are now passed as props from parent (SpecbotPage)
  // const [downloadedChatIds, setDownloadedChatIds] = useState(new Set());
  // const [processing, setProcessing] = useState({ ... });
  // const [actionLoading, setActionLoading] = useState(false);
  // const [extractedModalOpen, setExtractedModalOpen] = useState(false);
  // const [extractedReqs, setExtractedReqs] = useState([]);
  // const [isImporting, setIsImporting] = useState(false);

  const canAccess = true; // access control is handled by Sidebar and API, but we can double check
  
  // Permissions replacement for roles
  const canCreateChat = usePermission("create_specbot_chat");
  const canSummarize = usePermission("summarize_specbot_chat");
  const canExtract = usePermission("extract_requirements_from_specbot_chat");
  
  const canAnalyze = canSummarize || canExtract;
  // External users (respondents) don't show attachments, analysts do.
  // We'll use canAnalyze as the proxy for internal users.
  const showAttachments = canAnalyze;
  const isReadOnly = !canCreateChat; // Non-creators view in read-only mode for history if allowed

  const downloaded = useMemo(() => {
    if (!currentChat) return false;
    const isUpToDate =
      currentChat.last_downloaded_at &&
      currentChat.updated_at &&
      new Date(currentChat.last_downloaded_at) >= new Date(currentChat.updated_at);
    return isUpToDate || downloadedChatIds.has(currentChat.id);
  }, [currentChat, downloadedChatIds]);

  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
  };

  const noProjectSelected = !selectedProject?.id;

  return (
    <div className="bg-background relative z-0 flex h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-40 transition-opacity dark:opacity-20"></div>
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="from-primary to-accent relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>

      <div
        className={`${leftSidebarCollapsed ? "w-16" : "w-64"} border-border/50 bg-background/60 z-20 shrink-0 border-r shadow-sm backdrop-blur-xl transition-all duration-300`}
      >
        <LeftSidebar
          collapsed={leftSidebarCollapsed}
          onToggleCollapse={() => setLeftSidebarCollapsed((prev) => !prev)}
          chats={chats}
          onChatSelect={handleChatSelect}
          hideNewChat={!canCreateChat}
          readOnly={isReadOnly}
          activeChatId={currentChat?.id}
        />
      </div>

      <div className="max-h-full min-h-0 flex-1 overflow-hidden">
        <MainPanel
          hasProject={!noProjectSelected}
          canAccess={canAccess}
          currentChat={currentChat}
          messages={messages}
          loading={loading}
          error={error}
          onDismissError={clearError}
          onDownload={canAnalyze ? () => onAction("download") : undefined}
          onSummarize={canAnalyze ? () => onAction("summarize") : undefined}
          onExtract={canAnalyze ? () => onAction("extract") : undefined}
          actionsDisabled={actionLoading}
          downloaded={downloaded}
          showAttachments={showAttachments}
        />
      </div>
    </div>
  );
}
