"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { isToday, subDays } from "date-fns";
import ChatInputFeild from "@/components/common/ChatInputFeild";
import { Message } from "@/components/chat/Message";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import Starter from "@/components/specbot/Starters";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useUserStore from "@/store/authStore";
import useSpecbotStore from "@/store/specbotStore";
import useProjectsStore from "@/store/projectsStore";
import { Loader2, MessageSquare, Download, BarChart2, Bot, CheckCircle, Clock, ArrowLeft, FileText, ListChecks, RotateCcw, Edit2, Check, X, Tag } from "lucide-react";
import PageBanner from "@/components/layout/PageBanner";
import {
  downloadSpecbotChat,
  extractSpecbotRequirements,
  summarizeSpecbotChat
} from "@/api/specbot";
import { importRequirements } from "@/api/requirements";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    updateChatLocal,
    clearChat,
  } = useSpecbotStore();

  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [downloadedChatIds, setDownloadedChatIds] = useState(new Set());
  const [actionLoading, setActionLoading] = useState(false);
  const [processing, setProcessing] = useState({
    open: false,
    type: null,
    status: "",
    result: null,
    error: false,
  });
  const [extractedReqs, setExtractedReqs] = useState([]);
  const [selectedReqIds, setSelectedReqIds] = useState(new Set());
  const [editingReqId, setEditingReqId] = useState(null);
  const [editReqForm, setEditReqForm] = useState(null);
  const [confirmImportOpen, setConfirmImportOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultDialog, setResultDialog] = useState({ open: false, title: "", message: "", variant: "default" });
  const [activeTab, setActiveTab] = useState("chat");
  const [summaryData, setSummaryData] = useState(null);

  const messagesEndRef = useRef(null);

  // Fetch chats on mount and clear chat state on project change
  useEffect(() => {
    if (selectedProject?.id) {
      fetchChats(selectedProject.id);
      clearCurrentChat();
      setDownloadedChatIds(new Set()); // Clear memory on project change
      setSummaryData(null);
      setExtractedReqs([]);
      setActiveTab("chat"); // Reset to chat tab
    }
  }, [fetchChats, selectedProject?.id, clearCurrentChat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle opening new chat dialog
  const handleNewChat = () => {
    setNewChatDialogOpen(true);
  };

  // Fetch existing artifacts when switching tabs if they exist on server but not in state
  useEffect(() => {
    if (!currentChat) return;

    if (activeTab === "summary" && !summaryData && currentChat.last_summarized_at) {
      handleAction("summarize", currentChat, true);
    }

    if (activeTab === "requirements" && extractedReqs.length === 0 && currentChat.last_extracted_at) {
      handleAction("extract", currentChat, true);
    }
  }, [activeTab, currentChat, summaryData, extractedReqs.length]);

  const handleClearChat = async () => {
    if (!currentChat) return;
    try {
      await clearChat(currentChat.id);
      setClearModalOpen(false);
    } catch (err) {
      console.error("Failed to clear chat:", err);
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
  const handleAction = async (type, chat = currentChat, silent = false) => {
    if (!chat) return;

    const labels = {
      download: "Downloading chat...",
      summarize: "Summarizing chat...",
      extract: "Extracting requirements...",
    };

    if (!silent) {
      setProcessing({
        open: true,
        type,
        status: labels[type],
        result: null,
        error: false,
      });
    }

    setActionLoading(true);

    try {
      if (type === "download") {
        const response = await downloadSpecbotChat(chat.id);
        const exportedAt = response?.artifact?.exported_at;
        if (exportedAt) {
          updateChatLocal(chat.id, { last_downloaded_at: exportedAt });
        }
        setDownloadedChatIds((prev) => new Set(prev).add(chat.id));
        if (!silent) {
          setProcessing((prev) => ({
            ...prev,
            status: "Chat stored on server",
            result: response?.artifact,
          }));
        }
      } else if (type === "summarize") {
        const response = await summarizeSpecbotChat(chat.id);
        updateChatLocal(chat.id, { last_summarized_at: new Date().toISOString() });
        setSummaryData(response?.artifact?.data);
        if (!silent) setProcessing((prev) => ({ ...prev, open: false }));
      } else if (type === "extract") {
        const response = await extractSpecbotRequirements(chat.id);
        updateChatLocal(chat.id, { last_extracted_at: new Date().toISOString() });
        const reqs = (response?.artifact?.data?.requirements || []).map((req, i) => ({
          ...req,
          _tempId: `req-${i}-${Date.now()}`
        }));
        setExtractedReqs(reqs);
        setSelectedReqIds(new Set(reqs.map(r => r._tempId)));
        if (!silent) {
          setProcessing((prev) => ({ ...prev, open: false }));
          setActiveTab("requirements"); 
        }
      }
    } catch (err) {
      if (!silent) {
        setProcessing((prev) => ({
          ...prev,
          status: err?.message || "Something went wrong. Please try again.",
          error: true,
        }));
      } else {
        console.error(`Silent action ${type} failed:`, err);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleImportRequirements = async () => {
    if (!selectedProject?.id || selectedReqIds.size === 0) return;
    
    const requirementsToImport = extractedReqs
      .filter(r => selectedReqIds.has(r._tempId))
      .map(({ _tempId, ...rest }) => ({
        ...rest,
        status: "draft"
      }));

    setIsImporting(true);
    setConfirmImportOpen(false);
    
    try {
      await importRequirements(selectedProject.id, { requirements: requirementsToImport });
      setResultDialog({
        open: true,
        title: "Success",
        message: `${requirementsToImport.length} requirements successfully imported! You can view them in the Requirements module.`,
        variant: "default"
      });
      // Optionally clear selection or requirements
      // setExtractedReqs([]);
      // setSelectedReqIds(new Set());
    } catch (err) {
      console.error("Failed to import requirements:", err);
      setResultDialog({
        open: true,
        title: "Import Failed",
        message: "Failed to import requirements: " + (err.message || "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleSelectAllReqs = (checked) => {
    if (checked) {
      setSelectedReqIds(new Set(extractedReqs.map(r => r._tempId)));
    } else {
      setSelectedReqIds(new Set());
    }
  };

  const handleToggleSelectReq = (id) => {
    const next = new Set(selectedReqIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedReqIds(next);
  };

  const startEditReq = (req) => {
    setEditingReqId(req._tempId);
    setEditReqForm({
      title: req.title,
      description: req.description,
      priority: req.priority || "mid",
      tags: req.tags ? req.tags.join(", ") : ""
    });
  };

  const saveEditReq = (id) => {
    setExtractedReqs(prev => prev.map(req => {
      if (req._tempId === id) {
        return {
          ...req,
          title: editReqForm.title,
          description: editReqForm.description,
          priority: editReqForm.priority,
          tags: editReqForm.tags.split(",").map(t => t.trim()).filter(Boolean)
        };
      }
      return req;
    }));
    setEditingReqId(null);
  };

  const cancelEditReq = () => {
    setEditingReqId(null);
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

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "mid":
      case "medium": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "low": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
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
      <div className="flex flex-1 w-full h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] overflow-hidden relative z-0">
        {/* Chat Area */}
        <div className="flex flex-col flex-1 min-h-0 max-h-full overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/50 bg-background/60 backdrop-blur-xl px-6 py-4 sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold leading-tight">Specbot</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2 h-9"
              onClick={() => setClearModalOpen(true)}
              disabled={messages.length === 0}
            >
              <RotateCcw className="h-4 w-4" />
              Clear Chat
            </Button>
          </div>
          {!currentChat && loading ? (
            <div className="flex flex-1 items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                        name={
                          msg.sender_type === "bot" ? "SpecBot" :
                            (msg.sender?.display_name || msg.sender?.username || (msg.sender_id === user?.id ? "You" : "Client"))
                        }
                        avatarUrl={msg.sender_type === "user" ? msg.sender?.profile_pic_url : null}
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

        <ConfirmationDialog
          open={clearModalOpen}
          onOpenChange={setClearModalOpen}
          onConfirm={handleClearChat}
          title="Clear Conversation"
          description="Are you sure you want to clear this conversation? All messages will be permanently deleted."
          confirmText="Clear All"
          variant="destructive"
        />
      </div>
    );
  }

  // Manager/RE View: Tabbed Dashboard layout
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8 relative z-0">
      <PageBanner
        title="Specbot Analysis"
        description="Review conversation history and leverage AI to extract structured requirements."
        icon={Bot}
      />

      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full flex flex-col gap-6 md:flex-row">
        <div className="flex flex-col gap-4 min-w-[240px] md:sticky md:top-24">
          <TabsList className="bg-muted/50 h-fit w-full flex-col gap-1 p-1 border rounded-xl">
            <TabsTrigger
              value="chat"
              className="justify-start gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <MessageSquare className="size-4" />
              View Chat
            </TabsTrigger>
            <TabsTrigger
              value="download"
              className="justify-start gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Download className="size-4" />
              Download & Export
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              className="justify-start gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileText className="size-4" />
              AI Summary
            </TabsTrigger>
            <TabsTrigger
              value="requirements"
              className="justify-start gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <ListChecks className="size-4" />
              Extract Requirements
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 w-full flex flex-col">
          <TabsContent value="chat" className="mt-0 space-y-6 outline-none animate-fade-in focus-visible:ring-0">
            <Card className="flex flex-col h-[650px] overflow-hidden">
              <CardHeader className="pb-4 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-4 text-primary" />
                  <CardTitle className="text-lg">Conversation Transcript</CardTitle>
                </div>
                <CardDescription>Review the full history of interactions between the client and Specbot.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                {loading && messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground italic">
                    No messages recorded yet.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <Message
                      key={msg.id}
                      id={msg.id}
                      text={msg.content}
                      timestamp={formatTimestamp(msg.created_at)}
                      isSender={msg.sender_type === "user"}
                      name={
                        msg.sender_type === "bot" ? "SpecBot" :
                          (msg.sender?.display_name || msg.sender?.username || "Client")
                      }
                      avatarUrl={msg.sender_type === "user" ? msg.sender?.profile_pic_url : null}
                      metadata={msg.metadata}
                      allowedActions={["copy"]}
                      menuOpenId={menuOpenId}
                      setMenuOpenId={setMenuOpenId}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="download" className="mt-0 outline-none animate-fade-in focus-visible:ring-0">
            <Card className="h-full">
              <CardHeader className="pb-4 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                  <Download className="size-4 text-primary" />
                  <CardTitle className="text-lg">Sync & Export</CardTitle>
                </div>
                <CardDescription>Prepare the conversation data for AI analysis.</CardDescription>
              </CardHeader>
              <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Download className="h-10 w-10" />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-xl font-bold">Process Conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Specbot needs to sync and format the latest conversation data. This is a prerequisite for generating summaries and extracting requirements.
                  </p>
                </div>
                <div className="pt-4 flex flex-col items-center gap-4">
                  <Button
                    size="lg"
                    className="gap-2 px-10 shadow-lg hover:shadow-primary/20 transition-all font-bold"
                    onClick={() => handleAction("download", currentChat)}
                    disabled={actionLoading || !currentChat}
                  >
                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Sync Data Now
                  </Button>
                  {currentChat?.last_downloaded_at && (
                    <div className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2 border border-emerald-500/20">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Last synced: {new Date(currentChat.last_downloaded_at).toLocaleString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="mt-0 outline-none animate-fade-in focus-visible:ring-0">
            <Card className="flex flex-col h-[650px] overflow-hidden">
              <CardHeader className="pb-4 border-b bg-muted/20 flex flex-row items-center justify-between space-y-0">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    <CardTitle className="text-lg">AI Summary</CardTitle>
                  </div>
                  <CardDescription>Concise overview of project goals and discussed requirements.</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 font-bold"
                  onClick={() => handleAction("summarize", currentChat)}
                  disabled={actionLoading || !currentChat}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Regenerate
                </Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-8">
                {summaryData ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:mb-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {summaryData.summary_text}
                    </ReactMarkdown>
                  </div>
                ) : !currentChat?.last_summarized_at ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div className="max-w-xs space-y-2">
                      <p className="font-bold">No summary available</p>
                      <p className="text-xs text-muted-foreground italic">Generate a summary to get a structural overview of the requirements discussed.</p>
                    </div>
                    <Button size="sm" onClick={() => handleAction("summarize", currentChat)} disabled={actionLoading || !currentChat} className="font-bold">
                      Generate Summary
                    </Button>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
                      <p className="text-sm text-muted-foreground animate-pulse font-medium">Fetching summary...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="mt-0 outline-none animate-fade-in focus-visible:ring-0">
            <Card className="flex flex-col h-[650px] overflow-hidden">
              <CardHeader className="pb-4 border-b bg-muted/20 flex flex-row items-center justify-between space-y-0">
                <div>
                  <div className="flex items-center gap-2">
                    <ListChecks className="size-4 text-primary" />
                    <CardTitle className="text-lg">Import Requirements</CardTitle>
                  </div>
                  <CardDescription>
                    {extractedReqs.length > 0 
                      ? `AI extracted ${extractedReqs.length} requirements. Review, edit, and select which ones to import.`
                      : "AI-identified functional and non-functional requirements."}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-2 font-bold"
                    onClick={() => handleAction("extract", currentChat)}
                    disabled={actionLoading || !currentChat}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {extractedReqs.length > 0 ? "Refresh" : "Extract"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0">
                {extractedReqs.length > 0 ? (
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b bg-muted/5 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="select-all" 
                          checked={extractedReqs.length > 0 && selectedReqIds.size === extractedReqs.length}
                          onCheckedChange={handleSelectAllReqs}
                        />
                        <label
                          htmlFor="select-all"
                          className="text-sm font-semibold cursor-pointer"
                        >
                          Select All ({selectedReqIds.size} / {extractedReqs.length})
                        </label>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => setConfirmImportOpen(true)}
                        disabled={isImporting || selectedReqIds.size === 0}
                        className="font-bold shadow-sm"
                      >
                        {isImporting ? "Importing..." : "Import"}
                      </Button>
                    </div>

                    <div className="p-6 space-y-4">
                      {extractedReqs.map((req) => {
                        const isEditing = editingReqId === req._tempId;
                        const isSelected = selectedReqIds.has(req._tempId);

                        return (
                          <div 
                            key={req._tempId} 
                            className={`flex items-start gap-4 p-5 rounded-xl border transition-all ${isSelected ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-card hover:bg-muted/5'}`}
                          >
                            <div className="pt-1">
                              <Checkbox 
                                checked={isSelected}
                                onCheckedChange={() => handleToggleSelectReq(req._tempId)}
                              />
                            </div>

                            <div className="flex-1 space-y-2 overflow-hidden">
                              {isEditing ? (
                                <div className="space-y-4 bg-background p-4 rounded-lg border">
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Title</label>
                                    <Input 
                                      value={editReqForm.title} 
                                      onChange={(e) => setEditReqForm(f => ({ ...f, title: e.target.value }))}
                                      placeholder="Requirement Title"
                                      className="font-semibold"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Description</label>
                                    <Textarea 
                                      value={editReqForm.description} 
                                      onChange={(e) => setEditReqForm(f => ({ ...f, description: e.target.value }))}
                                      placeholder="Detailed description..."
                                      rows={3}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Tags (comma separated)</label>
                                      <Input 
                                        value={editReqForm.tags} 
                                        onChange={(e) => setEditReqForm(f => ({ ...f, tags: e.target.value }))}
                                        placeholder="e.g. Auth, API..."
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Priority</label>
                                      <Select 
                                        value={editReqForm.priority} 
                                        onValueChange={(val) => setEditReqForm(f => ({ ...f, priority: val }))}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="high">High</SelectItem>
                                          <SelectItem value="mid">Medium</SelectItem>
                                          <SelectItem value="low">Low</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2 pt-2">
                                    <Button size="sm" variant="ghost" onClick={cancelEditReq}>
                                      Cancel
                                    </Button>
                                    <Button size="sm" onClick={() => saveEditReq(req._tempId)}>
                                      Save Changes
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                      <h4 className="font-bold text-base flex items-center gap-3">
                                        {req.title}
                                        <Badge variant="outline" className={`${getPriorityColor(req.priority)} text-[10px] uppercase font-bold px-2`}>
                                          {req.priority}
                                        </Badge>
                                      </h4>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => startEditReq(req)}>
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                                    {req.description}
                                  </p>
                                  {req.tags && req.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                      {req.tags.map((tag, i) => (
                                        <Badge key={i} variant="secondary" className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-md flex items-center gap-1">
                                          <Tag className="h-3 w-3" /> {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                      <ListChecks className="h-8 w-8" />
                    </div>
                    <div className="max-w-xs space-y-2">
                      <p className="font-bold">No requirements extracted</p>
                      <p className="text-xs text-muted-foreground italic">Convert the conversation into actionable requirement drafts for your project.</p>
                    </div>
                    <Button size="sm" onClick={() => handleAction("extract", currentChat)} disabled={actionLoading || !currentChat} className="font-bold">
                      Extract Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <ConfirmationDialog
        open={confirmImportOpen}
        onOpenChange={setConfirmImportOpen}
        onConfirm={handleImportRequirements}
        title="Import Requirements"
        description={`Are you sure you want to import ${selectedReqIds.size} requirements? They will be saved as drafts in your project.`}
        confirmText="Import"
      />

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


      {/* Re-use shared dialogs */}
      <ConfirmationDialog
        open={resultDialog.open}
        onOpenChange={(open) => setResultDialog(prev => ({ ...prev, open }))}
        onConfirm={() => setResultDialog(prev => ({ ...prev, open: false }))}
        title={resultDialog.title}
        description={resultDialog.message}
        confirmText="OK"
        variant={resultDialog.variant}
      />
    </div>
  );
}
