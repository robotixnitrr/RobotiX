import { type NextRequest, NextResponse } from "next/server"
import { UserRepository } from "@/lib/repositories"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const currentUserId = searchParams.get("currentUserId")

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          error: "Current user ID is required",
        },
        { status: 400 },
      )
    }

    const users = await UserRepository.findAssignees(Number(currentUserId))

    return NextResponse.json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error("Failed to fetch assignable users:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch assignable users",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
