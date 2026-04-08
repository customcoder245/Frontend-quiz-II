"use client";
/* eslint-disable @next/next/no-img-element */

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const ILLUSTRATION_IMAGE = "/screen21-graph.png";

const timelineItems = [
  {
    title: "Hormonelle Gewichtszunahme stoppen",
    text:
      "Unsere Kombination aus adaptogenen Pflanzenextrakten und gezielten Mikronährstoffen unterstützt das Gleichgewicht von Cortisol, Progesteron und Östrogen und hilft dabei, hormonell bedingte Gewichtszunahme sowie Heißhunger auf Kohlenhydrate zu adressieren.",
  },
  {
    title: "Blähungen reduzieren",
    text:
      "Enthält ausgewählte probiotische Kulturen zur Unterstützung der Verdauung, zur Reduzierung von Blähungen, zur Linderung gelegentlicher Verdauungsbeschwerden und zur Förderung eines ausgeglichenen Darmmilieus.",
  },
  {
    title: "Hormone unterstützen und ausgleichen",
    text:
      "Spezielle Pflanzenextrakte und Nährstoffe helfen dabei, hormonelle Schwankungen während der Wechseljahre zu harmonisieren und das allgemeine Wohlbefinden zu fördern.",
  },
  {
    title: "Stress lindern und Stimmung verbessern",
    text:
      "Ashwagandha kann helfen, den Cortisolspiegel zu regulieren und so Stress zu reduzieren sowie das allgemeine Wohlbefinden zu unterstützen.",
  },
] as const;

const Screen21 = () => {
  const router = useRouter();

  return (
    <section className="mx-auto max-w-[760px] px-4 pb-32 pt-5">
      <div className="mx-auto max-w-[360px] text-center">
        <div className="mx-auto mb-4 h-[2px] w-[150px] bg-[#b94b60]" />
        <h2 className="test text-[28px] leading-[1.15] text-black">
          Welche Ergebnisse kann ich erwarten?
        </h2>
        <p className="mx-auto mt-4 max-w-[300px] text-[14px] leading-[1.45] text-black">
          Indem du Wechseljahre Complex+ in deine tägliche Routine integrierst,
          unterstützt du die natürliche hormonelle Regulation deines Körpers,
          ein entscheidender Faktor für Stoffwechsel, Gewichtsbalance und
          allgemeines Wohlbefinden in den Wechseljahren.
        </p>

        <div className="mx-auto mt-6 max-w-[380px]">
          <img
            src={ILLUSTRATION_IMAGE}
            alt="Illustration"
            className="mx-auto w-full max-w-[320px] object-contain"
          />

          <div className="mt-3">
            <img
              src="/screen21-steps.png"
              alt="Einnahme und erste Ergebnisse"
              className="mx-auto w-full max-w-[378px] object-contain"
            />
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-[320px] text-left">
          {timelineItems.map((item, index) => (
            <div key={item.title} className="relative pb-6 pl-7 last:pb-0">
              {index < timelineItems.length - 1 ? (
                <span className="absolute left-[5px] top-3 h-full w-px bg-black" />
              ) : null}
              <span className="absolute left-0 top-1.5 h-[10px] w-[10px] rounded-full bg-black" />
              <h3 className="text-[15px] leading-[1.25] text-black">
                {item.title}
              </h3>
              <p className="mt-2 text-[11px] leading-[1.45] text-black">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-[300px]">
          <img
            src="/screen21-icons.png"
            alt="Produktvorteile"
            className="mx-auto w-full object-contain"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-10 flex w-full justify-center border-t border-gray-100 bg-[#fafafb] px-4 py-5">
        <button
          onClick={() => router.push("/screen22")}
          className="flex w-full max-w-[398px] items-center justify-center gap-2.5 rounded-full bg-[#a6344a] px-6 py-3 text-[12px] uppercase text-white transition-all duration-300 hover:bg-[#942f43]"
        >
          WEITER
          <Icon icon="lucide:arrow-right" width="22" height="22" />
        </button>
      </div>
    </section>
  );
};

export default Screen21;
