"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useHydrated from "@/app/components/useHydrated";
import { useQuestionText } from "@/app/components/quiz/useQuestionText";

const MIN_WEIGHT = 30;
const MAX_WEIGHT = 300;

const Screen13 = () => {
  const router = useRouter();
  const hydrated = useHydrated();
  const title = useQuestionText("screen13-current-weight", "Wie viel wiegst du?");
  const [currentWeight, setCurrentWeight] = useState<string | null>(null);
  const [targetWeight, setTargetWeight] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const currentWeightValue =
    currentWeight ??
    (hydrated ? (localStorage.getItem("screen13-current-weight") ?? "") : "");
  const targetWeightValue =
    targetWeight ??
    (hydrated ? (localStorage.getItem("screen13-target-weight") ?? "") : "");

  const currentValue = Number(currentWeightValue);
  const targetValue = Number(targetWeightValue);

  const currentValid =
    currentWeightValue.trim() !== "" &&
    !Number.isNaN(currentValue) &&
    currentValue >= MIN_WEIGHT &&
    currentValue <= MAX_WEIGHT;

  const targetValid =
    targetWeightValue.trim() !== "" &&
    !Number.isNaN(targetValue) &&
    targetValue >= MIN_WEIGHT &&
    targetValue <= MAX_WEIGHT;

  const handleNext = () => {
    setTouched(true);
    if (!currentValid || !targetValid) return;

    localStorage.setItem("screen13-current-weight", String(currentValue));
    localStorage.setItem("screen13-target-weight", String(targetValue));
    router.push("/screen14");
  };

  return (
    <div className="min-h-[calc(100vh-100px)] pb-32">
      <div className="mx-auto mt-10 max-w-[760px] px-4 text-center">
        <h2 className="result-title text-(--primary-color)">{title}</h2>

        <div className="page-slide-in mx-auto mt-12 max-w-[430px]">
          <div>
            <label className="block text-[18px] text-black">
              Aktuelles Gewicht
            </label>
            <div className="mt-5 flex items-center rounded-[10px] border border-[#c9c9c9] bg-[#f7f7f7] px-4 py-3">
              <input
                type="number"
                min={MIN_WEIGHT}
                max={MAX_WEIGHT}
                inputMode="numeric"
                value={currentWeightValue}
                onChange={(e) => setCurrentWeight(e.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full bg-transparent text-[18px] text-black outline-none"
              />
              <span className="text-[18px] text-black">kg</span>
            </div>
            {touched && !currentValid ? (
              <p className="mx-auto mt-4 max-w-[360px] text-[17px] leading-[1.15] text-black">
                Bitte gib einen Wert zwischen 30 kg und 300 kg ein.
              </p>
            ) : null}
          </div>

          <div className="mt-10">
            <label className="block text-[18px] text-black">Zielgewicht</label>
            <div className="mt-5 flex items-center rounded-[10px] border border-[#c9c9c9] bg-[#f7f7f7] px-4 py-3">
              <input
                type="number"
                min={MIN_WEIGHT}
                max={MAX_WEIGHT}
                inputMode="numeric"
                value={targetWeightValue}
                onChange={(e) => setTargetWeight(e.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full bg-transparent text-[18px] text-black outline-none"
              />
              <span className="text-[18px] text-black">kg</span>
            </div>
            {touched && !targetValid ? (
              <p className="mx-auto mt-4 max-w-[360px] text-[17px] leading-[1.15] text-black">
                Bitte gib einen Wert zwischen 30 kg und 300 kg ein.
              </p>
            ) : null}
          </div>

          <p className="mx-auto mt-8 max-w-[430px] text-[17px] leading-[1.35] text-black">
            Ergebnisse können individuell variieren. Der Wechseljahre Complex+
            ist ein Nahrungsergänzungsmittel zur Unterstützung während der
            hormonellen Umstellungsphase und ersetzt keine ausgewogene Ernährung
            oder gesunde Lebensweise. Bei gesundheitlichen Fragen oder
            bestehenden Erkrankungen konsultiere bitte vor der Einnahme deinen
            Arzt oder Apotheker.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-10 flex w-full justify-center border-t border-gray-100 bg-[#fafafb] px-4 py-5">
        <button
          onClick={handleNext}
          className="flex w-full max-w-[398px] items-center justify-center gap-2.5 rounded-full bg-[#9c3246] px-6 py-3 text-lg uppercase text-white transition-all duration-300 hover:bg-[#942f43]"
        >
          Weiter
          <Icon icon="lucide:arrow-right" width="22" height="22" />
        </button>
      </div>
    </div>
  );
};

export default Screen13;
