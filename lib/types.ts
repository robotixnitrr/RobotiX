// CreateUserInput.ts
export type CreateUserInput = {
  name: string
  email: string
  password: string
  role: "assigner" | "assignee"
}

// CreateTaskInput.ts
export type CreateTaskInput = {
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assigneeId: number
  assignerId: number
}

// UpdateTaskInput.ts
export type UpdateTaskInput = Partial<{
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assigneeId: number
  assignerId: number
}>

