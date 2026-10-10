"use client";

import { useMemo, useState } from "react";

export interface Contribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionsData {
  total: Record<string, number>;
  contributions: Contribution[];
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

// Four intensities, plus an empty state. Uses the site's ink token with
// opacity so the grid sits on light backgrounds without a second palette.
function levelClass(level: number): string {
  switch (level) {
    case 1: return "bg-ink/20";
    case 2: return "bg-ink/40";
    case 3: return "bg-ink/60";
    case 4: return "bg-ink/85";
    default: return "bg-border";
  }
}

export function ContributionGrid({ data }: { data: ContributionsData }) {
  const [hovered, setHovered] = useState<Contribution | null>(null);

  // Chunk into calendar weeks. The first partial week is padded so the first
  // cell lands on the correct row (0 = Sunday), matching how GitHub renders.
  const weeks = useMemo(() => {
    const cells: (Contribution | null)[][] = [];
    let current: (Contribution | null)[] = [];

    const first = data.contributions[0];
    if (first) {
      const dow = new Date(first.date + "T00:00:00Z").getUTCDay();
      for (let i = 0; i < dow; i++) current.push(null);
    }

    for (const c of data.contributions) {
      current.push(c);
      if (current.length === 7) {
        cells.push(current);
        current = [];
      }
    }
    if (current.length > 0) {
      while (current.length < 7) current.push(null);
      cells.push(current);
    }
    return cells;
  }, [data.contributions]);

  const total = data.total["lastYear"] ?? 0;

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col gap-2 min-w-fit">
        <div className="flex gap-[3px] text-[10px] font-mono uppercase tracking-wider text-text-faint">
          <div className="w-6 shrink-0" />
          {weeks.map((week, i) => {
            const first = week.find(Boolean) as Contribution | undefined;
            if (!first) return <div key={i} className="w-[10px] shrink-0" />;
            const d = new Date(first.date + "T00:00:00Z");
            const show = d.getUTCDate() <= 7;
            return (
              <div key={i} className="w-[10px] shrink-0">
                {show ? MONTHS[d.getUTCMonth()] : ""}
              </div>
            );
          })}
        </div>

        <div className="flex gap-[3px]">
          <div className="flex w-6 shrink-0 flex-col gap-[3px] text-[10px] font-mono text-text-faint">
            {DAYS.map((d, i) => (
              <div key={i} className="h-[10px] leading-[10px]">{d}</div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex shrink-0 flex-col gap-[3px]">
              {week.map((cell, di) => (
                <div
                  key={di}
                  onMouseEnter={() => cell && setHovered(cell)}
                  onMouseLeave={() => setHovered(null)}
                  className={`h-[10px] w-[10px] rounded-sm transition-opacity ${cell ? levelClass(cell.level) + " hover:opacity-70 cursor-pointer" : "bg-transparent"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-text-faint">
        <span className="tabular-nums">
          {hovered
            ? `${hovered.count} on ${hovered.date}`
            : `${total} in the last year`}
        </span>
        <div className="flex items-center gap-2">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <div key={l} className={`h-[10px] w-[10px] rounded-sm ${levelClass(l)}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
