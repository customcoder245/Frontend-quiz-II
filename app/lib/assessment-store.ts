import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  appendAssessmentToUser,
  removeAssessmentFromUsers,
} from "@/app/lib/user-auth-store";

export type AssessmentResponse = {
  questionId: string;
  answer: string | number | string[];
};

export type AssessmentRecord = {
  id: string;
  userId?: string;
  email: string;
  firstName: string;
  lastName?: string;
  fullName?: string;
  message?: string;
  gender: string;
  responses: AssessmentResponse[];
  createdAt: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const assessmentsPath = path.join(dataDirectory, "assessments.json");
const legacySubmissionsPath = path.join(dataDirectory, "quiz-submissions.json");

const readJsonArray = async <T>(filePath: string): Promise<T[]> => {
  try {
    const fileContent = await readFile(filePath, "utf8");
    const parsed = JSON.parse(fileContent);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
};

export const loadAssessments = async (): Promise<AssessmentRecord[]> => {
  const primary = await readJsonArray<AssessmentRecord>(assessmentsPath);

  if (primary.length > 0) {
    return primary;
  }

  return readJsonArray<AssessmentRecord>(legacySubmissionsPath);
};

export const getAssessmentById = async (id: string) => {
  const assessments = await loadAssessments();
  return assessments.find((assessment) => assessment.id === id) ?? null;
};

const writeAssessments = async (assessments: AssessmentRecord[]) => {
  await mkdir(dataDirectory, { recursive: true });
  const payload = JSON.stringify(assessments, null, 2);

  await writeFile(assessmentsPath, payload, "utf8");
  await writeFile(legacySubmissionsPath, payload, "utf8");
};

const normalizeAssessmentName = (input: {
  firstName?: string;
  lastName?: string;
  fullName?: string;
}) => {
  const explicitFirstName = input.firstName?.trim() ?? "";
  const explicitLastName = input.lastName?.trim() ?? "";
  const explicitFullName = input.fullName?.trim() ?? "";
  const derivedFullName =
    explicitFullName ||
    [explicitFirstName, explicitLastName].filter(Boolean).join(" ").trim();
  const fallbackParts = derivedFullName.split(/\s+/).filter(Boolean);
  const firstName = explicitFirstName || fallbackParts[0] || "";
  const lastName = explicitLastName || fallbackParts.slice(1).join(" ");
  const fullName =
    derivedFullName || [firstName, lastName].filter(Boolean).join(" ").trim();

  return {
    firstName,
    lastName,
    fullName,
  };
};

export const saveAssessment = async (input: {
  userId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  message?: string;
  gender: string;
  responses: AssessmentResponse[];
}) => {
  const email = input.email.trim().toLowerCase();
  const message = input.message?.trim() ?? "";
  const name = normalizeAssessmentName(input);
  const assessment: AssessmentRecord = {
    id: randomUUID(),
    userId: input.userId?.trim() || undefined,
    email,
    firstName: name.firstName || name.fullName,
    lastName: name.lastName || undefined,
    fullName: name.fullName || name.firstName,
    message,
    gender: input.gender.trim() || "female",
    responses: input.responses,
    createdAt: new Date().toISOString(),
  };

  const existingAssessments = await loadAssessments();
  await writeAssessments([...existingAssessments, assessment]);

  const updatedUser = await appendAssessmentToUser({
    userId: assessment.userId,
    fullName: assessment.fullName || assessment.firstName,
    email: assessment.email,
    submissionId: assessment.id,
    gender: assessment.gender,
    responses: assessment.responses,
    createdAt: assessment.createdAt,
  });

  return {
    assessment,
    updatedUser,
  };
};

export const deleteAssessment = async (id: string) => {
  const assessments = await loadAssessments();

  if (!assessments.some((assessment) => assessment.id === id)) {
    return false;
  }

  const nextAssessments = assessments.filter((assessment) => assessment.id !== id);

  await writeAssessments(nextAssessments);
  await removeAssessmentFromUsers(id);

  return true;
};
