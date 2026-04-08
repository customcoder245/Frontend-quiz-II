"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const Screen19 = () => {
  const router = useRouter();

  return (
    <section className="mx-auto max-w-[760px] px-4 pb-32 pt-5">
      <div className="mx-auto max-w-[560px] text-center">
        <div className="mx-auto mb-10 flex w-full max-w-[448px] gap-1.5">
          <span className="h-1.5 w-[52px] rounded-full bg-[#a6344a]" />
          <span className="h-1.5 w-[52px] rounded-full bg-[#a6344a]" />
          <span className="h-1.5 w-[52px] rounded-full bg-[#a6344a]" />
          <span className="h-1.5 w-[52px] rounded-full bg-[#a6344a]" />
          <span className="h-1.5 w-[52px] rounded-full bg-[#e8e8ec]" />
          <span className="h-1.5 w-[52px] rounded-full bg-[#e8e8ec]" />
          <span className="h-1.5 w-[52px] rounded-full bg-[#e8e8ec]" />
          <span className="h-1.5 w-[52px] rounded-full bg-[#e8e8ec]" />
        </div>

        <h2 className="result-title text-black">
          Warum ein sinkender
          <br />
          Östrogenspiegel zu
          <br />
          Gewichtszunahme führt
        </h2>

        <p className="mx-auto mt-5 max-w-[500px] text-[18px] leading-[1.35] text-black">
          Deine Ergebnisse deuten auf ein hormonelles Ungleichgewicht hin, das
          mit einem niedrigeren Östrogenspiegel zusammenhängt.
        </p>

        <div className="mx-auto mt-8 max-w-[420px] rounded-[12px] bg-white px-6 py-10 text-left shadow-[0_10px_28px_#00000010]">
          <p className="text-[18px] text-black">Dein Stoffwechsel</p>
          <p className="test mt-4 text-[46px] leading-none text-[#ff6f7d]">
            Langsam
          </p>

          <p className="mt-6 max-w-[320px] text-[17px] leading-[1.35] text-black">
            Sinkende Östrogenwerte verändern die Fettverteilung im Körper und
            bremsen den Stoffwechsel.
          </p>

          <div className="relative mt-6">
            <div className="flex h-[42px] gap-1 rounded-[8px]">
              <div className="w-[25%] rounded-l-[8px] bg-[#ff7184]" />
              <div className="w-[15%] bg-[#ffdd84]" />
              <div className="w-[25%] bg-[#ffdd84]" />
              <div className="w-[25%] bg-[#98d9b4]" />
              <div className="w-[20%] rounded-r-[8px] bg-[#15b97d]" />
            </div>
            <div className="absolute left-[37%] top-[-8px] h-[56px] w-[6px] rounded-full bg-black" />
          </div>

          <div className="mt-4 flex justify-between text-[12px] text-black">
            <span className="w-[24%] text-center">Sehr langsam</span>
            <span className="w-[18%] text-center">Langsam</span>
            <span className="w-[24%] text-center">Schnell</span>
            <span className="w-[24%] text-center">Sehr schnell</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-10 flex w-full justify-center border-t border-gray-100 bg-[#fafafb] px-4 py-5">
        <button
          onClick={() => router.push("/screen20")}
          className="flex w-full max-w-[398px] items-center justify-center gap-2.5 rounded-full border-2 border-[#61a9ff] bg-[#a6344a] px-6 py-4 text-[18px] uppercase text-white transition-all duration-300 hover:bg-[#942f43]"
        >
          WEITER
          <Icon icon="lucide:arrow-right" width="22" height="22" />
        </button>
      </div>
    </section>
  );
};

export default Screen19;
