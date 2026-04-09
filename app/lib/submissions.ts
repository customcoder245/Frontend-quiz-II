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
  lastName?: string;
  fullName?: string;
  message?: string;
  gender: string;
  responses: StoredResponse[];
  createdAt: string;
};

export const loadSubmissions = async (): Promise<SubmissionRecord[]> => {
  return loadAssessments();
};

const normalizeSubmission = (submission: Record<string, unknown>): SubmissionRecord => {
  const user = submission.user as
    | {
        email?: string;
        gender?: string;
        name?: string;
        firstName?: string;
        lastName?: string;
      }
    | undefined;
  const rawFullName = String(
    submission.fullName ||
      user?.name ||
      submission.username ||
      submission.name ||
      "",
  ).trim();
  const rawFirstName = String(
    submission.firstName ||
      user?.firstName ||
      "",
  ).trim();
  const rawLastName = String(
    submission.lastName ||
      user?.lastName ||
      "",
  ).trim();
  const fullName =
    rawFullName ||
    [rawFirstName, rawLastName].filter(Boolean).join(" ").trim();
  const fullNameParts = fullName.split(/\s+/).filter(Boolean);
  const firstName = rawFirstName || fullNameParts[0] || "Guest";
  const lastName = rawLastName || fullNameParts.slice(1).join(" ");

  return {
    id: String(submission.id || submission["userId"] || submission["submissionId"] || ""),
    userId:
      typeof submission.userId === "string"
        ? submission.userId
        : typeof submission.id === "string"
          ? submission.id
          : undefined,
    email: String(submission.email || user?.email || ""),
    firstName,
    lastName: lastName || undefined,
    fullName: fullName || firstName,
    message: String(submission.message || ""),
    gender: String(submission.gender || user?.gender || "N/A"),
    createdAt: String(submission.createdAt || submission.date || new Date().toISOString()),
    responses: Array.isArray(submission.responses)
      ? (submission.responses as StoredResponse[])
      : Array.isArray(submission.fullResponses)
        ? (submission.fullResponses as Array<Record<string, unknown>>).map((response) => ({
            questionId: String(response.key || response.question || response.questionId || "QUESTION"),
            answer: (response.answer as string | number | string[]) ?? "",
          }))
        : [],
  };
};

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

const deleteCandidateEndpoints = [
  "/admin/submissions",
  "/admin/dashboard/submissions",
  "/dashboard/submissions",
  "/questions/submissions",
  "/submissions",
];

const readBackendMessage = async (response: Response) => {
  try {
    const data = await response.json();
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }
  } catch {
    // Fallback to plain text below.
  }

  try {
    const text = await response.text();
    return text.trim() || undefined;
  } catch {
    return undefined;
  }
};

export const deleteSubmissionFromBackend = async ({
  id,
  adminToken,
}: {
  id: string;
  adminToken?: string | null;
}): Promise<{
  attempted: boolean;
  deleted: boolean;
  message?: string;
}> => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

  if (!apiBaseUrl) {
    return {
      attempted: false,
      deleted: false,
      message: "Backend API base URL is not configured.",
    };
  }

  let attempted = false;
  let lastMessage = "Backend submission delete failed.";

  for (const endpoint of deleteCandidateEndpoints) {
    const requests = [
      {
        url: `${apiBaseUrl}${endpoint}/${encodeURIComponent(id)}`,
        body: null,
      },
      {
        url: `${apiBaseUrl}${endpoint}?id=${encodeURIComponent(id)}`,
        body: null,
      },
      {
        url: `${apiBaseUrl}${endpoint}`,
        body: JSON.stringify({ id }),
      },
    ];

    for (const request of requests) {
      try {
        const response = await fetch(request.url, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            ...(request.body ? { "Content-Type": "application/json" } : {}),
            ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
          },
          body: request.body,
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        });

        if (response.status === 404) {
          continue;
        }

        attempted = true;

        if (response.ok) {
          return {
            attempted: true,
            deleted: true,
          };
        }

        const message = await readBackendMessage(response);
        if (message) {
          lastMessage = message;
        }

        if ([400, 405, 422].includes(response.status)) {
          continue;
        }

        return {
          attempted: true,
          deleted: false,
          message: lastMessage,
        };
      } catch (error) {
        if (error instanceof Error && error.message) {
          lastMessage = error.message;
        }
      }
    }
  }

  return {
    attempted,
    deleted: false,
    message: attempted ? lastMessage : "No compatible backend delete endpoint found.",
  };
};
