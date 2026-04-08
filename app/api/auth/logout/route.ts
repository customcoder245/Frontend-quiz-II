import { NextResponse } from "next/server";
import { clearAdminSession } from "@/app/lib/auth";

export async function POST() {
  await clearAdminSession();
  const response = NextResponse.json({ message: "Logout successful." });
  response.cookies.delete("user-session");
  return response;
}
