// Mock data for tasks
export type Task = {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
  assignerId: string
  assignerName: string
  assigneeId: string
  assigneeName: string
  createdAt: string
  updatedAt: string
}

export type User = {
  id: string
  name: string
  email: string
  role: "assigner" | "assignee"
}

// Mock users for the application
export const users: User[] = [
  { id: "1", name: "John Assigner", email: "assigner@example.com", role: "assigner" },
  { id: "2", name: "Jane Assignee", email: "assignee@example.com", role: "assignee" },
  { id: "3", name: "Bob Worker", email: "bob@example.com", role: "assignee" },
  { id: "4", name: "Alice Manager", email: "alice@example.com", role: "assigner" },
  { id: "5", name: "Charlie Team", email: "charlie@example.com", role: "assignee" },
]

// Mock tasks for the application
export const tasks: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    description: "Create a modern landing page design for our product launch",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-12-15",
    assignerId: "1",
    assignerName: "John Assigner",
    assigneeId: "2",
    assigneeName: "Jane Assignee",
    createdAt: "2023-11-20T10:00:00Z",
    updatedAt: "2023-11-21T14:30:00Z",
  },
  {
    id: "2",
    title: "Fix navigation bug",
    description: "The dropdown menu in the navigation bar doesn't close properly on mobile",
    status: "pending",
    priority: "medium",
    dueDate: "2023-12-10",
    assignerId: "1",
    assignerName: "John Assigner",
    assigneeId: "3",
    assigneeName: "Bob Worker",
    createdAt: "2023-11-22T09:15:00Z",
    updatedAt: "2023-11-22T09:15:00Z",
  },
  {
    id: "3",
    title: "Update user documentation",
    description: "Update the user guide with the new features from the latest release",
    status: "completed",
    priority: "low",
    dueDate: "2023-11-30",
    assignerId: "4",
    assignerName: "Alice Manager",
    assigneeId: "2",
    assigneeName: "Jane Assignee",
    createdAt: "2023-11-15T11:30:00Z",
    updatedAt: "2023-11-28T16:45:00Z",
  },
  {
    id: "4",
    title: "Implement authentication",
    description: "Add user authentication using NextAuth.js",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-12-05",
    assignerId: "4",
    assignerName: "Alice Manager",
    assigneeId: "5",
    assigneeName: "Charlie Team",
    createdAt: "2023-11-18T13:20:00Z",
    updatedAt: "2023-11-25T10:10:00Z",
  },
  {
    id: "5",
    title: "Optimize database queries",
    description: "Improve performance by optimizing the most frequent database queries",
    status: "pending",
    priority: "medium",
    dueDate: "2023-12-20",
    assignerId: "1",
    assignerName: "John Assigner",
    assigneeId: "3",
    assigneeName: "Bob Worker",
    createdAt: "2023-11-23T15:40:00Z",
    updatedAt: "2023-11-23T15:40:00Z",
  },
]

// Helper functions to simulate API calls
// Modify the getTasks function to return all tasks without filtering
export async function getTasks(): Promise<Task[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...tasks]
}

export async function getTasksByAssignee(assigneeId: string): Promise<Task[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return tasks.filter((task) => task.assigneeId === assigneeId)
}

export async function getTasksByAssigner(assignerId: string): Promise<Task[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return tasks.filter((task) => task.assignerId === assignerId)
}

export async function getTask(taskId: string): Promise<Task | undefined> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return tasks.find((task) => task.id === taskId)
}

export async function getAssignees(): Promise<User[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return users.filter((user) => user.role === "assignee")
}

// Add a function to update a task
export async function updateTask(taskId: string, updatedTask: Partial<Task>): Promise<Task> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Find the task index
  const taskIndex = tasks.findIndex((task) => task.id === taskId)

  if (taskIndex === -1) {
    throw new Error("Task not found")
  }

  // Update the task
  const updatedTaskData = {
    ...tasks[taskIndex],
    ...updatedTask,
    updatedAt: new Date().toISOString(),
  }

  // In a real app, this would update the database
  // For our mock data, we'll update the tasks array
  tasks[taskIndex] = updatedTaskData as Task

  return updatedTaskData as Task
}

// Add a function to delete a task
export async function deleteTask(taskId: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Find the task index
  const taskIndex = tasks.findIndex((task) => task.id === taskId)

  if (taskIndex === -1) {
    throw new Error("Task not found")
  }

  // In a real app, this would delete from the database
  // For our mock data, we'll remove from the tasks array
  tasks.splice(taskIndex, 1)
}

// Add a function to create a new task
export async function createTask(newTask: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const task: Task = {
    id: Math.random().toString(36).substring(2, 9),
    ...newTask,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // In a real app, this would insert into the database
  // For our mock data, we'll add to the tasks array
  tasks.push(task)

  return task
}

// In a real application, these functions would make actual API calls
// and would include proper error handling and authentication
