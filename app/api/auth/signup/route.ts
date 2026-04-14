import { NextResponse } from "next/server";
import { signupWithBackend } from "@/app/lib/backend-user-auth";
import { createUserAccount, findUserAccountByEmail } from "@/app/lib/user-auth-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const payload = {
      name: typeof body.name === "string" ? body.name : "",
      email: typeof body.email === "string" ? body.email : "",
      password: typeof body.password === "string" ? body.password : "",
    };

    const backendResult = await signupWithBackend(payload);
    if (backendResult) {
      return NextResponse.json({
        message: backendResult.message || "Signup successful.",
        user: backendResult.user,
        source: "backend",
      });
    }

    const existingUser = await findUserAccountByEmail(payload.email);
    if (existingUser) {
      return NextResponse.json(
        { message: "An account has already been created with this email", user: existingUser },
        { status: 409 },
      );
    }

    const user = await createUserAccount(payload);

    return NextResponse.json({
      message: "Signup successful.",
      user,
      source: "local",
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Signup could not be completed" },
      { status: 400 },
    );
  }
}
