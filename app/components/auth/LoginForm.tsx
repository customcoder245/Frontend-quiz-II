"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network issue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-[14px] font-semibold text-[#233145]" htmlFor="email">
          Admin Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@example.com"
          className="w-full rounded-[18px] border border-[#d8e1ea] bg-white px-4 py-3 text-[15px] text-[#17263e] outline-none transition focus:border-[#2c69be] focus:ring-4 focus:ring-[#d8e8ff]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[14px] font-semibold text-[#233145]" htmlFor="password">
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
            className="w-full rounded-[18px] border border-[#d8e1ea] bg-white px-4 py-3 pr-24 text-[15px] text-[#17263e] outline-none transition focus:border-[#2c69be] focus:ring-4 focus:ring-[#d8e8ff]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[#d7e3f4] bg-[#f8fbff] px-3 py-1.5 text-[12px] font-semibold text-[#275cad] transition hover:bg-[#eef4ff]"
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
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-[18px] bg-[linear-gradient(135deg,#18345e_0%,#2e71d0_100%)] px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_rgba(31,80,143,0.25)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Signing in..." : "Login to Dashboard"}
      </button>
    </form>
  );
}
