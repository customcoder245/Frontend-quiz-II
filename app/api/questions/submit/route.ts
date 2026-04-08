import { NextResponse } from "next/server";
import { getBackendRequestHeaders } from "@/app/lib/backend-request-auth";
import { saveAssessment, type AssessmentResponse } from "@/app/lib/assessment-store";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<
    {
      email: string;
      gender: string;
      responses: AssessmentResponse[];
      fullName?: string;
      userId?: string;
    }
  >;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const userId = typeof body.userId === "string" ? body.userId.trim() : "";
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const gender = typeof body.gender === "string" ? body.gender.trim() : "female";
  const responses = Array.isArray(body.responses)
    ? body.responses.filter(
        (item): item is AssessmentResponse =>
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

  let backendResult:
    | {
        status: number;
        data: unknown;
      }
    | null = null;

  if (apiBaseUrl) {
    try {
      const { headers, sessionUser } = await getBackendRequestHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      });

      console.log("Assessment payload forwarding to backend:", {
        hasToken: Boolean(sessionUser?.token),
        userId: sessionUser?.id ?? null,
        body,
      });

      const response = await fetch(`${apiBaseUrl}/questions/submit`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));
      backendResult = {
        status: response.status,
        data,
      };
    } catch {
      backendResult = null;
    }
  }

  try {
    const { assessment, updatedUser } = await saveAssessment({
      userId: userId || undefined,
      email,
      fullName,
      gender,
      responses,
    });

    console.log("Assessment payload saving locally:", assessment);

    console.log("Assessment saved under user record:", updatedUser);

    return NextResponse.json({
      token: assessment.id,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: assessment.email,
        firstName: assessment.firstName,
        fullName: assessment.fullName,
        gender: assessment.gender,
        role: "user",
      },
      assessment,
      updatedUser: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        assessments: updatedUser.assessments ?? [],
      },
      backend: backendResult,
    });
  } catch {
    return NextResponse.json(
      { message: "Das Assessment konnte nicht gespeichert werden." },
      { status: 500 },
    );
  }
}
