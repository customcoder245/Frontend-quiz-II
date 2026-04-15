"use client";

import { useEffect, useState } from "react";

type ApiQuestion = {
  _id: string;
  questionText: string;
  classid?: string;
};

const SESSION_CACHE_KEY = "quiz-questions-cache-v1";

const readCachedQuestions = (): ApiQuestion[] | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ApiQuestion[]) : null;
  } catch {
    return null;
  }
};

const writeCachedQuestions = (questions: ApiQuestion[]) => {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(questions));
  } catch {
    // Ignore cache write errors.
  }
};

const findQuestionText = (questions: ApiQuestion[], key: string) => {
  const byId = questions.find((question) => question._id === key);
  if (byId?.questionText) return byId.questionText;

  const byClass = questions.find((question) => question.classid === key);
  if (byClass?.questionText) return byClass.questionText;

  return null;
};

export const useQuestionText = (questionKey: string, fallback: string) => {
  const [text, setText] = useState(fallback);

  useEffect(() => {
    let ignore = false;

    Promise.resolve().then(() => {
      if (!ignore) {
        setText(fallback);
      }
    });

    const cached = readCachedQuestions();
    if (cached) {
      const candidate = findQuestionText(cached, questionKey);
      if (candidate) {
        Promise.resolve().then(() => {
          if (!ignore) {
            setText(candidate);
          }
        });
      }
    }

    void (async () => {
      try {
        const response = await fetch(`/api/questions?gender=female`, {
          cache: "no-store",
        });
        if (!response.ok) return;

        const data = (await response.json()) as { questions?: ApiQuestion[] };
        const nextQuestions = Array.isArray(data.questions) ? data.questions : [];
        if (nextQuestions.length === 0) return;

        writeCachedQuestions(nextQuestions);

        const candidate = findQuestionText(nextQuestions, questionKey);
        if (candidate && !ignore) {
          setText(candidate);
        }
      } catch {
        // Ignore network errors and keep fallback/cached values.
      }
    })();

    return () => {
      ignore = true;
    };
  }, [fallback, questionKey]);

  return text;
};
