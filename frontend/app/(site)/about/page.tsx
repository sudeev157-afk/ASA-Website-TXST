import type { Metadata } from "next";
import AboutView from "./AboutView";

export const metadata: Metadata = {
  title: "About | ASA – Texas State University",
  description:
    "The Association for Statistics and Analytics is a student organization at Texas State University for students interested in statistics, analytics, research, and data-driven decision-making.",
};

export default function AboutPage() {
  return <AboutView />;
}
