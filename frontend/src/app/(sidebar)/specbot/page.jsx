"use client";

import { useState } from "react";
import ChatInputFeild from "@/components/common/ChatInputFeild";
import { Message } from "@/components/specbot/Message";
import Starter from "@/components/specbot/Starters";
import ChatLayout from "@/components/specbot/team/ChatLayout";
import LeftSidebar from "@/components/specbot/team/LeftSidebar";
import useUserStore from "@/store/authStore";

export default function SpecbotPage() {
  const { user } = useUserStore();

  const messages = [
    { text: "Hey! How’s it going?", timestamp: "10:00 AM", isSender: false },
    {
      text: "All good, just working on the project.",
      timestamp: "10:02 AM",
      isSender: true,
    },
    {
      text: "Nice! Let me know if you need help.",
      timestamp: "10:03 AM",
      isSender: false,
    },
    {
      text: "Sure thing, appreciate it 👍",
      timestamp: "10:05 AM",
      isSender: true,
    },
  ];

  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);

  return user.role === "client" ? (
    <div className="flex h-screen w-full border">
      {/* Left Sidebar */}
      <div className={`${leftSidebarCollapsed ? "w-16" : "w-64"} shrink-0`}>
        <LeftSidebar
          collapsed={leftSidebarCollapsed}
          onToggleCollapse={() =>
            setLeftSidebarCollapsed(!leftSidebarCollapsed)
          }
        />
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Messages */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {messages.map((msg, i) => (
            <Message
              key={i}
              text={msg.text}
              timestamp={msg.timestamp}
              isSender={msg.isSender}
            />
          ))}
        </div>

        {/* Starter + Input */}
        <div className="border-t">
          <Starter />
          <ChatInputFeild />
        </div>
      </div>
    </div>
  ) : (
    <section className="border w-full">
      <ChatLayout />
    </section>
  );
}
