import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { ApiQuestion } from "@/app/lib/quiz";
import { getLocalQuestions } from "@/app/lib/quiz";

const dataDirectory = path.join(process.cwd(), "data");
const questionsPath = path.join(dataDirectory, "questions.json");

const readJsonArray = async <T>(filePath: string): Promise<{ exists: boolean; items: T[] }> => {
  try {
    const fileContent = await readFile(filePath, "utf8");
    const parsed = JSON.parse(fileContent);
    return { exists: true, items: Array.isArray(parsed) ? (parsed as T[]) : [] };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { exists: false, items: [] };
    }

    throw error;
  }
};

const writeQuestions = async (questions: ApiQuestion[]) => {
  await mkdir(dataDirectory, { recursive: true });
  const payload = JSON.stringify(questions, null, 2);
  await writeFile(questionsPath, payload, "utf8");
};

const normalizeQuestionInput = (input: Partial<ApiQuestion>) => {
  const questionText = String(input.questionText ?? "").trim();
  const rawOrder = typeof input.order === "number" ? input.order : Number(input.order);

  return {
    questionText,
    order: Number.isFinite(rawOrder) ? rawOrder : null,
    attributeId:
      typeof input.attributeId === "string" && input.attributeId.trim()
        ? input.attributeId.trim()
        : undefined,
    classid:
      typeof input.classid === "string" && input.classid.trim()
        ? input.classid.trim()
        : undefined,
    screenKey:
      typeof input.screenKey === "string" && input.screenKey.trim()
        ? input.screenKey.trim()
        : undefined,
    storageKey:
      typeof input.storageKey === "string" && input.storageKey.trim()
        ? input.storageKey.trim()
        : undefined,
  };
};

export const loadQuestions = async (): Promise<ApiQuestion[]> => {
  const stored = await readJsonArray<ApiQuestion>(questionsPath);
  return stored.items.length > 0 ? stored.items : getLocalQuestions();
};

export const loadStoredQuestions = async (): Promise<{ exists: boolean; questions: ApiQuestion[] }> => {
  const stored = await readJsonArray<ApiQuestion>(questionsPath);
  return { exists: stored.exists, questions: stored.items };
};

export const getQuestionById = async (id: string): Promise<ApiQuestion | null> => {
  const questions = await loadQuestions();
  return questions.find((question) => question._id === id) ?? null;
};

export const createQuestion = async (
  input: Partial<ApiQuestion> & { questionText: string; order: number },
): Promise<{ question: ApiQuestion; questions: ApiQuestion[] }> => {
  const questions = await loadQuestions();
  const normalized = normalizeQuestionInput(input);

  if (!normalized.questionText) {
    throw new Error("Question text is required.");
  }

  if (normalized.order == null) {
    throw new Error("Order must be a number.");
  }

  const candidateId =
    typeof input._id === "string" && input._id.trim() ? input._id.trim() : randomUUID();

  if (questions.some((question) => question._id === candidateId)) {
    throw new Error("A question with this ID already exists.");
  }

  const question: ApiQuestion = {
    _id: candidateId,
    order: normalized.order,
    questionText: normalized.questionText,
    attributeId: normalized.attributeId,
    classid: normalized.classid,
    screenKey: normalized.screenKey,
    storageKey: normalized.storageKey,
  };

  const nextQuestions = [...questions, question].sort((a, b) => a.order - b.order);
  await writeQuestions(nextQuestions);

  return { question, questions: nextQuestions };
};

export const updateQuestion = async (
  id: string,
  input: Partial<ApiQuestion>,
): Promise<{ question: ApiQuestion; questions: ApiQuestion[] } | null> => {
  const questions = await loadQuestions();
  const index = questions.findIndex((question) => question._id === id);

  if (index < 0) {
    return null;
  }

  const normalized = normalizeQuestionInput(input);

  if (!normalized.questionText) {
    throw new Error("Question text is required.");
  }

  if (normalized.order == null) {
    throw new Error("Order must be a number.");
  }

  const nextQuestion: ApiQuestion = {
    ...questions[index],
    order: normalized.order,
    questionText: normalized.questionText,
    attributeId: normalized.attributeId,
    classid: normalized.classid,
    screenKey: normalized.screenKey,
    storageKey: normalized.storageKey,
  };

  const nextQuestions = questions
    .map((question, questionIndex) => (questionIndex === index ? nextQuestion : question))
    .sort((a, b) => a.order - b.order);

  await writeQuestions(nextQuestions);

  return { question: nextQuestion, questions: nextQuestions };
};

export const deleteQuestion = async (id: string): Promise<boolean> => {
  const questions = await loadQuestions();

  if (!questions.some((question) => question._id === id)) {
    return false;
  }

  const nextQuestions = questions.filter((question) => question._id !== id);
  await writeQuestions(nextQuestions);

  return true;
};
