import { logoutAdminAction } from "@/app/lib/auth-actions";
import { requireAdminSession } from "@/app/lib/auth";
import { resolveSubmissions } from "@/app/lib/submissions";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Calcutta",
  }).format(new Date(value));

export default async function AdminPage() {
  const adminSession = await requireAdminSession();
  const { submissions } = await resolveSubmissions();
  const uniqueUsers = new Set(submissions.map((item) => item.email)).size;
  const latestSubmission = submissions[0]?.createdAt;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff2f4_0%,#fff_38%,#f8fafc_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[28px] border border-[#efd6dc] bg-white/90 p-6 shadow-[0_20px_60px_rgba(156,50,70,0.10)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#9c3246]">
                Admin Dashboard
              </p>
              <h1 className="mt-3 font-(family-name:--font-display) text-[34px] leading-[1.05] text-[#1f1720] sm:text-[42px]">
                Assessment submissions
              </h1>
              <p className="mt-3 max-w-[640px] text-[15px] leading-[1.6] text-[#5f5560]">
                Here you can see which user has submitted the assessment, their name, email, submission time, and how many answers were saved.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[18px] border border-[#f0e2e6] bg-[#fff8f9] px-4 py-3 text-[13px] text-[#6b5f66]">
                <span className="font-semibold text-[#9c3246]">{adminSession.username}</span>
                <span className="rounded-full bg-[#f6dbe1] px-2.5 py-1 font-semibold text-[#9c3246]">
                  {adminSession.role}
                </span>
                <span>Logged in: {formatDateTime(adminSession.loginAt)}</span>
                <form action={logoutAdminAction}>
                  <button type="submit" className="rounded-full border border-[#ead1d7] bg-white px-4 py-2 font-semibold text-[#8d3041] transition hover:bg-[#fff1f4]">
                    Logout
                  </button>
                </form>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] border border-[#f0e2e6] bg-[#fff8f9] px-5 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#7a6570]">
                  Total assessments
                </p>
                <p className="mt-2 text-[30px] font-semibold text-[#9c3246]">{submissions.length}</p>
              </div>
              <div className="rounded-[22px] border border-[#e3edf4] bg-[#f7fbff] px-5 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#627180]">
                  Unique users
                </p>
                <p className="mt-2 text-[30px] font-semibold text-[#1f4f8f]">{uniqueUsers}</p>
              </div>
              <div className="rounded-[22px] border border-[#e4efe8] bg-[#f7fcf8] px-5 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#5f7666]">
                  Latest submit
                </p>
                <p className="mt-2 text-[14px] font-semibold leading-[1.4] text-[#256341]">
                  {latestSubmission ? formatDateTime(latestSubmission) : "No submissions yet"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-[24px] border border-[#efe6e9]">
            {submissions.length === 0 ? (
              <div className="bg-white px-6 py-16 text-center">
                <h2 className="font-(family-name:--font-display) text-[30px] text-[#9c3246]">
                 No assessment has been saved yet.
                </h2>
                <p className="mx-auto mt-3 max-w-[460px] text-[15px] leading-[1.6] text-[#6b5f66]">
                  When users submit on `screen24`, their name and email will automatically appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden grid-cols-[1.4fr_1.3fr_0.8fr_1.1fr] gap-4 border-b border-[#efe6e9] bg-[#fff7f8] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#715862] md:grid">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Answers</div>
                  <div>Submitted at</div>
                </div>

                <div className="divide-y divide-[#f2eaed] bg-white">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="grid gap-3 px-6 py-5 md:grid-cols-[1.4fr_1.3fr_0.8fr_1.1fr] md:items-center"
                    >
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8a6b75] md:hidden">
                          Name
                        </p>
                        <p className="text-[16px] font-semibold text-[#21191f]">
                          {submission.firstName}
                        </p>
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8a6b75] md:hidden">
                          Email
                        </p>
                        <p className="break-all text-[15px] text-[#51474f]">{submission.email}</p>
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8a6b75] md:hidden">
                          Answers
                        </p>
                        <span className="inline-flex rounded-full bg-[#f6dbe1] px-3 py-1 text-[13px] font-semibold text-[#9c3246]">
                          {submission.responses.length} saved
                        </span>
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8a6b75] md:hidden">
                          Submitted at
                        </p>
                        <p className="text-[14px] leading-[1.45] text-[#51474f]">
                          {formatDateTime(submission.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
