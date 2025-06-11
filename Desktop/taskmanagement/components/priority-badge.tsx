import { Badge } from "@/components/ui/badge"

type PriorityBadgeProps = {
  priority: "low" | "medium" | "high"
  size?: "default" | "sm" | "lg"
}

export function PriorityBadge({ priority, size = "default" }: PriorityBadgeProps) {
  return (
    <Badge variant={`priority-${priority}`} size={size}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}
