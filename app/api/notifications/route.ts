import { NextResponse, type NextRequest } from "next/server"
import { TaskRepository } from "@/lib/repositories"
import { initDb } from "@/lib/db"

export async function GET(request: NextRequest) {
  await initDb()

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get all tasks
    const tasks = await TaskRepository.findAll()

    // Create notifications for recent tasks
    const notifications = tasks
      .slice(0, 5)
      .map((task) => {
        const isAssignee = task.assignee_id === Number(userId)
        const isAssigner = task.assigner_id === Number(userId)

        if (isAssignee) {
          return {
            id: `task-${task.id}-assigned`,
            title: "New task assigned to you",
            message: `"${task.title}" has been assigned to you by ${task.assigner_name}`,
            timestamp: task.created_at,
            read: false,
            type: "task_assigned",
          }
        } else if (isAssigner && task.status === "completed") {
          return {
            id: `task-${task.id}-completed`,
            title: "Task completed",
            message: `"${task.title}" has been completed by ${task.assignee_name}`,
            timestamp: task.updated_at,
            read: false,
            type: "task_completed",
          }
        } else if (isAssigner && task.status === "in-progress") {
          return {
            id: `task-${task.id}-progress`,
            title: "Task in progress",
            message: `"${task.title}" is now in progress by ${task.assignee_name}`,
            timestamp: task.updated_at,
            read: false,
            type: "task_updated",
          }
        }
        return null
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b ? b.timestamp : "").getTime() - new Date(a ? a.timestamp : "").getTime())

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
