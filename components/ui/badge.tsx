import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * A label, not a chip. No fill on the neutral variant, because a row of filled
 * pills is the fastest way to make a page look like a template.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-[3px] font-mono text-[0.6875rem] uppercase tracking-[0.09em] leading-none",
  {
    variants: {
      variant: {
        default: "text-text-secondary",
        outline: "border border-rule px-1.5 py-1 text-text-secondary",
        live: "text-status-live",
        progress: "text-status-progress",
        planning: "text-status-planning",
        down: "text-[#B91C1C]"
      }
    },
    defaultVariants: { variant: "default" }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/** The dot that goes in front of a status label. */
export function StatusDot({ tone }: { tone: "live" | "progress" | "planning" | "down" }) {
  const color = {
    live: "bg-status-live",
    progress: "bg-status-progress",
    planning: "bg-status-planning",
    down: "bg-[#B91C1C]"
  }[tone];
  return <span aria-hidden="true" className={cn("inline-block h-[5px] w-[5px] rounded-full", color)} />;
}

export { badgeVariants };
