import { DateTime } from "luxon";

// Mentor working hours in IST (inclusive start, exclusive end)
export const MENTOR_TZ = "Asia/Kolkata";
export const SLOT_HOUR_START_IST = 8;  // 8:00 AM IST
export const SLOT_HOUR_END_IST = 20;   // 8:00 PM IST (last slot starts at 19:00)
export const SLOT_DURATION_HOURS = 1;
export const MAX_CLASSES_PER_MENTOR_PER_DAY = 2;
export const DEMO_CLASS_BASE_URL = "https://demo.codeyoung.com/class";

/**
 * Generate all candidate slot UTC start times for a given parent date string.
 * We iterate over IST working hours and produce UTC datetimes.
 *
 * @param dateStr  "YYYY-MM-DD" in the parent's local timezone
 * @param parentTz IANA timezone for the parent
 */
export function generateDaySlots(dateStr: string, parentTz: string): DateTime[] {
  const slots: DateTime[] = [];

  // Generate each hour in IST for the full working day
  for (let hour = SLOT_HOUR_START_IST; hour < SLOT_HOUR_END_IST; hour++) {
    // Build IST datetime for this slot
    const slotIST = DateTime.fromObject(
      {
        year: parseInt(dateStr.substring(0, 4)),
        month: parseInt(dateStr.substring(5, 7)),
        day: parseInt(dateStr.substring(8, 10)),
        hour,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
      { zone: MENTOR_TZ }
    );

    // Check if that IST date matches what the parent considers the requested date
    // (We want to show parent their local day's slots)
    const slotParent = slotIST.setZone(parentTz);
    if (slotParent.toISODate() === dateStr) {
      slots.push(slotIST.toUTC());
    }
  }

  return slots;
}

/**
 * Generate slots for a given IST date, returned as UTC datetimes.
 * Used internally for the availability check across the IST day.
 */
export function generateISTDaySlots(istDateStr: string): DateTime[] {
  const slots: DateTime[] = [];
  const [year, month, day] = istDateStr.split("-").map(Number);

  for (let hour = SLOT_HOUR_START_IST; hour < SLOT_HOUR_END_IST; hour++) {
    const slotIST = DateTime.fromObject(
      { year, month, day, hour, minute: 0, second: 0, millisecond: 0 },
      { zone: MENTOR_TZ }
    );
    slots.push(slotIST.toUTC());
  }

  return slots;
}

/**
 * Format a UTC datetime for display in a given timezone.
 * Returns both a time string (e.g. "10:00 AM EDT") and a date string (e.g. "Mon, Jun 15 2025").
 */
export function formatForTimezone(
  utcIso: string,
  tz: string
): { timeDisplay: string; dateDisplay: string; isoLocal: string } {
  const dt = DateTime.fromISO(utcIso, { zone: "utc" }).setZone(tz);

  return {
    timeDisplay: dt.toFormat("h:mm a ZZZZ"),   // "10:00 AM EDT"
    dateDisplay: dt.toFormat("EEE, MMM d yyyy"), // "Mon, Jun 15 2025"
    isoLocal: dt.toISO() ?? utcIso,
  };
}

/**
 * Get the start and end of a UTC day for a given IST date string.
 * Used for DB queries scoped to a calendar day in IST.
 */
export function getISTDayBounds(istDateStr: string): { start: Date; end: Date } {
  const [year, month, day] = istDateStr.split("-").map(Number);

  const startIST = DateTime.fromObject(
    { year, month, day, hour: 0, minute: 0, second: 0 },
    { zone: MENTOR_TZ }
  );
  const endIST = startIST.plus({ days: 1 });

  return {
    start: startIST.toUTC().toJSDate(),
    end: endIST.toUTC().toJSDate(),
  };
}

/**
 * Get the IST date string for a UTC ISO string.
 */
export function utcToISTDate(utcIso: string): string {
  return DateTime.fromISO(utcIso, { zone: "utc" }).setZone(MENTOR_TZ).toISODate() ?? "";
}
