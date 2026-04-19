type SendQuoteNotificationInput = {
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

export async function sendQuoteNotificationEmail(
  input: SendQuoteNotificationInput
) {
  console.log("Quote notification email stub called.");
  console.log({
    to: process.env.QUOTE_NOTIFICATION_TO ?? "not-configured",
    subject: `New Quote Request - ${input.eventType} - ${input.name}`,
    payload: input,
  });

  return { success: true };
}
