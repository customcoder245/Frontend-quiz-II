import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { PublicUser } from "@/app/lib/user-session";

export type StoredUserAccount = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  lastLoginAt?: string;
  loginCount?: number;
  authSource?: "local" | "backend";
  assessments?: Array<{
    submissionId: string;
    gender: string;
    responses: Array<{
      questionId: string;
      answer: string | number | string[];
    }>;
    createdAt: string;
  }>;
};

const dataDirectory = path.join(process.cwd(), "data");
const usersPath = path.join(dataDirectory, "user-accounts.json");

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const readUsers = async (): Promise<StoredUserAccount[]> => {
  try {
    const fileContent = await readFile(usersPath, "utf8");
    const parsed = JSON.parse(fileContent);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
};

const writeUsers = async (users: StoredUserAccount[]) => {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(usersPath, JSON.stringify(users, null, 2), "utf8");
};

const toPublicUser = (user: StoredUserAccount): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  lastLoginAt: user.lastLoginAt ?? null,
  loginCount: user.loginCount ?? 0,
  source: "local",
});

type UserAssessmentInput = {
  userId?: string;
  fullName?: string;
  email: string;
  submissionId: string;
  gender: string;
  responses: Array<{
    questionId: string;
    answer: string | number | string[];
  }>;
  createdAt: string;
};

const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password: string, storedValue: string) => {
  const [salt, storedHash] = storedValue.split(":");
  if (!salt || !storedHash) {
    return false;
  }

  const hashBuffer = Buffer.from(scryptSync(password, salt, 64).toString("hex"));
  const storedBuffer = Buffer.from(storedHash);

  return (
    hashBuffer.length === storedBuffer.length &&
    timingSafeEqual(hashBuffer, storedBuffer)
  );
};

export const createUserAccount = async (input: {
  name: string;
  email: string;
  password: string;
}) => {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password.trim();

  if (name.length < 2) {
    throw new Error("Name is required.");
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new Error("A valid email is required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  const users = await readUsers();
  if (users.some((user) => user.email === email)) {
    throw new Error("An account with this email already exists.");
  }

  const user: StoredUserAccount = {
    id: randomUUID(),
    name,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    authSource: "local",
  };

  await writeUsers([...users, user]);

  return toPublicUser(user);
};

export const findUserAccountByEmail = async (emailInput: string) => {
  const email = normalizeEmail(emailInput);
  const users = await readUsers();
  const user = users.find((item) => item.email === email);
  return user ? toPublicUser(user) : null;
};

export const verifyUserAccount = async (input: {
  email: string;
  password: string;
}) => {
  const email = normalizeEmail(input.email);
  const password = input.password.trim();
  const users = await readUsers();
  const userIndex = users.findIndex((item) => item.email === email);
  const user = users[userIndex];

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new Error("Email or password is incorrect.");
  }

  const updatedUser: StoredUserAccount = {
    ...user,
    lastLoginAt: new Date().toISOString(),
    loginCount: (user.loginCount ?? 0) + 1,
  };

  users[userIndex] = updatedUser;
  await writeUsers(users);

  return toPublicUser(updatedUser);
};

export const getUserAccountById = async (id: string) => {
  const users = await readUsers();
  const user = users.find((item) => item.id === id);
  return user ? toPublicUser(user) : null;
};

export const listUserAccounts = async () => {
  const users = await readUsers();
  return users.map((user) => toPublicUser(user));
};

export const appendAssessmentToUser = async (input: UserAssessmentInput) => {
  const users = await readUsers();
  const normalizedEmail = normalizeEmail(input.email);
  const normalizedName = input.fullName?.trim();
  const userIndex = users.findIndex(
    (item) => item.id === input.userId || item.email === normalizedEmail,
  );
  const nextAssessment = {
    submissionId: input.submissionId,
    gender: input.gender,
    responses: input.responses,
    createdAt: input.createdAt,
  };

  if (userIndex === -1) {
    const createdUser: StoredUserAccount = {
      id: input.userId?.trim() || randomUUID(),
      name: input.fullName?.trim() || normalizedEmail.split("@")[0] || "User",
      email: normalizedEmail,
      passwordHash: "",
      createdAt: new Date().toISOString(),
      authSource: "backend",
      assessments: [nextAssessment],
    };

    users.push(createdUser);
    await writeUsers(users);
    return createdUser;
  }

  const user = users[userIndex];
  const updatedUser: StoredUserAccount = {
    ...user,
    name: normalizedName || user.name || normalizedEmail.split("@")[0] || "User",
    authSource: user.authSource ?? "local",
    assessments: [...(user.assessments ?? []), nextAssessment],
  };

  users[userIndex] = updatedUser;
  await writeUsers(users);

  return updatedUser;
};

export const removeAssessmentFromUsers = async (submissionId: string) => {
  const users = await readUsers();
  let hasChanges = false;

  const updatedUsers = users.map((user) => {
    if (!user.assessments?.length) {
      return user;
    }

    const nextAssessments = user.assessments.filter(
      (assessment) => assessment.submissionId !== submissionId,
    );

    if (nextAssessments.length === user.assessments.length) {
      return user;
    }

    hasChanges = true;

    return {
      ...user,
      assessments: nextAssessments,
    };
  });

  if (hasChanges) {
    await writeUsers(updatedUsers);
  }

  return hasChanges;
};
