/**
 * The Gambia: 65 Years in Numbers, in-portfolio view (full navigation).
 * The clean, shareable standalone version lives at /case-studies/gambia.
 */

import type { Metadata } from "next";
import { GambiaCaseStudyBody } from "@/components/GambiaCaseStudyBody";

export const metadata: Metadata = {
  title: "The Gambia: 65 Years in Numbers, Abdoulie Balisa",
  description:
    "65 years of Gambian development indicators from the World Bank, cleaned, charted, and read for what they actually say. Health, education, economy, demographics, and what the data demands we fix.",
};

export default function GambiaCaseStudy() {
  return <GambiaCaseStudyBody standalone={false} />;
}
