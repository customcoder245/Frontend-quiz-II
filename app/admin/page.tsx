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

export default async function AdminPage() {
  const adminSession = await requireAdminSession();
  const { submissions } = await resolveSubmissions();

  const users = Array.from(
    submissions.reduce((map, submission) => {
      const existing = map.get(submission.email);

      if (!existing) {
        map.set(submission.email, {
          email: submission.email,
          name: getDisplayName(submission),
          gender: submission.gender,
          totalSubmissions: 1,
          latestCreatedAt: submission.createdAt,
          latestMessage: submission.message || "",
        });
        return map;
      }

      existing.totalSubmissions += 1;

      if (
        new Date(submission.createdAt).getTime() >
        new Date(existing.latestCreatedAt).getTime()
      ) {
        existing.name = getDisplayName(submission);
        existing.gender = submission.gender;
        existing.latestCreatedAt = submission.createdAt;
        existing.latestMessage = submission.message || "";
      }

      return map;
    }, new Map<string, {
      email: string;
      name: string;
      gender: string;
      totalSubmissions: number;
      latestCreatedAt: string;
      latestMessage: string;
    }>()),
  )
    .map(([, user]) => user)
    .sort(
      (a, b) =>
        new Date(b.latestCreatedAt).getTime() - new Date(a.latestCreatedAt).getTime(),
    );

  const averageSubmissions =
    users.length > 0 ? (submissions.length / users.length).toFixed(1) : "0.0";
  const latestActivity = users[0]?.latestCreatedAt;

  return (
    <AdminShell
      adminSession={adminSession}
      activePage="users"
      title="Users Overview"
      description="All admin pages now follow the same dashboard UI. This page shows unique users, their latest activity, and how many submissions each user has made."
      actions={
        <>
          <Link
            href="/submissions"
            className="inline-flex items-center justify-center rounded-[16px] border border-[#dfe6ef] bg-white px-4 py-3 text-[14px] font-semibold text-[#1d3559] transition hover:bg-[#f4f7fb]"
          >
            Open Submissions
          </Link>
          <Link
            href="/reports"
            className="inline-flex items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#18345e_0%,#2e71d0_100%)] px-5 py-3 text-[14px] font-semibold text-white"
          >
            Open Reports
          </Link>
        </>
      }
      stats={
        <>
          <div className="rounded-[22px] border border-[#e4ebf2] bg-white px-5 py-5 shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
            <p className="text-[13px] text-[#6c7b90]">Unique Users</p>
            <p className="mt-2 text-[38px] font-semibold tracking-[-0.04em] text-[#17263e]">
              {users.length}
            </p>
          </div>
          <div className="rounded-[22px] border border-[#e4ebf2] bg-white px-5 py-5 shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
            <p className="text-[13px] text-[#6c7b90]">Total Submissions</p>
            <p className="mt-2 text-[38px] font-semibold tracking-[-0.04em] text-[#17263e]">
              {submissions.length}
            </p>
          </div>
          <div className="rounded-[22px] border border-[#e4ebf2] bg-white px-5 py-5 shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
            <p className="text-[13px] text-[#6c7b90]">Average / User</p>
            <p className="mt-2 text-[38px] font-semibold tracking-[-0.04em] text-[#17263e]">
              {averageSubmissions}
            </p>
          </div>
          <div className="rounded-[22px] border border-[#e4ebf2] bg-white px-5 py-5 shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
            <p className="text-[13px] text-[#6c7b90]">Latest Activity</p>
            <p className="mt-2 text-[14px] font-semibold leading-[1.5] text-[#17263e]">
              {latestActivity ? formatAdminDateTime(latestActivity) : "No users yet"}
            </p>
          </div>
        </>
      }
    >
      <div className="rounded-[26px] border border-[#e4ebf2] bg-white shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
        <div className="border-b border-[#ebf0f5] px-5 py-5 sm:px-6">
          <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#16253a]">
            Users Directory
          </h2>
          <p className="mt-1 text-[14px] text-[#738399]">
            Each user is grouped by email so you can quickly review their latest
            submission, total activity, and saved profile details.
          </p>
        </div>

        {users.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-[26px] font-semibold text-[#17263e]">No users found</h3>
            <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-[1.6] text-[#718095]">
              When assessments are submitted, unique users will appear here with
              their latest activity and submission count.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-[#edf2f7] bg-[#fbfcfe]">
                <tr className="text-[12px] uppercase tracking-[0.12em] text-[#6e7e95]">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Gender</th>
                  <th className="px-6 py-4 font-semibold">Submissions</th>
                  <th className="px-6 py-4 font-semibold">Latest Activity</th>
                  <th className="px-6 py-4 font-semibold">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2f7]">
                {users.map((user) => (
                  <tr key={user.email} className="text-[14px] text-[#1f2e45]">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#14253d]">{user.name}</p>
                      {user.latestMessage ? (
                        <p className="mt-1 max-w-[280px] truncate text-[12px] text-[#8190a6]">
                          {user.latestMessage}
                        </p>
                      ) : (
                        <p className="mt-1 text-[12px] text-[#8190a6]">No message saved</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#516077]">{user.email}</td>
                    <td className="px-6 py-4 text-[#516077]">{user.gender}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-[#eef4ff] px-3 py-1 text-[12px] font-semibold text-[#275cad]">
                        {user.totalSubmissions} total
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#516077]">
                      {formatAdminDateTime(user.latestCreatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href="/submissions"
                        className="inline-flex rounded-[12px] border border-[#dfe6ef] px-3 py-2 text-[13px] font-semibold text-[#1d3559] transition hover:bg-[#f4f7fb]"
                      >
                        View Submissions
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
