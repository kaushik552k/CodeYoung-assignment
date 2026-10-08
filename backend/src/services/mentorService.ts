import { prisma } from "../lib/prisma";
import {
  MAX_CLASSES_PER_MENTOR_PER_DAY,
  getISTDayBounds,
  utcToISTDate,
} from "../lib/timezone";

/**
 * Find a mentor who is available for a given UTC slot.
 * A mentor is eligible if they have < MAX_CLASSES_PER_MENTOR_PER_DAY bookings
 * on the IST calendar day of the requested slot, AND are not already booked
 * for that exact slot.
 *
 * Returns a randomly selected eligible mentor for load distribution,
 * or null if no mentor is available.
 */
export async function findAvailableMentor(
  slotUtc: Date
): Promise<{ id: string; name: string; email: string; timezone: string } | null> {
  const istDateStr = utcToISTDate(slotUtc.toISOString());
  const { start, end } = getISTDayBounds(istDateStr);

  // Mentors who already have the daily cap of bookings (CONFIRMED)
  const capped = await prisma.booking.groupBy({
    by: ["mentorId"],
    where: {
      slotUtc: { gte: start, lt: end },
      status: "CONFIRMED",
    },
    having: {
      mentorId: {
        _count: { gte: MAX_CLASSES_PER_MENTOR_PER_DAY },
      },
    },
    _count: { mentorId: true },
  });

  const cappedIds = capped.map((c) => c.mentorId);

  // Mentors already booked for THIS exact slot
  const slotBookings = await prisma.booking.findMany({
    where: { slotUtc, status: "CONFIRMED" },
    select: { mentorId: true },
  });
  const slotBookedIds = slotBookings.map((b) => b.mentorId);

  // All excluded mentor IDs
  const excludedIds = Array.from(new Set([...cappedIds, ...slotBookedIds]));

  // Fetch eligible mentors
  const eligible = await prisma.mentor.findMany({
    where: {
      id: { notIn: excludedIds.length > 0 ? excludedIds : [] },
    },
    select: { id: true, name: true, email: true, timezone: true },
  });

  if (eligible.length === 0) return null;

  // Random selection to distribute load across mentors
  const randomIndex = Math.floor(Math.random() * eligible.length);
  return eligible[randomIndex];
}
