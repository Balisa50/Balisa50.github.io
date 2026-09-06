import type { Metadata } from "next";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Open to full-time roles and select contract work on ML-heavy products. Tell me what you are working on and I will come back to you."
};

export default function ContactPage() {
  return <Contact />;
}
