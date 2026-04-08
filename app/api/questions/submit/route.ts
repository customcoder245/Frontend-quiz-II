import { NextResponse } from "next/server";
import { getBackendRequestHeaders } from "@/app/lib/backend-request-auth";
import type { AssessmentResponse } from "@/app/lib/assessment-store";

const createAssessmentHeaders = (includeAuth: boolean, baseHeaders?: Headers) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  if (!includeAuth || !baseHeaders) {
    return headers;
  }

  const authHeaderNames = [
    "Authorization",
    "token",
    "x-auth-token",
    "x-access-token",
  ];

  for (const headerName of authHeaderNames) {
    const headerValue = baseHeaders.get(headerName);
    if (headerValue) {
      headers.set(headerName, headerValue);
    }
  }

  return headers;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<
    {
      email: string;
      gender: string;
      responses: AssessmentResponse[];
      firstName?: string;
      lastName?: string;
      fullName?: string;
      message?: string;
      userId?: string;
    }
  >;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const userId = typeof body.userId === "string" ? body.userId.trim() : "";
  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
  const fullName =
    typeof body.fullName === "string" && body.fullName.trim().length > 0
      ? body.fullName.trim()
      : [firstName, lastName].filter(Boolean).join(" ").trim();
  const message = typeof body.message === "string" ? body.message.trim() : "";
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

  if (firstName.length < 2) {
    return NextResponse.json({ message: "First name is required." }, { status: 400 });
  }

  if (lastName.length < 2) {
    return NextResponse.json({ message: "Last name is required." }, { status: 400 });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ message: "Valid email is required." }, { status: 400 });
  }

  if (message.length < 3) {
    return NextResponse.json({ message: "Your message is required." }, { status: 400 });
  }

  if (responses.length === 0) {
    return NextResponse.json({ message: "No assessment answers were found." }, { status: 400 });
  }

  if (!apiBaseUrl) {
    return NextResponse.json(
      { message: "Backend API base URL is not configured." },
      { status: 500 },
    );
  }

  try {
    const { headers, sessionUser } = await getBackendRequestHeaders();
    const payload = {
      ...body,
      userId: userId || sessionUser?.id || undefined,
      email,
      firstName,
      lastName,
      fullName,
      message,
      gender,
      responses,
    };

    const submitToBackend = async (includeAuth: boolean) => {
      const response = await fetch(`${apiBaseUrl}/questions/submit`, {
        method: "POST",
        headers: createAssessmentHeaders(includeAuth, headers),
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));

      return { response, data };
    };

    let { response, data } = await submitToBackend(Boolean(sessionUser?.token));

    if (response.status === 401 && sessionUser?.token) {
      ({ response, data } = await submitToBackend(false));
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            typeof data?.message === "string"
              ? data.message
              : "The assessment could not be saved in the database.",
          backend: {
            status: response.status,
            data,
          },
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "The backend assessment service is unavailable." },
      { status: 502 },
    );
  }
}
