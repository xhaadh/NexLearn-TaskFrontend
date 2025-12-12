"use client";
import React, { useEffect } from "react";

type SmallConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  remainingTime: string;
  totalQuestions: number;
  questionsAnswered: number;
  markedForReview: number;
};

export default function SmallConfirmModal({
  open,
  onClose,
  onConfirm,
  remainingTime,
  totalQuestions,
  questionsAnswered,
  markedForReview,
}: SmallConfirmModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm submit"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xs bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-sm font-medium text-slate-800">
            Are you sure you want to submit the test?
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-500 hover:text-slate-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="border-t border-gray-300" />

        <div className="p-4 space-y-3 text-sm text-slate-700">
          <StatRow
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-900">
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            }
            label="Remaining Time:"
            value={remainingTime}
          />

          <StatRow
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 9h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            }
            label="Total Questions:"
            value={String(totalQuestions).padStart(3, "0")}
          />

          <StatRow
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 12h2l1 1 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            label="Questions Answered:"
            value={String(questionsAnswered).padStart(3, "0")}
          />

          <StatRow
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 8h8v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            label="Marked for review:"
            value={String(markedForReview).padStart(3, "0")}
          />
        </div>

        <div className="" />

        <div className="px-4 py-4">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full inline-flex items-center justify-center bg-slate-800 text-white py-2 rounded-md text-sm font-medium hover:opacity-95"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string; }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-800">
          {icon}
        </div>
        <div className="text-xs text-slate-600">{label}</div>
      </div>

      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
