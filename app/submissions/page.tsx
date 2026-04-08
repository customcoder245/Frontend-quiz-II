import DashboardClient from "@/app/components/dashboard/DashboardClient";
import { requireAdminSession } from "@/app/lib/auth";

type PageProps = {
  searchParams?: Promise<{ q?: string; filter?: string; view?: string }>;
};

const allowedFilters = new Set(["all", "recent", "completed"]);

export default async function SubmissionsPage({ searchParams }: PageProps) {
  const adminSession = await requireAdminSession();
  const params = (await searchParams) ?? {};
  const normalizedFilter = (params.filter ?? "all").toLowerCase();

  return (
    <DashboardClient
      adminSession={adminSession}
      initialQ={params.q?.trim() ?? ""}
      initialFilter={allowedFilters.has(normalizedFilter) ? normalizedFilter : "all"}
      initialView={params.view ?? ""}
      activeSection="submissions"
    />
  );
}
