import type { Metadata } from "next";
import { Papers } from "@/components/Papers";

export const metadata: Metadata = {
  title: "Papers",
  description:
    "Working papers, unrefereed. Mortality projection, poverty transfer learning and device-invariant screening, including the results that did not support their own hypotheses."
};

export default function PapersPage() {
  return <Papers />;
}
