"use server";

import { redirect } from "next/navigation";
import { clearAdminSession } from "@/app/lib/auth";

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/login");
}
