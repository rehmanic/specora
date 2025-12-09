"use client";

import React, { useState, useRef } from "react";
import { Paperclip, Send } from "lucide-react";

export default function InputField({
  value: controlledValue,
  onChange: controlledOnChange,
  onSend: controlledOnSend,
  disabled = false,
  placeholder = "Type your message here..."
}) {
  const [internalValue, setInternalValue] = useState("");
  const fileInputRef = useRef(null);

  // Use controlled value if provided, otherwise use internal state
  const inputValue = controlledValue !== undefined ? controlledValue : internalValue;
  const setInputValue = controlledOnChange || setInternalValue;

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log("Selected file:", files[0].name);
      // Handle file upload logic here
    }
  };

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      if (controlledOnSend) {
        controlledOnSend(inputValue);
      } else {
        console.log("Sending message:", inputValue);
        setInputValue("");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring">
        {/* File Upload Button */}
        <button
          type="button"
          onClick={handleFileClick}
          className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors cursor-pointer hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />

        {/* Input Field */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none md:text-base disabled:opacity-50"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!inputValue.trim() || disabled}
          className="flex items-center justify-center rounded-md p-2 transition-colors cursor-pointer bg-primary text-primary-foreground hover:bg-black focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
