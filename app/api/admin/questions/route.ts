import { NextResponse } from "next/server";
import { getAdminSession } from "@/app/lib/auth";
import { createQuestion, loadQuestions } from "@/app/lib/question-store";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const questions = await loadQuestions();
  return NextResponse.json({ questions });
}

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      _id?: string;
      order?: number;
      questionText?: string;
      attributeId?: string;
      classid?: string;
      storageKey?: string;
      screenKey?: string;
    };

    const result = await createQuestion({
      _id: body._id,
      order: Number(body.order),
      questionText: String(body.questionText ?? ""),
      attributeId: body.attributeId,
      classid: body.classid,
      storageKey: body.storageKey,
      screenKey: body.screenKey,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to create question." },
      { status: 400 },
    );
  }
}

