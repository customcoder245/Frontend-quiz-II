"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useHydrated from "@/app/components/useHydrated";
import Brand1 from "@/public/brand1.svg";
import Brand2 from "@/public/brand2.svg";
import Brand3 from "@/public/brand3.svg";
import Brand4 from "@/public/brand4.svg";
import FemaleAgeGrp1 from "@/public/female-age-grp/img1.svg";
import FemaleAgeGrp2 from "@/public/female-age-grp/img2.svg";
import FemaleAgeGrp3 from "@/public/female-age-grp/img3.svg";
import FemaleAgeGrp4 from "@/public/female-age-grp/img4.svg";
import { useQuestionText } from "@/app/components/quiz/useQuestionText";

const ageGroups = [
  { id: "35-44", label: "35-44", image: FemaleAgeGrp1 },
  { id: "45-54", label: "45-54", image: FemaleAgeGrp2 },
  { id: "55-64", label: "55-64", image: FemaleAgeGrp3 },
  { id: "65+", label: "65+", image: FemaleAgeGrp4 },
] as const;

const logos = [Brand1, Brand2, Brand3, Brand4];

export default function Screen1Content() {
  const router = useRouter();
  const hydrated = useHydrated();
  const title = useQuestionText(
    "screen1-age",
    "Speichert dein Körper hormonelles Fett?",
  );
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const currentSelectedAge =
    selectedAge ?? (hydrated ? localStorage.getItem("screen1-age") : null);

  const handleSelect = (value: string) => {
    setSelectedAge(value);
    localStorage.setItem("screen1-age", value);

    window.setTimeout(() => {
      router.push("/screen2");
    }, 150);
  };

  return (
    <div className="min-h-[calc(100vh-112px)] bg-white">
      <div className="mx-auto max-w-[900px] px-4 pb-8 pt-7 sm:pt-9">
        <h2 className="mx-auto max-w-[760px] font-(family-name:--font-display) text-center text-[34px] font-normal leading-[1.08] tracking-[-0.02em] text-(--primary-color) sm:text-[42px]">
          {title}
        </h2>

        <div className="page-slide-in my-7 grid grid-cols-2 gap-4 sm:my-8 sm:grid-cols-4 sm:gap-5">
          {ageGroups.map((group) => {
            const isSelected = currentSelectedAge === group.id;

            return (
              <label
                key={group.id}
                htmlFor={group.id}
                onClick={() => handleSelect(group.id)}
                className={`group relative cursor-pointer overflow-hidden rounded-[6px] border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(156,50,70,0.16)] ${
                  isSelected
                    ? "border-[#9c3246] bg-[#ead2d6] shadow-[0_12px_32px_rgba(156,50,70,0.16)]"
                    : "border-[#ead9dc] bg-[#f1e2e5]"
                }`}
              >
                <div className="flex min-h-[210px] items-end justify-center px-2 pt-2 sm:min-h-[250px]">
                  <Image
                    src={group.image}
                    alt={`Age ${group.label}`}
                    width={400}
                    height={400}
                    className={`h-auto w-full max-w-[178px] object-contain transition-transform duration-300 group-hover:scale-[1.04] sm:max-w-[205px] ${
                      isSelected ? "scale-[1.04]" : ""
                    }`}
                    unoptimized
                  />
                </div>

                <div className="w-full bg-(--primary-color) px-3 py-3 text-center text-[18px] font-semibold tracking-[-0.01em] text-white sm:text-[20px]">
                  Alter: {group.label}
                </div>

                <input
                  type="radio"
                  className="absolute right-2 top-2 size-5 rounded-full accent-(--primary-color)"
                  name="age-group"
                  id={group.id}
                  checked={isSelected}
                  onChange={() => handleSelect(group.id)}
                  onClick={() => handleSelect(group.id)}
                />
              </label>
            );
          })}
        </div>

        <h4 className="mx-auto mt-6 max-w-[520px] text-center text-[18px] leading-[1.55] text-(--dark-grey-color)">
          W&auml;hle dein Alter, um deine pers&ouml;nliche Hormonanalyse zu erstellen.
        </h4>

        <div className="my-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-x-7">
          {logos.map((logo, index) => (
            <Image
              key={index}
              src={logo}
              alt={`Brand ${index + 1}`}
              width={400}
              height={400}
              className="h-7 w-auto object-contain sm:h-10"
              unoptimized
            />
          ))}
        </div>

        <p className="mx-auto my-9 max-w-[520px] text-center text-[14px] leading-6 text-[#4f4f57]">
          Durch Klicken auf eine der oben genannten Optionen stimmen Sie den{" "}
          <a href="#" className="text-(--primary-color)">
            Nutzungsbedingungen
          </a>{" "}
          und{" "}
          <a href="#" className="text-(--primary-color)">
            Datenschutzbestimmungen
          </a>{" "}
          zu.
        </p>
      </div>
    </div>
  );
}
