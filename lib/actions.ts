"use server"

import { revalidatePath } from "next/cache"
import { sql } from "drizzle-orm"
import { TaskRepository, UserRepository } from "@/lib/repositories"
import type { Task, User, CreateTaskInput, UpdateTaskInput } from "@/db/schema"

// Helper: safely parse a date
function safeParseDate(value: Date | string | null): Date {
  return value ? new Date(value) : new Date(0)
}

// Task actions
export async function getTasks(filters?: {
  assigneeId?: number
  assignerId?: number
  status?: "pending" | "in-progress" | "completed"
  priority?: "low" | "medium" | "high"
  search?: string
}) {
  try {
    let tasks;

    if (filters?.assigneeId) {
      tasks = await TaskRepository.findByAssignee(filters.assigneeId)
    } else if (filters?.assignerId) {
      tasks = await TaskRepository.findByAssigner(filters.assignerId)
    } else if (filters?.status) {
      tasks = await TaskRepository.findByStatus(filters.status)
    } else if (filters?.priority) {
      tasks = await TaskRepository.findByPriority(filters.priority)
    } else if (filters?.search) {
      tasks = await TaskRepository.search(filters.search)
    } else {
      tasks = await TaskRepository.findAll()
    }

    return tasks
  } catch (error) {
    console.error("Error in getTasks:", error)
    throw new Error(`Failed to get tasks: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function getTask(id: number): Promise<Task | null> {
  try {
    const task = await TaskRepository.findById(id);
    return task ?? null;
  } catch (error) {
    console.error("getTask error:", error);
    throw new Error(
      error instanceof Error
        ? `Failed to fetch task: ${error.message}`
        : "Failed to fetch task"
    );
  }
}

export async function createTask(taskData: Omit<CreateTaskInput, "assigner_name" | "assignee_name">): Promise<Task> {
  try {
    const assignee = await UserRepository.findById(Number(taskData.assigneeId))
    if (!assignee) throw new Error("Assignee not found")

    const assigner = await UserRepository.findById(Number(taskData.assignerId))
    if (!assigner) throw new Error("Assigner not found")

    const task = await TaskRepository.create({
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || "pending",
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      assignerId: Number(taskData.assignerId),
      assignerName: assigner.name,
      assigneeId: Number(taskData.assigneeId),
      assigneeName: assignee.name,
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/tasks")

    return task
  } catch (error) {
    console.error("Error in createTask:", error)
    throw new Error(`Failed to create task: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function updateTask(id: number, updates: UpdateTaskInput): Promise<Task | null> {
  try {
    if (updates.assigneeId) {
      const assignee = await UserRepository.findById(Number(updates.assigneeId))
      if (!assignee) throw new Error("Assignee not found")
      updates.assigneeName = assignee.name
    }

    const task = await TaskRepository.update(id, updates)

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/tasks")
    revalidatePath(`/dashboard/tasks/${id}`)

    return task
  } catch (error) {
    console.error("Error in updateTask:", error)
    throw new Error(`Failed to update task: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function updateTaskStatus(id: number, status: "pending" | "in-progress" | "completed"): Promise<Task | null> {
  try {
    const task = await TaskRepository.findById(id)
    if (!task) throw new Error("Task not found")

    const updatedTask = await TaskRepository.update(id, { status })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/tasks")
    revalidatePath(`/dashboard/tasks/${id}`)

    return updatedTask
  } catch (error) {
    console.error("Error in updateTaskStatus:", error)
    throw new Error(`Failed to update task status: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function deleteTask(id: number): Promise<boolean> {
  try {
    const success = await TaskRepository.delete(id)

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/tasks")

    return !!success
  } catch (error) {
    console.error("Error in deleteTask:", error)
    throw new Error(`Failed to delete task: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function getAssignees(): Promise<User[]> {
  try {
    return await UserRepository.findAssignees()
  } catch (error) {
    console.error("Error in getAssignees:", error)
    throw new Error(`Failed to get assignees: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function getTaskStats() {
  try {
    return await TaskRepository.getStats()
  } catch (error) {
    console.error("Error in getTaskStats:", error)
    return {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
    }
  }
}

export async function getNotifications(userId: number): Promise<any[]> {
  try {
    const userResult = await sql`
      SELECT last_notification_read_at
      FROM users
      WHERE id = ${userId}
    `
    const lastReadRaw = (userResult as any)[0]?.last_notification_read_at ?? null
    const lastRead = safeParseDate(lastReadRaw)

    const tasks = await TaskRepository.findAll()

    const notifications = tasks
      .map((task) => {
        const isAssignee = task.assigneeId === userId
        const isAssigner = task.assignerId === userId

        if (isAssignee) {
          return {
            id: `task-${task.id}-assigned`,
            title: "New task assigned to you",
            message: `"${task.title}" has been assigned to you by ${task.assignerName}`,
            timestamp: task.createdAt,
            type: "taskAssigned",
          }
        } else if (isAssigner && task.status === "completed") {
          return {
            id: `task-${task.id}-completed`,
            title: "Task completed",
            message: `"${task.title}" has been completed by ${task.assigneeName}`,
            timestamp: task.updatedAt,
            type: "task_completed",
          }
        } else if (isAssigner && task.status === "in-progress") {
          return {
            id: `task-${task.id}-progress`,
            title: "Task in progress",
            message: `"${task.title}" is now in progress by ${task.assigneeName}`,
            timestamp: task.updatedAt,
            type: "task_updated",
          }
        }

        return null
      })
      .filter((n): n is NonNullable<typeof n> => n !== null)
      .filter((n) => safeParseDate(n.timestamp) > lastRead)
      .sort((a, b) => safeParseDate(b.timestamp).getTime() - safeParseDate(a.timestamp).getTime())

    return notifications
  } catch (error) {
    console.error("Error in getNotifications:", error)
    return []
  }
}

export async function markNotificationsAsRead(userId: number) {
  await sql`
    UPDATE users
    SET last_notification_read_at = NOW()
    WHERE id = ${userId}
  `
}
