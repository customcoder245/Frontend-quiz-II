import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/auth";
import { deleteQuestion, updateQuestion } from "@/app/lib/question-store";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, { params }: RouteContext) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const questionId = decodeURIComponent(id).trim();

    if (!questionId) {
      return NextResponse.json({ message: "Question ID is required" }, { status: 400 });
    }

    const body = (await request.json()) as {
      order?: number;
      questionText?: string;
      attributeId?: string;
      classid?: string;
      storageKey?: string;
      screenKey?: string;
    };

    const result = await updateQuestion(questionId, {
      order: Number(body.order),
      questionText: String(body.questionText ?? ""),
      attributeId: body.attributeId,
      classid: body.classid,
      storageKey: body.storageKey,
      screenKey: body.screenKey,
    });

    if (!result) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update question." },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const questionId = decodeURIComponent(id).trim();

    if (!questionId) {
      return NextResponse.json({ message: "Question ID is required" }, { status: 400 });
    }

    const deleted = await deleteQuestion(questionId);
    if (!deleted) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to delete question." },
      { status: 500 },
    );
  }
}

