import type { Metadata } from "next";
import Membership from "./membership";

export const metadata: Metadata = {
  title: "Membership | ASA – Texas State University",
  description:
    "Membership in the Association for Statistics and Analytics is free and open to every major at Texas State University. Projects, research, workshops, speakers, and professional development.",
};

export default function MembershipPage() {
  return <Membership />;
}
