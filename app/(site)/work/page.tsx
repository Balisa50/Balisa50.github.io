import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/ProjectsGrid";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Statistical modeling and forecasting, AI systems, and client delivery. Nine projects, three disciplines, one identity."
};

export default function WorkPage() {
  return <ProjectsGrid />;
}
