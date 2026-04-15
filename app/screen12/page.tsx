"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useHydrated from "@/app/components/useHydrated";
import { useQuestionText } from "@/app/components/quiz/useQuestionText";

const MIN_HEIGHT = 90;
const MAX_HEIGHT = 240;

const Screen12 = () => {
  const router = useRouter();
  const hydrated = useHydrated();
  const title = useQuestionText("screen12-height", "Wie groß bist du?");
  const [height, setHeight] = useState<string | null>(null);
  const currentHeight =
    height ?? (hydrated ? (localStorage.getItem("screen12-height") ?? "") : "");

  const parsedHeight = Number(currentHeight);
  const isValid =
    currentHeight.trim() !== "" &&
    !Number.isNaN(parsedHeight) &&
    parsedHeight >= MIN_HEIGHT &&
    parsedHeight <= MAX_HEIGHT;

  const handleNext = () => {
    if (!isValid) return;

    localStorage.setItem("screen12-height", String(parsedHeight));
    router.push("/screen13");
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-white pb-28">
      <div className="mx-auto mt-9 max-w-[760px] px-4 text-center">
        <h2 className="font-(family-name:--font-display) text-[31px] font-normal leading-[1.15] text-(--primary-color) sm:text-[33px]">
          {title}
        </h2>

        <p className="mx-auto mt-7 max-w-[392px] text-[17px] leading-[1.38] text-black sm:text-[18px]">
          Wir verwenden diese Daten, um deinen BMI (Body-Mass-Index) zu
          berechnen.
        </p>

        <div className="page-slide-in mx-auto mt-14 max-w-[388px]">
          <label className="block text-[17px] leading-none text-black">
            Größe
          </label>

          <div className="mt-8 flex items-center rounded-[13px] border border-black bg-[#fbf8f8] px-4 py-[13px]">
            <input
              type="number"
              min={MIN_HEIGHT}
              max={MAX_HEIGHT}
              inputMode="numeric"
              value={currentHeight}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Größe"
              className="w-full bg-transparent text-[18px] leading-none text-black outline-none placeholder:text-[#d6d0cf]"
            />
            <span className="pl-3 text-[18px] font-semibold leading-none text-black">
              cm
            </span>
          </div>

          <p className="mx-auto mt-4 max-w-[318px] text-[16px] leading-[1.05] text-black sm:text-[17px]">
            Bitte gib einen Wert zwischen 90 cm und 240 cm ein.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-10 flex w-full justify-center border-t border-[#f1efef] bg-[#faf9fa] px-4 py-4">
        <button
          onClick={handleNext}
          disabled={!isValid}
          className={`flex h-[48px] w-full max-w-[398px] items-center justify-center gap-2.5 rounded-full px-6 text-[15px] font-semibold uppercase tracking-[0.02em] text-white transition-all duration-300 ${
            isValid
              ? "bg-[#9c3246] hover:bg-[#942f43]"
              : "bg-[#cf97a2]"
          }`}
        >
          WEITER
          <Icon icon="lucide:arrow-right" width="22" height="22" />
        </button>
      </div>
    </div>
  );
};

export default Screen12;
