"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  buildQuizResponses,
  fetchQuestions,
  submitQuizAssessment,
} from "@/app/lib/quiz";

const emailPattern = /\S+@\S+\.\S+/;
const successToastId = "screen24-submit-success";

const clearQuizSessionStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  const removableKeys = Object.keys(window.localStorage).filter(
    (key) => key.startsWith("screen") || key.startsWith("quiz-"),
  );

  removableKeys.forEach((key) => {
    window.localStorage.removeItem(key);
  });
};

const AssessmentDetailsForm = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedFirstName = window.localStorage.getItem("quiz-contact-first-name");
    const savedLastName = window.localStorage.getItem("quiz-contact-last-name");
    const savedEmail = window.localStorage.getItem("quiz-contact-email");
    const savedMessage = window.localStorage.getItem("quiz-contact-message");
    const legacyName = window.localStorage.getItem("quiz-contact-name");

    if (savedFirstName) {
      setFirstName(savedFirstName);
    } else if (legacyName) {
      const [legacyFirstName = "", ...legacyLastName] = legacyName.trim().split(/\s+/);
      setFirstName(legacyFirstName);
      setLastName(legacyLastName.join(" "));
    }

    if (savedLastName) {
      setLastName(savedLastName);
    }

    if (savedEmail) {
      setEmail(savedEmail);
    }

    if (savedMessage) {
      setMessage(savedMessage);
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || submitSuccess) {
      return;
    }

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMessage = message.trim();
    const fullName = [trimmedFirstName, trimmedLastName].filter(Boolean).join(" ").trim();

    if (trimmedFirstName.length < 2) {
      setErrorMessage("Enter your first name.");
      return;
    }

    if (trimmedLastName.length < 2) {
      setErrorMessage("Enter your Last name.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setErrorMessage("Enter a valid email ID.");
      return;
    }

    if (trimmedMessage.length < 3) {
      setErrorMessage("Enter your message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const questions = await fetchQuestions("female");
      const responses = buildQuizResponses(questions, window.localStorage);

      if (responses.length === 0) {
        throw new Error("Assessment responses not received.");
      }

      const data = await submitQuizAssessment({
        email: trimmedEmail,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        fullName,
        message: trimmedMessage,
        gender: "female",
        responses,
      });

      window.localStorage.setItem("quiz-contact-first-name", trimmedFirstName);
      window.localStorage.setItem("quiz-contact-last-name", trimmedLastName);
      window.localStorage.setItem("quiz-contact-name", fullName);
      window.localStorage.setItem("quiz-contact-email", trimmedEmail);
      window.localStorage.setItem("quiz-contact-message", trimmedMessage);

      if (data.token) {
        window.localStorage.setItem("quiz-auth-token", data.token);
      }

      window.localStorage.setItem(
        "quiz-user",
        JSON.stringify({
          id: data.user?.id ?? data.updatedUser?.id ?? "",
          name: data.user?.name ?? fullName,
          email: data.user?.email ?? data.updatedUser?.email ?? trimmedEmail,
        }),
      );

      setSubmitSuccess(true);
      toast.success("Thank you! Your response has been submitted.", {
        toastId: successToastId,
        autoClose: 5000,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        onClose: () => {
          clearQuizSessionStorage();
          router.replace("/");
          router.refresh();
        },
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Assessment could not be saved.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-[28px] border border-[#eadfe0] bg-[#fff8f9] p-5 text-left shadow-[0_18px_45px_rgba(156,50,70,0.08)]">
      <p className="text-center text-[20px] font-semibold text-[#9c3246]">
        Please fill in your details below
      </p>
      <p className="mt-2 text-center text-[14px] leading-[1.6] text-[#5a4650]">
        Once you submit your details, your assessment will be saved.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-[14px] font-semibold text-[#4c2830]"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="Enter your first name"
              disabled={isSubmitting || submitSuccess}
              className="w-full rounded-[18px] border border-[#e3cfd4] bg-white px-4 py-3 text-[15px] text-[#23161b] outline-none transition focus:border-[#9c3246] focus:ring-2 focus:ring-[#9c324626] disabled:cursor-not-allowed disabled:bg-[#f7eef0]"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-[14px] font-semibold text-[#4c2830]"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Enter your last name"
              disabled={isSubmitting || submitSuccess}
              className="w-full rounded-[18px] border border-[#e3cfd4] bg-white px-4 py-3 text-[15px] text-[#23161b] outline-none transition focus:border-[#9c3246] focus:ring-2 focus:ring-[#9c324626] disabled:cursor-not-allowed disabled:bg-[#f7eef0]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-[14px] font-semibold text-[#4c2830]"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            disabled={isSubmitting || submitSuccess}
            className="w-full rounded-[18px] border border-[#e3cfd4] bg-white px-4 py-3 text-[15px] text-[#23161b] outline-none transition focus:border-[#9c3246] focus:ring-2 focus:ring-[#9c324626] disabled:cursor-not-allowed disabled:bg-[#f7eef0]"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-[14px] font-semibold text-[#4c2830]"
          >
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write your message"
            disabled={isSubmitting || submitSuccess}
            className="w-full rounded-[18px] border border-[#e3cfd4] bg-white px-4 py-3 text-[15px] text-[#23161b] outline-none transition focus:border-[#9c3246] focus:ring-2 focus:ring-[#9c324626] disabled:cursor-not-allowed disabled:bg-[#f7eef0]"
          />
        </div>

        {errorMessage ? (
          <div className="rounded-[18px] border border-[#f3c7cb] bg-[#fff1f2] px-4 py-3 text-sm text-[#b42318]">
            {errorMessage}
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
  );
};

export default AssessmentDetailsForm;
