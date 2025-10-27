import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        red: "bg-red-100 text-red-700",
        green: "bg-green-100 text-green-700",
        yellow: "bg-yellow-100 text-yellow-700",
        blue: "bg-blue-100 text-blue-700",
        purple: "bg-purple-100 text-purple-700",
        gray: "bg-gray-100 text-gray-700",
      },
    },
    defaultVariants: {
      variant: "gray",
    },
  }
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

export default function Badge({ children, variant, className }: BadgeProps) {
  return (
    <span className={`${badgeVariants({ variant })} ${className || ""}`}>
      {children}
    </span>
  );
}
