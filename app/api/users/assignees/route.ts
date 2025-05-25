import { NextResponse } from "next/server"
import { sql, initDb } from "@/lib/db"

export async function GET() {
  await initDb()

  try {
    const assignees = await sql`
      SELECT id, name, email, role, created_at, updated_at 
      FROM users 
      WHERE role = 'assignee'
      ORDER BY name ASC
    `

    return NextResponse.json({
      success: true,
      assignees,
    })
  } catch (error) {
    console.error("Get assignees error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch assignees",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
