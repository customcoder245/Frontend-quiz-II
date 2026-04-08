"use client";

import { Check } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  buildQuizResponses,
  fetchQuestions,
  submitQuizAssessment,
} from "@/app/lib/quiz";

const emailPattern = /\S+@\S+\.\S+/;

const Screen24 = () => {
  const formRef = useRef<HTMLDivElement | null>(null);
  const [done, setDone] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDone(true);
    }, 1800);

    const savedName = window.localStorage.getItem("quiz-contact-name");
    const savedEmail = window.localStorage.getItem("quiz-contact-email");

    if (savedName) {
      setFullName(savedName);
    }

    if (savedEmail) {
      setEmail(savedEmail);
    }

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!done || !formRef.current) {
      return;
    }

    const scrollTimer = window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 220);

    return () => {
      window.clearTimeout(scrollTimer);
    };
  }, [done]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || submitSuccess) {
      return;
    }

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      setErrorMessage("Apna naam fill karein.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setErrorMessage("Valid email id fill karein.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const questions = await fetchQuestions("female");
      const responses = buildQuizResponses(questions, window.localStorage);

      if (responses.length === 0) {
        throw new Error("Assessment responses nahi mile.");
      }

      const data = await submitQuizAssessment({
        email: trimmedEmail,
        fullName: trimmedName,
        gender: "female",
        responses,
      });

      window.localStorage.setItem("quiz-contact-name", trimmedName);
      window.localStorage.setItem("quiz-contact-email", trimmedEmail);

      if (data.token) {
        window.localStorage.setItem("quiz-auth-token", data.token);
      }

      window.localStorage.setItem(
        "quiz-user",
        JSON.stringify({
          id: data.user?.id ?? data.updatedUser?.id ?? "",
          name: data.user?.name ?? trimmedName,
          email: data.user?.email ?? data.updatedUser?.email ?? trimmedEmail,
        }),
      );

      setSubmitSuccess(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Assessment save nahi ho saka.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

            <div
              ref={formRef}
              className="mt-8 w-full rounded-[28px] border border-[#eadfe0] bg-[#fff8f9] p-5 text-left shadow-[0_18px_45px_rgba(156,50,70,0.08)]"
            >
              <p className="text-center text-[20px] font-semibold text-[#9c3246]">
                Please fill in your details below
              </p>
              <p className="mt-2 text-center text-[14px] leading-[1.6] text-[#5a4650]">
               Once you submit your name and email ID, your assessment will be saved.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-[14px] font-semibold text-[#4c2830]"
                  >
                    User Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-[18px] border border-[#e3cfd4] bg-white px-4 py-3 text-[15px] text-[#23161b] outline-none transition focus:border-[#9c3246] focus:ring-2 focus:ring-[#9c324626]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[14px] font-semibold text-[#4c2830]"
                  >
                    Email Id
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-[18px] border border-[#e3cfd4] bg-white px-4 py-3 text-[15px] text-[#23161b] outline-none transition focus:border-[#9c3246] focus:ring-2 focus:ring-[#9c324626]"
                  />
                </div>

                {errorMessage ? (
                  <div className="rounded-[18px] border border-[#f3c7cb] bg-[#fff1f2] px-4 py-3 text-sm text-[#b42318]">
                    {errorMessage}
                  </div>
                ) : null}

                {submitSuccess ? (
                  <div className="rounded-[18px] border border-[#b6e7d2] bg-[#ecfdf3] px-4 py-3 text-sm text-[#027a48]">
                    Assessment successfully submit.
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="w-full rounded-full bg-[#9c3246] px-8 py-3 text-[15px] font-semibold text-white transition hover:bg-[#8e2d40] disabled:cursor-not-allowed disabled:bg-[#d7a8b1]"
                >
                  {submitSuccess
                    ? "Submitted"
                    : isSubmitting
                      ? "Submitting..."
                      : "Submit"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Screen24;
