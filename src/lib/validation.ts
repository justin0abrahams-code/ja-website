export type QuoteFormInput = {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: string;
  guestCount: number | null;
  location: string;
  rentalPreference: string;
  supportNeeds: string[];
  notes: string;
};

export type QuoteFormValidationResult =
  | { success: true; data: QuoteFormInput }
  | { success: false; message: string };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const allowedEventTypes = new Set([
  "corporate",
  "wedding",
  "live-music",
  "party",
  "presentation",
  "other",
]);

const allowedRentalPreferences = new Set([
  "pickup",
  "delivery",
  "not-sure",
  "",
]);

const allowedSupportNeeds = new Set([
  "setup",
  "technician",
  "not-sure",
]);

export function validateQuoteForm(
  input: QuoteFormInput
): QuoteFormValidationResult {
  if (!input.name.trim()) {
    return { success: false, message: "Full name is required." };
  }

  if (!input.email.trim()) {
    return { success: false, message: "Email address is required." };
  }

  if (!isValidEmail(input.email.trim())) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (!input.eventType.trim()) {
    return { success: false, message: "Event type is required." };
  }

  if (!allowedEventTypes.has(input.eventType)) {
    return { success: false, message: "Invalid event type selected." };
  }

  if (!allowedRentalPreferences.has(input.rentalPreference)) {
    return { success: false, message: "Invalid rental preference selected." };
  }

  const invalidSupport = input.supportNeeds.some(
    (item) => !allowedSupportNeeds.has(item)
  );

  if (invalidSupport) {
    return { success: false, message: "Invalid support option selected." };
  }

  if (input.guestCount !== null && input.guestCount < 0) {
    return {
      success: false,
      message: "Guest count cannot be negative.",
    };
  }

  return {
    success: true,
    data: {
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      eventDate: input.eventDate.trim(),
      eventType: input.eventType,
      guestCount: input.guestCount,
      location: input.location.trim(),
      rentalPreference: input.rentalPreference,
      supportNeeds: input.supportNeeds,
      notes: input.notes.trim(),
    },
  };
}
