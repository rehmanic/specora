import ChatInputFeild from "@/components/common/ChatInputFeild";
import { Message } from "@/components/specbot/Message";
import Starter from "@/components/specbot/Starters";

export default function SpecbotPage() {
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

  return (
    <div className="flex flex-col h-screen border w-full">
      {/* Chat messages */}
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
      <Starter />
      <ChatInputFeild />
    </div>
  );
}
