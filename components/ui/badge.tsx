import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80 ring-primary/30",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 ring-secondary/30",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80 ring-destructive/30",
        outline: "text-foreground ring-border hover:bg-muted",
        // Status badges
        pending: "bg-status-pending text-status-pending-foreground ring-status-pending/30",
        "in-progress": "bg-status-in-progress text-status-in-progress-foreground ring-status-in-progress/30",
        completed: "bg-status-completed text-status-completed-foreground ring-status-completed/30",
        // Priority badges
        "priority-low": "bg-priority-low text-priority-low-foreground ring-priority-low/30",
        "priority-medium": "bg-priority-medium text-priority-medium-foreground ring-priority-medium/30",
        "priority-high": "bg-priority-high text-priority-high-foreground ring-priority-high/30",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge, badgeVariants }
