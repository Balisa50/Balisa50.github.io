import type { Metadata } from "next";
import { Skills } from "@/components/Skills";

export const metadata: Metadata = {
  title: "Stack",
  description:
    "The languages, frameworks and statistical tools I actually build with, grouped by what I reach for first."
};

export default function StackPage() {
  return <Skills />;
}
