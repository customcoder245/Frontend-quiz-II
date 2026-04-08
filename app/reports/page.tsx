import Link from "next/link";
import AdminShell, {
  formatAdminDateTime,
} from "@/app/components/dashboard/AdminShell";
import { requireAdminSession } from "@/app/lib/auth";
import { resolveSubmissions } from "@/app/lib/submissions";

const getDisplayName = (submission: {
  firstName: string;
  lastName?: string;
  fullName?: string;
}) =>
  submission.fullName ||
  [submission.firstName, submission.lastName].filter(Boolean).join(" ").trim() ||
  submission.firstName;

export default async function ReportsPage() {
  const adminSession = await requireAdminSession();
  const { submissions } = await resolveSubmissions();
  const completedReports = submissions.filter(
    (submission) => submission.responses.length >= 10,
  ).length;
  const latestReport = submissions[0]?.createdAt;

  return (
    <AdminShell
      adminSession={adminSession}
      activePage="reports"
      title="Users Reports"
      description="Reports now share the same dashboard layout, spacing, and font styling. You can review each saved report here and download individual or full exports."
      actions={
        <>
          <Link
            href="/submissions"
            className="inline-flex items-center justify-center rounded-[16px] border border-[#dfe6ef] bg-white px-4 py-3 text-[14px] font-semibold text-[#1d3559] transition hover:bg-[#f4f7fb]"
          >
            Open Submissions
          </Link>
          <a
            href="/api/dashboard/export"
            className="inline-flex items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#18345e_0%,#2e71d0_100%)] px-5 py-3 text-[14px] font-semibold text-white"
          >
            Download Full Report
          </a>
        </>
      }
      stats={
        <>
          <div className="rounded-[22px] border border-[#e4ebf2] bg-white px-5 py-5 shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
            <p className="text-[13px] text-[#6c7b90]">Total Reports</p>
            <p className="mt-2 text-[38px] font-semibold tracking-[-0.04em] text-[#17263e]">
              {submissions.length}
            </p>
          </div>
          <div className="rounded-[22px] border border-[#e4ebf2] bg-white px-5 py-5 shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
            <p className="text-[13px] text-[#6c7b90]">Completed Reports</p>
            <p className="mt-2 text-[38px] font-semibold tracking-[-0.04em] text-[#17263e]">
              {completedReports}
            </p>
          </div>
          <div className="rounded-[22px] border border-[#e4ebf2] bg-white px-5 py-5 shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
            <p className="text-[13px] text-[#6c7b90]">Draft Reports</p>
            <p className="mt-2 text-[38px] font-semibold tracking-[-0.04em] text-[#17263e]">
              {submissions.length - completedReports}
            </p>
          </div>
          <div className="rounded-[22px] border border-[#e4ebf2] bg-white px-5 py-5 shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
            <p className="text-[13px] text-[#6c7b90]">Latest Report</p>
            <p className="mt-2 text-[14px] font-semibold leading-[1.5] text-[#17263e]">
              {latestReport ? formatAdminDateTime(latestReport) : "No reports yet"}
            </p>
          </div>
        </>
      }
    >
      <div className="grid gap-5">
        {submissions.length === 0 ? (
          <div className="rounded-[26px] border border-[#e4ebf2] bg-white px-6 py-16 text-center shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
            <h2 className="text-[28px] font-semibold text-[#16253a]">No reports available</h2>
            <p className="mt-3 text-[15px] text-[#718095]">
              When users submit their assessments on the final details step, their
              reports will appear here automatically.
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
                    {getDisplayName(submission)}
                  </h2>
                  <p className="mt-1 break-all text-[14px] text-[#5f7189]">
                    {submission.email}
                  </p>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.12em] text-[#8a97aa]">
                    {submission.gender} | {formatAdminDateTime(submission.createdAt)}
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
                {submission.message ? (
                  <div className="rounded-[16px] border border-[#dfe9f7] bg-[#f6f9ff] p-4 md:col-span-2">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6983a3]">
                      Your Message
                    </p>
                    <p className="mt-2 text-[14px] leading-[1.6] text-[#24344e]">
                      {submission.message}
                    </p>
                  </div>
                ) : null}

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
    </AdminShell>
  );
}
