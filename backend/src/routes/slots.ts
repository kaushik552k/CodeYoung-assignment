import { Router, Request, Response } from "express";
import { validate } from "../middleware/validate";
import { GetSlotsQuerySchema } from "../shared/types";
import { getAvailableSlots } from "../services/slotService";
import { DateTime } from "luxon";

const router = Router();

/**
 * GET /api/slots
 * Returns available time slots for a given date in the parent's timezone.
 *
 * Query params:
 *   - parentTz: IANA timezone string (e.g. "America/New_York")
 *   - date: YYYY-MM-DD in the parent's local timezone
 */
router.get(
  "/",
  validate(GetSlotsQuerySchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { parentTz, date } = (req as any).validatedQuery as {
        parentTz: string;
        date: string;
      };

      // Guard: date must not be more than 30 days in the future
      const requestedDate = DateTime.fromISO(date, { zone: parentTz });
      const now = DateTime.now().setZone(parentTz);
      const maxDate = now.plus({ days: 30 });

      if (requestedDate < now.startOf("day")) {
        res.status(400).json({
          error: "Cannot view slots for past dates",
          code: "DATE_IN_PAST",
        });
        return;
      }

      if (requestedDate > maxDate) {
        res.status(400).json({
          error: "Cannot book more than 30 days in advance",
          code: "DATE_TOO_FAR",
        });
        return;
      }

      const slots = await getAvailableSlots(date, parentTz);

      res.json({ slots, date, parentTz });
    } catch (err: any) {
      if (err?.message?.includes("Invalid")) {
        res.status(400).json({ error: err.message, code: "INVALID_INPUT" });
        return;
      }
      throw err;
    }
  }
);

export default router;
