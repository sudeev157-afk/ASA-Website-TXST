import type { Metadata } from "next";
import EventsView from "./EventsView";

export const metadata: Metadata = {
  title: "Events | ASA - TXST",
  description:
    "Workshops, guest speakers, projects, and professional development from the Association for Statistics and Analytics at Texas State University. The first schedule is on its way.",
};

export default function EventsPage() {
  return <EventsView />;
}
