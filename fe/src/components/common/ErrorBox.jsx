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
    <div className="bg-destructive/10 border-destructive/20 text-destructive animate-fade-in flex items-start gap-3 rounded-lg border p-4">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <p className="flex-1 text-sm">{message}</p>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="text-destructive/70 hover:text-destructive shrink-0 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
