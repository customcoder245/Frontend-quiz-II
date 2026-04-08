import { cookies } from "next/headers";
import { decodeUserSession } from "@/app/lib/user-session";

export const getBackendRequestHeaders = async (initialHeaders?: HeadersInit) => {
  const headers = new Headers(initialHeaders);
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user-session")?.value;
  const sessionUser = decodeUserSession(sessionCookie);

  if (sessionUser?.token) {
    headers.set("Authorization", `Bearer ${sessionUser.token}`);
    headers.set("token", sessionUser.token);
    headers.set("x-auth-token", sessionUser.token);
    headers.set("x-access-token", sessionUser.token);
  }

  return {
    headers,
    sessionUser,
  };
};
