import { NextResponse } from "next/server";
import { loginWithBackend } from "@/app/lib/backend-user-auth";
import { verifyUserAccount } from "@/app/lib/user-auth-store";
import { encodeUserSession } from "@/app/lib/user-session";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const payload = {
      email: typeof body.email === "string" ? body.email : "",
      password: typeof body.password === "string" ? body.password : "",
    };

    const backendResult = await loginWithBackend(payload);
    const user = backendResult
      ? backendResult.user
      : await verifyUserAccount(payload);

    const response = NextResponse.json({
      message: backendResult?.message || "Login successful.",
      user,
      source: backendResult ? "backend" : "local",
    });

    response.cookies.set("user-session", encodeUserSession(user), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Login nahi ho saka." },
      { status: 401 },
    );
  }
}
