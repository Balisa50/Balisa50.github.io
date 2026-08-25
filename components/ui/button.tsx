import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui button, retuned to this site.
 *
 * Two changes from the generated default worth knowing about: the radius is
 * 6px rather than the default pill-to-lg range, because the rest of the layout
 * is square and a rounded-full button reads as borrowed from another site; and
 * there is no shadow on any variant, because nothing else here casts one.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-ink text-background hover:bg-ink/88",
        outline: "border border-rule-strong bg-transparent text-ink hover:bg-surface",
        ghost: "text-text-secondary hover:text-ink hover:bg-surface",
        link: "text-accent underline underline-offset-4 decoration-1 hover:decoration-accent",
        onDark:
          "border border-white/25 bg-transparent text-white hover:bg-white hover:text-ink"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-[0.8125rem]",
        lg: "h-11 px-6",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
