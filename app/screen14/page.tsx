"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useHydrated from "@/app/components/useHydrated";

const SCREEN_TITLE =
  "Welche K\u00f6rperform trifft aktuell am besten auf dich zu?";
const SCREEN_SUBTITLE = "(W\u00e4hle eine Antwort aus)";

const bodyTypes = [
  {
    id: "slim",
    title: "Schlank",
    image:
      "https://assets.prd.heyflow.com/flows/2OKICQDCLSwOEim6VvLh/www/assets/6ecc50ed-3a8a-4842-8329-2ce144efaf88/original.png",
  },
  {
    id: "medium",
    title: "Mittel gebaut",
    image:
      "https://assets.prd.heyflow.com/flows/2OKICQDCLSwOEim6VvLh/www/assets/7b3ae615-6d69-47ea-8b50-ed788075f5b4/original.png",
  },
  {
    id: "strong",
    title: "Kr\u00e4ftig gebaut",
    image:
      "https://assets.prd.heyflow.com/flows/2OKICQDCLSwOEim6VvLh/www/assets/3dd2ee14-8784-46ec-befe-9bc015ef5ab4/original.png",
  },
  {
    id: "overweight",
    title: "Deutlich \u00fcbergewichtig",
    image:
      "https://assets.prd.heyflow.com/flows/2OKICQDCLSwOEim6VvLh/www/assets/68d45b86-28a0-4b2e-897d-5317ebd40a96/original.png",
  },
];

const Screen14 = () => {
  const router = useRouter();
  const hydrated = useHydrated();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const currentSelectedType =
    selectedType ?? (hydrated ? localStorage.getItem("screen14-body-type") : null);

  const handleSelect = (value: string) => {
    setSelectedType(value);
    localStorage.setItem("screen14-body-type", value);

    window.setTimeout(() => {
      router.push("/screen15");
    }, 150);
  };

  return (
    <section className="bg-white px-4 pb-10 pt-10">
      <div className="mx-auto max-w-[920px]">
        <h2 className="quiz-title mx-auto max-w-[610px] text-center text-(--primary-color)">
          {SCREEN_TITLE}
        </h2>

        <p className="quiz-subtitle mx-auto mt-3 max-w-[280px] text-center text-(--dark-grey-color)">
          {SCREEN_SUBTITLE}
        </p>

        <div className="page-slide-in mx-auto mt-8 grid max-w-[860px] grid-cols-2 gap-4 md:grid-cols-4">
          {bodyTypes.map((bodyType) => {
            const isActive = currentSelectedType === bodyType.id;

            return (
              <button
                key={bodyType.id}
                type="button"
                onClick={() => handleSelect(bodyType.id)}
                className={`relative overflow-hidden rounded-[18px] text-left shadow-[0_6px_16px_#00000012] transition-all duration-300 ${
                  isActive
                    ? "bg-[#e7cdd2]"
                    : "bg-[#f1e6e8]"
                }`}
              >
                <div className="absolute right-3 top-3 z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white shadow-[0_1px_4px_#00000014]">
                  <span
                    className={`block h-[16px] w-[16px] rounded-full border ${
                      isActive
                        ? "border-[#a6344a] bg-[#a6344a] shadow-[inset_0_0_0_2px_#ffffff]"
                        : "border-[#eadcdf] bg-white"
                    }`}
                  />
                </div>

                <div className="flex h-[176px] items-end justify-center px-2 pt-4 sm:h-[186px] md:h-[176px]">
                  <Image
                    src={bodyType.image}
                    alt={bodyType.title}
                    width={320}
                    height={240}
                    unoptimized
                    className="h-full w-full object-contain object-center"
                  />
                </div>

                <div className="flex min-h-[72px] items-center justify-center bg-[#a6344a] px-3 py-4 text-center">
                  <span className="text-[17px] leading-6 text-white">
                    {bodyType.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Screen14;
