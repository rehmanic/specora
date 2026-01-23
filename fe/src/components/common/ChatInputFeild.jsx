"use client";

import { useState, useRef } from "react";
import { Send, Paperclip, Smile, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ChatInputField({
  value = "",
  onChange,
  onSend,
  disabled = false,
  placeholder = "Type a message...",
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const currentValue = onChange ? value : localValue;
  const setCurrentValue = onChange || setLocalValue;

  const handleSend = () => {
    if (currentValue.trim() && !disabled) {
      onSend?.(currentValue);
      if (!onChange) setLocalValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto resize textarea
  const handleInput = (e) => {
    setCurrentValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div
      className={cn(
        "flex items-end gap-2 p-3 rounded-xl border bg-card transition-all duration-200",
        isFocused ? "border-primary ring-2 ring-primary/20" : "border-input",
        disabled && "opacity-60"
      )}
    >
      {/* Attachment button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
        disabled={disabled}
      >
        <Paperclip className="h-5 w-5" />
      </Button>

      {/* Text input */}
      <div className="flex-1 min-w-0">
        <textarea
          ref={textareaRef}
          value={currentValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="w-full resize-none bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed max-h-[120px]"
          style={{ minHeight: "24px" }}
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          disabled={disabled}
        >
          <Smile className="h-5 w-5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          disabled={disabled}
        >
          <Mic className="h-5 w-5" />
        </Button>

        {/* Send button */}
        <Button
          type="button"
          onClick={handleSend}
          disabled={disabled || !currentValue.trim()}
          size="icon"
          className={cn(
            "h-9 w-9 rounded-lg transition-all",
            currentValue.trim()
              ? "gradient-primary border-0 hover:opacity-90"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
