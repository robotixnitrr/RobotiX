import { type NextRequest, NextResponse } from "next/server"
import { sql, initDb } from "@/lib/db"

export async function POST(request: NextRequest) {
  await initDb()

  try {
    const body = await request.json()
    const { name, email, password, role } = body

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (!["assigner", "assignee"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    console.log("Attempting registration for:", email)

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create user
    const result = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${password}, ${role})
      RETURNING id, name, email, role, created_at, updated_at
    `

    const user = result[0]

    console.log("Registration successful for:", user.email)

    return NextResponse.json({
      success: true,
      user,
      message: "Registration successful",
    })
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
