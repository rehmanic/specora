"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import ChatInputFeild from "@/components/common/ChatInputFeild";
import { Message } from "@/components/chat/Message";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import Starter from "@/components/specbot/Starters";
import ChatLayout from "@/components/specbot/team/ChatLayout";
import LeftSidebar from "@/components/specbot/team/LeftSidebar";
import NewChatDialog from "@/components/specbot/NewChatDialog";
import useUserStore from "@/store/authStore";
import useSpecbotStore from "@/store/specbotStore";
import useProjectsStore from "@/store/projectsStore";
import { Loader2 } from "lucide-react";

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

  const handleDeleteChat = async (chat) => {
    if (!chat) return;
    const confirmDelete = window.confirm(
      `Delete chat "${chat.title}"? This cannot be undone.`
    );
    if (!confirmDelete) return;

    setDeletingChatId(chat.id);
    try {
      await deleteChat(chat.id);
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

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return isClient ? (
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
          // Empty state - no chat selected
          <div className="flex flex-1 items-center justify-center p-8 bg-transparent">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Welcome to Specbot
              </h2>
              <p className="text-muted-foreground max-w-md">
                Select a chat from the sidebar or create a new one to start a
                conversation with your AI assistant.
              </p>
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
                  <p className="text-muted-foreground">
                    No messages yet. Start the conversation!
                  </p>
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

            {/* Error Display */}
            {error && (
              <div className="flex items-center justify-between px-4 py-2 bg-destructive/10 text-destructive text-sm">
                <span>{error}</span>
                <button
                  type="button"
                  className="text-xs underline"
                  onClick={clearError}
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Starter + Input */}
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
                  placeholder={
                    sendingMessage
                      ? "Waiting for response..."
                      : "Type your message here..."
                  }
                  showAttachments={false}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* New Chat Dialog */}
      <NewChatDialog
        open={newChatDialogOpen}
        onOpenChange={setNewChatDialogOpen}
        onCreateChat={handleCreateChat}
        loading={creatingChat}
      />
    </div>
  ) : (
    <section className="border w-full flex-1 min-h-0 overflow-hidden">
      <ChatLayout />
    </section>
  );
}
