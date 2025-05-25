import { sql } from "./db"
import type { User, Task, CreateUserInput, CreateTaskInput, UpdateTaskInput } from "./models"

// User Repository
export class UserRepository {
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await sql`
        SELECT id, name, email, password, role, created_at, updated_at 
        FROM users 
        WHERE email = ${email}
        LIMIT 1
      `
      return result[0] as User || null
    } catch (error) {
      console.error("Error finding user by email:", error)
      throw new Error("Failed to find user")
    }
  }

  static async findById(id: number): Promise<User | null> {
    try {
      const result = await sql`
        SELECT id, name, email, role, created_at, updated_at 
        FROM users 
        WHERE id = ${id}
        LIMIT 1
      `
      return result[0] as User || null
    } catch (error) {
      console.error("Error finding user by ID:", error)
      throw new Error("Failed to find user")
    }
  }

  static async create(userData: CreateUserInput): Promise<User> {
    try {
      const result = await sql`
        INSERT INTO users (name, email, password, role)
        VALUES (${userData.name}, ${userData.email}, ${userData.password}, ${userData.role})
        RETURNING id, name, email, role, created_at, updated_at
      `
      return result[0] as User
    } catch (error) {
      console.error("Error creating user:", error)
      if (error instanceof Error && error.message.includes("duplicate key")) {
        throw new Error("User with this email already exists")
      }
      throw new Error("Failed to create user")
    }
  }

  static async findAssignees(): Promise<User[]> {
    try {
      const result = await sql`
        SELECT id, name, email, role, created_at, updated_at 
        FROM users 
        WHERE role = 'assignee'
        ORDER BY name ASC
      `
      return result as User[]
    } catch (error) {
      console.error("Error finding assignees:", error)
      throw new Error("Failed to find assignees")
    }
  }

  static async findAll(): Promise<User[]> {
    try {
      const result = await sql`
        SELECT id, name, email, role, created_at, updated_at 
        FROM users 
        ORDER BY created_at DESC
      `
      return result as User[]
    } catch (error) {
      console.error("Error finding all users:", error)
      throw new Error("Failed to find users")
    }
  }

  static async update(id: number, updates: Partial<User>): Promise<User | null> {
    try {
      const setClause = Object.keys(updates)
        .filter((key) => key !== "id" && key !== "created_at")
        .map((key) => `${key} = $${Object.keys(updates).indexOf(key) + 2}`)
        .join(", ")

      if (!setClause) return null

      const values = [
        id,
        ...Object.values(updates).filter(
          (_, index) => Object.keys(updates)[index] !== "id" && Object.keys(updates)[index] !== "created_at",
        ),
      ]

      const result = await sql`
        UPDATE users 
        SET ${sql.unsafe(setClause)}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING id, name, email, role, created_at, updated_at
      `
      return result[0] as User || null
    } catch (error) {
      console.error("Error updating user:", error)
      throw new Error("Failed to update user")
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const result: any = await sql`
        DELETE FROM users 
        WHERE id = ${id}
      `
      return result.count > 0
    } catch (error) {
      console.error("Error deleting user:", error)
      throw new Error("Failed to delete user")
    }
  }
}

// Task Repository
export class TaskRepository {
  static async findAll(): Promise<Task[]> {
    try {
      const result = await sql`
        SELECT * FROM tasks 
        ORDER BY created_at DESC
      `
      return result as Task[]
    } catch (error) {
      console.error("Error finding all tasks:", error)
      throw new Error("Failed to find tasks")
    }
  }

  static async findById(id: number): Promise<Task | null> {
    try {
      const result = await sql`
        SELECT * FROM tasks 
        WHERE id = ${id}
        LIMIT 1
      `
      return result[0] as Task || null
    } catch (error) {
      console.error("Error finding task by ID:", error)
      throw new Error("Failed to find task")
    }
  }

  static async findByAssignee(assigneeId: number): Promise<Task[]> {
    try {
      const result = await sql`
        SELECT * FROM tasks 
        WHERE assignee_id = ${assigneeId}
        ORDER BY created_at DESC
      `
      return result as Task[]
    } catch (error) {
      console.error("Error finding tasks by assignee:", error)
      throw new Error("Failed to find tasks")
    }
  }

  static async findByAssigner(assignerId: number): Promise<Task[]> {
    try {
      const result = await sql`
        SELECT * FROM tasks 
        WHERE assigner_id = ${assignerId}
        ORDER BY created_at DESC
      `
      return result as Task[]
    } catch (error) {
      console.error("Error finding tasks by assigner:", error)
      throw new Error("Failed to find tasks")
    }
  }

  static async create(taskData: CreateTaskInput): Promise<Task> {
    try {
      const result = await sql`
        INSERT INTO tasks (
          title, description, status, priority, due_date,
          assigner_id, assigner_name, assignee_id, assignee_name
        )
        VALUES (
          ${taskData.title}, ${taskData.description}, ${taskData.status}, 
          ${taskData.priority}, ${taskData.due_date}, ${taskData.assigner_id}, 
          ${taskData.assigner_name}, ${taskData.assignee_id}, ${taskData.assignee_name}
        )
        RETURNING *
      `
      return result[0] as Task
    } catch (error) {
      console.error("Error creating task:", error)
      throw new Error("Failed to create task")
    }
  }

  static async update(id: number, updates: UpdateTaskInput): Promise<Task | null> {
    try {
      const updateFields = []
      const values = []
      let paramIndex = 1

      if (updates.title !== undefined) {
        updateFields.push(`title = $${paramIndex++}`)
        values.push(updates.title)
      }
      if (updates.description !== undefined) {
        updateFields.push(`description = $${paramIndex++}`)
        values.push(updates.description)
      }
      if (updates.status !== undefined) {
        updateFields.push(`status = $${paramIndex++}`)
        values.push(updates.status)
      }
      if (updates.priority !== undefined) {
        updateFields.push(`priority = $${paramIndex++}`)
        values.push(updates.priority)
      }
      if (updates.due_date !== undefined) {
        updateFields.push(`due_date = $${paramIndex++}`)
        values.push(updates.due_date)
      }
      if (updates.assignee_id !== undefined) {
        updateFields.push(`assignee_id = $${paramIndex++}`)
        values.push(updates.assignee_id)
      }
      if (updates.assignee_name !== undefined) {
        updateFields.push(`assignee_name = $${paramIndex++}`)
        values.push(updates.assignee_name)
      }

      if (updateFields.length === 0) return null

      updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
      values.push(id)

      const query = `
        UPDATE tasks
        SET ${updateFields.join(", ")}
        WHERE id = $${values.length}
        RETURNING *
      `
      // const result = await sql`
      //   UPDATE tasks 
      //   SET ${sql.unsafe(updateFields.join(", "))}
      //   WHERE id = ${paramIndex}
      //   RETURNING *
      // `
      const result = await sql.query(query, values)
      return result[0] as Task || null
    } catch (error) {
      console.error("Error updating task:", error)
      throw new Error("Failed to update task")
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const result: any = await sql`
        DELETE FROM tasks 
        WHERE id = ${id}
      `
      return result.count > 0
    } catch (error) {
      console.error("Error deleting task:", error)
      throw new Error("Failed to delete task")
    }
  }

  static async findByStatus(status: string): Promise<Task[]> {
    try {
      const result = await sql`
        SELECT * FROM tasks 
        WHERE status = ${status}
        ORDER BY created_at DESC
      `
      return result as Task[]
    } catch (error) {
      console.error("Error finding tasks by status:", error)
      throw new Error("Failed to find tasks")
    }
  }

  static async findByPriority(priority: string): Promise<Task[]> {
    try {
      const result = await sql`
        SELECT * FROM tasks 
        WHERE priority = ${priority}
        ORDER BY created_at DESC
      `
      return result as Task[]
    } catch (error) {
      console.error("Error finding tasks by priority:", error)
      throw new Error("Failed to find tasks")
    }
  }

  static async count(): Promise<number> {
    try {
      const result = await sql`
        SELECT COUNT(*) as count FROM tasks
      `
      return Number.parseInt(result[0].count)
    } catch (error) {
      console.error("Error counting tasks:", error)
      throw new Error("Failed to count tasks")
    }
  }

  static async getStats() {
    try {
      const result = await sql`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority,
          COUNT(CASE WHEN priority = 'medium' THEN 1 END) as medium_priority,
          COUNT(CASE WHEN priority = 'low' THEN 1 END) as low_priority
        FROM tasks
      `
      return {
        total: Number.parseInt(result[0].total),
        pending: Number.parseInt(result[0].pending),
        inProgress: Number.parseInt(result[0].in_progress),
        completed: Number.parseInt(result[0].completed),
        highPriority: Number.parseInt(result[0].high_priority),
        mediumPriority: Number.parseInt(result[0].medium_priority),
        lowPriority: Number.parseInt(result[0].low_priority),
      }
    } catch (error) {
      console.error("Error getting task stats:", error)
      throw new Error("Failed to get task statistics")
    }
  }

  static async search(
    query: string,
    filters?: {
      status?: string[]
      priority?: string[]
      assigneeId?: number
      assignerId?: number
    },
  ): Promise<Task[]> {
    try {
      let whereClause = `WHERE (title ILIKE $1 OR description ILIKE $1)`
      const values = [`%${query}%`]
      let paramIndex = 2

      if (filters?.status?.length) {
        whereClause += ` AND status = ANY($${paramIndex++})`
        values.push(`{${filters.status.map(s => `"${s}"`).join(",")}}`)
      }

      if (filters?.priority?.length) {
        whereClause += ` AND priority = ANY($${paramIndex++})`
        values.push(`{${filters.priority.map(p => `"${p}"`).join(",")}}`)
      }

      if (filters?.assigneeId) {
        whereClause += ` AND assignee_id = $${paramIndex++}`
        values.push(filters.assigneeId.toString())
      }

      if (filters?.assignerId) {
        whereClause += ` AND assigner_id = $${paramIndex++}`
        values.push(filters.assignerId.toString())
      }

      const result = await sql`
        SELECT * FROM tasks 
        ${sql.unsafe(whereClause)}
        ORDER BY created_at DESC
      `
      return result as Task[]
    } catch (error) {
      console.error("Error searching tasks:", error)
      throw new Error("Failed to search tasks")
    }
  }
}
