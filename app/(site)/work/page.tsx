import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/ProjectsGrid";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Statistical modeling and forecasting, AI systems, and client delivery. The projects I have built and what each one was for."
};

export default function WorkPage() {
  return <ProjectsGrid />;
}
