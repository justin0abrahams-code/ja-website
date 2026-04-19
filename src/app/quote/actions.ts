"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { quoteRequests } from "@/db/schema";
import { sendQuoteNotificationEmail } from "@/lib/email";
import { validateQuoteForm } from "@/lib/validation";

export async function submitQuoteRequest(formData: FormData) {
  const rawGuestCount = String(formData.get("guestCount") ?? "").trim();

  const guestCount =
    rawGuestCount === "" ? null : Number.parseInt(rawGuestCount, 10);

  const input = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    eventDate: String(formData.get("eventDate") ?? ""),
    eventType: String(formData.get("eventType") ?? ""),
    guestCount: Number.isNaN(guestCount) ? null : guestCount,
    location: String(formData.get("location") ?? ""),
    rentalPreference: String(formData.get("rentalPreference") ?? ""),
    supportNeeds: formData
      .getAll("support")
      .map((value) => String(value))
      .filter(Boolean),
    notes: String(formData.get("notes") ?? ""),
  };

  const validation = validateQuoteForm(input);

  if (!validation.success) {
    redirect(`/quote?error=${encodeURIComponent(validation.message)}`);
  }

  const data = validation.data;

  try {
    await db.insert(quoteRequests).values({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      eventDate: data.eventDate || null,
      eventType: data.eventType as
        | "corporate"
        | "wedding"
        | "live-music"
        | "party"
        | "presentation"
        | "other",
      guestCount: data.guestCount,
      location: data.location || null,
      rentalPreference: data.rentalPreference
        ? (data.rentalPreference as "pickup" | "delivery" | "not-sure")
        : null,
      supportNeeds: data.supportNeeds,
      notes: data.notes || null,
      status: "new",
    });

    await sendQuoteNotificationEmail(data);
  } catch (error) {
    console.error("Failed to submit quote request:", error);
    redirect("/quote?error=Something went wrong. Please try again.");
  }

  redirect("/quote?success=1");
}
