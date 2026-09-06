/**
 * WhatsApp deep-link helpers.
 *
 * Voltra's B2B flow hands off to WhatsApp because that's where Nigerian
 * trade conversation actually happens. The number below is a demo
 * placeholder — swap for the real business line before launch.
 */
const VOLTRA_WHATSAPP_NUMBER = "2348012345678";

export function waLink(text: string): string {
  return `https://wa.me/${VOLTRA_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Build the prefilled message for a quote request (or draft list). */
export function quoteWhatsAppText(input: {
  company: string;
  lines: { name: string; qty: number }[];
  notes?: string;
}): string {
  const parts = [
    "Hello Voltra — I'd like a wholesale quote.",
    "",
    `Business: ${input.company}`,
    "",
    "Items:",
    ...input.lines.map((l) => `• ${l.name} × ${l.qty}`),
  ];
  if (input.notes) parts.push("", `Notes: ${input.notes}`);
  return parts.join("\n");
}
