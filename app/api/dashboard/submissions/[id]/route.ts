import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/auth";
import { deleteAssessment } from "@/app/lib/assessment-store";
import {
  deleteSubmissionFromBackend,
  resolveSubmissions,
} from "@/app/lib/submissions";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const submissionId = decodeURIComponent(id).trim();

    if (!submissionId) {
      return NextResponse.json(
        { message: "Submission id required hai." },
        { status: 400 },
      );
    }

    const resolved = await resolveSubmissions();
    const exists = resolved.submissions.some(
      (submission) => submission.id === submissionId,
    );

    if (!exists) {
      return NextResponse.json(
        { message: "Submission nahi mili." },
        { status: 404 },
      );
    }

    if (resolved.source === "backend") {
      const backendDelete = await deleteSubmissionFromBackend({
        id: submissionId,
        adminToken: session.token,
      });

      if (!backendDelete.deleted) {
        return NextResponse.json(
          {
            message:
              backendDelete.message ||
              "Backend delete endpoint available nahi hai.",
          },
          { status: backendDelete.attempted ? 502 : 501 },
        );
      }

      await deleteAssessment(submissionId).catch(() => undefined);

      return NextResponse.json({
        deleted: true,
        source: "backend",
      });
    }

    const deleted = await deleteAssessment(submissionId);

    if (!deleted) {
      return NextResponse.json(
        { message: "Submission delete nahi ho saki." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      deleted: true,
      source: "local",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Submission delete nahi ho saki.",
      },
      { status: 500 },
    );
  }
}
