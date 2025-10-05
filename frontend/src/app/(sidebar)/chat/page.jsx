"use client";
import { useState } from "react";
import { Message } from "@/components/chat/Message";
import ChatInputFeild from "@/components/common/ChatInputFeild";

export default function ChatPage() {
  const [menuOpenId, setMenuOpenId] = useState(null);

  const messages = [
    {
      id: 1,
      text: "Hey! How’s it going?",
      timestamp: "10:00 AM",
      isSender: false,
      name: "Alice",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    },
    {
      id: 2,
      text: "All good, just working on the project.",
      timestamp: "10:02 AM",
      isSender: true,
      name: "You",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
    },
    {
      id: 3,
      text: "Nice! Let me know if you need help.",
      timestamp: "10:03 AM",
      isSender: false,
      name: "Alice",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    },
    {
      id: 4,
      text: "Sure thing, appreciate it 👍",
      timestamp: "10:05 AM",
      isSender: true,
      name: "You",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
    },
  ];

  return (
    <section className="flex flex-col h-screen border w-full p-4 space-y-3 overflow-y-auto">
      {messages.map((msg) => (
        <Message
          key={msg.id}
          {...msg}
          menuOpenId={menuOpenId}
          setMenuOpenId={setMenuOpenId}
        />
      ))}
      <ChatInputFeild />
    </section>
  );
}
