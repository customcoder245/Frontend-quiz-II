import AdminShell from "@/app/components/dashboard/AdminShell";
import QuestionsClient from "@/app/components/dashboard/QuestionsClient";
import { requireAdminSession } from "@/app/lib/auth";

export default async function AdminQuestionsPage() {
  const adminSession = await requireAdminSession();

  return (
    <AdminShell
      adminSession={adminSession}
      activePage="questions"
      title="Questions"
      description="Manage the quiz questions used by the frontend. Create, edit, and delete questions from this page."
    >
      <QuestionsClient />
    </AdminShell>
  );
}

