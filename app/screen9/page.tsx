"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BodyImg from "@/public/screen9-img.avif";

const Screen9 = () => {
  const router = useRouter();

  return (
    <section className="mx-auto max-w-[1200px] px-3">
      <div className="grid items-center gap-7 pt-10 md:grid-cols-2">
        <div className="order-2 px-2.5 md:order-1 md:px-0">
          <h2 className="quiz-title text-[#9c3246]">
            Deine Antworten zeigen ein klares Muster.
          </h2>

          <div className="mt-5 grid gap-4 text-[16px] leading-7 text-[#22222a] sm:text-[17px]">
            <span>
              Anhand deiner Angaben können wir erkennen, dass dein Körper unter
              einem <span className="font-semibold">starken hormonellen Ungleichgewicht leidet</span>{" "}
              und was dein Körper jetzt braucht, um wieder darauf zu reagieren.
            </span>
            <span>
              Lass uns deine Ergebnisse fertigstellen und eine personalisierte
              Auswertung erstellen.
            </span>
          </div>

          <button
            onClick={() => router.push("/screen10")}
            className="mt-10 flex min-w-full max-w-max items-center justify-center gap-2.5 rounded-full bg-[#9c3246] px-6 py-3 text-lg uppercase text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#942f43] sm:min-w-sm"
          >
            Weiter
            <Icon icon="lucide:arrow-right" width="22" height="22" />
          </button>
        </div>

        <div className="order-1 md:order-2">
          <Image
            src={BodyImg}
            alt="Analyse Illustration"
            width={580}
            height={580}
            className="mx-auto w-full max-w-[550px]"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
};

export default Screen9;
