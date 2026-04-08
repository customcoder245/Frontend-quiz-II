"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "@/public/logo.avif";

const leftItems = [
  "Langsamer Stoffwechsel und Gewichtszunahme",
  "Hitzewallungen und plötzliche Wärmegefühle",
  "Nachtschweiß stört den Schlaf.",
  "Stimmungsschwankungen und Reizbarkeit",
  "Niedrige Energie",
];

const rightItems = [
  "Gesunde Gewichtserhaltung",
  "Stabile Körpertemperatur",
  "Erholsamer, ununterbrochener Schlaf",
  "Emotionale Stabilität und Stimmungsaufhellung",
  "Energieanstieg",
];

function Bullet({
  children,
  positive,
}: {
  children: React.ReactNode;
  positive: boolean;
}) {
  return (
    <li className="flex items-start gap-[8px]">
      <span
        className={`mt-[2px] inline-flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${
          positive ? "bg-[#2db66d]" : "bg-[#1d2450]"
        }`}
      >
        {positive ? "✓" : "×"}
      </span>
      <span className="text-[11px] font-medium leading-[1.45] text-[#23305b]">
        {children}
      </span>
    </li>
  );
}

function Gauge() {
  return (
    <div className="relative mx-auto h-[150px] w-[184px]">
      <p className="absolute left-0 top-[7px] text-[11px] font-semibold text-[#1d2450]">
        Du bist hier: 32%
      </p>

      <div className="absolute right-0 top-[11px] flex items-start gap-1 text-[11px] font-semibold leading-none text-[#1d2450]">
        <span className="pt-[2px]">Mit</span>
        <Image
          src={Logo}
          alt="purefemm"
          width={64}
          height={16}
          unoptimized
          className="h-auto w-[64px]"
        />
      </div>

      <svg
        viewBox="0 0 184 150"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M23 106 A68 68 0 0 1 161 106"
          fill="none"
          stroke="#1d2450"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M65 43 L72 57"
          stroke="#1d2450"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M145 76 L132 84"
          stroke="#1d2450"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <g transform="translate(93 102)">
          <path
            d="M0 0 L-30 -48 C-32 -51 -27 -55 -22 -51 L9 -18 C13 -14 12 -9 6 -8 Z"
            fill="#1d2450"
          />
          <circle r="12" fill="#1d2450" />
          <circle r="5.4" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
}

const Screen17 = () => {
  const router = useRouter();

  return (
    <section className="min-h-screen bg-white">
      <header className="bg-white">
        <div className="relative px-4 py-2.5 sm:px-5">
          <button
            type="button"
            aria-label="Back"
            onClick={() => router.back()}
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-[#66666c] sm:left-5"
          >
            <Icon icon="radix-icons:arrow-left" width="22" height="22" />
          </button>

          <div className="mx-auto flex max-w-[980px] items-center justify-center py-3">
            <Image
              src={Logo}
              alt="purefemm"
              width={120}
              height={30}
              unoptimized
              className="h-9 w-auto object-contain sm:h-10"
            />
          </div>
        </div>

        <div className="h-[4px] bg-[#ece8ea]">
          <div className="h-full w-[71.5%] bg-[#a7344a]" />
        </div>
      </header>

      <div className="mx-auto max-w-[360px] px-4 pb-28 pt-8 text-center">
        <div className="mx-auto flex w-[188px] items-center gap-[4px]">
          <span className="h-[3px] w-[37px] rounded-full bg-[#a7344a]" />
          <span className="h-[3px] w-[37px] rounded-full bg-[#a7344a]" />
          <span className="h-[3px] w-[37px] rounded-full bg-[#ece8ea]" />
          <span className="h-[3px] w-[37px] rounded-full bg-[#ece8ea]" />
          <span className="h-[3px] w-[37px] rounded-full bg-[#ece8ea]" />
        </div>

        <h1 className="mt-7 font-(family-name:--font-display) text-[28px] font-normal leading-[1.1] text-[#111111]">
          Deine Hormone <span className="text-[#d73345]">sind aus dem</span>
          <br />
          <span className="text-[#d73345]">Gleichgewicht</span>
        </h1>

        <div className="mx-auto mt-7 w-[304px] overflow-hidden rounded-[2px]">
          <div className="relative grid grid-cols-2">
            <div className="absolute inset-x-0 top-0 z-10 grid h-[178px] grid-cols-2">
              <div className="bg-[#ff7384]" />
              <div className="bg-[#d5f7e1]" />
            </div>

            <div className="absolute inset-x-0 top-0 z-20 flex h-[178px] items-start justify-center pt-5">
              <Gauge />
            </div>

            <div className="bg-[#ff7384] px-[14px] pb-7 pt-[182px]">
              <div className="text-left">
                <h2 className="text-[13px] font-extrabold leading-[1.1] text-[#1d2450]">
                  HORMONELLES
                  <br />
                  UNGLEICHGEWICHT
                </h2>

                <ul className="mt-3 space-y-4">
                  {leftItems.map((item) => (
                    <Bullet key={item} positive={false}>
                      {item}
                    </Bullet>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-[#d5f7e1] px-[12px] pb-7 pt-[182px]">
              <div className="text-left">
                <h2 className="text-[13px] font-extrabold leading-[1.1] text-[#1d2450]">
                  HORMONELLES
                  <br />
                  GLEICHGEWICHT
                </h2>

                <ul className="mt-3 space-y-4">
                  {rightItems.map((item) => (
                    <Bullet key={item} positive>
                      {item}
                    </Bullet>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#fbfafb] px-4 py-3">
        <button
          type="button"
          onClick={() => router.push("/screen18")}
          className="mx-auto flex h-[48px] w-full max-w-[398px] items-center justify-center gap-2.5 rounded-full border-2 border-[#4fa1ff] bg-[#a7344a] text-[14px] font-bold text-white shadow-[0_0_0_1px_rgba(167,52,74,0.08)]"
        >
          WEITER
          <Icon icon="lucide:arrow-right" width="22" height="22" />
        </button>
      </div>
    </section>
  );
};

export default Screen17;
