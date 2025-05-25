// Updated models for PostgreSQL
export interface User {
  id: number
  name: string
  email: string
  password?: string
  role: "assigner" | "assignee"
  created_at: string
  updated_at: string
}

export interface Task {
  id: number
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  due_date: string
  assigner_id: number
  assigner_name: string
  assignee_id: number
  assignee_name: string
  created_at: string
  updated_at: string
}

// Input types for creating new records
export interface CreateUserInput {
  name: string
  email: string
  password: string
  role: "assigner" | "assignee"
}

export interface CreateTaskInput {
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  due_date: string
  assigner_id: number
  assigner_name: string
  assignee_id: number
  assignee_name: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: "pending" | "in-progress" | "completed"
  priority?: "low" | "medium" | "high"
  due_date?: string
  assignee_id?: number
  assignee_name?: string
}
