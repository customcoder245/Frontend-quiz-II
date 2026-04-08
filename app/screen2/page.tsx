"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import useHydrated from "@/app/components/useHydrated";

const Screen2 = () => {
  const router = useRouter();
  const hydrated = useHydrated();
  const [sufferFlash, setSufferFlash] = useState<string | null>(null);
  const currentSufferFlash =
    sufferFlash ?? (hydrated ? localStorage.getItem("screen2-flash") : null);

  const handleSelect = (value: string) => {
    setSufferFlash(value);
    localStorage.setItem("screen2-flash", value);
    window.setTimeout(() => {
      router.push("/screen3");
    }, 150);
  };

  return (
    <div>
      <div className="mx-auto mt-9 max-w-[520px] px-3">
        <h2 className="quiz-title text-center text-(--primary-color)">
          Leidest du unter Hitzewallungen?
        </h2>

        <div className="page-slide-in my-5 grid gap-4 px-1.5">
          {[
            ["yes", "🔥", "Ja"],
            ["no", "🧊", "Nein"],
          ].map(([value, emoji, label]) => (
            <label
              key={value}
              htmlFor={`suffer-flash-${value}`}
              onClick={() => handleSelect(value)}
              className={`group relative flex cursor-pointer items-center justify-between gap-4 rounded-[10px] border-2 p-4 transition-colors duration-300 hover:border-[#9c3246] hover:bg-[#9c32460d] hover:shadow-[0_2px_6px_#0000001a] ${
                currentSufferFlash === value
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
                name="suffering-flash"
                id={`suffer-flash-${value}`}
                checked={currentSufferFlash === value}
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

export default Screen2;
