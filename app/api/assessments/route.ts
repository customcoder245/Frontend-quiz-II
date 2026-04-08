import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/auth";
import { loadAssessments, saveAssessment } from "@/app/lib/assessment-store";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const assessments = await loadAssessments();

  return NextResponse.json({
    assessments,
    total: assessments.length,
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    userId?: string;
    email?: string;
    fullName?: string;
    gender?: string;
    responses?: Array<{
      questionId: string;
      answer: string | number | string[];
    }>;
  };

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const gender = typeof body.gender === "string" ? body.gender.trim() : "female";
  const userId = typeof body.userId === "string" ? body.userId : undefined;
  const responses = Array.isArray(body.responses)
    ? body.responses.filter(
        (item): item is { questionId: string; answer: string | number | string[] } =>
          typeof item?.questionId === "string" &&
          item.questionId.trim().length > 0 &&
          (typeof item.answer === "string" ||
            typeof item.answer === "number" ||
            Array.isArray(item.answer)),
      )
    : [];

  if (fullName.length < 2) {
    return NextResponse.json({ message: "Name ist erforderlich." }, { status: 400 });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ message: "Gueltige E-Mail ist erforderlich." }, { status: 400 });
  }

  if (responses.length === 0) {
    return NextResponse.json({ message: "Keine Antworten zum Speichern gefunden." }, { status: 400 });
  }

  const { assessment, updatedUser } = await saveAssessment({
    userId,
    email,
    fullName,
    gender,
    responses,
  });

  return NextResponse.json({
    token: assessment.id,
    user: {
      email: assessment.email,
      firstName: assessment.firstName,
      gender: assessment.gender,
      role: "user",
    },
    assessment,
    updatedUser,
  });
}
