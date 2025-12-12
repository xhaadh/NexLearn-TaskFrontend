"use client";
import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import SmallConfirmModal from "@/components/SmallConfirmModal";
import Legends from "@/components/Legends";
import Modal from "@/components/Modal";
import Image from "next/image";
import RequireAuth from "@/components/RequireAuth";
import { listQuestions, submitAnswers } from "@/lib/api";
import { useRouter } from "next/navigation";

type Option = { id: number; option: string; is_correct?: boolean; image?: string | null };
type Question = {
  question_id: number;
  number: number;
  question: string;
  comprehension?: string | null;
  image?: string | null;
  options: Option[];
};

export default function ExamPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({}); 
  const [marked, setMarked] = useState<Set<number>>(new Set()); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await listQuestions();
        const payload = (res && (res.data ?? res)) as any;

        const qList: Question[] = payload?.questions ?? payload?.data?.questions ?? payload?.questionsList ?? [];
        if (!Array.isArray(qList)) {
          throw new Error("Invalid questions payload");
        }
        if (!mounted) return;
        setQuestions(qList);

        const totalTimeMinutes = Number(payload?.total_time ?? payload?.data?.total_time ?? payload?.time ?? 0);
        const secs = totalTimeMinutes > 0 ? totalTimeMinutes * 60 : 100 * 60; 
        setRemainingSeconds(secs);

        const initialAnswers: Record<number, null> = {};
        qList.forEach((q) => (initialAnswers[q.question_id] = null));
        setAnswers(initialAnswers);
      } catch (err: any) {
        console.error("Failed to load questions", err);
        setFetchError("Failed to load questions");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (remainingSeconds === null) return;
    const t = setInterval(() => {
      setRemainingSeconds((s) => {
        if (s === null) return null;
        if (s <= 1) {
          clearInterval(t);
          handleSubmitAnswers();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSeconds !== null]); 

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  const answeredCount = useMemo(
    () => Object.values(answers).filter((v) => v !== null).length,
    [answers]
  );

  function formatTime(secs: number | null) {
    if (secs === null) return "--:--";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function selectOption(qid: number, optionId: number) {
    setAnswers((prev) => ({ ...prev, [qid]: optionId }));
  }

  function toggleMark(qid: number) {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(qid)) next.delete(qid);
      else next.add(qid);
      return next;
    });
  }

  function goToQuestion(idx: number) {
    if (idx < 0 || idx >= totalQuestions) return;
    setCurrentIndex(idx);
  }

  async function handleSubmitAnswers() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = questions.map((q) => ({
        question_id: q.question_id,
        selected_option_id: answers[q.question_id] ?? null,
      }));
      const res = await submitAnswers(payload);
      const data = res?.data ?? res;
      try {
        sessionStorage.setItem("last_exam_result", JSON.stringify(data));
      } catch (e) {
       
      }
      router.push("/result");
    } catch (err: any) {
      console.error("Submit failed", err);
      alert(err?.response?.data?.message || err?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="card p-6">Loading exam...</div>;
  if (fetchError) return <div className="card p-6 text-red-600">{fetchError}</div>;
  if (!questions.length) return <div className="card p-6">No questions found</div>;

  const isLast = currentIndex === totalQuestions - 1;

  return (
    <RequireAuth>
      <div className="p-6 md:p-5">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-base text-[#1C3141] mb-2 font-medium">Ancient Indian History MCQ</span>
              <span className="text-sm text-gray-600 mb-2 bg-white px-3 py-0.5 font-medium shadow rounded-lg">
                {String(currentIndex + 1).padStart(2, "0")}/{String(totalQuestions).padStart(2, "0")}
              </span>
            </div>

            <div className="bg-white px-5 py-3 rounded-xl mb-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-[#177A9C] hover:opacity-90 text-white text-sm px-4 py-2 rounded-md mb-2 cursor-pointer"
              >
                📘 Read Comprehensive Paragraph
              </button>

              <p className="font-medium mb-2">
                {currentQuestion.number}. {currentQuestion.question}
              </p>

              {currentQuestion.image && (
                <div className="mb-3">
                  <Image src={currentQuestion.image} alt="question image" width={400} height={220} className="rounded-md object-cover" />
                </div>
              )}

            </div>

            <p className="text-sm mb-2 text-gray-500">Choose the answer:</p>

            <div className="space-y-3">
              {currentQuestion.options.map((opt, index) => (
                <label
                  key={opt.id}
                  className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 cursor-pointer bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{String.fromCharCode(64 + (index + 1))}.</div>
                    <div>{opt.option}</div>
                  </div>
                  <input
                    type="radio"
                    name={`q-${currentQuestion.question_id}`}
                    checked={answers[currentQuestion.question_id] === opt.id}
                    onChange={() => selectOption(currentQuestion.question_id, opt.id)}
                  />
                </label>
              ))}

              <div className="flex flex-wrap gap-3 mt-4 sm:flex-row flex-col">
                <button
                  onClick={() => {
                    toggleMark(currentQuestion.question_id);
                  }}
                  className="px-4 py-2 rounded bg-[#800080] text-white flex-1 cursor-pointer hover:opacity-95"
                >
                  {marked.has(currentQuestion.question_id) ? "Unmark Review" : "Mark For Review"}
                </button>

                <button onClick={() => goToQuestion(currentIndex - 1)} className="px-4 py-2 rounded border flex-1 cursor-pointer hover:bg-gray-300" aria-label="Previous question">
                  Previous
                </button>

                <button
                  onClick={() => {
                    if (isLast) {
                      setConfirmOpen(true);
                    } else {
                      goToQuestion(currentIndex + 1);
                    }
                  }}
                  className={`px-4 py-2 flex-1 cursor-pointer hover:opacity-95 rounded bg-[#1C3141] text-white`}
                  aria-label={isLast ? "Submit test" : "Next question"}
                >
                  {isLast ? "Submit" : "Next"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-1/3 pr-5 lg:px-6 lg:border-l border-gray-300">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm sm:text-base font-semibold">Question No. Sheet:</h2>

              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="hidden sm:block">Remaining Time :{" "}</span>
                <span className="bg-gray-900 text-white rounded-lg px-3 py-0.5">{formatTime(remainingSeconds)}</span>
              </div>
            </div>

            <div className="grid grid-cols-10 gap-2 mb-5">
              {questions.map((q, idx) => {
                const num = q.number ?? idx + 1;
                let statusClass = "bg-gray-100 text-slate-800"; // not attended
                if (answers[q.question_id]) statusClass = "bg-green-500 text-white"; // answered
                if (!answers[q.question_id]) statusClass = "bg-gray-100 text-slate-800"; // not attended
                if (marked.has(q.question_id)) statusClass = "bg-purple-700 text-white"; // marked
                return (
                  <button
                    key={q.question_id}
                    onClick={() => goToQuestion(idx)}
                    className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-semibold ${statusClass}`}
                    aria-label={`Question ${num}`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 text-xs">
              <Legends color="bg-green-500" text="Answered" />
              <Legends color="bg-gray-100" text="Not Attempted" />
              <Legends color="bg-purple-700" text="Marked For Review" />
            </div>
          </div>
        </div>


        <Modal open={isModalOpen} title="Comprehension" onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
            <p>{currentQuestion.comprehension ?? "No extra paragraph available."}</p>
          </div>
        </Modal>

        <SmallConfirmModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => {
            handleSubmitAnswers();
          }}
          remainingTime={formatTime(remainingSeconds)}
          totalQuestions={totalQuestions}
          questionsAnswered={answeredCount}
          markedForReview={marked.size}
        />
      </div>
    </RequireAuth>
  );
}
