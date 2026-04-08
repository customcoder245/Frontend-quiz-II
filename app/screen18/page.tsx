"use client";

import { Icon } from "@iconify/react";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import useHydrated from "@/app/components/useHydrated";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const Screen18 = () => {
  const router = useRouter();
  const hydrated = useHydrated();
  const heightValue = hydrated
    ? Number(localStorage.getItem("screen12-height")) || 0
    : 0;
  const currentWeightValue = hydrated
    ? Number(localStorage.getItem("screen13-current-weight")) || 0
    : 0;

  const bmi = useMemo(() => {
    if (!heightValue || !currentWeightValue) return 200;
    const heightInMeters = heightValue / 100;
    return currentWeightValue / (heightInMeters * heightInMeters);
  }, [heightValue, currentWeightValue]);

  const displayBmi = Math.round(bmi || 200);
  const metabolicAge =
    bmi && currentWeightValue ? Math.max(47, Math.round(bmi + 18)) : 47;
  const markerLeft = clamp(84, 10, 92);

  return (
    <section className="mx-auto max-w-[760px] bg-white px-4 pb-32 pt-5">
      <div className="mx-auto max-w-[520px] text-center">
        <div className="mx-auto mb-10 flex w-full max-w-[404px] gap-[4px]">
          <span className="h-[4px] flex-1 rounded-full bg-[#a7344a]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#a7344a]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#a7344a]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#e7e7ea]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#e7e7ea]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#e7e7ea]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#e7e7ea]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#e7e7ea]" />
        </div>

        <h2 className="mx-auto max-w-[470px] font-(family-name:--font-display) text-[31px] font-normal leading-[1.16] text-black sm:text-[33px]">
          Deine persönliche Auswertung
        </h2>

        <p className="mx-auto mt-5 max-w-[430px] text-[18px] leading-[1.38] text-black">
          Deine Antworten zeigen, dass dein Körper aktuell zusätzliches Fett
          speichert und dein Stoffwechsel langsamer arbeitet als normal.
        </p>

        <div className="mx-auto mt-10 max-w-[376px] rounded-[10px] bg-white px-6 pb-7 pt-11 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <p className="text-[19px] font-semibold uppercase text-black">DEIN BMI</p>
          <p className="mt-4 font-(family-name:--font-display) text-[52px] font-normal leading-none text-black sm:text-[56px]">
            {displayBmi}
          </p>

          <div className="relative mx-auto mt-6 max-w-[332px]">
            <div className="flex h-[38px] overflow-hidden rounded-[8px]">
              <div className="w-[33.33%] bg-[#92ddb4]" />
              <div className="w-[33.33%] bg-[#ffdb84]" />
              <div className="w-[33.34%] bg-[#ff7080]" />
            </div>

            <div
              className="absolute top-[-6px] h-[50px] w-[4px] rounded-full bg-[#1f1f1f]"
              style={{ left: `${markerLeft}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 text-[12px] text-black">
            <span className="text-left">Normalgewicht</span>
            <span className="text-center">Übergewicht</span>
            <span className="text-right">Fettleibigkeit</span>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-[376px] rounded-[10px] bg-white px-6 pb-7 pt-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <p className="text-[18px] font-semibold text-black">
            Dein Stoffwechselalter
          </p>

          <p className="mt-6 font-(family-name:--font-display) text-[52px] font-normal leading-none text-black sm:text-[56px]">
            {metabolicAge} Jahre
          </p>

          <div className="mt-6 flex items-center gap-2 rounded-[8px] bg-[#ffefea] px-4 py-3 text-left">
            <AlertTriangle className="shrink-0 text-[#ffb224]" size={15} />
            <p className="text-[13px] text-[#ff5a4f]">
              Dein Stoffwechselalter ist{" "}
              <span className="font-semibold uppercase">LANGSAM</span>
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-10 flex w-full justify-center border-t border-[#f1efef] bg-[#faf9fa] px-4 py-4">
        <button
          onClick={() => router.push("/screen19")}
          className="flex h-[48px] w-full max-w-[398px] items-center justify-center gap-2.5 rounded-full border-2 border-[#4fa1ff] bg-[#a7344a] px-6 text-[16px] font-semibold uppercase text-white transition-all duration-300 hover:bg-[#972f44]"
        >
          WEITER
          <Icon icon="lucide:arrow-right" width="22" height="22" />
        </button>
      </div>
    </section>
  );
};

export default Screen18;
