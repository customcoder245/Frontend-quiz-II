"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import useHydrated from "@/app/components/useHydrated";
import { useQuestionText } from "@/app/components/quiz/useQuestionText";

const Screen6 = () => {
  const router = useRouter();
  const hydrated = useHydrated();
  const title = useQuestionText(
    "screen6-anxious",
    "Fühlst du dich oft ängstlich oder überfordert?",
  );
  const [anxious, setAnxious] = useState<string | null>(null);
  const currentAnxious =
    anxious ?? (hydrated ? localStorage.getItem("screen6-anxious") : null);

  const handleSelect = (value: string) => {
    setAnxious(value);
    localStorage.setItem("screen6-anxious", value);
    window.setTimeout(() => {
      router.push("/screen7");
    }, 150);
  };

  return (
    <div>
      <div className="mx-auto mt-9 max-w-[820px] px-3">
        <h2 className="quiz-title text-center text-(--primary-color)">
          {title}
        </h2>

        <div className="page-slide-in mx-auto my-5 grid max-w-md gap-4 px-1.5">
          {[
            ["1", "😰", "Ja"],
            ["2", "😌", "Nein"],
            ["3", "🤐", "Möchte ich nicht beantworten"],
          ].map(([value, emoji, label]) => (
            <label
              key={value}
              htmlFor={`anxious-${value}`}
              onClick={() => handleSelect(value)}
              className={`group relative flex cursor-pointer items-center justify-between gap-4 rounded-[10px] border-2 p-4 transition-colors duration-300 hover:border-[#9c3246] hover:bg-[#9c32460d] hover:shadow-[0_2px_6px_#0000001a] ${
                currentAnxious === value
                  ? "border-[#9c3246] bg-[#9c32460d] shadow-[0_2px_6px_#0000001a]"
                  : "border-[#b96d7c] bg-white"
              }`}
            >
              <div className="flex items-center">
                <div className="me-3 flex size-10 items-center justify-center rounded-full bg-[#9c32461f]">
                  <div className="text-2xl">{emoji}</div>
                </div>
                <p className="text-[17px] text-[#0a0908]">{label}</p>
              </div>

              <input
                type="radio"
                className="size-5 rounded-full accent-(--primary-color)"
                name="anxious-status"
                id={`anxious-${value}`}
                checked={currentAnxious === value}
                onChange={() => handleSelect(value)}
                onClick={() => handleSelect(value)}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Screen6;
