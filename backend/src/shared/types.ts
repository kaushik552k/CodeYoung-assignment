import { z } from "zod";

// ─── Timezone ────────────────────────────────────────────────────────────────

export const SUPPORTED_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "Europe/London",
  "Europe/Dublin",
  "Asia/Kolkata",
] as const;

export type SupportedTimezone = (typeof SUPPORTED_TIMEZONES)[number];

export const TimezoneSchema = z.enum(SUPPORTED_TIMEZONES);

// ─── Slot schemas ─────────────────────────────────────────────────────────────

export const GetSlotsQuerySchema = z.object({
  parentTz: TimezoneSchema,
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
});

export type GetSlotsQuery = z.infer<typeof GetSlotsQuerySchema>;

export const SlotSchema = z.object({
  utcStart: z.string(), // ISO UTC string
  parentLocal: z.string(), // ISO local string with offset
  parentDisplay: z.string(), // Human-friendly: "10:00 AM EDT"
  parentDateDisplay: z.string(), // "Mon, Jun 15 2025"
  available: z.boolean(),
  mentorsAvailable: z.number().int().min(0),
});

export type Slot = z.infer<typeof SlotSchema>;

// ─── Booking schemas ──────────────────────────────────────────────────────────

export const CreateBookingSchema = z.object({
  parentName: z.string().min(2, "Name must be at least 2 characters"),
  parentEmail: z.string().email("Invalid email address"),
  parentTz: TimezoneSchema,
  slotUtc: z.string().datetime({ message: "slotUtc must be a valid ISO UTC datetime" }),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

export const BookingResultSchema = z.object({
  id: z.string(),
  parentName: z.string(),
  parentEmail: z.string(),
  parentTz: z.string(),
  parentDisplay: z.string(), // "10:00 AM EDT, Mon Jun 15 2025"
  mentorName: z.string(),
  mentorEmail: z.string(),
  mentorDisplay: z.string(), // "7:30 PM IST, Mon Jun 15 2025"
  classLink: z.string().url(),
  status: z.enum(["CONFIRMED", "CANCELLED"]),
  slotUtc: z.string(),
  createdAt: z.string(),
});

export type BookingResult = z.infer<typeof BookingResultSchema>;

// ─── Error response ───────────────────────────────────────────────────────────

export const ApiErrorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  alternatives: z.array(SlotSchema).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
