# Codeyoung Trial Class Booking System

A full-stack appointment-booking application for parents to book a free 1-on-1 trial coding class for their child with an available Codeyoung mentor.

Built with **Next.js 14**, **Tailwind CSS**, **Express.js (TypeScript)**, **Prisma + SQLite**, and **Luxon** for DST-safe timezone handling.

---

## 📁 Repository Structure

```
codeYoung-assignment/
├── backend/                  # Express.js REST API
│   ├── prisma/               # Schema & seeds
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── routes/           # Slots & bookings routers
│   │   ├── services/         # Slot calculations, mentor allocation, concurrency logic
│   │   ├── shared/           # Zod schemas & shared types
│   │   ├── lib/              # Timezone utilities & Prisma client
│   │   └── index.ts
│   ├── tests/                # Backend unit & integration tests
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # Next.js 14 Frontend Web App
│   ├── app/                  # App Router & Layout
│   ├── components/           # Booking Form, Value Prop, Navbar, Footer
│   ├── lib/                  # Timezone, API client & shared types
│   ├── store/                # Zustand booking store
│   ├── public/               # Static assets
│   ├── Dockerfile
│   └── package.json
├── docs/                     # Design Documentation
│   ├── ai-prompts.md         # AI engineering prompts log
│   ├── architecture.md       # Architecture & database design
│   ├── requirements.md       # Functional & non-functional requirements
│   ├── test-coverage-report.md # Test verification report
│   └── tradeoffs.md          # Architectural decisions & trade-offs
├── docker-compose.yml        # Multi-container orchestration
├── walkthrough.md            # Demo guide & step-by-step walkthrough
└── README.md
```

---

## ⚡ Quick Start

### 1. Start Backend (Terminal 1)
```bash
cd backend
npm install
npx prisma db push
npm run seed
npm run dev
# API running at http://localhost:4000
```

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
# Web app running at http://localhost:3000
```

---

## 🎯 Key Capabilities & Constraints

- 🌍 **Automatic Timezone & DST Safety**: Converts between parent local time and mentor IST (`Asia/Kolkata`) without static UTC offset drift.
- 👨‍🏫 **Daily Mentor Capacity**: Enforces a strict cap of **maximum 2 demo classes per mentor per day** (evaluated across IST calendar boundaries).
- 🔒 **Concurrency & Race Condition Handling**: Interactive Prisma transactions (`$transaction`) prevent simultaneous double-booking of any mentor. If capacity is exhausted, the losing request receives alternative slot suggestions.
- 🎨 **Subtle, Descent EdTech UI**: Professional light theme matching modern learning platforms with parent details, child information, course selection, and live slot chips.
- 📅 **One-Click Calendar Integration**: Generates Google Calendar invite links pre-filled with demo meeting details and live class URL.
