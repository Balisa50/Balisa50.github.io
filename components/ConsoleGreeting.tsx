"use client";

import { useEffect } from "react";
import { PROFILE } from "@/lib/projects";

/**
 * Prints a stylised greeting to the devtools console so recruiters / engineers
 * poking at the page find a friendly note. Runs once per mount.
 */
export function ConsoleGreeting() {
  useEffect(() => {
    const title = `%c${PROFILE.fullName}`;
    const titleStyle =
      "font-size:22px;font-weight:700;color:#00F0FF;text-shadow:0 0 12px rgba(0,240,255,0.5);";
    const sub = `%c${PROFILE.title}`;
    const subStyle = "font-size:13px;color:#A0A0A0;";
    const body =
      "%c👋 Hi recruiter! JSON résumé at /api/resume\n" +
      `   GitHub: ${PROFILE.github}\n` +
      `   Email:  ${PROFILE.email}\n` +
      "   Try the Konami code: ↑↑↓↓←→←→ B A";
    const bodyStyle = "font-size:12px;color:#FFFFFF;line-height:1.6;";

    // eslint-disable-next-line no-console
    console.log(title, titleStyle);
    // eslint-disable-next-line no-console
    console.log(sub, subStyle);
    // eslint-disable-next-line no-console
    console.log(body, bodyStyle);
  }, []);

  return null;
}
