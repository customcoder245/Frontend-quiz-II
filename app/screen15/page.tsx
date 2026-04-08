"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STEPS = [
  {
    key: "answers",
    text: "Auswertung deiner Antworten ...",
    icon: "hugeicons:presentation-online",
  },
  {
    key: "results",
    text: "Analyse deiner Ergebnisse ...",
    icon: "lucide:search",
  },
  {
    key: "balance",
    text: "Beurteilung deines hormonellen Gleichgewichts ...",
    icon: "solar:refresh-outline",
  },
  {
    key: "summary",
    text: "Erstellung einer Zusammenfassung...",
    icon: "line-md:loading-twotone-loop",
  },
] as const;

const INTRO_DELAY = 900;
const STEP_DURATION = 850;
const NEXT_DELAY = 650;

function HormoneIcon() {
  return (
    <svg
      width="126"
      height="126"
      viewBox="0 0 126 126"
      aria-hidden="true"
      className="overflow-visible"
    >
      <circle
        cx="63"
        cy="35"
        r="28"
        fill="none"
        stroke="#c6848f"
        strokeWidth="5"
      />
      <path
        d="M22 39c0 29 17 49 41 49s41-20 41-49"
        fill="none"
        stroke="#a7344a"
        strokeLinecap="round"
        strokeWidth="6"
      />
      <path
        d="M63 66v42"
        fill="none"
        stroke="#a7344a"
        strokeLinecap="round"
        strokeWidth="6"
      />
      <path
        d="M48 94h30"
        fill="none"
        stroke="#a7344a"
        strokeLinecap="round"
        strokeWidth="6"
      />
    </svg>
  );
}

const Screen15 = () => {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers: number[] = [];

    timers.push(
      window.setTimeout(() => {
        setShowContent(true);
      }, INTRO_DELAY),
    );

    STEPS.forEach((_, index) => {
      timers.push(
        window.setTimeout(() => {
          setActiveStep(index + 1);
        }, INTRO_DELAY + index * STEP_DURATION),
      );
    });

    timers.push(
      window.setTimeout(() => {
        router.push("/screen16");
      }, INTRO_DELAY + STEPS.length * STEP_DURATION + NEXT_DELAY),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [router]);

  return (
    <section className="mx-auto max-w-[760px] bg-white px-4 pb-20 pt-12">
      <div className="mx-auto max-w-[442px] text-center">
        <div className="flex min-h-[126px] justify-center">
          {showContent ? (
            <HormoneIcon />
          ) : (
            <div className="purefemm-loader scale-[0.82]" />
          )}
        </div>

        <h2 className="mx-auto mt-4 max-w-[390px] font-(family-name:--font-display) text-[29px] font-normal leading-[1.16] text-[#a7344a]">
          Analyse deiner Hormone wird
          <br />
          durchgeführt...
        </h2>

        <div className="mx-auto mt-5 h-[4px] w-full max-w-[406px] rounded-full bg-[#a7344a]" />

        <div className="mx-auto mt-6 max-w-[406px] space-y-8 text-left">
          {STEPS.map((step, index) => {
            const isVisible = activeStep >= index + 1;

            return (
              <div
                key={step.key}
                className={`flex items-center gap-4 transition-all duration-300 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center text-[#a7344a]">
                  <Icon icon={step.icon} width="29" height="29" />
                </div>

                <p className="text-[15px] leading-[1.35] text-[#4c5676]">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Screen15;
