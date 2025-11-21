"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import ChatInputFeild from "@/components/common/ChatInputFeild";
import { Message } from "@/components/specbot/Message";
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
    clearError,
  } = useSpecbotStore();

  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch chats on mount
  useEffect(() => {
    if (isClient) {
      fetchChats();
    }
  }, [isClient, fetchChats]);

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
    <div className="flex flex-1 w-full min-h-0 overflow-hidden">
      {/* Left Sidebar */}
      <div className={`${leftSidebarCollapsed ? "w-16" : "w-64"} shrink-0`}>
        <LeftSidebar
          collapsed={leftSidebarCollapsed}
          onToggleCollapse={() =>
            setLeftSidebarCollapsed(!leftSidebarCollapsed)
          }
          chats={chats}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
          activeChatId={currentChat?.id}
        />
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1 min-h-0">
        {!currentChat ? (
          // Empty state - no chat selected
          <div className="flex flex-1 items-center justify-center p-8">
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
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
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
                      text={msg.content}
                      timestamp={formatTimestamp(msg.created_at)}
                      isSender={msg.sender_type === "user"}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Starter + Input */}
            <div className="border-t">
              {messages.length === 0 && <Starter onSelect={setInputValue} />}
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
              />
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
