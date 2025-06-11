import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, tasks } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export async function GET() {
  try {
    // Total users count
    const userCountResult = await db
      .select({ count: count() })
      .from(users);

    const userCount = Number(userCountResult[0]?.count || 0);

    // Total tasks count
    const taskCountResult = await db
      .select({ count: count() })
      .from(tasks);

    const taskCount = Number(taskCountResult[0]?.count || 0);

    // Task status counts
    const [pendingCountResult, inProgressCountResult, completedCountResult] = await Promise.all([
      db.select({ count: count() }).from(tasks).where(eq(tasks.status, "pending")),
      db.select({ count: count() }).from(tasks).where(eq(tasks.status, "in-progress")),
      db.select({ count: count() }).from(tasks).where(eq(tasks.status, "completed")),
    ]);

    return NextResponse.json({
      success: true,
      userCount,
      taskCount,
      taskStats: {
        pending: Number(pendingCountResult[0]?.count || 0),
        inProgress: Number(inProgressCountResult[0]?.count || 0),
        completed: Number(completedCountResult[0]?.count || 0),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get database statistics",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
