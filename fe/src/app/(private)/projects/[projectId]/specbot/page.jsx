"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import ChatInputFeild from "@/components/common/ChatInputFeild";
import { Message } from "@/components/chat/Message";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import ChatLayout from "@/components/specbot/team/ChatLayout";
import LeftSidebar from "@/components/specbot/team/LeftSidebar";
import NewChatDialog from "@/components/specbot/NewChatDialog";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import useUserStore from "@/store/authStore";
import useSpecbotStore from "@/store/specbotStore";
import useProjectsStore from "@/store/projectsStore";
import { Loader2, MessageSquare, Download, BarChart2, Bot } from "lucide-react";
import PageBanner from "@/components/layout/PageBanner";
import StatsCard from "@/components/requirements/StatsCard";
import SpecbotTableView from "@/components/specbot/team/SpecbotTableView";
import { 
  downloadSpecbotChat, 
  extractSpecbotRequirements, 
  summarizeSpecbotChat 
} from "@/api/specbot";
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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function SpecbotPage() {
  const { user } = useUserStore();
  const { selectedProject } = useProjectsStore();
  const params = useParams();
  const projectId = params.projectId;
  const isClient = user?.role === "client";

  const {
    chats,
    currentChat,
    messages,
    loading,
    sendingMessage,
    error,
    fetchChats,
    createChat,
    setCurrentChat,
    sendMessage,
    deleteChat,
    clearError,
    clearCurrentChat,
    updateChat,
  } = useSpecbotStore();

  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null); // New state for message menu
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [downloadedChatIds, setDownloadedChatIds] = useState(new Set());
  const [actionLoading, setActionLoading] = useState(false);
  const [processing, setProcessing] = useState({
    open: false,
    type: null,
    status: "",
    result: null,
    error: false,
  });
  const [extractedModalOpen, setExtractedModalOpen] = useState(false);
  const [extractedReqs, setExtractedReqs] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Fetch chats on mount and clear chat state on project change
  useEffect(() => {
    if (isClient && selectedProject?.id) {
      fetchChats(selectedProject.id);
      clearCurrentChat(); // <-- clear chat when switching projects
    }
  }, [isClient, fetchChats, selectedProject?.id, clearCurrentChat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle opening new chat dialog
  const handleNewChat = () => {
    setNewChatDialogOpen(true);
  };

  // Handle creating chat from dialog
  const handleCreateChat = async (title) => {
    setCreatingChat(true);
    try {
      await createChat({
        title: title,
        user_id: user.id,
        project_id: selectedProject?.id,
      });
      // The store automatically sets this as current chat
      setNewChatDialogOpen(false);
    } catch (err) {
      console.error("Failed to create chat:", err);
      // Keep dialog open on error so user can retry
    } finally {
      setCreatingChat(false);
    }
  };

  // Handle chat selection
  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
  };

  const handleDeleteChat = (chat) => {
    if (!chat) return;
    setChatToDelete(chat);
    setDeleteModalOpen(true);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;
    setDeletingChatId(chatToDelete.id);
    try {
      await deleteChat(chatToDelete.id);
      setDeleteModalOpen(false);
      setChatToDelete(null);
    } catch (err) {
      console.error("Failed to delete chat:", err);
    } finally {
      setDeletingChatId(null);
    }
  };

  const handleRenameChat = async (chatId, newTitle) => {
    try {
      await updateChat(chatId, { title: newTitle });
    } catch (err) {
      console.error("Failed to rename chat:", err);
    }
  };

  // Handle send message
  const handleSendMessage = async (content) => {
    if (!content.trim() || !currentChat) return;

    try {
      await sendMessage({
        chat_type: "specbot",
        chat_id: currentChat.id,
        content: content.trim(),
        sender_type: "user",
        sender_id: user.id,
        instructions: {}, // You can add custom instructions here
      });
      setInputValue("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Handle Specbot Actions (Download, Summarize, Extract)
  const handleAction = async (type, chat = currentChat) => {
    if (!chat) return;

    const labels = {
      download: "Downloading chat...",
      summarize: "Summarizing chat...",
      extract: "Extracting requirements...",
    };

    setProcessing({
      open: true,
      type,
      status: labels[type],
      result: null,
      error: false,
    });
    setActionLoading(true);

    try {
      if (type === "download") {
        const response = await downloadSpecbotChat(chat.id);
        setDownloadedChatIds((prev) => new Set(prev).add(chat.id));
        setProcessing((prev) => ({
          ...prev,
          status: "Chat stored on server",
          result: response?.artifact,
        }));
      } else if (type === "summarize") {
        const response = await summarizeSpecbotChat(chat.id);
        setProcessing((prev) => ({
          ...prev,
          status: "Summary ready",
          result: response?.artifact,
        }));
      } else if (type === "extract") {
        const response = await extractSpecbotRequirements(chat.id);
        const reqs = response?.artifact?.data?.requirements || [];
        setExtractedReqs(reqs);
        setProcessing((prev) => ({ ...prev, open: false }));
        setExtractedModalOpen(true);
      }
    } catch (err) {
      setProcessing((prev) => ({
        ...prev,
        status: err?.message || "Something went wrong. Please try again.",
        error: true,
      }));
    } finally {
      setActionLoading(false);
    }
  };

  const handleImportRequirements = async (requirementsToImport) => {
    if (!selectedProject?.id) return;
    setIsImporting(true);
    try {
      await importRequirements(selectedProject.id, { requirements: requirementsToImport });
      setExtractedModalOpen(false);
      // We'll use a standard alert for now as per ChatLayout
      alert("Requirements successfully imported!");
    } catch (err) {
      console.error("Failed to import requirements:", err);
      alert("Failed to import requirements: " + (err.message || ""));
    } finally {
      setIsImporting(false);
    }
  };

  const closeProcessing = () => setProcessing(p => ({ ...p, open: false }));

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user || !selectedProject) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Client View: Chat-centric sidebar layout
  if (isClient) {
    return (
      <div className="flex flex-1 w-full h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] overflow-hidden bg-background relative z-0">
        {/* Dynamic Background Pattern */}
        <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none -z-10 dark:opacity-20 transition-opacity"></div>
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        {/* Left Sidebar */}
        <div className={`${leftSidebarCollapsed ? "w-16" : "w-64"} shrink-0 border-r border-border/50 bg-background/60 backdrop-blur-xl z-20 transition-all duration-300 shadow-sm`}>
          <LeftSidebar
            collapsed={leftSidebarCollapsed}
            onToggleCollapse={() =>
              setLeftSidebarCollapsed(!leftSidebarCollapsed)
            }
            chats={chats}
            onChatSelect={handleChatSelect}
            onNewChat={handleNewChat}
            activeChatId={currentChat?.id}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
            deletingChatId={deletingChatId}
          />
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-1 min-h-0 max-h-full overflow-hidden">
          {!currentChat ? (
            <div className="flex flex-1 items-center justify-center p-8 bg-transparent">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Welcome to Specbot</h2>
                <p className="text-muted-foreground max-w-md">Select a chat from the sidebar or create a new one to start a conversation with your AI assistant.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-transparent">
                {loading && messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <Message
                        key={msg.id}
                        id={msg.id}
                        text={msg.content}
                        timestamp={formatTimestamp(msg.created_at)}
                        isSender={msg.sender_type === "user"}
                        name={msg.sender_type === "user" ? user?.username || "You" : "SpecBot"}
                        avatarUrl={msg.sender_type === "user" ? user?.profile_pic_url : null}
                        metadata={msg.metadata}
                        allowedActions={["copy"]}
                        menuOpenId={menuOpenId}
                        setMenuOpenId={setMenuOpenId}
                      />
                    ))}
                    <TypingIndicator isVisible={sendingMessage} />
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 sm:p-6 pb-6 bg-transparent">
                {messages.length === 0 && (
                  <div className="px-4 pb-4">
                    <Starter onSelect={setInputValue} />
                  </div>
                )}
                <div className="max-w-4xl mx-auto rounded-2xl shadow-2xl shadow-primary/5 dark:shadow-primary/10 border border-primary/10 bg-card/80 backdrop-blur-xl overflow-hidden ring-1 ring-white/10 dark:ring-white/5 transition-all">
                  <ChatInputFeild
                    value={inputValue}
                    onChange={setInputValue}
                    onSend={handleSendMessage}
                    disabled={sendingMessage}
                    placeholder={sendingMessage ? "Waiting for response..." : "Type your message here..."}
                    showAttachments={false}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <NewChatDialog
          open={newChatDialogOpen}
          onOpenChange={setNewChatDialogOpen}
          onCreateChat={handleCreateChat}
          loading={creatingChat}
        />

        <ConfirmationDialog
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          onConfirm={confirmDeleteChat}
          title="Delete Chat"
          description={`Are you sure you want to delete the chat "${chatToDelete?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          variant="destructive"
        />
      </div>
    );
  }

  // Manager/RE View: Dashboard layout with Table
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8 bg-background relative z-0">
      {/* Background patterns for non-client view too */}
      <div className="absolute inset-0 hero-grid opacity-20 pointer-events-none -z-10 dark:opacity-10 transition-opacity"></div>
      
      <PageBanner
        title="Specbot Analysis"
        description="Review, download, and extract requirements from Specbot conversations."
        icon={Bot}
      />

      {/* Stats Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Conversations"
          value={chats.length}
          icon={MessageSquare}
          description="Total sessions with Specbot"
        />
        <StatsCard
          title="Analyzable Chats"
          value={downloadedChatIds.size}
          icon={Download}
          description="Chats stored for analysis"
          color="emerald"
        />
        <StatsCard
          title="Processing Status"
          value={actionLoading ? "Busy" : "Idle"}
          icon={BarChart2}
          description={actionLoading ? "Currently processing an action" : "System ready for analysis"}
          color={actionLoading ? "yellow" : "violet"}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Project Conversations
          </h3>
          <p className="text-xs text-muted-foreground italic">
            Manager & Requirements Engineer View
          </p>
        </div>

        {currentChat ? (
          <div className="flex flex-col h-[600px] border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm shadow-xl">
             <ChatLayout 
               onAction={handleAction}
               actionLoading={actionLoading}
               downloadedChatIds={downloadedChatIds}
               onImportRequirements={handleImportRequirements}
               isImporting={isImporting}
             />
          </div>
        ) : (
          <SpecbotTableView 
            chats={chats}
            downloadedChatIds={downloadedChatIds}
            actionLoading={actionLoading}
            onViewChat={handleChatSelect}
            onAction={handleAction}
          />
        )}
      </div>

      {/* Processing Dialog */}
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
                  processing.result.data.requirements.map((req, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="font-semibold">{req.title}</p>
                      <p className="text-muted-foreground">{req.description}</p>
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

      <ExtractedRequirementsModal
        isOpen={extractedModalOpen}
        onClose={() => setExtractedModalOpen(false)}
        requirements={extractedReqs}
        onImport={handleImportRequirements}
        isImporting={isImporting}
      />

      {/* Re-use shared dialogs */}
      <ConfirmationDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDeleteChat}
        title="Delete Chat"
        description={`Are you sure you want to delete the chat "${chatToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
