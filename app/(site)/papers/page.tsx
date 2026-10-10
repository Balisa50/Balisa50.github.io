import type { Metadata } from "next";
import { Papers } from "@/components/Papers";

export const metadata: Metadata = {
  title: "Papers",
  description:
    "Three working papers on mortality projection, poverty transfer learning, and device-invariant screening. Drafts, not peer-reviewed, and honest about the results that did not work."
};

export default function PapersPage() {
  return <Papers />;
}
