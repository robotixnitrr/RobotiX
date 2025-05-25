import { type NextRequest, NextResponse } from "next/server"
import { sql, initDb } from "@/lib/db"

export async function POST(request: NextRequest) {
  await initDb()
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("Attempting login for:", email)

    // Find user by email
    const users = await sql`
      SELECT id, name, email, role, created_at, updated_at, password
      FROM users 
      WHERE email = ${email}
      LIMIT 1
    `

    console.log("Found users:", users.length)

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = users[0]

    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    console.log("Login successful for:", userWithoutPassword.email)

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
