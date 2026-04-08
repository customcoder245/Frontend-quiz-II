"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const testimonials = [
  {
    name: "Sabine",
    city: "Hannover",
    quote:
      "Vom totalen Hormonchaos zu natürlicher Hormonbalance, die Kapseln sind mein go-to für die Wechseljahre-Kilos.",
    imagePosition: "14% 31%",
  },
  {
    name: "Maria",
    city: "Wien",
    quote:
      '"Ich fühl mich endlich wieder wie vor den Wechseljahren! Die Kapseln haben bei meinem Wechseljahre-Bauch echt Wunder gewirkt."',
    imagePosition: "11% 51.5%",
  },
  {
    name: "Angelika",
    city: "München",
    quote:
      '"Dachte meine Schlanke Phase ist jetzt vorbei. Bin so happy dass die Nahrungsergänzung mir dabei geholfen hat, das Hormon-Gewicht loszuwerden"',
    imagePosition: "16% 69.5%",
  },
] as const;

const featuredMedia = ["Women'sHealth", "BUNTE.de", "gofeminin", "DAS MAGAZIN"];

const progressBars = [
  "#a7344a",
  "#a7344a",
  "#a7344a",
  "#a7344a",
  "#a7344a",
  "#a7344a",
  "#a7344a",
];

const Screen23 = () => {
  const router = useRouter();

  return (
    <section className="mx-auto min-h-[calc(100vh-100px)] max-w-[760px] bg-white px-4 pb-28 pt-10">
      <div className="mx-auto max-w-[430px]">
        {/* Progress Bars */}
        <div className="mx-auto mb-8 flex w-full max-w-[404px] gap-[4px]">
          {progressBars.map((color, index) => (
            <span
              key={index}
              className="h-[3px] flex-1 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Title */}
        <h2 className="mx-auto max-w-[390px] text-center font-sans text-[29px] font-normal leading-[1.12] text-[#a7344a]">
          Weitere Erfahrungen echter
          <br />
          Nutzerinnen:
        </h2>

        {/* Testimonials */}
        <div className="mx-auto mt-8 max-w-[382px] space-y-0">
          {testimonials.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className={`flex gap-5 py-7 first:pt-0 last:pb-0 ${
                index < testimonials.length - 1 ? "border-b border-[#eadfe0]" : ""
              }`}
            >
              {/* Testimonial Image */}
              <div
                className="h-[90px] w-[90px] shrink-0 rounded-[6px] border border-[#ebe3e3] bg-no-repeat shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                style={{
                  backgroundImage: "url('/screen23-reference.png')",
                  backgroundPosition: item.imagePosition,
                  backgroundSize: "720px auto",
                }}
              />

              {/* Testimonial Text */}
              <div className="min-w-0 flex-1 pt-[1px]">
                <p className="text-[16px] leading-[1.34] text-black">
                  {item.quote}
                </p>

                <div className="mt-2.5 flex items-center justify-between gap-3">
                  <p className="text-[14px] font-semibold leading-none text-black">
                    {item.name}, {item.city}
                  </p>

                  <div className="flex items-center gap-1.5 text-[#12a86f]">
                    <Icon
                      icon="mdi:check-circle"
                      width="20"
                      height="20"
                      className="shrink-0"
                    />
                    <span className="text-[14px] leading-none">Verifiziert</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Featured Media */}
        <div className="mt-8 text-center">
          <p className="text-[13px] font-semibold text-[#3f3f46]">
            Purefemm ist bekannt aus:
          </p>

          <div className="mx-auto mt-4 flex max-w-[372px] items-center justify-between gap-3 text-black">
            {featuredMedia.map((item) => (
              <span
                key={item}
                className={`whitespace-nowrap text-[14px] font-semibold tracking-[-0.03em] ${
                  item === "Women'sHealth"
                    ? "font-serif"
                    : item === "BUNTE.de"
                    ? "border border-black px-1.5 py-0.5 text-[13px]"
                    : item === "gofeminin"
                    ? "font-normal italic"
                    : ""
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#f1efef] bg-[#faf9fa] px-4 py-4">
        <button
          type="button"
          onClick={() => router.push("/screen24")}
          className="mx-auto flex h-[48px] w-full max-w-[398px] items-center justify-center gap-2.5 rounded-full bg-[#a7344a] text-[15px] font-bold uppercase text-white transition-all duration-300 hover:bg-[#972f44]"
        >
          Zu den Ergebnissen
          <Icon icon="lucide:arrow-right" width="22" height="22" />
        </button>
      </div>
    </section>
  );
};

export default Screen23;