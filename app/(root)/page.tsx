"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import RequireAuth from "@/components/RequireAuth";
import { listQuestions } from "@/lib/api";

export default function Page() {
  const [instructionHtml, setInstructionHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [questionsCount, setQuestionsCount] = useState<number | null>(null);
  const [totalMarks, setTotalMarks] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await listQuestions();
        const payload = (res && (res.data ?? res)) as any;
        if (!mounted) return;
        if (payload?.instruction) setInstructionHtml(payload.instruction);
        if (payload?.total_marks) setTotalMarks(payload.total_marks);
        if (payload?.total_time) setTotalTime(payload.total_time);
        if (payload?.questions_count) setQuestionsCount(Number(payload.questions_count));
        else if (Array.isArray(payload?.questions)) setQuestionsCount(payload.questions.length);
      } catch (err: any) {
        console.error("Failed to load instructions:", err);
        setError("Failed to load instructions");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <RequireAuth>
      <section className="flex items-start justify-center py-6">
        <div className="w-full max-w-2xl px-6">
          <h1 className="text-center text-xl md:text-2xl font-semibold text-[#1C3141]">
            Ancient Indian History MCQ
          </h1>

          <div className="mt-6 bg-[#1C3141] text-white rounded-lg shadow-md p-6 md:p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center">
                <div className="text-xs">Total MCQ's:</div>
                <div className="mt-2 text-3xl md:text-4xl font-medium">
                  {questionsCount}
                </div>
              </div>

              <div className="hidden md:block h-20 border-l border-slate-600/60 mx-4" />

              <div className="flex-1 text-center">
                <div className="text-xs">Total marks:</div>
                <div className="mt-2 text-3xl md:text-4xl font-medium">{totalMarks}</div>
              </div>

              <div className="hidden md:block h-20 border-l border-slate-600/60 mx-4" />

              <div className="flex-1 text-center">
                <div className="text-xs">Total time:</div>
                <div className="mt-2 text-3xl md:text-4xl font-medium">{totalTime}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-slate-700">
            <h2 className="font-semibold mb-2">Instructions:</h2>

            {loading && <div className="text-sm text-slate-500">Loading instructions...</div>}

            {error && <div className="text-sm text-rose-600">{error}</div>}

            {!loading && !error && instructionHtml && (
              <div
                className="prose text-sm"
                dangerouslySetInnerHTML={{ __html: instructionHtml }}
              />
            )}

            {!loading && !error && !instructionHtml && (
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>You have 100 minutes to complete the test.</li>
                <li>Test consists of 100 multiple-choice q's.</li>
                <li>Each incorrect answer will incur a negative mark of -1/4.</li>
              </ol>
            )}
          </div>

          <div className="mt-6 flex justify-center mb-4">
            <Button href="/mcq" text="Start Test" className="bg-[#1C3141]" />
          </div>
        </div>
      </section>
    </RequireAuth>
  );
}
