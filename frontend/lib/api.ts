import axios from "axios";
import type { Slot, BookingResult, CreateBookingInput } from "@/lib/shared";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const apiClient = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ─── Slots ─────────────────────────────────────────────────────────────────────

export interface GetSlotsResponse {
  slots: Slot[];
  date: string;
  parentTz: string;
}

export async function fetchSlots(
  date: string,
  parentTz: string
): Promise<GetSlotsResponse> {
  const res = await apiClient.get<GetSlotsResponse>("/slots", {
    params: { date, parentTz },
  });
  return res.data;
}

// ─── Bookings ──────────────────────────────────────────────────────────────────

export interface CreateBookingResponse {
  booking: BookingResult;
}

export interface NoMentorError {
  error: string;
  code: "NO_MENTOR_AVAILABLE";
  alternatives: Slot[];
}

export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResponse> {
  const res = await apiClient.post<CreateBookingResponse>("/bookings", input);
  return res.data;
}

export async function fetchBooking(id: string): Promise<BookingResult> {
  const res = await apiClient.get<{ booking: BookingResult }>(`/bookings/${id}`);
  return res.data.booking;
}
