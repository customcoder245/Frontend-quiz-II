import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/auth";
import { getAssessmentById } from "@/app/lib/assessment-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const assessment = await getAssessmentById(id);

  if (!assessment) {
    return NextResponse.json({ message: "Assessment not found." }, { status: 404 });
  }

  return NextResponse.json({ assessment });
}
