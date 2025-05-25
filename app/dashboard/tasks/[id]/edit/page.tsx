"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { getTask, updateTask, getAssignees } from "@/lib/actions"
import type { Task, User } from "@/lib/models"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function EditTaskPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [task, setTask] = useState<Task | null>(null)
  const [assignees, setAssignees] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
    assigneeId: "",
    assigneeName: "",
  })

  const taskId = Number.parseInt(params.id)

  useEffect(() => {
    async function loadData() {
      if (!user) return

      try {
        setLoading(true)

        // Load task data
        const fetchedTask = await getTask(taskId)
        if (!fetchedTask) {
          toast({
            variant: "destructive",
            title: "Task not found",
            description: "The requested task could not be found.",
          })
          router.push("/dashboard/tasks")
          return
        }

        // Check if user is authorized to edit this task
        if (user.role !== "assigner" || fetchedTask.assigner_id !== Number(user.id)) {
          toast({
            variant: "destructive",
            title: "Unauthorized",
            description: "You don't have permission to edit this task.",
          })
          router.push(`/dashboard/tasks/${taskId}`)
          return
        }

        setTask(fetchedTask)

        // Format the date for the input field (YYYY-MM-DD)
        const formattedDate = new Date(fetchedTask.due_date).toISOString().split("T")[0]

        setFormData({
          title: fetchedTask.title,
          description: fetchedTask.description,
          priority: fetchedTask.priority as "low" | "medium" | "high",
          dueDate: formattedDate,
          assigneeId: fetchedTask.assignee_id.toString(),
          assigneeName: fetchedTask.assignee_name,
        })

        // Load assignees
        const fetchedAssignees = await getAssignees()
        setAssignees(fetchedAssignees)
      } catch (error) {
        console.error("Failed to load data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load task data.",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [taskId, user, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePriorityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, priority: value as "low" | "medium" | "high" }))
  }

  const handleAssigneeChange = (value: string) => {
    const selectedAssignee = assignees.find((assignee) => assignee.id?.toString() === value)
    setFormData((prev) => ({
      ...prev,
      assigneeId: value,
      assigneeName: selectedAssignee?.name || prev.assigneeName,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !task) return

    try {
      setUpdating(true)

      // Update the task
      const updatedTask = await updateTask(taskId, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        due_date: formData.dueDate,
        assignee_id: Number(formData.assigneeId),
        assignee_name: formData.assigneeName,
      })

      toast({
        title: "Task updated",
        description: "The task has been updated successfully.",
      })

      router.push(`/dashboard/tasks/${taskId}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating the task.",
      })
    } finally {
      setUpdating(false)
    }
  }

  if (!user) return null

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (!task || user.role !== "assigner" || task.assigner_id !== Number(user.id)) {
    return (
      <DashboardLayout>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
            <CardDescription>You don't have permission to edit this task.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href={`/dashboard/tasks/${taskId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Task
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Edit Task</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/tasks/${taskId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Task
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Update the information for this task.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter task description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <RadioGroup
                    value={formData.priority}
                    onValueChange={handlePriorityChange}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low" className="font-normal">
                        Low
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="font-normal">
                        Medium
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="font-normal">
                        High
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee">Assign To</Label>
                <Select value={formData.assigneeId} onValueChange={handleAssigneeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignees.map((assignee) => (
                      <SelectItem key={assignee.id?.toString()} value={assignee.id?.toString() || ""}>
                        {assignee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => router.push(`/dashboard/tasks/${taskId}`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updating}>
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Task"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}
