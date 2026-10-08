import { SUPPORTED_TIMEZONES, SupportedTimezone } from "@/lib/shared";

export const TIMEZONE_LABELS: Record<SupportedTimezone, string> = {
  "America/New_York": "Eastern Time (ET) — New York",
  "America/Chicago": "Central Time (CT) — Chicago",
  "America/Denver": "Mountain Time (MT) — Denver",
  "America/Los_Angeles": "Pacific Time (PT) — Los Angeles",
  "America/Phoenix": "Arizona Time (MST) — Phoenix (no DST)",
  "Europe/London": "United Kingdom (GMT/BST) — London",
  "Europe/Dublin": "Ireland (GMT/IST) — Dublin",
  "Asia/Kolkata": "India Standard Time (IST) — Kolkata",
};

export type { SupportedTimezone };
export { SUPPORTED_TIMEZONES };

/**
 * Detect the user's timezone from the browser.
 * Falls back to America/New_York if not a supported timezone.
 */
export function detectBrowserTimezone(): SupportedTimezone {
  try {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if ((SUPPORTED_TIMEZONES as readonly string[]).includes(detected)) {
      return detected as SupportedTimezone;
    }
  } catch {
    // ignore
  }
  return "America/New_York";
}

/**
 * Generate Google Calendar "Add to Calendar" link for a booking.
 */
export function buildGoogleCalendarLink(params: {
  title: string;
  description: string;
  utcStart: string;
  durationMinutes?: number;
}): string {
  const { title, description, utcStart, durationMinutes = 60 } = params;

  const start = new Date(utcStart);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const formatForGCal = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params2 = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description,
    dates: `${formatForGCal(start)}/${formatForGCal(end)}`,
  });

  return `https://calendar.google.com/calendar/render?${params2.toString()}`;
}
