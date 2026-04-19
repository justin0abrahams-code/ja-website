"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { quoteRequests } from "@/db/schema";

const allowedStatuses = new Set(["new", "contacted", "quoted", "closed"]);

export async function updateQuoteStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !allowedStatuses.has(status)) {
    throw new Error("Invalid quote status update request.");
  }

  await db
    .update(quoteRequests)
    .set({
      status: status as "new" | "contacted" | "quoted" | "closed",
    })
    .where(eq(quoteRequests.id, id));

  revalidatePath("/admin/quotes");
  revalidatePath(`/admin/quotes/${id}`);
}
