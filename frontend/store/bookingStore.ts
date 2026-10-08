import { create } from "zustand";
import type { Slot, BookingResult } from "@/lib/shared";
import type { SupportedTimezone } from "@/lib/timezone";

export type BookingStep = "timezone" | "date" | "slot" | "info" | "confirmed";

interface BookingState {
  step: BookingStep;

  // Step 1
  parentTz: SupportedTimezone;
  tzDetected: boolean;

  // Step 2
  selectedDate: string | null;

  // Step 3
  slots: Slot[];
  slotsLoading: boolean;
  slotsError: string | null;
  selectedSlot: Slot | null;

  // Step 4 — parent & child info
  parentName: string;
  parentEmail: string;
  childName: string;
  childAge: string;

  // Booking
  bookingLoading: boolean;
  bookingError: string | null;
  bookingErrorCode: string | null;
  alternatives: Slot[];
  confirmedBooking: BookingResult | null;

  // Actions
  setStep: (step: BookingStep) => void;
  setParentTz: (tz: SupportedTimezone) => void;
  setTzDetected: (v: boolean) => void;
  setSelectedDate: (date: string) => void;
  setSlots: (slots: Slot[]) => void;
  setSlotsLoading: (v: boolean) => void;
  setSlotsError: (e: string | null) => void;
  setSelectedSlot: (slot: Slot | null) => void;
  setParentName: (v: string) => void;
  setParentEmail: (v: string) => void;
  setChildName: (v: string) => void;
  setChildAge: (v: string) => void;
  setBookingLoading: (v: boolean) => void;
  setBookingError: (e: string | null, code?: string | null) => void;
  setAlternatives: (slots: Slot[]) => void;
  setConfirmedBooking: (booking: BookingResult) => void;
  reset: () => void;
}

const DEFAULTS = {
  step: "timezone" as BookingStep,
  parentTz: "America/New_York" as SupportedTimezone,
  tzDetected: false,
  selectedDate: null,
  slots: [],
  slotsLoading: false,
  slotsError: null,
  selectedSlot: null,
  parentName: "",
  parentEmail: "",
  childName: "",
  childAge: "8 – 10 years",
  bookingLoading: false,
  bookingError: null,
  bookingErrorCode: null,
  alternatives: [],
  confirmedBooking: null,
};

export const useBookingStore = create<BookingState>((set) => ({
  ...DEFAULTS,

  setStep: (step) => set({ step }),
  setParentTz: (parentTz) => set({ parentTz }),
  setTzDetected: (tzDetected) => set({ tzDetected }),

  setSelectedDate: (date) =>
    set({ selectedDate: date, slots: [], selectedSlot: null, slotsError: null }),

  setSlots: (slots) => set({ slots }),
  setSlotsLoading: (slotsLoading) => set({ slotsLoading }),
  setSlotsError: (slotsError) => set({ slotsError }),
  setSelectedSlot: (selectedSlot) => set({ selectedSlot }),

  setParentName: (parentName) => set({ parentName }),
  setParentEmail: (parentEmail) => set({ parentEmail }),
  setChildName: (childName) => set({ childName }),
  setChildAge: (childAge) => set({ childAge }),

  setBookingLoading: (bookingLoading) => set({ bookingLoading }),
  setBookingError: (bookingError, bookingErrorCode = null) =>
    set({ bookingError, bookingErrorCode }),
  setAlternatives: (alternatives) => set({ alternatives }),
  setConfirmedBooking: (confirmedBooking) =>
    set({ confirmedBooking, step: "confirmed" }),

  reset: () => set({ ...DEFAULTS }),
}));
