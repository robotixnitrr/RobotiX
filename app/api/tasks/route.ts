import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // Assumes `db` is your Drizzle instance
import { eq, ilike, and, or } from "drizzle-orm";
import { tasks, users } from "@/db/schema";

// GET all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assigneeId = searchParams.get("assigneeId");
    const assignerId = searchParams.get("assignerId");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    const whereClauses = [];

    if (assigneeId) {
      whereClauses.push(eq(tasks.assigneeId, Number(assigneeId)));
    }

    if (assignerId) {
      whereClauses.push(eq(tasks.assignerId, Number(assignerId)));
    }

    if (status) {
      whereClauses.push(eq(tasks.status, status as "pending" | "in-progress" | "completed"));
    }

    if (priority) {
      whereClauses.push(eq(tasks.priority, priority as "low" | "medium" | "high"));
    }

    if (search) {
      whereClauses.push(
        ilike(tasks.title, `%${search}%`) // OR condition handled below
      );
    }

    const tasksResult = await db
      .select()
      .from(tasks)
      .where(
        and(
          ...whereClauses.map((clause, index) =>
            index === whereClauses.length - 1 && search
              ? or(ilike(tasks.title, `%${search}%`), ilike(tasks.description, `%${search}%`))
              : clause
          )
        )
      )
      .orderBy(tasks.createdAt);

    return NextResponse.json({
      success: true,
      tasks: tasksResult,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch tasks",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST create new task
export async function POST(request: NextRequest) {
  try {
    const taskData = await request.json();

    if (!taskData.title || !taskData.description || !taskData.assignee_id || !taskData.due_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const assignee = await db.query.users.findFirst({
      where: and(eq(users.id, taskData.assignee_id), eq(users.role, "assignee")),
    });

    if (!assignee) {
      return NextResponse.json({ error: "Assignee not found" }, { status: 404 });
    }

    const assigner = await db.query.users.findFirst({
      where: and(eq(users.id, taskData.assigner_id), eq(users.role, "assigner")),
    });

    if (!assigner) {
      return NextResponse.json({ error: "Assigner not found" }, { status: 404 });
    }

    const insertedTask = await db.insert(tasks).values({
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || "pending",
      priority: taskData.priority,
      dueDate: new Date(taskData.due_date).toLocaleString(),
      assignerId: assigner.id,
      assignerName: assigner.name,
      assigneeId: assignee.id,
      assigneeName: assignee.name,
    }).returning();

    return NextResponse.json({
      success: true,
      task: insertedTask[0],
      message: "Task created successfully",
    });
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json(
      {
        error: "Failed to create task",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
