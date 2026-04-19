import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "jaep_admin_auth";

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  return value === "authenticated";
}

export async function setAdminAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
