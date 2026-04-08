"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Screen11 = () => {
  const router = useRouter();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const completeTimer = window.setTimeout(() => {
      setDone(true);
    }, 1700);

    const nextTimer = window.setTimeout(() => {
      router.push("/screen12");
    }, 2350);

    return () => {
      window.clearTimeout(completeTimer);
      window.clearTimeout(nextTimer);
    };
  }, [router]);

  return (
    <section className="mx-auto max-w-[980px] px-4 pb-12">
      <div className="mx-auto max-w-4xl pt-8 text-center">
        <h2 className="result-title text-(--primary-color)">
          Warum diese Methoden meist scheitern
        </h2>

        <div className="page-slide-in mt-8 px-3">
          <p className="mx-auto max-w-[780px] text-[18px] italic leading-[1.35] text-black">
            Diäten, Sport oder Intervallfasten können funktionieren, aber nicht,
            wenn die Gewichtszunahme hormonell bedingt ist.
          </p>
          <p className="mx-auto mt-5 max-w-[780px] text-[18px] italic leading-[1.35] text-black">
            Denn dann speichert dein Körper Fett nicht, weil du zu viel isst,
            sondern weil Hormone, Stoffwechsel und Darmflora aus dem
            Gleichgewicht geraten sind.
          </p>
          <p className="mx-auto mt-5 max-w-[780px] text-[18px] italic leading-[1.35] text-black">
            Und herkömmliche Präparate? Die regulieren meist nur einen einzelnen
            Faktor oder sind zu niedrig dosiert, um wirklich etwas zu verändern.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center">
          {done ? (
            <div className="purefemm-loader-done">
              <Check size={38} strokeWidth={2.2} />
            </div>
          ) : (
            <div className="purefemm-loader" />
          )}

          <span className="mt-4 text-[17px] text-black">
            Lade die nächste Frage...
          </span>
        </div>
      </div>
    </section>
  );
};

export default Screen11;
