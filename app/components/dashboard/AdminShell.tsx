import Link from "next/link";
import { ReactNode, SVGProps } from "react";
import { logoutAdminAction } from "@/app/lib/auth-actions";
import type { AdminSession } from "@/app/lib/auth";

type ActivePage = "users" | "reports";

type AdminShellProps = {
  adminSession: Pick<AdminSession, "username" | "role" | "loginAt">;
  activePage: ActivePage;
  title: string;
  description: string;
  actions?: ReactNode;
  stats?: ReactNode;
  children: ReactNode;
  showBranding?: boolean;
};

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Icon = ({
  children,
  ...props
}: SVGProps<SVGSVGElement> & { children: ReactNode }) => (
  <svg aria-hidden="true" {...iconProps} {...props}>
    {children}
  </svg>
);

const Grid = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Icon>
);

const File = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v5h5" />
    <path d="M9 13h6" />
    <path d="M9 17h6" />
    <path d="M9 9h2" />
  </Icon>
);

const Users = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9.5" cy="7" r="3" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
    <path d="M16 4.1a3 3 0 0 1 0 5.8" />
  </Icon>
);

const Chart = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M4 20V10" />
    <path d="M10 20V4" />
    <path d="M16 20v-7" />
    <path d="M22 20v-4" />
  </Icon>
);

export const formatAdminDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Calcutta",
  }).format(new Date(value));

export default function AdminShell({
  adminSession,
  activePage,
  title,
  description,
  actions,
  stats,
  children,
  showBranding = false,
}: AdminShellProps) {
  const navItems = [
    { label: "Dashboard", icon: Grid, href: "/dashboard", active: false },
    { label: "Submissions", icon: File, href: "/submissions", active: false },
    { label: "Users", icon: Users, href: "/admin", active: activePage === "users" },
    { label: "Reports", icon: Chart, href: "/reports", active: activePage === "reports" },
  ];

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
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-[16px] px-4 py-3 transition ${item.active ? "bg-[linear-gradient(135deg,#18345e_0%,#234f8f_100%)] text-white" : "text-[#26354d] hover:bg-[#f4f7fb]"}`}
              >
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
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#6f7e95]">
                  Admin Panel
                </p>
                <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-[#16253a]">
                  {title}
                </h1>
                <p className="mt-2 max-w-[760px] text-[14px] leading-[1.6] text-[#6f7e95]">
                  {description}
                </p>
                <div className="mt-4 inline-flex flex-wrap items-center gap-3 rounded-[18px] border border-[#e3ebf5] bg-[#f8fbff] px-4 py-3 text-[13px] text-[#516277]">
                  <span className="font-semibold text-[#173055]">{adminSession.username}</span>
                  <span className="rounded-full bg-[#eaf2ff] px-2.5 py-1 font-semibold text-[#2c64b7]">
                    {adminSession.role}
                  </span>
                  <span>Logged in: {formatAdminDateTime(adminSession.loginAt)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {actions}
                <form action={logoutAdminAction}>
                  <button
                    type="submit"
                    className="rounded-[16px] border border-[#dfe6ef] bg-white px-4 py-3 text-[14px] font-semibold text-[#1d3559] transition hover:bg-[#f4f7fb]"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-7">
            {stats ? <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">{stats}</div> : null}
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
