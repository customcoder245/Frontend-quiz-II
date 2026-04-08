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

const ageGroups = [
  { id: "35-44", label: "Alter: 35-44", image: FemaleAgeGrp1 },
  { id: "45-54", label: "Alter: 45-54", image: FemaleAgeGrp2 },
  { id: "55-64", label: "Alter: 55-64", image: FemaleAgeGrp3 },
  { id: "65+", label: "Alter: 65+", image: FemaleAgeGrp4 },
] as const;

const logos = [Brand1, Brand2, Brand3, Brand4];

export default function Screen1Content() {
  const router = useRouter();
  const hydrated = useHydrated();
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
    <div>
      <div className="mx-auto mt-9 max-w-[840px] px-3 sm:mt-10">
        <h2 className="quiz-title text-center text-(--primary-color)">
          Speichert dein KÃ¶rper hormonelles Fett?
        </h2>

        <div className="page-slide-in my-6 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
          {ageGroups.map((group) => {
            const isSelected = currentSelectedAge === group.id;

            return (
              <label
                key={group.id}
                htmlFor={group.id}
                onClick={() => handleSelect(group.id)}
                className={`relative cursor-pointer rounded-2xl p-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e5cacf] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] ${
                  isSelected
                    ? "bg-[#e5cacf] shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
                    : "bg-[#f3e8ea]"
                }`}
              >
                <Image
                  src={group.image}
                  alt={group.label}
                  width={400}
                  height={400}
                  className={`mx-auto h-auto w-full max-w-[160px] object-contain transition-transform duration-300 group-hover:scale-[1.03] ${
                    isSelected ? "scale-[1.03]" : ""
                  }`}
                  unoptimized
                />

                <div className="w-full rounded-xl bg-(--primary-color) px-3 py-2.5 text-center text-base text-white sm:text-lg">
                  {group.label}
                </div>

                <input
                  type="radio"
                  className="absolute right-1.5 top-1.5 size-5 rounded-full accent-(--primary-color)"
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

        <h4 className="quiz-subtitle mx-auto mt-6 max-w-md text-center text-(--dark-grey-color)">
          WÃ¤hle dein Alter, um deine persÃ¶nliche Hormonanalyse zu erstellen.
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

        <p className="mx-auto my-10 max-w-md text-center text-sm leading-6 text-[#4f4f57]">
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
