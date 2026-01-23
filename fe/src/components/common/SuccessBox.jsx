"use client";

import { CheckCircle, X } from "lucide-react";
import { useState } from "react";

export default function SuccessBox({ message, dismissible = false, onDismiss }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!message || !isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-success/10 border border-success/20 text-success animate-fade-in">
      <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="shrink-0 text-success/70 hover:text-success transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
