# Technical Decisions & Architectural Trade-offs

## 1. Timezone Management: Luxon & IANA vs Native Date / Fixed Offsets
- **Decision**: Store all slot dates in UTC in database; format into IANA zones at runtime via Luxon.
- **Trade-off**: Native JavaScript `Date` lacks native IANA zone conversion prior to Temporal API; using fixed offset arithmetic (e.g. UTC-4) introduces bugs during DST clock changes. Luxon ensures accurate DST offset shifts for every date.

## 2. Storage Layer: SQLite vs PostgreSQL
- **Decision**: SQLite configured by default for zero-friction local execution, with full compatibility for PostgreSQL via Prisma schema provider change.
- **Trade-off**: SQLite enables running the entire stack immediately without external Docker dependencies or database setup. In high-scale production, PostgreSQL provides row-level locking (`SELECT ... FOR UPDATE`) and connection pooling.

## 3. Capacity Accounting: Dynamic Aggregation vs Cached Counter
- **Decision**: Aggregate confirmed bookings dynamically per mentor per IST day using Prisma `groupBy` and counts inside transaction scopes.
- **Trade-off**: Avoids distributed counter drift and cache invalidation complexity, ensuring 100% strict adherence to the 2 demo class daily cap.

## 4. Concurrency Strategy: Optimistic Transaction vs Pessimistic Table Locks
- **Decision**: Interactive transactions with immediate re-verification of mentor availability.
- **Trade-off**: Provides fast reads for browsing parents while guaranteeing serial consistency when multiple parents click 'Book' at the exact same millisecond.
