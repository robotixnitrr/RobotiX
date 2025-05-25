import { NextResponse } from "next/server"
import { sql, initDb } from "@/lib/db"

export async function GET() {
  await initDb()

  try {
    // Get user count
    const userCountResult = await sql`SELECT COUNT(*) as count FROM users`
    const userCount = Number(userCountResult[0].count)

    // Get task count
    const taskCountResult = await sql`SELECT COUNT(*) as count FROM tasks`
    const taskCount = Number(taskCountResult[0].count)

    // Get task stats
    const taskStatsResult = await sql`
      SELECT 
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
      FROM tasks
    `

    return NextResponse.json({
      success: true,
      userCount,
      taskCount,
      taskStats: {
        pending: Number(taskStatsResult[0].pending),
        inProgress: Number(taskStatsResult[0].in_progress),
        completed: Number(taskStatsResult[0].completed),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get database statistics",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
