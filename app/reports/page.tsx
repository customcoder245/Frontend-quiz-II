import Link from "next/link";
import { logoutAdminAction } from "@/app/lib/auth-actions";
import { requireAdminSession } from "@/app/lib/auth";
import { resolveSubmissions } from "@/app/lib/submissions";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Calcutta",
  }).format(new Date(value));

export default async function ReportsPage() {
  const adminSession = await requireAdminSession();
  const { submissions } = await resolveSubmissions();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#eef4ff_0%,#f8fbff_28%,#f3f6fb_55%,#eef2f8_100%)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] shadow-[0_18px_55px_rgba(36,66,115,0.08)]">
        <div className="border-b border-[#e8edf5] px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#6f7e95]">
                Reports Panel
              </p>
              <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.03em] text-[#16253a]">
                Users Reports
              </h1>
              <p className="mt-2 max-w-[720px] text-[15px] leading-[1.7] text-[#6f7e95]">
              All the user data displayed on the dashboard is available here in report format. Each user’s complete report, as well as the full CSV/JSON report, can be downloaded from here.
              </p>
              <div className="mt-4 inline-flex flex-wrap items-center gap-3 rounded-[18px] border border-[#e3ebf5] bg-[#f8fbff] px-4 py-3 text-[13px] text-[#516277]">
                <span className="font-semibold text-[#173055]">{adminSession.username}</span>
                <span className="rounded-full bg-[#eaf2ff] px-2.5 py-1 font-semibold text-[#2c64b7]">
                  {adminSession.role}
                </span>
                <span>Logged in: {formatDateTime(adminSession.loginAt)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-[16px] border border-[#dfe6ef] bg-white px-4 py-3 text-[14px] font-semibold text-[#1d3559]"
              >
                Back to Dashboard
              </Link>
              <a
                href="/api/dashboard/export"
                className="inline-flex items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#18345e_0%,#2e71d0_100%)] px-5 py-3 text-[14px] font-semibold text-white"
              >
              Download Full Report
              </a>
              <form action={logoutAdminAction}>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-[16px] border border-[#dfe6ef] bg-white px-4 py-3 text-[14px] font-semibold text-[#1d3559]"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid gap-5 px-6 py-6 sm:px-8">
          {submissions.length === 0 ? (
            <div className="rounded-[24px] border border-[#e4ebf2] bg-white px-6 py-16 text-center">
              <h2 className="text-[28px] font-semibold text-[#16253a]">No reports available</h2>
              <p className="mt-3 text-[15px] text-[#718095]">
                When users submit their assessments, their reports will be displayed here.
              </p>
            </div>
          ) : (
            submissions.map((submission) => (
              <section
                key={submission.id}
                className="rounded-[26px] border border-[#e4ebf2] bg-white shadow-[0_8px_25px_rgba(42,78,130,0.06)]"
              >
                <div className="flex flex-col gap-4 border-b border-[#ebf0f5] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div>
                    <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#16253a]">
                      {submission.firstName}
                    </h2>
                    <p className="mt-1 break-all text-[14px] text-[#5f7189]">
                      {submission.email}
                    </p>
                    <p className="mt-2 text-[12px] uppercase tracking-[0.12em] text-[#8a97aa]">
                      {submission.gender} | {formatDateTime(submission.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[12px] font-semibold text-[#275cad]">
                      {submission.responses.length} answers
                    </span>
                    <a
                      href={`/api/dashboard/export?id=${submission.id}&format=json`}
                      className="rounded-full bg-[#18345e] px-3 py-1 text-[12px] font-semibold text-white"
                    >
                      Download Report
                    </a>
                  </div>
                </div>

                <div className="grid gap-3 px-5 py-5 md:grid-cols-2 sm:px-6">
                  {submission.responses.map((response) => (
                    <div
                      key={`${submission.id}-${response.questionId}`}
                      className="rounded-[16px] border border-[#e6edf5] bg-[#fbfcfe] p-3"
                    >
                      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7c8ca2]">
                        {response.questionId}
                      </p>
                      <p className="mt-1 text-[14px] text-[#24344e]">
                        {Array.isArray(response.answer)
                          ? response.answer.join(", ")
                          : String(response.answer)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
