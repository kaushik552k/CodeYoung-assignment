# AI-Assisted Development Transcript (TRANSCRIPT.md)

This document provides a record of the AI-assisted engineering sessions utilized to design, develop, test, and document the **Codeyoung Trial Class Appointment-Booking System**, as required by Section 7 of the Technical Assignment.

---

## Session 1: Requirements Breakdown, Architecture & Data Modeling

### 1.1 User Prompt / Input
> "Build an appointment-booking web application that allows parents to book a trial class with an available mentor while correctly handling time zones, Daylight Saving Time, mentor capacity, and booking constraints.
> - Mentors: 10 mentors available (operating in IST).
> - Parents: ~20 booking requests per day (US/UK/global).
> - Mentor capacity: Maximum 2 demo classes per mentor per day.
> - Stack: React (frontend), Node.js (backend), lightweight database."

### 1.2 AI Analysis & Strategy
- **Timezone & DST Isolation**: Mentors operate strictly under `Asia/Kolkata` (IST, UTC+05:30). Parents operate across US (`America/New_York`, `America/Chicago`, etc.) and UK (`Europe/London`). Storing fixed offsets (e.g. UTC-5) fails across DST transitions. We decided to store all timestamps in SQLite in normalized **UTC (`ISO 8601`)**, while performing conversions using canonical **IANA timezone identifiers** via `luxon`.
- **Capacity Management**: 10 mentors × 2 classes/day = 20 classes/day maximum capacity, perfectly matching the ~20 parent requests/day.
- **IST Day Boundaries**: The 2-class/day cap must be measured with respect to the **mentor's calendar day in IST** (00:00 to 24:00 IST = 18:30 UTC previous day to 18:30 UTC current day).
- **Schema Design**: Defined Prisma models:
  - `Mentor`: `id`, `name`, `email`, `timezone` ("Asia/Kolkata")
  - `Booking`: `id`, `mentorId`, `parentName`, `parentEmail`, `parentTz`, `slotUtc`, `classLink`, `status` ("CONFIRMED" | "CANCELLED"), `createdAt`

---

## Session 2: Backend API & Concurrency-Safe Booking Logic

### 2.1 User Prompt / Input
> "Implement backend routes and services. Ensure two parents booking at the same time don't double-book a mentor, and if no mentors are available, return a helpful error with alternative slots."

### 2.2 AI Implementation
- **Slot Generation (`slotService.ts`)**:
  - Mentors work from 8:00 AM to 8:00 PM IST in 60-minute slots.
  - Calculated candidate slots in parent local time.
  - Filtered slots based on mentor availability and remaining daily capacity.
- **Race Condition Prevention (`bookingService.ts`)**:
  - Used Prisma interactive transactions (`prisma.$transaction`).
  - Mentors are checked inside the transaction to ensure they have `< 2` confirmed bookings on that IST date and are not already booked for that exact UTC slot.
  - If no mentor is available, transaction safely throws `NO_MENTOR_AVAILABLE`.
- **Alternative Slot Finder**:
  - If a requested slot is exhausted, the service queries the next 5 upcoming available slots across the next 7 days and returns them in the response.

---

## Session 3: Frontend Wizard & UX Development

### 3.1 User Prompt / Input
> "Create the React/Next.js frontend. The user experience should guide the parent through timezone selection (auto-detected), date selection (within 30 days), available slots with remaining capacity, student/parent information, and a confirmation screen."

### 3.2 AI Implementation
- Built multi-step booking wizard with **Zustand** state store:
  1. **Timezone Step**: Auto-detects local timezone via `Intl.DateTimeFormat().resolvedOptions().timeZone` with instant manual override dropdown.
  2. **Date Step**: Interactive calendar limited strictly to the next 30 days, disabling past dates.
  3. **Slot Step**: Grid of 60-minute time slots displayed in parent's local time, showing real-time mentor capacity chips (e.g., "3 mentors available").
  4. **Parent & Child Info Step**: Form capturing parent name, parent email, child name, and child age with live validation.
  5. **Confirmation Step**: Displays assigned mentor, meeting link (`https://meet.codeyoung.com/demo/...`), parent local time, mentor IST time, 1-click Google Calendar invite, and pre-class checklist.

---

## Session 4: UI/UX Refinement & Visual Styling

### 4.1 User Prompt / Input
> "Fix the UI, it looks childish, dark theme - not at all. Keep it subtle and decent. Check color reference, take inspiration from clean, subtle edtech platforms with warm orange accents."

### 4.2 AI Implementation
- Replaced dark aesthetic with a clean, high-trust EdTech light theme.
- **Color Palette**: Clean slate backgrounds (`#F8FAFC`), white elevated cards with subtle borders (`border-slate-200`), primary warm orange/amber buttons (`bg-orange-500 hover:bg-orange-600`), and emerald accents for availability tags.
- Added sticky navigation header, reassuring trust badges (100% Free, Live 1-on-1, Expert Mentors), and step-by-step breadcrumb progress bar.

---

## Session 5: Documentation & Git Version Control

### 5.1 User Prompt / Input
> "Check all requirements, verify documentation, provide setup instructions, and explain how to push to GitHub."

### 5.2 AI Implementation
- Configured `.gitignore` to protect environment variables and avoid committing `node_modules` and SQLite databases.
- Provided step-by-step Git instructions for repository creation, commit, branch setup (`main`), and push to GitHub.
- Authored comprehensive architectural guides in `docs/architecture.md`, trade-offs analysis in `docs/tradeoffs.md`, and this `TRANSCRIPT.md` file.
