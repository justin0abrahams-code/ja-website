"use server";

import { redirect } from "next/navigation";
import { setAdminAuthCookie } from "@/lib/admin-auth";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    redirect("/admin/login?error=Admin password is not configured.");
  }

  if (password !== expectedPassword) {
    redirect("/admin/login?error=Invalid password.");
  }

  await setAdminAuthCookie();
  redirect("/admin/quotes");
}
