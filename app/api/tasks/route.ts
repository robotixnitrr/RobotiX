import { type NextRequest, NextResponse } from "next/server"
import { sql, initDb } from "@/lib/db"

// GET all tasks
export async function GET(request: NextRequest) {
  await initDb()
  try {
    const { searchParams } = new URL(request.url)
    const assigneeId = searchParams.get("assigneeId")
    const assignerId = searchParams.get("assignerId")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const search = searchParams.get("search")

    let query = `SELECT * FROM tasks`
    const conditions = []
    const params = []

    if (assigneeId) {
      conditions.push(`assignee_id = $${params.length + 1}`)
      params.push(Number.parseInt(assigneeId))
    }

    if (assignerId) {
      conditions.push(`assigner_id = $${params.length + 1}`)
      params.push(Number.parseInt(assignerId))
    }

    if (status) {
      conditions.push(`status = $${params.length + 1}`)
      params.push(status)
    }

    if (priority) {
      conditions.push(`priority = $${params.length + 1}`)
      params.push(priority)
    }

    if (search) {
      conditions.push(`(title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`)
      params.push(`%${search}%`)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    query += ` ORDER BY created_at DESC`

    const tasks = await sql.unsafe(query)

    return NextResponse.json({
      success: true,
      tasks,
    })
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch tasks",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// POST create new task
export async function POST(request: NextRequest) {
  await initDb()
  try {
    const taskData = await request.json()

    // Validate required fields
    if (!taskData.title || !taskData.description || !taskData.assignee_id || !taskData.due_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate assignee exists
    const assignees = await sql`
      SELECT id, name FROM users WHERE id = ${taskData.assignee_id} AND role = 'assignee' LIMIT 1
    `

    if (assignees.length === 0) {
      return NextResponse.json({ error: "Assignee not found" }, { status: 404 })
    }

    // Validate assigner exists
    const assigners = await sql`
      SELECT id, name FROM users WHERE id = ${taskData.assigner_id} AND role = 'assigner' LIMIT 1
    `

    if (assigners.length === 0) {
      return NextResponse.json({ error: "Assigner not found" }, { status: 404 })
    }

    // Create task with proper names
    const result = await sql`
      INSERT INTO tasks (
        title, description, status, priority, due_date,
        assigner_id, assigner_name, assignee_id, assignee_name
      )
      VALUES (
        ${taskData.title}, ${taskData.description}, ${taskData.status || "pending"}, 
        ${taskData.priority}, ${taskData.due_date}, ${taskData.assigner_id}, 
        ${assigners[0].name}, ${taskData.assignee_id}, ${assignees[0].name}
      )
      RETURNING *
    `

    const task = result[0]

    return NextResponse.json({
      success: true,
      task,
      message: "Task created successfully",
    })
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json(
      {
        error: "Failed to create task",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
