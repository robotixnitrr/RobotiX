import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PriorityBadge } from "@/components/priority-badge"
import { StatusBadge } from "@/components/status-badge"
import type { Task } from "@/lib/models"
import { Calendar, User, Clock } from "lucide-react"

type TaskCardProps = {
  task: Task
  className?: string
}

export function TaskCard({ task, className }: TaskCardProps) {
  // Handle both due_date and dueDate formats
  const dueDate = task.due_date || task.dueDate
  const isOverdue = new Date(dueDate) < new Date() && task.status !== "completed"
  const daysUntilDue = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  // Handle both assignee_name and assigneeName formats
  const assigneeName = task.assignee_name || task.assigneeName
  const assignerName = task.assigner_name || task.assignerName

  // Handle both created_at and createdAt formats
  const updatedAt = task.updated_at || task.updatedAt

  return (
    <Card
      className={`task-card h-full group hover:shadow-xl transition-all duration-300 hover:border-primary/20 ${className} ${isOverdue ? "border-destructive/50" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {task.title}
          </CardTitle>
          <PriorityBadge priority={task.priority as "low" | "medium" | "high"} />
        </div>
        <CardDescription className="line-clamp-3 mt-2">{task.description}</CardDescription>
      </CardHeader>

      <CardContent className="pb-3 task-card-content space-y-3">
        <div className="grid gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Due:</span>
            <span
              className={`font-medium ${isOverdue ? "text-destructive" : daysUntilDue <= 3 ? "text-yellow-600" : ""}`}
            >
              {new Date(dueDate).toLocaleDateString()}
              {isOverdue && <span className="ml-1 text-xs">(Overdue)</span>}
              {!isOverdue && daysUntilDue <= 3 && daysUntilDue > 0 && (
                <span className="ml-1 text-xs">({daysUntilDue} days left)</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Assigned to:</span>
            <span className="font-medium text-primary">{assigneeName}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Assigned by:</span>
            <span className="font-medium">{assignerName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Status:</span>
            </div>
            <StatusBadge status={task.status as "pending" | "in-progress" | "completed"} />
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground">Updated {new Date(updatedAt).toLocaleDateString()}</div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Link href={`/dashboard/tasks/${task.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 focus-ring"
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
