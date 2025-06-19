import { type NextRequest, NextResponse } from "next/server"
import { ProjectUpdateRepository } from "@/lib/repositories"
import { z } from "zod"

const createUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required").max(1000, "Description too long"),
  updateType: z.string().optional().default("general"),
})

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params
    const projectId = Number.parseInt(id)

    if (isNaN(projectId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid project ID",
        },
        { status: 400 },
      )
    }

    const updates = await ProjectUpdateRepository.findByProject(projectId)

    return NextResponse.json({
      success: true,
      data: updates,
    })
  } catch (error) {
    console.error("Failed to fetch project updates:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch project updates",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params
    const projectId = Number.parseInt(id)

    if (isNaN(projectId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid project ID",
        },
        { status: 400 },
      )
    }

    // Get user from cookie
    const userCookie = request.cookies.get("user")?.value
    const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate request body
    const validationResult = createUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        { status: 400 },
      )
    }

    const { title, description, updateType } = validationResult.data

    // Create project update
    const update = await ProjectUpdateRepository.create({
      projectId,
      userId: user.id,
      title,
      description,
      updateType,
    })

    return NextResponse.json(
      {
        success: true,
        data: update,
        message: "Project update created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Failed to create project update:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project update",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
