"use client";

import { Icon } from "@iconify/react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useHydrated from "@/app/components/useHydrated";

const symptoms = [
  { id: "bloating", label: "Blähungen", emoji: "💨" },
  { id: "cravings", label: "Heißhunger", emoji: "🍫" },
  { id: "brainfog", label: "Brain Fog", emoji: "🌫️" },
  {
    id: "jointpain",
    label: "Knochenschwächung und Gelenkschmerzen",
    emoji: "🦴",
  },
  { id: "dryness", label: "Vaginale Trockenheit", emoji: "🌵" },
  { id: "none", label: "Ich habe keines dieser Symptome", emoji: "✅" },
];

const Screen7 = () => {
  const router = useRouter();
  const hydrated = useHydrated();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[] | null>(null);

  const currentSelectedSymptoms = (() => {
    if (selectedSymptoms) return selectedSymptoms;
    if (!hydrated) return [];

    const saved = localStorage.getItem("screen7-symptoms");
    if (!saved) return [];

    try {
      return JSON.parse(saved) as string[];
    } catch {
      return [];
    }
  })();

  const toggleSymptom = (value: string) => {
    setSelectedSymptoms((prev) => {
      const safePrev = prev ?? currentSelectedSymptoms;
      const next = safePrev.includes(value)
        ? safePrev.filter((item) => item !== value)
        : [...safePrev, value];

      localStorage.setItem("screen7-symptoms", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="min-h-[calc(100vh-100px)] pb-32">
      <div className="mx-auto mt-9 max-w-[820px] px-3">
        <h2 className="quiz-title text-center text-(--primary-color)">
          Gab es sonst noch etwas, womit du in letzter Zeit zu kämpfen hattest?
        </h2>

        <h4 className="quiz-subtitle mx-auto mt-6 max-w-md text-center text-(--dark-grey-color)">
          Die zusätzlichen Symptome helfen uns, deinen Zustand besser zu verstehen.
        </h4>

        <div className="page-slide-in mx-auto my-5 grid max-w-md gap-4 px-1.5">
          {symptoms.map((symptom) => {
            const isActive = currentSelectedSymptoms.includes(symptom.id);

            return (
              <label
                key={symptom.id}
                htmlFor={symptom.id}
                className={`group relative flex cursor-pointer items-center justify-between gap-4 rounded-[10px] border-2 p-4 transition-colors duration-300 hover:border-[#9c3246] hover:bg-[#9c32460d] hover:shadow-[0_2px_6px_#0000001a] ${
                  isActive
                    ? "border-[#9c3246] bg-[#9c32460d] shadow-[0_2px_6px_#0000001a]"
                    : "border-[#b96d7c] bg-white"
                }`}
              >
                <div className="flex items-center">
                  <div className="me-3 flex size-10 items-center justify-center rounded-full bg-[#9c32461f]">
                    <div className="text-2xl">{symptom.emoji}</div>
                  </div>
                  <p className="text-[17px] text-[#0a0908]">{symptom.label}</p>
                </div>

                <div>
                  <input
                    type="checkbox"
                    id={symptom.id}
                    className="hidden"
                    checked={isActive}
                    onChange={() => toggleSymptom(symptom.id)}
                  />
                  <div
                    className={`flex size-5 items-center justify-center rounded-sm border transition-all duration-200 ${
                      isActive
                        ? "border-[#b96d7c] bg-[#b96d7c]"
                        : "border-gray-300 bg-white group-hover:border-(--primary-color)"
                    }`}
                  >
                    <Check
                      className={`size-3.5 transition-opacity duration-200 ${
                        isActive
                          ? "opacity-100 text-white"
                          : "text-(--primary-color) opacity-0 group-hover:opacity-100"
                      }`}
                      strokeWidth={3.5}
                    />
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-10 flex w-full justify-center border-t border-gray-100 bg-[#fafafb] px-4 py-5">
        <button
          onClick={() => router.push("/screen8")}
          className="flex min-w-full max-w-max items-center justify-center gap-2.5 rounded-full bg-[#9c3246] px-6 py-3 text-lg uppercase text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#942f43] sm:min-w-md"
        >
          Weiter
          <Icon icon="lucide:arrow-right" width="22" height="22" />
        </button>
      </div>
    </div>
  );
};

export default Screen7;
