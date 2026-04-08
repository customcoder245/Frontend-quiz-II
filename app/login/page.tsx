import LoginForm from "@/app/components/auth/LoginForm";
import { redirectIfAuthenticated } from "@/app/lib/auth";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e4eefc_0%,#f8fbff_38%,#eef4fb_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        
        {/* Left Section */}
        <section className="rounded-[32px] border border-white/70 bg-[linear-gradient(160deg,#173056_0%,#0f223f_54%,#214f8e_100%)] p-8 text-white shadow-[0_24px_70px_rgba(18,40,74,0.22)] sm:p-10">
          
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#b6cef6]">
            Secure Admin Access
          </p>

          <h1 className="mt-5 font-(family-name:--font-display) text-[42px] leading-[1.02] sm:text-[54px]">
            Secure dashboard login for authorized admin access.
          </h1>

          <p className="mt-5 max-w-[520px] text-[16px] leading-[1.7] text-[#dce8fb]">
            This panel is designed for a verified administrator. After a
            successful sign-in, you will be redirected to the dashboard
            where user submissions and system information are available.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            
            <div className="rounded-[22px] border border-white/10 bg-white/8 p-5">
              <p className="text-[12px] uppercase tracking-[0.14em] text-[#a7c0eb]">
                Access Rule
              </p>

              <p className="mt-2 text-[20px] font-semibold">
                Admin Only
              </p>

              <p className="mt-2 text-[14px] leading-[1.6] text-[#d3e0f4]">
                Invalid credentials are rejected before dashboard access
                is granted.
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/8 p-5">
              <p className="text-[12px] uppercase tracking-[0.14em] text-[#a7c0eb]">
                Dashboard Data
              </p>

              <p className="mt-2 text-[20px] font-semibold">
                User Submissions
              </p>

              <p className="mt-2 text-[14px] leading-[1.6] text-[#d3e0f4]">
                View submitted records and manage system data securely.
              </p>
            </div>

          </div>
        </section>

        {/* Right Section */}
        <section className="rounded-[32px] border border-[#e3ebf5] bg-white p-8 shadow-[0_24px_70px_rgba(31,80,143,0.10)] sm:p-10">
          
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#6d7d92]">
            Admin Login
          </p>

          <h2 className="mt-4 text-[34px] font-semibold tracking-[-0.03em] text-[#16253a]">
            Welcome Back
          </h2>

          <p className="mt-3 text-[15px] leading-[1.7] text-[#66778d]">
            Enter your backend administrator email and password to access the protected dashboard.
          </p>

          <LoginForm />

        </section>

      </div>
    </main>
  );
}
