"use client"

import React, { useEffect, useState } from "react"
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
import { getAssignees, getTask, updateTask } from "@/lib/actions"
import type { Task, User } from "@/db/schema"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function EditTaskPage() {
  const { user } = useAuth()
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const taskId = Number(id)
  const [task, setTask] = useState<Task | null>(null)
  const [assignees, setAssignees] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    dueDate: "",
    assigneeId: "",
  })

  useEffect(() => {
    async function loadData() {
      if (!user) return

      setLoading(true)
      try {
        // Fetch single task by ID
        const fetched = await getTask(taskId)
        if (!fetched) {
          toast({ variant: "destructive", title: "Not Found", description: "Task not found." })
          router.push("/dashboard/tasks")
          return
        }

        // Authorization: must be assigner
        if (user.role !== "assigner" || fetched.assignerId !== Number(user.id)) {
          toast({ variant: "destructive", title: "Unauthorized", description: "You cannot edit this task." })
          router.push(`/dashboard/tasks/${taskId}`)
          return
        }

        setTask(fetched)

        // Populate form
        setFormData({
          title: fetched.title,
          description: fetched.description,
          priority: fetched.priority,
          dueDate: new Date(fetched.dueDate).toISOString().split('T')[0],
          assigneeId: String(fetched.assigneeId),
        })

        // Fetch assignees list
        const list = await getAssignees()
        setAssignees(list)
      } catch (err) {
        console.error(err)
        toast({ variant: "destructive", title: "Error", description: "Failed loading data." })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [taskId, user, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePriorityChange = (value: string) => {
    setFormData(prev => ({ ...prev, priority: value as Task["priority"] }))
  }

  const handleAssigneeChange = (value: string) => {
    setFormData(prev => ({ ...prev, assigneeId: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task) return

    setUpdating(true)
    try {
      await updateTask(taskId, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate,
        assigneeId: Number(formData.assigneeId),
      })
      toast({ title: "Updated", description: "Task updated successfully." })
      router.push(`/dashboard/tasks/${taskId}`)
    } catch (err) {
      console.error(err)
      toast({ variant: "destructive", title: "Error", description: "Failed to update task." })
    } finally {
      setUpdating(false)
    }
  }

  if (!user) return null

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (!task) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Task</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/tasks/${taskId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />Back
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Update the fields below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Priority</Label>
                  <RadioGroup value={formData.priority} onValueChange={handlePriorityChange} className="flex space-x-4">
                    {(["low","medium","high"] as Task["priority"][]).map(pr => (
                      <div key={pr} className="flex items-center space-x-2">
                        <RadioGroupItem value={pr} id={pr} />
                        <Label htmlFor={pr} className="font-normal capitalize">{pr}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <Label htmlFor="assignee">Assign To</Label>
                <Select value={formData.assigneeId} onValueChange={handleAssigneeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignees.map(u => (
                      <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between flex-wrap gap-2">
              <Button variant="outline" onClick={() => router.push(`/dashboard/tasks/${taskId}`)}>Cancel</Button>
              <Button type="submit" disabled={updating}>
                {updating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Update"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}
