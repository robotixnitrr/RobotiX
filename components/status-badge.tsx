import { Badge } from "@/components/ui/badge"

type StatusBadgeProps = {
  status: "pending" | "in-progress" | "completed"
  size?: "default" | "sm" | "lg"
}

export function StatusBadge({ status, size = "default" }: StatusBadgeProps) {
  const statusLabel = status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <Badge variant={status == "in-progress" ? "default" : status === "pending" ? "destructive" : "outline"}>
      {statusLabel}
    </Badge>
  )
}
