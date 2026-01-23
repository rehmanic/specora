"use client";

import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

export default function ErrorBox({ message, dismissible = false, onDismiss }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!message || !isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive animate-fade-in">
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="shrink-0 text-destructive/70 hover:text-destructive transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
