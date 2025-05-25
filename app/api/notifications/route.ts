import { NextResponse, type NextRequest } from "next/server"
import { TaskRepository } from "@/lib/repositories" // make sure this uses Drizzle ORM internally

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const userIdNumber = Number(userId)
    if (isNaN(userIdNumber)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 })
    }

    // Get all tasks (make sure this method uses Drizzle ORM)
    const tasks = await TaskRepository.findAll()

    const notifications = tasks
      .slice(0, 5)
      .map((task) => {
        const isAssignee = task.assigneeId === userIdNumber
        const isAssigner = task.assignerId === userIdNumber

        if (isAssignee) {
          return {
            id: `task-${task.id}-assigned`,
            title: "New task assigned to you",
            message: `"${task.title}" has been assigned to you by ${task.assignerName}`,
            timestamp: task.createdAt,
            read: false,
            type: "task_assigned",
          }
        }

        if (isAssigner && task.status === "completed") {
          return {
            id: `task-${task.id}-completed`,
            title: "Task completed",
            message: `"${task.title}" has been completed by ${task.assigneeName}`,
            timestamp: task.updatedAt,
            read: false,
            type: "task_completed",
          }
        }

        if (isAssigner && task.status === "in-progress") {
          return {
            id: `task-${task.id}-progress`,
            title: "Task in progress",
            message: `"${task.title}" is now in progress by ${task.assigneeName}`,
            timestamp: task.updatedAt,
            read: false,
            type: "task_updated",
          }
        }

        return null
      })
      .filter(Boolean)
      .sort((a, b) =>
        new Date(b!.timestamp ?? 0).getTime() - new Date(a!.timestamp ?? 0).getTime()
      )

    return NextResponse.json({
      success: true,
      notifications,
    })
  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch notifications",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
