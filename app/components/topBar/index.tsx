"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/public/logo.avif";

const TOTAL_SCREENS = 19;

const TopBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const hideTopBar =
    pathname === "/screen17" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/user-login") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/reports");

  const isFirstScreen = pathname === "/" || pathname === "/screen1";
  const isFinalScreen = pathname === "/screen24";

  const handleQuizLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // Best-effort logout. Local quiz state is cleared below either way.
    } finally {
      if (typeof window !== "undefined") {
        const removableKeys = Object.keys(window.localStorage).filter(
          (key) => key.startsWith("screen") || key.startsWith("quiz-"),
        );

        removableKeys.forEach((key) => {
          window.localStorage.removeItem(key);
        });
      }

      router.push("/");
      router.refresh();
    }
  };

  let currentStep = 1;
  if (!isFirstScreen) {
    const match = pathname.match(/screen(\d+)/);
    if (match) {
      currentStep = parseInt(match[1], 10);
    }
  }

  const percent = Math.min(
    100,
    Math.max(0, ((currentStep - 1) / Math.max(1, TOTAL_SCREENS - 1)) * 100),
  );

  if (hideTopBar) {
    return null;
  }

  return (
    <>
      <section className="sticky top-0 z-10 bg-white/95 backdrop-blur-[2px]">
        <div className="relative px-4 py-2.5 sm:px-5">
          <button
            type="button"
            className={`absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-0 text-[#505051] outline-0 transition-opacity duration-300 sm:left-5 ${
              isFirstScreen ? "pointer-events-none cursor-default opacity-0" : "opacity-100"
            }`}
            onClick={() => !isFirstScreen && router.back()}
            disabled={isFirstScreen}
          >
            <Icon
              icon="radix-icons:arrow-left"
              width="22"
              height="22"
              color="#505051"
            />
          </button>

          <div className="mx-auto flex max-w-[980px] items-center justify-center py-3">
            <Image
              src={Logo}
              alt="Logo"
              width={100}
              height={100}
              unoptimized
              className="h-9 w-auto object-contain sm:h-10"
            />
          </div>

          {isFirstScreen || isFinalScreen ? (
            <div className="mt-2 flex justify-end text-[12px] font-semibold sm:absolute sm:right-5 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2 sm:text-[13px]">
              {isFinalScreen ? (
                <button
                  type="button"
                  onClick={handleQuizLogout}
                  className="rounded-full border border-[#ead1d7] bg-[#fff7f8] px-3 py-2 text-[#9c3246] shadow-[0_8px_18px_rgba(156,50,70,0.08)] transition hover:bg-[#fff1f4]"
                >
                  Logout
                </button>
              ) : null}

              {isFirstScreen ? (
              <Link
                href="/login"
                className="rounded-full border border-[#d8e1ea] bg-[#f8fbff] px-3 py-2 text-[#275cad] shadow-[0_8px_18px_rgba(31,80,143,0.08)] transition hover:bg-[#eef4ff]"
              >
                Admin Login
              </Link>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="h-1 w-full bg-[#eaeaeb]">
          <div
            className="h-full bg-[#9c3246]"
            style={{ width: `${percent}%`, transition: "width 0.5s ease" }}
          />
        </div>
      </section>
    </>
  );
};

export default TopBar;
