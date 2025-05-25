import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // adjust import path based on your structure
import { users } from "@/db/schema"; // your drizzle users table
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, position } = body;

    // Validate input
    if (!name || !email || !password || !role || !position) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!["assigner", "assignee"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const validPositions = [
      "overall-cordinator",
      "head-coordinator",
      "core-coordinator",
      "executive",
      "members",
    ];
    if (!validPositions.includes(position)) {
      return NextResponse.json({ error: "Invalid position" }, { status: 400 });
    }

    console.log("Attempting registration for:", email);

    // Check if user already exists
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    // Create user
    const insertedUsers = await db
      .insert(users)
      .values({ name, email, password, role, position })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        position: users.position,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    const user = insertedUsers[0];

    console.log("Registration successful for:", user.email);

    return NextResponse.json({
      success: true,
      user,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
