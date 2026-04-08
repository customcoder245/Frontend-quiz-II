"use client";
/* eslint-disable @next/next/no-img-element */

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const PRODUCT_IMAGE =
  "https://assets.prd.heyflow.com/flows/2OKICQDCLSwOEim6VvLh/www/assets/2e8803cd-a8f3-472a-bd8b-55e58a9894ea/original.jpeg";

const bulletItems = [
  "Unterstützt deinen Körper dabei, aus dem hormonellen Speichermodus zu finden - mit Ashwagandha KSM-66® und gezielten Adaptogenen",
  "Hilft bei Heißhunger, Blähbauch und träger Verdauung - durch klinisch erforschte Probiotika wie B420®",
  "Stabilisiert Energie, Schlaf und Stimmung - mit Salbei, Melisse und Mikronährstoffen wie Chrom, B6, D3 und K2",
];

const Screen20 = () => {
  const router = useRouter();

  return (
    <section className="mx-auto max-w-[760px] bg-white px-4 pb-32 pt-5">
      <div className="mx-auto max-w-[520px] text-center">
        <div className="mx-auto mb-10 flex w-full max-w-[404px] gap-[4px]">
          <span className="h-[4px] flex-1 rounded-full bg-[#a7344a]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#a7344a]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#a7344a]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#a7344a]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#a7344a]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#e7e7ea]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#e7e7ea]" />
          <span className="h-[4px] flex-1 rounded-full bg-[#e7e7ea]" />
        </div>

        <h2 className="mx-auto max-w-[420px] font-(family-name:--font-display) text-[31px] font-normal leading-[1.22] text-black sm:text-[33px]">
          Dein Körper braucht jetzt die
          <br />
          richtige natürliche
          <br />
          Unterstützung.
        </h2>

        <p className="mx-auto mt-5 max-w-[430px] text-[18px] leading-[1.4] text-black">
          Zwei Kapseln und dein Körper bekommt zum ersten Mal genau das, was er
          in dieser Phase braucht. Ohne Hormone. Ohne Diät. Ohne deinen Alltag
          umzukrempeln.
        </p>

        <div className="mx-auto mt-10 flex justify-center">
          <img
            src={PRODUCT_IMAGE}
            alt="Wechseljahre Complex+ mit Qualitätssiegeln"
            className="w-full max-w-[360px] object-contain"
          />
        </div>

        <div className="mx-auto mt-9 max-w-[470px] space-y-5 text-left">
          {bulletItems.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#2ec777] text-[#2ec777]">
                <Icon icon="lucide:check" width="16" height="16" />
              </div>
              <p className="text-[16px] leading-[1.25] text-black">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-10 flex w-full justify-center border-t border-[#f1efef] bg-[#faf9fa] px-4 py-4">
        <button
          onClick={() => router.push("/screen21")}
          className="flex h-[48px] w-full max-w-[398px] items-center justify-center gap-2.5 rounded-full border-2 border-[#4fa1ff] bg-[#a7344a] px-6 text-[16px] font-semibold uppercase text-white transition-all duration-300 hover:bg-[#972f44]"
        >
          WEITER
          <Icon icon="lucide:arrow-right" width="22" height="22" />
        </button>
      </div>
    </section>
  );
};

export default Screen20;
