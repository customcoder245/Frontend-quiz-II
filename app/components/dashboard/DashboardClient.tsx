"use client";

import { isAxiosError } from "axios";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ReactNode, SVGProps } from "react";
import { logoutAdminAction } from "@/app/lib/auth-actions";
import { apiClient } from "@/app/lib/api-client";

type StoredResponse = { questionId: string; answer: string | number | string[] };
type SubmissionRecord = {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  fullName?: string;
  message?: string;
  gender: string;
  responses: StoredResponse[];
  createdAt: string;
};
type AdminSession = { username: string; role: "admin"; loginAt: string };
type DashboardClientProps = {
  adminSession: AdminSession;
  initialQ: string;
  initialFilter: string;
  initialView: string;
  activeSection?: "dashboard" | "submissions";
};

const iconProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const Icon = ({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) => <svg aria-hidden="true" {...iconProps} {...props}>{children}</svg>;
const Search = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.5-3.5" /></Icon>;
const Grid = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Icon>;
const File = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" /><path d="M14 2v5h5" /><path d="M9 13h6" /><path d="M9 17h6" /><path d="M9 9h2" /></Icon>;
const Users = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="3" /><path d="M22 21v-2a4 4 0 0 0-3-3.9" /><path d="M16 4.1a3 3 0 0 1 0 5.8" /></Icon>;
const Chart = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20v-4" /></Icon>;
const List = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3.5 6h.5" /><path d="M3.5 12h.5" /><path d="M3.5 18h.5" /></Icon>;
const Eye = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" /><circle cx="12" cy="12" r="3" /></Icon>;
const Mail = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></Icon>;
const Trash = (p: SVGProps<SVGSVGElement>) => <Icon {...p}><path d="M3 6h18" /><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></Icon>;

const allowedFilters = new Set(["all", "recent", "completed"]);

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Calcutta",
  }).format(new Date(value));

const buildHref = ({
  q,
  filter,
  view,
  basePath,
}: {
  q?: string;
  filter?: string;
  view?: string;
  basePath: string;
}) => {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (filter && filter !== "all" && allowedFilters.has(filter)) params.set("filter", filter);
  if (view) params.set("view", view);
  return params.size ? `${basePath}?${params.toString()}` : basePath;
};

const getDisplayName = (submission: Pick<SubmissionRecord, "firstName" | "lastName" | "fullName">) =>
  submission.fullName?.trim() ||
  [submission.firstName, submission.lastName].filter(Boolean).join(" ").trim() ||
  submission.firstName;

const getInitials = (value: string) => {
  const parts = value.split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) {
    return "US";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
};

export default function DashboardClient({
  adminSession,
  initialQ,
  initialFilter,
  initialView,
  activeSection = "dashboard",
}: DashboardClientProps) {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dataSource, setDataSource] = useState<"backend" | "local" | "">("");
  const [deletingId, setDeletingId] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const pagePath = activeSection === "submissions" ? "/submissions" : "/dashboard";

  useEffect(() => {
    let ignore = false;

    const fetchSubmissions = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await apiClient.get("/dashboard/submissions");
        const data = response.data as {
          submissions?: SubmissionRecord[];
          source?: "backend" | "local";
          message?: string;
        };

        if (!ignore) {
          setSubmissions(Array.isArray(data.submissions) ? data.submissions : []);
          setDataSource(data.source || "");
        }
      } catch (fetchError) {
        if (!ignore) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Dashboard submissions fetch Failed.",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void fetchSubmissions();

    return () => {
      ignore = true;
    };
  }, []);

  const q = initialQ;
  const filter = allowedFilters.has(initialFilter) ? initialFilter : "all";
  const view = initialView;

  const derivedData = useMemo(() => {
    const latestCreatedAt = submissions[0]?.createdAt ?? null;
    const isSameDayAsLatest = (value: string) => {
      if (!latestCreatedAt) return false;
      const target = new Date(value);
      const latest = new Date(latestCreatedAt);
      return target.getUTCFullYear() === latest.getUTCFullYear() && target.getUTCMonth() === latest.getUTCMonth() && target.getUTCDate() === latest.getUTCDate();
    };

    const filtered = submissions.filter((submission) => {
      const complete = submission.responses.length >= 10;
      const displayName = getDisplayName(submission);
      const searchOk =
        !q ||
        displayName.toLowerCase().includes(q.toLowerCase()) ||
        submission.email.toLowerCase().includes(q.toLowerCase()) ||
        submission.id.toLowerCase().includes(q.toLowerCase());
      const filterOk =
        filter === "all" ||
        (filter === "recent" && isSameDayAsLatest(submission.createdAt)) ||
        (filter === "completed" && complete) ||
        (filter === "draft" && !complete);

      return searchOk && filterOk;
    });

    return {
      filtered,
      recent: submissions.slice(0, 4),
      users: Array.from(
        submissions.reduce((map, submission) => {
          const existing = map.get(submission.email);

          if (!existing) {
            map.set(submission.email, {
              email: submission.email,
              name: getDisplayName(submission),
              gender: submission.gender,
              totalSubmissions: 1,
              latestCreatedAt: submission.createdAt,
              latestSubmissionId: submission.id,
            });
            return map;
          }

          existing.totalSubmissions += 1;

          if (
            new Date(submission.createdAt).getTime() >
            new Date(existing.latestCreatedAt).getTime()
          ) {
            existing.latestCreatedAt = submission.createdAt;
            existing.latestSubmissionId = submission.id;
            existing.name = getDisplayName(submission);
            existing.gender = submission.gender;
          }

          return map;
        }, new Map<string, {
          email: string;
          name: string;
          gender: string;
          totalSubmissions: number;
          latestCreatedAt: string;
          latestSubmissionId: string;
        }>()),
      ).map(([, user]) => user),
      selected:
        filtered.find((submission) => submission.id === view) ??
        submissions.find((submission) => submission.id === view) ??
        filtered[0] ??
        null,
      stats: [
        { label: "Total Assessments", value: submissions.length },
        {
          label: "New Assessments (Today)",
          value: submissions.filter((submission) => isSameDayAsLatest(submission.createdAt)).length,
        },
        {
          label: "Unique Users",
          value: new Set(submissions.map((submission) => submission.email)).size,
        },
        {
          label: "Published / Draft",
          value: `${submissions.filter((submission) => submission.responses.length >= 10).length}/${submissions.filter((submission) => submission.responses.length < 10).length}`,
        },
      ],
    };
  }, [filter, q, submissions, view]);

  const navItems = [
    { label: "Dashboard", icon: Grid, href: "/dashboard", active: activeSection === "dashboard" },
    { label: "Submissions", icon: File, href: "/submissions", active: activeSection === "submissions" },
    { label: "Users", icon: Users, href: "/admin" },
    { label: "Questions", icon: List, href: "/admin/questions" },
    { label: "Reports", icon: Chart, href: "/reports" },
  ];
  const showBranding = activeSection === "dashboard";

  const handleDelete = async (submission: SubmissionRecord) => {
    const displayName = getDisplayName(submission);
    const confirmed = window.confirm(`Delete submission for ${displayName}?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(submission.id);
    setFeedback(null);

    try {
      await apiClient.delete(`/dashboard/submissions/${submission.id}`);
      setSubmissions((current) => current.filter((item) => item.id !== submission.id));
      setFeedback({
        type: "success",
        message: `${displayName} Has the submission been deleted?`,
      });
    } catch (deleteError) {
      const responseData = isAxiosError(deleteError) ? deleteError.response?.data : null;
      const message =
        responseData &&
        typeof responseData === "object" &&
        "message" in responseData &&
        typeof responseData.message === "string"
          ? responseData.message
          : isAxiosError(deleteError)
            ? deleteError.message
            : deleteError instanceof Error
              ? deleteError.message
              : ": The submission could not be deleted.;";

      setFeedback({
        type: "error",
        message,
      });
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#eef4ff_0%,#f8fbff_28%,#f3f6fb_55%,#eef2f8_100%)] p-4 sm:p-6">
      <div className="mx-auto grid max-w-[1480px] gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-5 shadow-[0_18px_55px_rgba(36,66,115,0.08)]">
          {showBranding ? (
            <div className="rounded-[20px] border border-[#e8edf5] bg-white px-4 py-4">
              <p className="text-[22px] font-semibold text-[#173055]">AssessQuest</p>
              <p className="text-[13px] text-[#6d7c92]">Assessment manager</p>
            </div>
          ) : null}
          <nav className={`${showBranding ? "mt-6" : "mt-0"} space-y-2`}>
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className={`flex items-center gap-3 rounded-[16px] px-4 py-3 transition ${item.active ? "bg-[linear-gradient(135deg,#18345e_0%,#234f8f_100%)] text-white" : "text-[#26354d] hover:bg-[#f4f7fb]"}`}>
                <item.icon width={18} height={18} />
                <span className="text-[15px] font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <section className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] shadow-[0_18px_55px_rgba(36,66,115,0.08)]">
          <div className="border-b border-[#e8edf5] px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#6f7e95]">Admin Panel</p>
                <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-[#16253a]">
                  {activeSection === "submissions" ? "Assessment Submissions" : "Assessment Dashboard"}
                </h1>
                <p className="mt-2 text-[14px] leading-[1.6] text-[#6f7e95]">
                  {activeSection === "submissions"
                    ? "All submissions are available here with quick filters, detail view, and delete actions."
                    : "Real user records are being loaded on the dashboard through the API."}
                </p>
                <div className="mt-4 inline-flex flex-wrap items-center gap-3 rounded-[18px] border border-[#e3ebf5] bg-[#f8fbff] px-4 py-3 text-[13px] text-[#516277]">
                  <span className="font-semibold text-[#173055]">{adminSession.username}</span>
                  <span className="rounded-full bg-[#eaf2ff] px-2.5 py-1 font-semibold text-[#2c64b7]">
                    {adminSession.role}
                  </span>
                  <span>Logged in: {formatDateTime(adminSession.loginAt)}</span>
                  {dataSource ? (
                    <span className={`rounded-full px-2.5 py-1 font-semibold ${dataSource === "backend" ? "bg-[#e9f8ef] text-[#2f8a53]" : "bg-[#fff4df] text-[#b17918]"}`}>
                      Source: {dataSource}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <form action={pagePath} className="flex min-w-[280px] items-center gap-3 rounded-[16px] border border-[#dfe6ef] bg-white px-4 py-3">
                  <Search width={18} height={18} className="text-[#72839a]" />
                  <input name="q" defaultValue={q} placeholder="Search candidate or email..." className="w-full bg-transparent text-[14px] text-[#16253a] outline-none placeholder:text-[#95a2b3]" />
                  {filter !== "all" ? <input type="hidden" name="filter" value={filter} /> : null}
                </form>
                <form action={logoutAdminAction}>
                  <button type="submit" className="rounded-[16px] border border-[#dfe6ef] bg-white px-4 py-3 text-[14px] font-semibold text-[#1d3559] transition hover:bg-[#f4f7fb]">
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-7 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {derivedData.stats.map((stat) => (
                  <div key={stat.label} className="rounded-[22px] border border-[#e4ebf2] bg-white px-5 py-5 shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
                    <p className="text-[13px] text-[#6c7b90]">{stat.label}</p>
                    <p className="mt-2 text-[38px] font-semibold tracking-[-0.04em] text-[#17263e]">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div id="repository" className="rounded-[26px] border border-[#e4ebf2] bg-white shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
                <div className="border-b border-[#ebf0f5] px-5 py-5 sm:px-6">
                  <div>
                    <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#16253a]">Users Data Repository</h2>
                    <p className="mt-1 text-[14px] text-[#738399]">Submitted users’ data from the backend—including emails, answers, and the activity timeline—is displayed here.</p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {["all", "recent", "completed"].map((item) => (
                      <Link key={item} href={`${buildHref({ q, filter: item, basePath: pagePath })}#repository`} className={`rounded-[14px] border px-4 py-2.5 text-[13px] font-semibold ${filter === item ? "border-[#d8e4f7] bg-[#eef4ff] text-[#265cae]" : "border-[#dde5ef] bg-white text-[#526177]"}`}>{item[0].toUpperCase() + item.slice(1)}</Link>
                    ))}
                  </div>
                  {feedback ? (
                    <div className={`mt-4 rounded-[16px] border px-4 py-3 text-[13px] font-medium ${feedback.type === "success" ? "border-[#dbeedc] bg-[#f4fbf5] text-[#2f8a53]" : "border-[#f3d6dc] bg-[#fff5f7] text-[#b33b4b]"}`}>
                      {feedback.message}
                    </div>
                  ) : null}
                </div>

                {isLoading ? (
                  <div className="px-6 py-16 text-center">
                    <h3 className="text-[24px] font-semibold text-[#17263e]">Loading dashboard data...</h3>
                    <p className="mt-3 text-[15px] text-[#718095]">Submissions are being fetched from the API.</p>
                  </div>
                ) : error ? (
                  <div className="px-6 py-16 text-center">
                    <h3 className="text-[24px] font-semibold text-[#17263e]">Unable to load dashboard</h3>
                    <p className="mt-3 text-[15px] text-[#b33b4b]">{error}</p>
                  </div>
                ) : derivedData.filtered.length === 0 ? (
                  <div className="px-6 py-16 text-center">
                    <h3 className="text-[26px] font-semibold text-[#17263e]">No assessments found</h3>
                    <p className="mx-auto mt-3 max-w-[480px] text-[15px] leading-[1.6] text-[#718095]">No matching assessment was found in the current search or filter.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead className="border-b border-[#edf2f7] bg-[#fbfcfe]">
                        <tr className="text-[12px] uppercase tracking-[0.12em] text-[#6e7e95]">
                          <th className="px-6 py-4 font-semibold">ID</th>
                          <th className="px-6 py-4 font-semibold">User Name</th>
                          <th className="px-6 py-4 font-semibold">Email</th>
                          <th className="px-6 py-4 font-semibold">Answers</th>
                          <th className="px-6 py-4 font-semibold">Status</th>
                          <th className="px-6 py-4 font-semibold">Created</th>
                          <th className="px-6 py-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#edf2f7]">
                        {derivedData.filtered.map((submission, index) => {
                          const complete = submission.responses.length >= 10;
                          return (
                            <tr key={submission.id} className="text-[14px] text-[#1f2e45]">
                              <td className="px-6 py-4 font-medium">#{String(index + 1011)}</td>
                              <td className="px-6 py-4"><p className="font-semibold text-[#14253d]">{getDisplayName(submission)}</p><p className="mt-0.5 text-[12px] text-[#8190a6]">{submission.gender}</p></td>
                              <td className="px-6 py-4 text-[#516077]">{submission.email}</td>
                              <td className="px-6 py-4">{submission.responses.length}</td>
                              <td className="px-6 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold ${complete ? "bg-[#e9f8ef] text-[#2f8a53]" : "bg-[#fff4df] text-[#b17918]"}`}>{complete ? "Published" : "Draft"}</span></td>
                              <td className="px-6 py-4 text-[#516077]">{formatDateTime(submission.createdAt)}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3 text-[#6c7b90]">
                                  <Link href={`${buildHref({ q, filter, view: submission.id, basePath: pagePath })}#submission-details`} className="hover:text-[#1b5db7]" title="View details"><Eye width={16} height={16} /></Link>
                                  <a href={`mailto:${submission.email}?subject=Assessment Update`} className="hover:text-[#1b5db7]" title="Send email"><Mail width={16} height={16} /></a>
                                  <a
                                    href={`/api/dashboard/export?id=${submission.id}&format=json`}
                                    className="hover:text-[#1b5db7]"
                                    title="Download JSON"
                                  >
                                    <File width={16} height={16} />
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => void handleDelete(submission)}
                                    disabled={deletingId === submission.id}
                                    className="transition hover:text-[#c53e53] disabled:cursor-not-allowed disabled:opacity-40"
                                    title="Delete submission"
                                  >
                                    <Trash width={16} height={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>

            <div className="space-y-5">
              <div id="submission-details" className="rounded-[24px] border border-[#e4ebf2] bg-white p-5 shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
                <h3 className="text-[22px] font-semibold text-[#16253a]">Selected User Details</h3>
                {derivedData.selected ? (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-[18px] bg-[#f6f9ff] p-4">
                      <p className="text-[18px] font-semibold text-[#17263e]">{getDisplayName(derivedData.selected)}</p>
                      <p className="mt-1 text-[14px] text-[#5f7189]">{derivedData.selected.email}</p>
                      <p className="mt-2 text-[12px] uppercase tracking-[0.12em] text-[#8a97aa]">{formatDateTime(derivedData.selected.createdAt)}</p>
                    </div>
                    {derivedData.selected.message ? (
                      <div className="rounded-[18px] border border-[#dbe7f5] bg-[#f8fbff] p-4">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6c7c92]">
                          Your Message
                        </p>
                        <p className="mt-2 text-[14px] leading-[1.6] text-[#24344e]">
                          {derivedData.selected.message}
                        </p>
                      </div>
                    ) : null}
                    <div className="space-y-3">
                      {derivedData.selected.responses.map((response) => (
                        <div key={response.questionId} className="rounded-[16px] border border-[#e6edf5] bg-[#fbfcfe] p-3">
                          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7c8ca2]">{response.questionId}</p>
                          <p className="mt-1 text-[14px] text-[#24344e]">{Array.isArray(response.answer) ? response.answer.join(", ") : String(response.answer)}</p>
                        </div>
                      ))}
                    </div>
                    <a
                      href={`/api/dashboard/export?id=${derivedData.selected.id}&format=json`}
                      className="inline-flex rounded-[14px] bg-[#18345e] px-4 py-2.5 text-[13px] font-semibold text-white"
                    >
                      Download Full JSON
                    </a>
                  </div>
                ) : <p className="mt-4 text-[14px] text-[#72839a]">Clicking on the view icon will display the details here.</p>}
              </div>

              <div id="recent-activity" className="rounded-[24px] border border-[#e4ebf2] bg-white p-5 shadow-[0_8px_25px_rgba(42,78,130,0.06)]">
                <h3 className="text-[22px] font-semibold text-[#16253a]">Users Data</h3>
                <div className="mt-4 space-y-4">
                  {derivedData.users.length === 0 ? <p className="text-[14px] text-[#72839a]">No user has submitted yet.</p> : derivedData.users.map((user, index) => (
                    <Link key={user.email} href={`${buildHref({ q, filter, view: user.latestSubmissionId, basePath: pagePath })}#submission-details`} className="flex gap-3 rounded-[16px] p-2 transition hover:bg-[#f6f9ff]">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${index % 2 === 0 ? "bg-[linear-gradient(135deg,#1d4278_0%,#5a99eb_100%)]" : "bg-[linear-gradient(135deg,#7d57c6_0%,#f08aac_100%)]"}`}>{getInitials(user.name)}</div>
                      <div>
                        <p className="text-[14px] leading-[1.5] text-[#24344e]"><span className="font-semibold">{user.name}</span></p>
                        <p className="text-[12px] break-all text-[#7990ad]">{user.email}</p>
                        <p className="mt-1 text-[12px] text-[#95a2b3]">
                          {user.totalSubmissions} submission(s) | {formatDateTime(user.latestCreatedAt)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
