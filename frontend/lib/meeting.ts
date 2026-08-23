/**
 * The first meeting, in one place.
 *
 * Everything on the events page reads from here, including the calendar
 * link, so changing a detail means changing one line.
 *
 * NOTE ON THE TIME: the brief said "evening, 5:00 AM to 6:00 AM", which
 * cannot both be true. It is set to 5:00–6:00 PM on the strength of
 * "evening". If that is wrong, `start`, `end` and the two timestamps in
 * `calendarUrl` are the only things to change.
 */
export const FIRST_MEETING = {
  weekday: "Wednesday",
  date: "September 16",
  year: "2026",
  start: "5:00 PM",
  end: "6:00 PM",
  place: "McCoy Building, Room 240",
  cadence: "Every two weeks after that",
};

/* Google Calendar's template URL. Local times plus an explicit zone, so it
   lands at 5pm Central for someone adding it from anywhere. */
export const ADD_TO_CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=" + encodeURIComponent("ASA First Meeting — Texas State") +
  "&dates=20260916T170000/20260916T180000" +
  "&ctz=America/Chicago" +
  "&location=" +
  encodeURIComponent("McCoy Building Room 240, Texas State University, San Marcos, TX") +
  "&details=" +
  encodeURIComponent(
    "First meeting of the Association for Statistics and Analytics. Every two weeks after this one.",
  );
