import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getAdminSession } from "@/app/lib/auth";
import { resolveSubmissions, SubmissionRecord } from "@/app/lib/submissions";

const exportsDirectory = path.join(process.cwd(), "data", "exports");

const toCsv = (rows: SubmissionRecord[]) => {
  const header = [
    "id",
    "firstName",
    "email",
    "gender",
    "answersCount",
    "createdAt",
    "responses",
  ];
  const lines = rows.map((row) =>
    [
      row.id,
      row.firstName,
      row.email,
      row.gender,
      String(row.responses.length),
      row.createdAt,
      JSON.stringify(row.responses),
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(","),
  );

  return [header.join(","), ...lines].join("\n");
};

const buildFileName = (baseName: string) => {
  const stamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
  const extensionIndex = baseName.lastIndexOf(".");

  if (extensionIndex === -1) {
    return `${baseName}-${stamp}`;
  }

  const name = baseName.slice(0, extensionIndex);
  const extension = baseName.slice(extensionIndex);
  return `${name}-${stamp}${extension}`;
};

const saveExportFile = async (fileName: string, content: string) => {
  await mkdir(exportsDirectory, { recursive: true });
  const finalFileName = buildFileName(fileName);
  const filePath = path.join(exportsDirectory, finalFileName);
  await writeFile(filePath, content, "utf8");

  return { filePath, fileName: finalFileName };
};

type ExportPayload =
  | {
      status: 200;
      fileName: string;
      contentType: string;
      content: string;
    }
  | {
      status: 404;
      body: string;
    };

const resolveExportPayload = async ({
  id,
  format,
}: {
  id?: string | null;
  format?: string | null;
}): Promise<ExportPayload> => {
  const { submissions } = await resolveSubmissions();

  if (id) {
    const submission = submissions.find((item) => item.id === id);

    if (!submission) {
      return { status: 404, body: "Submission not found" as const };
    }

    return {
      status: 200,
      fileName: `submission-${submission.id}.json`,
      contentType: "application/json; charset=utf-8",
      content: JSON.stringify(submission, null, 2),
    };
  }

  if (format === "json") {
    return {
      status: 200,
      fileName: "dashboard-submissions.json",
      contentType: "application/json; charset=utf-8",
      content: JSON.stringify(submissions, null, 2),
    };
  }

  return {
    status: 200,
    fileName: "dashboard-submissions.csv",
    contentType: "text/csv; charset=utf-8",
    content: toCsv(submissions),
  };
};

export async function GET(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const format = searchParams.get("format") ?? "csv";
  const save = searchParams.get("save") === "true";
  const payload = await resolveExportPayload({ id, format });

  if (payload.status !== 200) {
    return new Response(payload.body, { status: payload.status });
  }

  if (save) {
    const saved = await saveExportFile(payload.fileName, payload.content);
    return Response.json({ saved: true, savedTo: saved.filePath, fileName: saved.fileName });
  }

  return new Response(payload.content, {
    headers: {
      "Content-Type": payload.contentType,
      "Content-Disposition": `attachment; filename="${payload.fileName}"`,
    },
  });
}

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json()) as {
    id?: string;
    format?: string;
  };

  const payload = await resolveExportPayload({
    id: body.id ?? null,
    format: body.format ?? "csv",
  });

  if (payload.status !== 200) {
    return new Response(payload.body, { status: payload.status });
  }

  const saved = await saveExportFile(payload.fileName, payload.content);

  return Response.json({
    saved: true,
    savedTo: saved.filePath,
    fileName: saved.fileName,
  });
}
