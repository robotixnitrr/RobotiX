import { NextResponse } from "next/server"
import { UserRepository } from "@/lib/repositories"

export async function GET() {
  try {
    const users = await UserRepository.findAll()

    return NextResponse.json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
