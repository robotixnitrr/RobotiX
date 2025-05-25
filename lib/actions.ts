"use server"

import { revalidatePath } from "next/cache"
import { TaskRepository, UserRepository } from "@/lib/repositories"
import type { Task, User, CreateTaskInput, UpdateTaskInput } from "./models"

// Task actions
export async function getTasks(filters?: {
  assigneeId?: number
  assignerId?: number
  status?: string
  priority?: string
  search?: string
}): Promise<Task[]> {
  try {
    let tasks: Task[]

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
    return await TaskRepository.findById(id)
  } catch (error) {
    console.error("Error in getTask:", error)
    throw new Error(`Failed to get task: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function createTask(taskData: Omit<CreateTaskInput, "assigner_name" | "assignee_name">): Promise<Task> {
  try {
    // Get the assignee name
    const assignee = await UserRepository.findById(Number(taskData.assignee_id))
    if (!assignee) {
      throw new Error("Assignee not found")
    }

    // Get the assigner name
    const assigner = await UserRepository.findById(Number(taskData.assigner_id))
    if (!assigner) {
      throw new Error("Assigner not found")
    }

    // Create the task with proper data
    const task = await TaskRepository.create({
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || "pending",
      priority: taskData.priority,
      due_date: taskData.due_date,
      assigner_id: Number(taskData.assigner_id),
      assigner_name: assigner.name,
      assignee_id: Number(taskData.assignee_id),
      assignee_name: assignee.name,
    })

    // Revalidate relevant paths
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
    // If assignee is being updated, get the new assignee name
    if (updates.assignee_id) {
      const assignee = await UserRepository.findById(Number(updates.assignee_id))
      if (!assignee) {
        throw new Error("Assignee not found")
      }
      updates.assignee_name = assignee.name
    }

    const task = await TaskRepository.update(id, updates)

    // Revalidate relevant paths
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/tasks")
    revalidatePath(`/dashboard/tasks/${id}`)

    return task
  } catch (error) {
    console.error("Error in updateTask:", error)
    throw new Error(`Failed to update task: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function updateTaskStatus(id: number, status: "pending" | "in-progress" | "completed") {
  try {
    // Validate status before updating to avoid violating DB constraint
    const allowed = ["pending", "in-progress", "completed"]
    if (!allowed.includes(status)) {
      throw new Error(`Invalid status value: ${status}`)
    }
    const task = await TaskRepository.findById(id)
    if (!task) {
      throw new Error("Task not found")
    }
    const updatedTask = await TaskRepository.update(id, {...task, status})
    
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/tasks")
    revalidatePath(`/dashboard/tasks/${id}`)
    return task
  } catch (error) {
    console.error("Error in updateTaskStatus:", error)
    throw new Error(`Failed to update task status: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function deleteTask(id: number): Promise<boolean> {
  try {
    const success = await TaskRepository.delete(id)

    // Revalidate relevant paths
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/tasks")

    return success
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

// Task statistics
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

// Get notifications from database
export async function getNotifications(userId: number): Promise<any[]> {
  try {
    // In a real app, you would fetch notifications from a notifications table
    // For now, we'll create some dummy notifications based on tasks
    const tasks = await TaskRepository.findAll()

    // Create notifications for recent tasks
    const notifications = tasks
      .slice(0, 5)
      .map((task) => {
        const isAssignee = task.assignee_id === userId
        const isAssigner = task.assigner_id === userId

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
      .filter((n): n is NonNullable<typeof n> => n !== null)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return notifications
  } catch (error) {
    console.error("Error in getNotifications:", error)
    return []
  }
}
