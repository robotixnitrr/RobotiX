import { db } from "@/db"
import { CreateTaskInput, CreateUserInput, tasks, UpdateTaskInput, users } from "@/db/schema"
import { eq, and, sql, ilike, inArray, or, not } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"
import { Assignee } from "./types"
import { positionRank } from "./constants"

export class UserRepository {
  static async findByEmail(email: string) {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    return result
  }

  static async findById(id: number) {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id),
    })
    return result
  }

  static async create(userData: CreateUserInput) {
    try {
      const [user] = await db
        .insert(users)
        .values(userData)
        .returning()
      return user
    } catch (error: any) {
      if (error.message.includes("duplicate key")) {
        throw new Error("User with this email already exists")
      }
      throw new Error("Failed to create user")
    }
  }

  static async findAssignees(currentUserId: number) {
    const currentUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, currentUserId),
    });

    if (!currentUser) throw new Error("Current user not found");

    type Position = keyof typeof positionRank;

    const currentRank = positionRank[currentUser.position as Position];

    // Get positions with equal or lower rank
    const allowedPositions = Object.entries(positionRank)
      .filter(([_, rank]) => rank <= currentRank)
      .map(([pos]) => pos as Position);

    return db
      .select()
      .from(users)
      .where(
        and(
          inArray(users.position, allowedPositions as readonly Position[]), // Allowed positions
          not(eq(users.id, currentUserId)) // Exclude current user
        )
      )
      .orderBy(users.name);
  }



  static async findAll() {
    return db
      .select()
      .from(users)
      .orderBy(users.createdAt)
  }

  static async update(id: number, updates: Partial<typeof users.$inferInsert>) {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning()
    return updatedUser ?? null
  }

  static async delete(id: number) {
    const result = await db.delete(users).where(eq(users.id, id))
    return result?.rowCount && result.rowCount > 0
  }
}

const filters = {
  status: ["pending", "completed"] as const,
}

// Helper function to get the base query structure
const assigner = alias(users, "assigner");

export const getBaseTaskQuery = () => {
  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      priority: tasks.priority,
      dueDate: tasks.dueDate,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
      assignerId: tasks.assignerId,
      assignerName: assigner.name,
      assignees: tasks.assignees,
    })
    .from(tasks)
    .leftJoin(assigner, eq(assigner.id, tasks.assignerId));
};


export class TaskRepository {
  static async findAll() {
    return getBaseTaskQuery();
  }

  static async findById(id: number) {
    return db.query.tasks.findFirst({ where: eq(tasks.id, id) })
  }

  static async findByAssignee(assigneeId: number) {
    return getBaseTaskQuery()
      .where(
        sql`EXISTS (
            SELECT 1 FROM jsonb_array_elements(${tasks.assignees}) AS assignee
            WHERE (assignee->>'userId')::int = ${assigneeId}
          )`
      )
      .orderBy(sql`${tasks.createdAt} DESC`);
    // .where(eq((tasks.assignees as Assignee[]), assigneeId))
    // .orderBy(sql`${tasks.createdAt} DESC`);
  }

  static async findByAssigner(assignerId: number) {
    return getBaseTaskQuery()
      .where(eq(tasks.assignerId, assignerId))
      .orderBy(sql`${tasks.createdAt} DESC`);
  }

  static async create(taskData: CreateTaskInput) {
    const [task] = await db.insert(tasks).values(taskData).returning()
    return task
  }

  static async update(id: number, updates: UpdateTaskInput) {
    const [task] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning()
    return task ?? null
  }

  static async delete(id: number) {
    const result = await db.delete(tasks).where(eq(tasks.id, id))
    return result?.rowCount && result.rowCount > 0
  }

  static async findByStatus(status: string) {
    return getBaseTaskQuery()
      .where(eq(tasks.status, status as "pending" | "in-progress" | "completed"))
      .orderBy(sql`${tasks.createdAt} DESC`);
  }

  static async findByPriority(priority: string) {
    return getBaseTaskQuery()
      .where(eq(tasks.priority, priority as "low" | "medium" | "high"))
      .orderBy(sql`${tasks.createdAt} DESC`);
  }

  static async count() {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
    return Number(count)
  }

  static async getStats() {
    const result = await db.execute(sql`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'pending') as pending,
      COUNT(*) FILTER (WHERE status = 'in-progress') as in_progress,
      COUNT(*) FILTER (WHERE status = 'completed') as completed,
      COUNT(*) FILTER (WHERE priority = 'high') as high_priority,
      COUNT(*) FILTER (WHERE priority = 'medium') as medium_priority,
      COUNT(*) FILTER (WHERE priority = 'low') as low_priority
    FROM tasks
  `)

    const row = (result as any).rows?.[0]

    return {
      total: Number(row.total),
      pending: Number(row.pending),
      inProgress: Number(row.in_progress),
      completed: Number(row.completed),
      highPriority: Number(row.high_priority),
      mediumPriority: Number(row.medium_priority),
      lowPriority: Number(row.low_priority),
    }
  }

  static async search(
    query: string,
    filters?: {
      status?: string[];
      priority?: string[];
      assigneeId?: number;
      assignerId?: number;
    }
  ) {
    const whereConditions = [
      or(
        ilike(tasks.title, `%${query}%`),
        ilike(tasks.description, `%${query}%`)
      ),
    ];

    if (filters?.status?.length) {
      whereConditions.push(inArray(tasks.status, filters.status as any));
    }

    if (filters?.priority?.length) {
      whereConditions.push(inArray(tasks.priority, filters.priority as any));
    }

    if (filters?.assigneeId) {
      whereConditions.push(eq((tasks.assignees as any).id, filters.assigneeId));
    }

    if (filters?.assignerId) {
      whereConditions.push(eq(tasks.assignerId, filters.assignerId));
    }

    return getBaseTaskQuery()
      .where(and(...whereConditions))
      .orderBy(sql`${tasks.createdAt} DESC`);
  }
}