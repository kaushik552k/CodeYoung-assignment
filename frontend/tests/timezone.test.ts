import { buildGoogleCalendarLink } from "../lib/timezone";

describe("Frontend Calendar Integration", () => {
  it("generates a valid Google Calendar link", () => {
    const link = buildGoogleCalendarLink({
      title: "Codeyoung Free Trial Class",
      description: "Class session with mentor",
      utcStart: "2026-10-10T14:00:00.000Z",
      durationMinutes: 60,
    });

    expect(link).toContain("https://calendar.google.com/calendar/render");
    expect(link).toContain("Codeyoung");
  });
});
