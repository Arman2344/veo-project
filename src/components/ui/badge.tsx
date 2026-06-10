import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary border border-primary/20",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-red-500/10 text-red-600 border border-red-500/20",
        outline: "border border-border text-foreground",
        gradient:
          "bg-gradient-to-r from-brand-500 to-purple-600 text-white",
        neon: "bg-brand-500/10 text-brand-400 border border-brand-500/30",
        gold: "bg-amber-500/10 text-amber-500 border border-amber-500/30",
        tiktok: "bg-pink-500/10 text-pink-500 border border-pink-500/30",
        instagram: "bg-purple-500/10 text-purple-400 border border-purple-500/30",
        youtube: "bg-red-500/10 text-red-500 border border-red-500/30",
        linkedin: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
