import { Badge } from "@/components/ui/badge"
import clsx from "clsx"

type PriorityBadgeProps = {
  priority: "low" | "medium" | "high"
  size?: "default" | "sm" | "lg"
}

const priorityClasses: Record<PriorityBadgeProps["priority"], string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
}

const sizeClasses: Record<NonNullable<PriorityBadgeProps["size"]>, string> = {
  default: "px-2 py-1 text-xs",
  sm: "px-1.5 py-0.5 text-xs",
  lg: "px-3 py-1.5 text-sm",
}

export function PriorityBadge({ priority, size = "default" }: PriorityBadgeProps) {
  return (
    <Badge className={clsx(priorityClasses[priority], sizeClasses[size])}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}
