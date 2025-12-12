"use client";
import React, { useEffect } from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, title = "Modal", onClose, children }: ModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      aria-modal="true"
      role="dialog"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/70 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* panel */}
      <div className="relative z-10 w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* header */}
        <div className="px-4 py-3 bg-white/90 border-b border-gray-300">
          <h3 className="text-sm font-medium text-slate-700">{title}</h3>
        </div>

        {/* content area */}
        <div className="max-h-[62vh] overflow-y-auto px-5 py-6 text-sm text-slate-700">
          {children}
        </div>

        <div className="px-5 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-28 py-2 bg-slate-800 text-white rounded-md shadow-sm hover:opacity-95"
          >
            Minimize
          </button>
        </div>
      </div>
    </div>
  );
}
