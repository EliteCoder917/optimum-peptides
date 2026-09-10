const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * Built by hand rather than via toLocaleDateString: the admin pages render on
 * both sides of the wire, and a locale that resolves differently on the server
 * than in the browser produces a hydration mismatch on what is only ever a
 * cosmetic timestamp. Same reasoning as `formatPrice`.
 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
