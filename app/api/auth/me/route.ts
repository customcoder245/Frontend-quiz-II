import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserAccountById } from "@/app/lib/user-auth-store";
import { decodeUserSession } from "@/app/lib/user-session";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user-session")?.value;

  if (!sessionCookie) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const sessionUser = decodeUserSession(sessionCookie);
  if (sessionUser) {
    return NextResponse.json({ user: sessionUser });
  }

  const user = await getUserAccountById(sessionCookie);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
