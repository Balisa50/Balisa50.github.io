/**
 * The Gambia: 65 Years in Numbers, standalone, shareable view.
 * Same content as /projects/gambia, but with no portfolio chrome.
 */

import type { Metadata } from "next";
import { GambiaCaseStudyBody } from "@/components/GambiaCaseStudyBody";

const title = "The Gambia: 65 Years in Numbers";
const description =
  "65 years of Gambian development indicators from the World Bank, cleaned, charted, and read for what they actually say.";

export const metadata: Metadata = {
  title: `${title}, Abdoulie Balisa`,
  description,
  openGraph: {
    type: "article",
    url: "/case-studies/gambia",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function GambiaStandaloneCaseStudy() {
  return <GambiaCaseStudyBody standalone={true} />;
}
