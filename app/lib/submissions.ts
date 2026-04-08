import axios from "axios";
import { loadAssessments } from "@/app/lib/assessment-store";

export type StoredResponse = {
  questionId: string;
  answer: string | number | string[];
};

export type SubmissionRecord = {
  id: string;
  userId?: string;
  email: string;
  firstName: string;
  gender: string;
  responses: StoredResponse[];
  createdAt: string;
};

export const loadSubmissions = async (): Promise<SubmissionRecord[]> => {
  return loadAssessments();
};

const normalizeSubmission = (submission: Record<string, unknown>): SubmissionRecord => ({
  id: String(submission.id || submission["userId"] || submission["submissionId"] || ""),
  userId:
    typeof submission.userId === "string"
      ? submission.userId
      : typeof submission.id === "string"
        ? submission.id
        : undefined,
  email: String(
    submission.email ||
      (submission.user as { email?: string } | undefined)?.email ||
      "",
  ),
  firstName: String(
    submission.firstName ||
      submission.fullName ||
      submission.username ||
      submission.name ||
      "Guest",
  ),
  gender: String(
    submission.gender ||
      (submission.user as { gender?: string } | undefined)?.gender ||
      "N/A",
  ),
  createdAt: String(submission.createdAt || submission.date || new Date().toISOString()),
  responses: Array.isArray(submission.responses)
    ? (submission.responses as StoredResponse[])
    : Array.isArray(submission.fullResponses)
      ? (submission.fullResponses as Array<Record<string, unknown>>).map((response) => ({
          questionId: String(response.key || response.question || response.questionId || "QUESTION"),
          answer: (response.answer as string | number | string[]) ?? "",
        }))
      : [],
});

export const resolveSubmissions = async (): Promise<{
  source: "backend" | "local";
  submissions: SubmissionRecord[];
}> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

  if (apiBaseUrl) {
    const candidateEndpoints = [
      `${apiBaseUrl}/admin/dashboard`,
      `${apiBaseUrl}/admin/submissions`,
      `${apiBaseUrl}/dashboard/submissions`,
      `${apiBaseUrl}/questions/submissions`,
      `${apiBaseUrl}/submissions`,
    ];

    for (const endpoint of candidateEndpoints) {
      try {
        const response = await axios.get(endpoint, {
          timeout: 8000,
          headers: {
            Accept: "application/json",
          },
        });

        const rawSubmissions: unknown[] | null = Array.isArray(response.data?.submissions)
          ? response.data.submissions
          : Array.isArray(response.data?.dashboard?.submissions)
            ? response.data.dashboard.submissions
            : Array.isArray(response.data)
              ? response.data
              : null;

        if (rawSubmissions) {
          return {
            source: "backend",
            submissions: rawSubmissions
              .map((submission) => normalizeSubmission(submission as Record<string, unknown>))
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
          };
        }
      } catch {
        // Try next endpoint and fall back to local data.
      }
    }
  }

  return {
    source: "local",
    submissions: (await loadSubmissions()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  };
};
