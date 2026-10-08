import { prisma } from "../lib/prisma";
import { Slot } from "../shared/types";
import { DateTime } from "luxon";
import {
  MENTOR_TZ,
  SLOT_DURATION_HOURS,
  MAX_CLASSES_PER_MENTOR_PER_DAY,
  generateDaySlots,
  formatForTimezone,
  getISTDayBounds,
  utcToISTDate,
} from "../lib/timezone";

/**
 * Total number of mentors — used to determine max capacity per slot.
 * We fetch this dynamically so it scales as mentors are added.
 */
async function getTotalMentors(): Promise<number> {
  return prisma.mentor.count();
}

/**
 * For a given UTC date range, get a map of mentorId → number of bookings
 * (only CONFIRMED bookings count toward the daily cap).
 */
async function getMentorBookingCounts(
  dayStart: Date,
  dayEnd: Date
): Promise<Map<string, number>> {
  const bookings = await prisma.booking.findMany({
    where: {
      slotUtc: { gte: dayStart, lt: dayEnd },
      status: "CONFIRMED",
    },
    select: { mentorId: true },
  });

  const counts = new Map<string, number>();
  for (const b of bookings) {
    counts.set(b.mentorId, (counts.get(b.mentorId) ?? 0) + 1);
  }
  return counts;
}

/**
 * Count available mentors for a specific UTC slot datetime.
 */
async function countAvailableMentorsForSlot(
  slotUtc: Date,
  istDateStr: string
): Promise<number> {
  const { start, end } = getISTDayBounds(istDateStr);
  const [totalMentors, bookingsByMentor, slotBookings] = await Promise.all([
    getTotalMentors(),
    getMentorBookingCounts(start, end),
    prisma.booking.count({
      where: { slotUtc, status: "CONFIRMED" },
    }),
  ]);

  // Mentors at daily cap
  const mentorsCapped = [...bookingsByMentor.values()].filter(
    (count) => count >= MAX_CLASSES_PER_MENTOR_PER_DAY
  ).length;

  // Mentors already booked for THIS specific slot
  const availableForSlot = totalMentors - mentorsCapped - slotBookings;

  return Math.max(0, availableForSlot);
}

/**
 * Build the full list of available slots for a given date in the parent's timezone.
 */
export async function getAvailableSlots(
  dateStr: string,
  parentTz: string
): Promise<Slot[]> {
  // Validate the requested date isn't in the past
  const now = DateTime.now().toUTC();
  const requestedDate = DateTime.fromISO(dateStr, { zone: parentTz });

  if (!requestedDate.isValid) {
    throw new Error("Invalid date provided");
  }

  // Generate candidate slots for the given parent-date, mapped through IST working hours
  const slotUtcTimes = generateDaySlots(dateStr, parentTz);

  if (slotUtcTimes.length === 0) {
    return [];
  }

  // Determine the IST date for the first slot to scope DB queries
  const firstSlotIST = slotUtcTimes[0].setZone(MENTOR_TZ);
  const istDateStr = firstSlotIST.toISODate() ?? dateStr;
  const { start, end } = getISTDayBounds(istDateStr);

  const [totalMentors, dailyBookingCounts] = await Promise.all([
    getTotalMentors(),
    getMentorBookingCounts(start, end),
  ]);

  // Get per-slot booking counts
  const slotBookingCounts = await prisma.booking.groupBy({
    by: ["slotUtc"],
    where: {
      slotUtc: { gte: start, lt: end },
      status: "CONFIRMED",
    },
    _count: { id: true },
  });

  const slotCountMap = new Map<string, number>();
  for (const s of slotBookingCounts) {
    slotCountMap.set(s.slotUtc.toISOString(), s._count.id);
  }

  // Mentors at daily cap
  const mentorsCapped = [...dailyBookingCounts.values()].filter(
    (c) => c >= MAX_CLASSES_PER_MENTOR_PER_DAY
  ).length;

  const availableMentorsForDay = totalMentors - mentorsCapped;

  const slots: Slot[] = slotUtcTimes.map((slotUtc) => {
    const utcIso = slotUtc.toISO()!;
    const bookedForSlot = slotCountMap.get(utcIso) ?? 0;

    // A slot is available if: at least 1 mentor is available overall AND
    // not all available mentors are already booked for THIS specific slot
    const mentorsAvailable = Math.max(0, availableMentorsForDay - bookedForSlot);
    const available = mentorsAvailable > 0 && slotUtc > now;

    const { timeDisplay, dateDisplay, isoLocal } = formatForTimezone(utcIso, parentTz);

    return {
      utcStart: utcIso,
      parentLocal: isoLocal,
      parentDisplay: timeDisplay,
      parentDateDisplay: dateDisplay,
      available,
      mentorsAvailable,
    };
  });

  return slots;
}

/**
 * Find alternative available slots (next 5 available) when a requested slot is full.
 */
export async function findAlternativeSlots(
  fromUtcIso: string,
  parentTz: string,
  limit: number = 5
): Promise<Slot[]> {
  const from = DateTime.fromISO(fromUtcIso, { zone: "utc" });
  const alternatives: Slot[] = [];

  // Search up to 7 days ahead
  for (let daysAhead = 0; daysAhead <= 7 && alternatives.length < limit; daysAhead++) {
    const searchDate = from.plus({ days: daysAhead });
    const dateStr = searchDate.setZone(parentTz).toISODate()!;
    const slots = await getAvailableSlots(dateStr, parentTz);
    const available = slots.filter(
      (s) => s.available && DateTime.fromISO(s.utcStart) > from
    );
    alternatives.push(...available.slice(0, limit - alternatives.length));
  }

  return alternatives.slice(0, limit);
}
