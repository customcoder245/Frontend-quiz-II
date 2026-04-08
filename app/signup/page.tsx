import Link from "next/link";
import UserAuthForm from "@/app/components/auth/UserAuthForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#fff7f8_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-[520px] rounded-[28px] border border-[#efd6dc] bg-white p-7 shadow-[0_22px_60px_rgba(156,50,70,0.12)] sm:p-9">
        <Link href="/" className="text-[14px] font-semibold text-[#9c3246]">
          Back to quiz
        </Link>
        <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#9c3246]">
          User Signup
        </p>
        <h1 className="mt-4 font-(family-name:--font-display) text-[38px] leading-[1.08] text-[#1f1720]">
          Create your account
        </h1>
        <p className="mt-3 text-[15px] leading-[1.7] text-[#6d5f63]">
        First, sign up, then log in with the same email and password.
        </p>
        <UserAuthForm mode="signup" />
      </div>
    </main>
  );
}
