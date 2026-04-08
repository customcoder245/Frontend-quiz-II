"use client";
/* eslint-disable @next/next/no-img-element */

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const progressBars = [
  "#a7344a",
  "#a7344a",
  "#a7344a",
  "#a7344a",
  "#a7344a",
  "#e7e7ea",
  "#e7e7ea",
];

const BEFORE_AFTER_IMAGE =
  "https://assets.prd.heyflow.com/flows/2OKICQDCLSwOEim6VvLh/www/assets/30877a93-e58b-4d26-8421-9bd101944dc7/original.png";
const REVIEW_IMAGE =
  "https://assets.prd.heyflow.com/flows/2OKICQDCLSwOEim6VvLh/www/assets/9723c377-5cb3-400a-afe8-7b0b8cea584f/original.png";

const Screen22 = () => {
  const router = useRouter();

  return (
    <section className="mx-auto min-h-[calc(100vh-100px)] max-w-[760px] bg-white px-4 pb-28 pt-7">
      <div className="mx-auto max-w-[520px] text-center">
        <div className="mx-auto mb-5 flex w-full max-w-[298px] gap-[3px]">
          {progressBars.map((color, index) => (
            <span
              key={index}
              className="h-[3px] flex-1 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <h2 className="mx-auto max-w-[320px] font-(family-name:--font-display) text-[28px] font-normal leading-[1.12] text-black">
          Aber verlass dich nicht nur auf unsere Worte.
        </h2>

        <div className="mx-auto mt-4 w-full max-w-[282px]">
          <img
            src={BEFORE_AFTER_IMAGE}
            alt="Vorher und Nachher"
            className="block h-auto w-full rounded-[4px]"
          />
        </div>

        <div className="mx-auto mt-5 w-full max-w-[282px]">
          <img
            src={REVIEW_IMAGE}
            alt="Kundenbewertung"
            className="block h-auto w-full rounded-[8px]"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-[#f1efef] bg-[#faf9fa] px-4 py-4">
        <button
          type="button"
          onClick={() => router.push("/screen23")}
          className="mx-auto flex h-[48px] w-full max-w-[398px] items-center justify-center gap-2.5 rounded-full bg-[#a7344a] text-[14px] font-bold uppercase text-white transition-all duration-300 hover:bg-[#972f44]"
        >
          Weiter
          <Icon icon="lucide:arrow-right" width="22" height="22" />
        </button>
      </div>
    </section>
  );
};

export default Screen22;
