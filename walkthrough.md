# Codeyoung Trial Booking — Walkthrough & Demonstration Guide

## 1. Quick Start Guide

### Step 1: Start Backend (Terminal 1)
```bash
cd backend
npm install
npx prisma db push
npm run seed
npm run dev
# Running on http://localhost:4000
```

### Step 2: Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

---

## 2. Interactive Booking Flow Walkthrough

1. **Visit [http://localhost:3000](http://localhost:3000)**:
   - Notice the subtle, light-theme interface with the left booking card and right-hand benefits/social proof.
2. **Auto-Detected Timezone**:
   - The system detects the parent's browser timezone (e.g., `America/New_York`, `Asia/Kolkata`, `Europe/London`).
   - Parents can switch timezone anytime; all slot displays adapt instantly.
3. **Select Date**:
   - Select a date within the allowed 30-day trial booking window.
4. **Choose Available Slot**:
   - Time slots reflect mentor availability in the parent's local timezone.
   - Shows remaining mentor openings per slot.
5. **Parent & Child Details**:
   - Fill in Parent Name, Email, Child Name, and Child Age.
6. **Instant Confirmation**:
   - Mentor is assigned automatically (randomized across available mentors with < 2 daily bookings).
   - Generates demo video class URL.
   - Shows time in both parent timezone and mentor IST time.
   - One-click Google Calendar link pre-populated with session details.
