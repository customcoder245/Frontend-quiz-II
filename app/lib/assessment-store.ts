import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { appendAssessmentToUser } from "@/app/lib/user-auth-store";

export type AssessmentResponse = {
  questionId: string;
  answer: string | number | string[];
};

export type AssessmentRecord = {
  id: string;
  userId?: string;
  email: string;
  firstName: string;
  fullName: string;
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

export const saveAssessment = async (input: {
  userId?: string;
  email: string;
  fullName: string;
  gender: string;
  responses: AssessmentResponse[];
}) => {
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();
  const assessment: AssessmentRecord = {
    id: randomUUID(),
    userId: input.userId?.trim() || undefined,
    email,
    firstName: fullName,
    fullName,
    gender: input.gender.trim() || "female",
    responses: input.responses,
    createdAt: new Date().toISOString(),
  };

  const existingAssessments = await loadAssessments();

  await mkdir(dataDirectory, { recursive: true });
  await writeFile(
    assessmentsPath,
    JSON.stringify([...existingAssessments, assessment], null, 2),
    "utf8",
  );

  await writeFile(
    legacySubmissionsPath,
    JSON.stringify([...existingAssessments, assessment], null, 2),
    "utf8",
  );

  const updatedUser = await appendAssessmentToUser({
    userId: assessment.userId,
    fullName: input.fullName,
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
