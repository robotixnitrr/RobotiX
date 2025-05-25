import { type NextRequest, NextResponse } from "next/server"
import { TaskRepository, UserRepository } from "@/lib/repositories"
import type { UpdateTaskInput } from "@/lib/models"

// GET single task
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 })
    }

    const task = await TaskRepository.findById(id)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      task,
    })
  } catch (error) {
    console.error("Get task error:", error)
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

// PUT update task
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 })
    }

    const updates: UpdateTaskInput = await request.json()

    // If assignee is being updated, get the new assignee name
    if (updates.assignee_id) {
      const assignee = await UserRepository.findById(updates.assignee_id)
      if (!assignee) {
        return NextResponse.json({ error: "Assignee not found" }, { status: 404 })
      }
      updates.assignee_name = assignee.name
    }

    const task = await TaskRepository.update(id, updates)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      task,
      message: "Task updated successfully",
    })
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

// DELETE task
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 })
    }

    const success = await TaskRepository.delete(id)

    if (!success) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
