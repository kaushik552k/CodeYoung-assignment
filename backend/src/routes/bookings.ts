import { Router, Request, Response } from "express";
import { validate } from "../middleware/validate";
import { CreateBookingSchema } from "../shared/types";
import { createBooking, getBookingById } from "../services/bookingService";

const router = Router();

/**
 * POST /api/bookings
 * Creates a new booking. Assigns an available mentor atomically.
 *
 * Body: { parentName, parentEmail, parentTz, slotUtc }
 *
 * Responses:
 *   201 - Booking confirmed with full details
 *   400 - Validation error or slot in past
 *   409 - No mentor available, with alternative slots
 */
router.post(
  "/",
  validate(CreateBookingSchema, "body"),
  async (req: Request, res: Response) => {
    const input = req.body as {
      parentName: string;
      parentEmail: string;
      parentTz: string;
      slotUtc: string;
    };

    const result = await createBooking(input);

    if (result.success) {
      res.status(201).json({ booking: result.booking });
      return;
    }

    if (result.code === "SLOT_IN_PAST") {
      res.status(400).json({ error: result.error, code: result.code });
      return;
    }

    if (result.code === "NO_MENTOR_AVAILABLE") {
      res.status(409).json({
        error: result.error,
        code: result.code,
        alternatives: result.alternatives ?? [],
      });
      return;
    }

    res.status(400).json({ error: result.error, code: result.code });
  }
);

/**
 * GET /api/bookings/:id
 * Fetch a booking confirmation by ID.
 */
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    res.status(400).json({ error: "Invalid booking ID", code: "INVALID_ID" });
    return;
  }

  const booking = await getBookingById(id);

  if (!booking) {
    res.status(404).json({ error: "Booking not found", code: "NOT_FOUND" });
    return;
  }

  res.json({ booking });
});

export default router;
