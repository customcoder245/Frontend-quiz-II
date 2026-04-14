import { NextResponse } from "next/server";
import axios from "axios";
import { createAdminSession } from "@/app/lib/auth";

export async function GET() {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");
    if (!apiBaseUrl) {
      return NextResponse.json(
        { message: "NEXT_PUBLIC_API_BASE_URL set nahi hai." },
        { status: 500 },
      );
    }

    const response = await axios.get(`${apiBaseUrl}/admin/login-hint`, {
      headers: {
        Accept: "application/json",
      },
      timeout: 10000,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Login hint route error:", error);
    const message =
      axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Login hint load nahi ho saka.";
    const status = axios.isAxiosError(error) ? error.response?.status || 500 : 500;

    return NextResponse.json(
      { message, credentials: { email: "customcoder245@gmail.com", password: "Admin@12345" } },
      { status },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };

    const username = typeof body.username === "string" ? body.username : "";
    const password = typeof body.password === "string" ? body.password : "";

    console.log("Frontend auth route hit:", {
      username,
      hasPassword: Boolean(password),
    });

    if (!username.trim() || !password.trim()) {
      return NextResponse.json(
        { message: "Admin email and password are required. 🔐" },
        { status: 400 },
      );
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");
    if (!apiBaseUrl) {
      return NextResponse.json(
        { message: "NEXT_PUBLIC_API_BASE_URL It is not set." },
        { status: 500 },
      );
    }

    const backendResponse = await axios.post(
      `${apiBaseUrl}/admin/login`,
      {
        email: username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000,
      },
    );

    const backendToken = backendResponse.data?.token;
    console.log("Backend login response received:", {
      status: backendResponse.status,
      hasToken: Boolean(backendToken),
      user: backendResponse.data?.user?.email || username,
    });
    if (!backendToken) {
      return NextResponse.json(
        { message: "Auth token was not received from the backend." },
        { status: 500 },
      );
    }

    const session = await createAdminSession(username, backendToken);

    return NextResponse.json({
      message: "Login successful.",
      user: session,
    });
  } catch (error) {
    console.error("Frontend auth POST route error:", {
      isAxiosError: axios.isAxiosError(error),
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
      data: axios.isAxiosError(error) ? error.response?.data : undefined,
      message: error instanceof Error ? error.message : "Unknown login error",
    });
    const message =
      axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "The login process could not be completed.";
    const status = axios.isAxiosError(error) ? error.response?.status || 500 : 500;

    return NextResponse.json(
      { message },
      { status },
    );
  }
}
