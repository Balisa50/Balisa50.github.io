import type { Metadata } from "next";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Open to internships and early-career roles in data analytics, statistics, or actuarial science. Send a note."
};

export default function ContactPage() {
  return <Contact />;
}
