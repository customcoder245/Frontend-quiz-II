import { NextResponse } from "next/server";
import { getBackendRequestHeaders } from "@/app/lib/backend-request-auth";
import { getLocalQuestions } from "@/app/lib/quiz";

export async function GET(request: Request) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");
  const { searchParams } = new URL(request.url);
  const gender = searchParams.get("gender") ?? "female";

  if (apiBaseUrl) {
    try {
      const { headers, sessionUser } = await getBackendRequestHeaders({
        Accept: "application/json",
      });

      console.log("Questions request forwarding to backend:", {
        gender,
        hasToken: Boolean(sessionUser?.token),
        userId: sessionUser?.id ?? null,
      });

      const response = await fetch(`${apiBaseUrl}/questions?gender=${encodeURIComponent(gender)}`, {
        cache: "no-store",
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch {
      // Fall back to local questions below.
    }
  }

  return NextResponse.json({ questions: getLocalQuestions() });
}
