import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ProjectMemberRepository } from "@/lib/repositories";

interface RouteParams {
  params: Promise<{
    id: string;
    userId: string;
  }>;
}

// Validation schema for updating a team member
const updateTeamMemberSchema = z.object({
  role: z.string().optional(),
  contributions: z.string().optional(),
  isActive: z.boolean().optional(),
});

// PUT /api/projects/[id]/members/[userId]
export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const { id, userId } = await context.params;
    const projectId = Number.parseInt(id);
    const memberId = Number.parseInt(userId);

    if (isNaN(projectId) || isNaN(memberId)) {
      return NextResponse.json(
        { success: false, error: "Invalid project or user ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const data = updateTeamMemberSchema.parse(body);

    const updatedMember = await ProjectMemberRepository.updateMember(
      projectId,
      memberId,
      data
    );

    return NextResponse.json({
      success: true,
      data: updatedMember,
      message: "Member updated successfully",
    });
  } catch (error) {
    console.error("Failed to update project member:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update project member",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]/members/[userId]
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const { id, userId } = await context.params;
    const projectId = Number.parseInt(id);
    const memberId = Number.parseInt(userId);

    if (isNaN(projectId) || isNaN(memberId)) {
      return NextResponse.json(
        { success: false, error: "Invalid project or user ID" },
        { status: 400 }
      );
    }

    await ProjectMemberRepository.removeMember(projectId, memberId);

    return NextResponse.json({
      success: true,
      message: "Member removed from project",
    });
  } catch (error) {
    console.error("Failed to remove project member:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to remove project member",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
