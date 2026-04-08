import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AdminSession = {
  username: string;
  role: "admin";
  loginAt: string;
  token: string;
};

const SESSION_COOKIE_NAME = "admin-session";
const DEFAULT_AUTH_SECRET = "change-this-auth-secret";

const encodeBase64Url = (value: string) => Buffer.from(value, "utf8").toString("base64url");

const decodeBase64Url = (value: string) => Buffer.from(value, "base64url").toString("utf8");

const getAuthSecret = () => process.env.AUTH_SECRET || DEFAULT_AUTH_SECRET;

const signPayload = (payload: string) =>
  createHmac("sha256", getAuthSecret()).update(payload).digest("base64url");

const serializeSession = (session: AdminSession) => {
  const payload = encodeBase64Url(JSON.stringify(session));
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
};

const parseSession = (token?: string | null): AdminSession | null => {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeBase64Url(payload)) as Partial<AdminSession>;
    if (parsed.username && parsed.role === "admin" && parsed.loginAt && parsed.token) {
      return {
        username: parsed.username,
        role: "admin",
        loginAt: parsed.loginAt,
        token: parsed.token,
      };
    }
  } catch {
    return null;
  }

  return null;
};

export const createAdminSession = async (username: string, token: string) => {
  const session: AdminSession = {
    username: username.trim(),
    role: "admin",
    loginAt: new Date().toISOString(),
    token,
  };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, serializeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return session;
};

export const clearAdminSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
};

export const getAdminSession = async () => {
  const cookieStore = await cookies();
  return parseSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
};

export const requireAdminSession = async () => {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  return session;
};

export const redirectIfAuthenticated = async () => {
  const session = await getAdminSession();

  if (session) {
    redirect("/dashboard");
  }
};
