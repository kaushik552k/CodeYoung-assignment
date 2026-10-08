import { formatForTimezone, getISTDayBounds, utcToISTDate } from "../src/lib/timezone";

describe("Timezone & DST Utilities", () => {
  it("converts UTC slot to parent local timezone accurately", () => {
    // 2026-10-10 14:00 UTC -> 10:00 AM EDT (America/New_York)
    const result = formatForTimezone("2026-10-10T14:00:00.000Z", "America/New_York");
    expect(result.timeDisplay).toContain("10:00 AM");
    expect(result.dateDisplay).toContain("Oct 10, 2026");
  });

  it("calculates IST calendar bounds for mentor daily limits", () => {
    const { start, end } = getISTDayBounds("2026-10-10");
    expect(start.toISOString()).toBe("2026-10-09T18:30:00.000Z"); // 00:00 IST is 18:30 UTC previous day
    expect(end.toISOString()).toBe("2026-10-10T18:30:00.000Z");   // 24:00 IST
  });

  it("maps UTC time to correct IST calendar date string", () => {
    // 2026-10-09 20:00 UTC is 2026-10-10 01:30 AM IST
    const istDate = utcToISTDate("2026-10-09T20:00:00.000Z");
    expect(istDate).toBe("2026-10-10");
  });
});
