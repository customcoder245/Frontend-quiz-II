"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type UserAuthFormProps = {
  mode: "signup" | "login";
};

type AuthResponse = {
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export default function UserAuthForm({ mode }: UserAuthFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch(isSignup ? "/api/auth/signup" : "/api/auth/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isSignup ? { name, email, password } : { email, password }),
      });

      const data = (await response.json()) as AuthResponse;

      if (!response.ok) {
        setError(data.message || "Request complete nahi ho saka.");
        return;
      }

      if (data.user && !isSignup) {
        window.localStorage.setItem("quiz-user", JSON.stringify(data.user));
      }

      if (isSignup) {
        setSuccess("Signup ho gaya. Ab login page khul raha hai.");
        window.setTimeout(() => router.push("/user-login"), 700);
        return;
      }

      setSuccess("Login successful.");
      const nextPath = new URLSearchParams(window.location.search).get("next");
      router.push(nextPath?.startsWith("/screen") ? nextPath : "/");
    } catch {
      setError("Network issue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      {isSignup ? (
        <div className="space-y-2">
          <label className="text-[14px] font-semibold text-[#4c2830]" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            className="w-full rounded-[18px] border border-[#ead1d7] bg-white px-4 py-3 text-[15px] text-[#23191d] outline-none transition focus:border-[#9c3246] focus:ring-4 focus:ring-[#f7dfe4]"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-[14px] font-semibold text-[#4c2830]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-[18px] border border-[#ead1d7] bg-white px-4 py-3 text-[15px] text-[#23191d] outline-none transition focus:border-[#9c3246] focus:ring-4 focus:ring-[#f7dfe4]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[14px] font-semibold text-[#4c2830]" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            className="w-full rounded-[18px] border border-[#ead1d7] bg-white px-4 py-3 pr-24 text-[15px] text-[#23191d] outline-none transition focus:border-[#9c3246] focus:ring-4 focus:ring-[#f7dfe4]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[#ead1d7] bg-[#fff7f8] px-3 py-1.5 text-[12px] font-semibold text-[#9c3246] transition hover:bg-[#fff0f3]"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-[16px] border border-[#ffd5d9] bg-[#fff5f6] px-4 py-3 text-[14px] text-[#b33b4b]">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-[16px] border border-[#d5efdf] bg-[#effaf3] px-4 py-3 text-[14px] text-[#1f6c43]">
          {success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-[18px] bg-[#9c3246] px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(156,50,70,0.22)] transition hover:bg-[#8e2d40] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Please wait..." : isSignup ? "Create Account" : "Login"}
      </button>

      <p className="text-center text-[14px] text-[#6d5f63]">
        {isSignup ? "Already signed up?" : "New user?"}{" "}
        <Link
          href={isSignup ? "/user-login" : "/signup"}
          className="font-semibold text-[#9c3246]"
        >
          {isSignup ? "Login here" : "Signup here"}
        </Link>
      </p>
    </form>
  );
}
