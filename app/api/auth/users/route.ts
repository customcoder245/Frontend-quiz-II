import { NextResponse } from "next/server";
import { listBackendUsers } from "@/app/lib/backend-user-auth";
import { listUserAccounts } from "@/app/lib/user-auth-store";

export async function GET() {
  const backendResult = await listBackendUsers();
  const users = backendResult?.users ?? (await listUserAccounts());

  return NextResponse.json({
    users,
    total: users.length,
    source: backendResult ? "backend" : "local",
  });
}
