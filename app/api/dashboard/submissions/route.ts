import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/auth";
import { resolveSubmissions } from "@/app/lib/submissions";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const resolved = await resolveSubmissions();

  return NextResponse.json({
    source: resolved.source,
    submissions: resolved.submissions,
  });
}
