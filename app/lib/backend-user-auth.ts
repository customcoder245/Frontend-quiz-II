import { PublicUser } from "@/app/lib/user-session";

type AuthPayload = {
  name?: string;
  email: string;
  password: string;
};

type BackendAuthResult = {
  user: PublicUser;
  message: string;
};

type BackendListResult = {
  users: PublicUser[];
};

const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "";

const signupEndpoints = [
  "/auth/signup",
  "/auth/register",
  "/users/signup",
  "/users/register",
  "/user/signup",
  "/signup",
  "/register",
];

const loginEndpoints = [
  "/auth/login",
  "/users/login",
  "/user/login",
  "/login",
];

const usersEndpoints = [
  "/auth/users",
  "/users",
  "/user/users",
  "/auth/all-users",
];

const readJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const getNested = (value: unknown, path: string[]) =>
  path.reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }

    return undefined;
  }, value);

const asObject = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : null;

const normalizeBackendUser = (data: unknown, fallbackEmail = ""): PublicUser | null => {
  const candidate =
    asObject(getNested(data, ["user"])) ??
    asObject(getNested(data, ["data", "user"])) ??
    asObject(getNested(data, ["data"])) ??
    asObject(data);

  if (!candidate) {
    return null;
  }

  const firstName = typeof candidate.firstName === "string" ? candidate.firstName : "";
  const lastName = typeof candidate.lastName === "string" ? candidate.lastName : "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const email =
    typeof candidate.email === "string"
      ? candidate.email
      : typeof fallbackEmail === "string"
        ? fallbackEmail
        : "";
  const name =
    (typeof candidate.name === "string" && candidate.name.trim()) ||
    (typeof candidate.fullName === "string" && candidate.fullName.trim()) ||
    fullName ||
    email.split("@")[0] ||
    "User";
  const idSource =
    candidate.id ??
    candidate._id ??
    candidate.userId ??
    getNested(data, ["userId"]) ??
    email;

  if (!email) {
    return null;
  }

  const token =
    getNested(data, ["token"]) ??
    getNested(data, ["accessToken"]) ??
    getNested(data, ["data", "token"]) ??
    getNested(data, ["data", "accessToken"]);

  return {
    id: String(idSource),
    name,
    email,
    createdAt:
      typeof candidate.createdAt === "string" ? candidate.createdAt : new Date().toISOString(),
    lastLoginAt: typeof candidate.lastLoginAt === "string" ? candidate.lastLoginAt : null,
    loginCount: typeof candidate.loginCount === "number" ? candidate.loginCount : 0,
    token: typeof token === "string" ? token : null,
    source: "backend",
  };
};

const normalizeBackendUsers = (data: unknown): PublicUser[] => {
  const candidates =
    getNested(data, ["users"]) ??
    getNested(data, ["data", "users"]) ??
    getNested(data, ["data"]) ??
    data;

  return Array.isArray(candidates)
    ? candidates.flatMap((item) => {
        const user = normalizeBackendUser(item);
        return user ? [user] : [];
      })
    : [];
};

const postToBackend = async (
  endpoints: string[],
  payload: AuthPayload,
): Promise<BackendAuthResult | null> => {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    return null;
  }

  let sawReachableEndpoint = false;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: payload.name,
          fullName: payload.name,
          email: payload.email,
          password: payload.password,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      const data = await readJson(response);

      if (response.status === 404) {
        continue;
      }

      sawReachableEndpoint = true;

      if (!response.ok) {
        const message =
          typeof data?.message === "string" ? data.message : "Backend validation failed.";
        throw new Error(message);
      }

      const user = normalizeBackendUser(data, payload.email);
      if (!user) {
        throw new Error("Backend se user data nahi mila.");
      }

      return {
        user,
        message: typeof data?.message === "string" ? data.message : "Success.",
      };
    } catch (error) {
      if (sawReachableEndpoint && error instanceof Error) {
        throw error;
      }
    }
  }

  return null;
};

export const signupWithBackend = (payload: AuthPayload) =>
  postToBackend(signupEndpoints, payload);

export const loginWithBackend = (payload: AuthPayload) =>
  postToBackend(loginEndpoints, payload);

export const listBackendUsers = async (): Promise<BackendListResult | null> => {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    return null;
  }

  for (const endpoint of usersEndpoints) {
    try {
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });

      if (response.status === 404) {
        continue;
      }

      if (!response.ok) {
        throw new Error("Backend users fetch failed.");
      }

      const users = normalizeBackendUsers(await readJson(response));
      return { users };
    } catch {
      return null;
    }
  }

  return null;
};
