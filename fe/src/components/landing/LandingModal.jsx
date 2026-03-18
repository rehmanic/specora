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
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-[oklch(0.20_0.02_285)] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[oklch(0.85_0.20_130)] text-[oklch(0.15_0.02_285)] px-6 py-2 rounded-full text-xs font-bold hover:brightness-95 transition-all shadow-sm"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
}
