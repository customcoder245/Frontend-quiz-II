"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Screen24 = () => {
  const router = useRouter();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDone(true);
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!done) {
      return;
    }

    const redirectTimer = window.setTimeout(() => {
      router.replace("/screen25");
    }, 1400);

    return () => {
      window.clearTimeout(redirectTimer);
    };
  }, [done, router]);

  return (
    <section className="min-h-[calc(100vh-100px)] bg-white px-4 py-14">
      <div className="mx-auto flex max-w-[460px] flex-col items-center text-center">
        {!done ? (
          <div className="flex min-h-[55vh] items-center justify-center">
            <div className="purefemm-loader" />
          </div>
        ) : (
          <>
            <div className="purefemm-loader-done">
              <Check size={48} strokeWidth={1.6} />
            </div>
            <p className="mt-5 text-[16px] leading-[1.5] text-black">
              Einmaliger Sonderrabatt wird geladen...
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default Screen24;
