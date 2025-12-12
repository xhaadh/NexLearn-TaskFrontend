"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";

export default function Page() {
  const router = useRouter();
  const [result, setResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("last_exam_result");
      if (raw) {
        setResult(JSON.parse(raw));
      }
    } catch (e) {
     
    }
  }, []);

  function handleDone() {
    router.push("/");
  }

  if (!result) {
    return (
      <RequireAuth>
        <main className="min-h-screen bg-[#e9f8fa] flex items-center justify-center py-16 px-4">
          <div className="w-full max-w-sm">
            <div className="card p-6 text-center">
              No result found. Please complete the test first.
            </div>
            <div className="mt-4">
              <button onClick={() => router.push("/")} className="w-full bg-slate-800 text-white py-2 rounded-md">
                Go Home
              </button>
            </div>
          </div>
        </main>
      </RequireAuth>
    );
  }

  const marksObtained = result.score ?? 0;
  const totalMarks = result.total_marks ?? (result.correct ?? 0) + (result.wrong ?? 0) + (result.not_attended ?? 0);
  const totalQuestions = result.questions_count ?? (result.details?.length ?? 0);
  const correctAnswers = result.correct ?? 0;
  const incorrectAnswers = result.wrong ?? 0;
  const notAttempted = result.not_attended ?? (result.details?.filter((d) => d.status === "not_attended").length ?? 0);

  return (
    <RequireAuth>
      <main className="min-h-screen bg-[#e9f8fa] flex items-start justify-center py-16 px-4">
        <section className="w-full max-w-sm">
          {/* Score card */}
          <div className="mx-auto w-full">
            <div
              aria-hidden
              className="rounded-xl overflow-hidden shadow-md"
              style={{
                background:
                  "linear-gradient(180deg, rgba(6,78,111,1) 0%, rgba(18,81,105,1) 60%, rgba(6,78,111,0.85) 100%)",
              }}
            >
              <div className="py-3 text-center text-sm text-white/90">Marks Obtained:</div>
              <div className="py-6 text-center text-4xl md:text-5xl font-semibold text-white">
                {String(marksObtained).padStart(3, "0")} / {String(totalMarks).padStart(3, "0")}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6">
            <div className="space-y-4">
              <StatRow
                color="bg-amber-400"
                label="Total Questions:"
                value={String(totalQuestions).padStart(3, "0")}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M8 9h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                }
              />

              <StatRow
                color="bg-emerald-500"
                label="Correct Answers:"
                value={String(correctAnswers).padStart(3, "0")}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />

              <StatRow
                color="bg-rose-500"
                label="Incorrect Answers:"
                value={String(incorrectAnswers).padStart(3, "0")}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />

              <StatRow
                color="bg-slate-500"
                label="Not Attended Questions:"
                value={String(notAttempted).padStart(3, "0")}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M21 21c-3.3-3-7.7-5-9-5s-5.7 2-9 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Done button */}
          <div className="mt-6">
            <button onClick={handleDone} className="w-full bg-slate-800 text-white py-2 rounded-md shadow-sm hover:opacity-95" aria-label="Done">
              Done
            </button>
          </div>
        </section>
      </main>
    </RequireAuth>
  );
}

function StatRow({ color, label, value, icon }: { color: string; label: string; value: string; icon: React.ReactNode; }) {
  return (
    <div className="flex items-center justify-between gap-4 px-1">
      <div className="flex items-center gap-3">
        <div className={`w-7 h-7 rounded-sm flex items-center justify-center ${color} text-white`} aria-hidden>
          {icon}
        </div>
        <div className="text-sm text-slate-700">{label}</div>
      </div>

      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
