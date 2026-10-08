# Functional & Non-Functional Requirements

## 1. Problem Statement
At Codeyoung, parents can book a trial class to experience the platform and evaluate teaching quality before enrolling.
Mentors operate primarily in India Standard Time (`Asia/Kolkata`), while parents are distributed across North America, Europe, the Middle East, and Asia.

---

## 2. Resource Requirements & Limits
- **Mentors Available**: 10 mentors seeded and available for trial classes.
- **Parent Demand**: ~20 trial booking requests per day.
- **Mentor Capacity**: Maximum **2 demo/trial classes per mentor per day**.
- **Slot Duration**: 60 minutes per class (top of hour in IST).
- **Working Hours**: 8:00 AM – 8:00 PM IST (mentor availability window).

---

## 3. Functional Requirements

### 3.1 Time Zone & Daylight Saving Time (DST)
- Mentors and parents can reside in completely different time zones.
- The system must display all time slots in the parent's local time zone.
- Time zone handling must automatically adapt to Daylight Saving Time shifts (e.g. EDT vs EST, BST vs GMT) by relying on canonical IANA identifiers (e.g., `America/New_York`, `Europe/London`).
- Parent local time must be auto-detected via browser API while permitting seamless manual override.

### 3.2 Capacity & Concurrency Management
- Hard limit of 2 demo classes per mentor per IST calendar day.
- Prevent mentor double booking (no overlapping sessions for the same mentor).
- Concurrency race conditions: When multiple parents simultaneously book the same time slot, only available mentors are assigned; if capacity is exhausted, the losing request receives a friendly message and alternative slot suggestions.

### 3.3 Customer Journey & Booking Flow
1. Parent specifies/verifies local time zone.
2. Parent picks a convenient calendar date within 30 days.
3. Parent views open time slots showing remaining capacity.
4. Parent inputs contact & student information (Parent name, email, child name, age).
5. Confirmation view provides the class meeting link, mentor details, and a 1-click Google Calendar integration.
