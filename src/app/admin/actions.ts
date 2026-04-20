"use server";

import { redirect } from "next/navigation";
import { clearAdminAuthCookie } from "@/lib/admin-auth";

export async function logoutAdmin() {
  await clearAdminAuthCookie();
  redirect("/admin-login");
}
