"use client";

import { useState, useRef } from "react";
import { Send, Paperclip, Smile, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import EmojiPicker from "emoji-picker-react";
import useFileUpload from "@/hooks/useFileUpload";

// Modified to accept showAttachments prop
export default function ChatInputField({
  value = "",
  onChange,
  onSend,
  disabled = false,
  placeholder = "Type a message...",
  showAttachments = true,
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const { uploadFile, uploading } = useFileUpload();

  const currentValue = onChange ? value : localValue;
  const setCurrentValue = onChange || setLocalValue;

  const handleSend = () => {
    if ((currentValue.trim() || attachments.length > 0) && !disabled && !uploading) {
      onSend?.(currentValue, { attachments }); // Pass attachments
      if (!onChange) setLocalValue("");
      setAttachments([]); // Clear attachments
      setShowEmojiPicker(false);
    }
  };

  const handleFileSelect = async (e) => {
    if (!showAttachments) return;
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Upload each file
    // Ideally we could process parallel or use a loop
    // For simplicity/UX, let's just upload one by one or all
    try {
      const newAttachments = [];
      for (const file of files) {
        const uploaded = await uploadFile(file);
        newAttachments.push(uploaded);
      }
      setAttachments((prev) => [...prev, ...newAttachments]);
      // Focus back
      setTimeout(() => textareaRef.current?.focus(), 0);
    } catch (err) {
      console.error("Upload failed", err);
      // Could show toast here
    } finally {
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    if (onChange) {
      onChange(currentValue + emoji);
    } else {
      setLocalValue((prev) => prev + emoji);
    }
    // Adjust height after emoji addition
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
    // Focus back to textarea
    setTimeout(() => textareaRef.current?.focus(), 0);
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
        "relative flex items-end gap-2 bg-transparent px-4 py-3 transition-all duration-200",
        disabled && "opacity-60"
      )}
    >
      {/* Attachment button */}
      {showAttachments && (
        <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
      )}
      {/* Attachment button */}
      {showAttachments && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            "border-border/50 h-9 w-9 shrink-0 rounded-lg transition-all",
            showAttachments && !uploading
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
              : "bg-muted text-muted-foreground"
          )}
          disabled={disabled || uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-[18px] w-[18px]" />
        </Button>
      )}

      {/* Text input */}
      {/* Text input & Previews */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* Attachment Previews */}
        {showAttachments && (attachments.length > 0 || uploading) && (
          <div className="flex flex-wrap gap-2 px-1">
            {attachments.map((file, i) => (
              <div
                key={i}
                className="group/att bg-muted relative flex items-center gap-2 rounded-md border p-1 pr-6 text-xs"
              >
                {file.mimeType?.startsWith("image/") ? (
                  <div className="h-8 w-8 overflow-hidden rounded">
                    <img src={file.url} alt={file.originalName} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="bg-background flex h-8 w-8 items-center justify-center rounded">
                    <Paperclip className="text-muted-foreground h-4 w-4" />
                  </div>
                )}
                <span className="max-w-[100px] truncate">{file.originalName}</span>
                <button
                  onClick={() => removeAttachment(i)}
                  className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 rounded-full p-0.5 opacity-0 transition-opacity group-hover/att:opacity-100"
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {uploading && (
              <div className="text-muted-foreground flex items-center gap-2 p-2 text-xs">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Uploading...
              </div>
            )}
          </div>
        )}

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
          className="placeholder:text-muted-foreground max-h-[120px] w-full resize-none border-0 bg-transparent py-2 text-sm focus:border-0 focus:ring-0 focus:outline-none disabled:cursor-not-allowed"
          style={{ minHeight: "36px", boxShadow: "none" }}
        />
      </div>

      {/* Right actions */}
      <div className="relative flex shrink-0 items-center gap-1">
        <div className="relative">
          {showEmojiPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
              <div className="bg-background absolute right-0 bottom-12 z-50 rounded-xl border shadow-xl">
                <EmojiPicker onEmojiClick={onEmojiClick} theme="auto" width={300} height={400} />
              </div>
            </>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "border-border/50 h-9 w-9 rounded-lg transition-all",
              showEmojiPicker
                ? "border-amber-200 bg-amber-100 text-amber-600 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
            )}
            disabled={disabled}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-[18px] w-[18px]" />
          </Button>
        </div>

        {/* Send button */}
        <Button
          type="button"
          onClick={handleSend}
          disabled={disabled || (!currentValue.trim() && attachments.length === 0) || uploading}
          size="icon"
          className={cn(
            "h-9 w-9 rounded-lg transition-all",
            currentValue.trim() ? "gradient-primary border-0 hover:opacity-90" : "bg-muted text-muted-foreground"
          )}
        >
          <Send className="h-[18px] w-[18px]" />
        </Button>
      </div>
    </div>
  );
}
