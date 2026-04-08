"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import useHydrated from "@/app/components/useHydrated";
import { resolveWeightGoal } from "@/app/lib/weight-goal";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const Screen16 = () => {
  const router = useRouter();
  const hydrated = useHydrated();
  const currentWeightValue = hydrated
    ? Number(localStorage.getItem("screen13-current-weight")) || 0
    : 0;
  const targetWeightValue = hydrated
    ? Number(localStorage.getItem("screen13-target-weight")) || 0
    : 0;

  const { startWeight, desiredWeight, direction, absoluteChange } =
    resolveWeightGoal(currentWeightValue, targetWeightValue);
  const normalizedChange = clamp(
    absoluteChange / Math.max(startWeight, desiredWeight, 1),
    0.08,
    0.45,
  );
  const greenStartY = direction === "gain" ? 118 : 42;
  const greenEndY =
    direction === "gain"
      ? Math.round(greenStartY - normalizedChange * 150)
      : direction === "maintain"
        ? greenStartY + 3
        : Math.round(greenStartY + normalizedChange * 150);
  const greenMidY = Math.round((greenStartY + greenEndY) / 2);
  const greenPath = `M0 ${greenStartY} C55 ${greenStartY}, 78 ${greenStartY + 12}, 112 ${greenMidY - 18} C143 ${greenMidY + 8}, 171 ${greenMidY + 29}, 214 ${greenEndY - 12} C251 ${greenEndY}, 283 ${greenEndY + 2}, 320 ${greenEndY}`;
  const greenAreaPath = `${greenPath} L320 190 L0 190 Z`;
  const markerY = clamp(greenEndY, 24, 156);
  const startLabelTop = clamp(greenStartY - 18, 10, 126);
  const targetLabelTop = clamp(markerY - 18, 14, 138);
  const title =
    direction === "gain"
      ? "Deine Gewichtszunahme"
      : direction === "maintain"
        ? "Dein Gewichtsziel"
        : "Deine Gewichtsabnahme";
  const changeLabel =
    direction === "gain"
      ? `+${absoluteChange} kg`
      : direction === "loss"
        ? `-${absoluteChange} kg`
        : "0 kg";
  const goalSummary =
    direction === "gain"
      ? `Dein Ziel liegt ${absoluteChange} kg ueber deinem aktuellen Gewicht.`
      : direction === "loss"
        ? `Dein Ziel liegt ${absoluteChange} kg unter deinem aktuellen Gewicht.`
        : "Dein aktuelles Gewicht und dein Zielgewicht sind identisch.";

  return (
    <section className="mx-auto max-w-3xl bg-white px-4 pb-28 pt-4">
      <div className="mx-auto max-w-[640px] text-center">
        <div className="mx-auto mb-10 flex w-full max-w-[404px] gap-[6px]">
          <span className="h-[4px] flex-1 rounded-full bg-[#a8344b]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#e8e8eb]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#e8e8eb]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#e8e8eb]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#e8e8eb]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#e8e8eb]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#e8e8eb]" />
        </div>

        <h2 className="mx-auto max-w-[470px] font-(family-name:--font-display) text-[31px] font-normal leading-[1.18] text-black sm:text-[33px]">
          Dein Körper zeigt Anzeichen eines starken hormonellen Ungleichgewichts
        </h2>

        <p className="mx-auto mt-5 max-w-[420px] text-[18px] leading-[1.42] text-black">
          Die gute Nachricht ist, dass du mit dem richtigen Ansatz diesen
          Prozess wieder regulieren und schnellere Fortschritte erzielen kannst,
          als du vielleicht denkst.
        </p>

        <div className="mx-auto mt-10 max-w-[370px] rounded-[6px] bg-white px-6 pb-6 pt-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <h3 className="text-[21px] font-semibold text-[#393939]">
            {title}
          </h3>
          <p className="mt-2 text-[14px] leading-[1.45] text-[#636363]">
            {goalSummary}
          </p>

          <div className="relative mt-4 h-[242px] overflow-hidden rounded-[2px] bg-[#fffefe]">
            <div
              className="absolute left-0 z-20 rounded-[8px] bg-black px-3 py-1.5 text-[18px] font-semibold text-white"
              style={{ top: `${startLabelTop}px` }}
            >
              {startWeight} kg
            </div>

            <svg
              viewBox="0 0 320 190"
              className="absolute inset-x-0 top-5 h-[170px] w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="purefemmArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6fd6a0" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6fd6a0" stopOpacity="0.06" />
                </linearGradient>
              </defs>

              <path d={greenAreaPath} fill="url(#purefemmArea)" />

              <path
                d={greenPath}
                fill="none"
                stroke="#23c37b"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <path
                d="M0 36 C40 38, 75 48, 101 74 C121 95, 141 104, 165 84 C191 62, 217 54, 242 84 C259 104, 281 104, 302 75 C309 65, 315 63, 320 65"
                fill="none"
                stroke="#ff4a49"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <circle cx="270" cy={markerY} r="4" fill="#000000" />
            </svg>

            <div
              className="absolute right-[14px] z-20 flex items-center gap-1 rounded-[11px] bg-black px-2.5 py-1.5 text-[17px] font-semibold text-white"
              style={{ top: `${targetLabelTop}px` }}
            >
              <Icon icon="lucide:crown" width="14" height="14" />
              <span>{desiredWeight} kg</span>
            </div>

            <div className="absolute right-[14px] top-[18px] rounded-full bg-[#f6f7f8] px-3 py-1 text-[12px] font-semibold text-[#222]">
              {changeLabel}
            </div>

            <div className="absolute bottom-[52px] left-0 right-0 flex justify-between text-[13px] text-[#8c8c8c]">
              <span>Heute</span>
              <span>Tag 60+</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 space-y-2 pt-3 text-left">
              <div className="flex items-center gap-3 text-[13px] text-[#3a3a3a]">
                <span className="h-[7px] w-11 rounded-full bg-[#23c37b]" />
                <span>Mit Purefemm</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] text-[#3a3a3a]">
                <span className="h-[7px] w-11 rounded-full bg-[#ff4a49]" />
                <span>Mit einer Diät</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-12 text-[14px] text-black">Ergebnisse können variieren.</p>
      </div>

      <div className="fixed bottom-0 left-0 z-10 flex w-full justify-center border-t border-[#f1efef] bg-[#faf9fa] px-4 py-4">
        <button
          onClick={() => router.push("/screen17")}
          className="flex h-[48px] w-full max-w-[398px] items-center justify-center gap-2.5 rounded-full bg-[#a8344b] px-6 text-[16px] font-semibold uppercase text-white transition-all duration-300 hover:bg-[#972f44]"
        >
          WEITER
          <Icon icon="lucide:arrow-right" width="22" height="22" />
        </button>
      </div>
    </section>
  );
};

export default Screen16;





