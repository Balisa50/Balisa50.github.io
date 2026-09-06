import type { Metadata } from "next";
import { ProjectsGrid } from "@/components/ProjectsGrid";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected engineering work: retrieval and forecasting systems, agentic pipelines and full-stack AI tooling, with the checks that go around them."
};

export default function WorkPage() {
  return <ProjectsGrid />;
}
