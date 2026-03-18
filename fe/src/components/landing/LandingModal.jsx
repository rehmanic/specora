"use client";

import { X } from "lucide-react";

/**
 * A reusable modal component for the landing page.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible.
 * @param {Function} props.onClose - Function to call when closing the modal.
 * @param {string} props.title - The title to display in the header.
 * @param {React.ReactNode} props.children - The content to display in the modal body.
 */
export default function LandingModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-950/80 backdrop-blur-sm duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="animate-in zoom-in-95 fade-in relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.20_0.02_285)] shadow-2xl duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full p-1 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="custom-scrollbar max-h-[70vh] overflow-y-auto px-6 py-8">{children}</div>

        {/* Footer */}
        <div className="flex justify-end border-t border-white/10 bg-white/5 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-full bg-[oklch(0.85_0.20_130)] px-6 py-2 text-xs font-bold text-[oklch(0.15_0.02_285)] shadow-sm transition-all hover:brightness-95"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
}
