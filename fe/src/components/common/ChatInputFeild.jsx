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
      setAttachments(prev => [...prev, ...newAttachments]);
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
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    setCurrentValue((prev) => prev + emoji);
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
        "flex items-end gap-2 px-4 py-3 bg-transparent transition-all duration-200 relative",
        isFocused ? "bg-accent/50" : "",
        disabled && "opacity-60"
      )}
    >
      {/* Attachment button */}
      {showAttachments && (
        <input
          type="file"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
      )}
      {/* Attachment button */}
      {showAttachments && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          disabled={disabled || uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
      )}

      {/* Text input */}
      {/* Text input & Previews */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {/* Attachment Previews */}
        {showAttachments && (attachments.length > 0 || uploading) && (
          <div className="flex flex-wrap gap-2 px-1">
            {attachments.map((file, i) => (
              <div key={i} className="relative group/att bg-muted rounded-md p-1 pr-6 flex items-center gap-2 text-xs border">
                {file.mimeType?.startsWith("image/") ? (
                  <div className="h-8 w-8 rounded overflow-hidden">
                    <img src={file.url} alt={file.originalName} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-8 w-8 bg-background flex items-center justify-center rounded">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <span className="max-w-[100px] truncate">{file.originalName}</span>
                <button
                  onClick={() => removeAttachment(i)}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover/att:opacity-100 transition-opacity"
                >
                  <span className="sr-only">Remove</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
              </div>
            ))}
            {uploading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
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
          className="w-full resize-none bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed max-h-[120px]"
          style={{ minHeight: "24px" }}
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 shrink-0 relative">
        <div className="relative">
          {showEmojiPicker && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowEmojiPicker(false)}
              />
              <div className="absolute bottom-12 right-0 z-50 shadow-xl rounded-xl border bg-background">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  theme="auto"
                  width={300}
                  height={400}
                />
              </div>
            </>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 text-muted-foreground hover:text-foreground",
              showEmojiPicker && "text-primary bg-accent"
            )}
            disabled={disabled}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-5 w-5" />
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
