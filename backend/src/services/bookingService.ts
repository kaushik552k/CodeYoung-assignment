import { DateTime } from "luxon";
import { prisma } from "../lib/prisma";
import { findAvailableMentor } from "./mentorService";
import { findAlternativeSlots } from "./slotService";
import { BookingResult, Slot } from "../shared/types";
import { DEMO_CLASS_BASE_URL, formatForTimezone, MENTOR_TZ } from "../lib/timezone";

export type CreateBookingResult =
  | { success: true; booking: BookingResult }
  | {
      success: false;
      error: string;
      code: string;
      alternatives?: Slot[];
    };

/**
 * Create a booking with full concurrency safety via Prisma interactive transaction.
 *
 * Transaction flow:
 *  1. Re-validate the slotUtc is in the future
 *  2. Find an eligible mentor (re-checked inside TX)
 *  3. Create the booking record
 *  4. Return formatted confirmation for both parent and mentor
 */
export async function createBooking(input: {
  parentName: string;
  parentEmail: string;
  parentTz: string;
  slotUtc: string;
}): Promise<CreateBookingResult> {
  const { parentName, parentEmail, parentTz, slotUtc: slotUtcIso } = input;

  // Parse slotUtc
  const slotDt = DateTime.fromISO(slotUtcIso, { zone: "utc" });
  if (!slotDt.isValid) {
    return { success: false, error: "Invalid slot time", code: "INVALID_SLOT" };
  }

  // Must be in the future
  if (slotDt <= DateTime.now().toUTC()) {
    return {
      success: false,
      error: "Cannot book a slot in the past",
      code: "SLOT_IN_PAST",
    };
  }

  const slotUtcDate = slotDt.toJSDate();

  try {
    // Use an interactive transaction for concurrency safety
    const booking = await prisma.$transaction(async (tx) => {
      // --- Re-check mentor availability INSIDE the transaction ---
      const mentor = await findAvailableMentor(slotUtcDate);

      if (!mentor) {
        // Signal no availability — throw a known error to abort TX
        throw Object.assign(new Error("NO_MENTOR_AVAILABLE"), {
          code: "NO_MENTOR_AVAILABLE",
        });
      }

      // Create the booking
      const classLink = `${DEMO_CLASS_BASE_URL}/${generateBookingId()}`;

      const created = await tx.booking.create({
        data: {
          mentorId: mentor.id,
          parentName,
          parentEmail,
          parentTz,
          slotUtc: slotUtcDate,
          classLink,
          status: "CONFIRMED",
        },
        include: { mentor: true },
      });

      return created;
    });

    // Format times for both parties
    const parentFormatted = formatForTimezone(booking.slotUtc.toISOString(), parentTz);
    const mentorFormatted = formatForTimezone(
      booking.slotUtc.toISOString(),
      MENTOR_TZ
    );

    const result: BookingResult = {
      id: booking.id,
      parentName: booking.parentName,
      parentEmail: booking.parentEmail,
      parentTz: booking.parentTz,
      parentDisplay: `${parentFormatted.timeDisplay}, ${parentFormatted.dateDisplay}`,
      mentorName: booking.mentor.name,
      mentorEmail: booking.mentor.email,
      mentorDisplay: `${mentorFormatted.timeDisplay}, ${mentorFormatted.dateDisplay}`,
      classLink: booking.classLink,
      status: "CONFIRMED",
      slotUtc: booking.slotUtc.toISOString(),
      createdAt: booking.createdAt.toISOString(),
    };

    return { success: true, booking: result };
  } catch (err: any) {
    if (err?.message === "NO_MENTOR_AVAILABLE" || err?.code === "NO_MENTOR_AVAILABLE") {
      // Find alternative slots to suggest
      const alternatives = await findAlternativeSlots(slotUtcIso, parentTz, 5);
      return {
        success: false,
        error:
          "No mentors are available for your selected time. Please try one of the suggested alternatives.",
        code: "NO_MENTOR_AVAILABLE",
        alternatives,
      };
    }

    throw err;
  }
}

/**
 * Retrieve a booking by ID with full display formatting.
 */
export async function getBookingById(
  id: string
): Promise<BookingResult | null> {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { mentor: true },
  });

  if (!booking) return null;

  const parentFormatted = formatForTimezone(
    booking.slotUtc.toISOString(),
    booking.parentTz
  );
  const mentorFormatted = formatForTimezone(
    booking.slotUtc.toISOString(),
    MENTOR_TZ
  );

  return {
    id: booking.id,
    parentName: booking.parentName,
    parentEmail: booking.parentEmail,
    parentTz: booking.parentTz,
    parentDisplay: `${parentFormatted.timeDisplay}, ${parentFormatted.dateDisplay}`,
    mentorName: booking.mentor.name,
    mentorEmail: booking.mentor.email,
    mentorDisplay: `${mentorFormatted.timeDisplay}, ${mentorFormatted.dateDisplay}`,
    classLink: booking.classLink,
    status: (booking.status === "CANCELLED" ? "CANCELLED" : "CONFIRMED") as "CONFIRMED" | "CANCELLED",
    slotUtc: booking.slotUtc.toISOString(),
    createdAt: booking.createdAt.toISOString(),
  };
}

function generateBookingId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
