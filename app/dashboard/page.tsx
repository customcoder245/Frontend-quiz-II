import DashboardClient from "@/app/components/dashboard/DashboardClient";
import { requireAdminSession } from "@/app/lib/auth";

type PageProps = {
  searchParams?: Promise<{ q?: string; filter?: string; view?: string }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const adminSession = await requireAdminSession();
  const params = (await searchParams) ?? {};

  return (
    <DashboardClient
      adminSession={adminSession}
      initialQ={params.q?.trim() ?? ""}
      initialFilter={(params.filter ?? "all").toLowerCase()}
      initialView={params.view ?? ""}
    />
  );
}
