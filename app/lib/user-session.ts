export type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt?: string | null;
  lastLoginAt?: string | null;
  loginCount?: number;
  token?: string | null;
  source?: "backend" | "local";
};

export const encodeUserSession = (user: PublicUser) =>
  Buffer.from(JSON.stringify(user), "utf8").toString("base64url");

export const decodeUserSession = (value?: string | null): PublicUser | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<PublicUser>;

    if (
      typeof parsed.id === "string" &&
      typeof parsed.name === "string" &&
      typeof parsed.email === "string"
    ) {
      return {
        id: parsed.id,
        name: parsed.name,
        email: parsed.email,
        createdAt: parsed.createdAt ?? null,
        lastLoginAt: parsed.lastLoginAt ?? null,
        loginCount: parsed.loginCount ?? 0,
        token: parsed.token ?? null,
        source: parsed.source === "backend" ? "backend" : "local",
      };
    }
  } catch {
    return null;
  }

  return null;
};
