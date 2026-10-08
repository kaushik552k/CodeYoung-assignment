# AI Prompt Engineering & Development Log

## 1. Requirement Framing & Analysis
- Prompting strategies focused on parsing Codeyoung domain rules:
  - 10 Mentors in IST (India Standard Time, UTC+05:30)
  - 20 Parents per day
  - Hard limit of max 2 demo classes per mentor per day
  - Concurrency handling across simultaneous booking attempts
  - DST handling across IANA timezones

## 2. Architecture & Data Modeling Prompts
- Formulating interactive Prisma transactions for slot reservation.
- UTC-first data persistence to prevent timezone drift during database serialization.

## 3. UI/UX Refinement Prompts
- Transitioning from high-contrast dark theme to subtle, light-theme edtech aesthetics referenced from modern learning platforms (e.g., BrightMinds, Codeyoung).
- Implementing accessible contrast ratios, rounded cards, warm orange CTA buttons, and responsive grid layouts.
