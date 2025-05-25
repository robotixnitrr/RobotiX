"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import DashboardLayout from "@/components/dashboard-layout"
import { PriorityBadge } from "@/components/priority-badge"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { getTasks, getAssignees } from "@/lib/actions"
import type { Task, User } from "@/lib/models"
import { ClipboardList, Loader2, MoreHorizontal, PlusCircle, Search } from "lucide-react"

export default function TasksPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [tasks, setTasks] = useState<Task[]>([])
  const [assignees, setAssignees] = useState<User[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [assignerFilter, setAssignerFilter] = useState("all")

  useEffect(() => {
    async function loadData() {
      if (!user) return

      try {
        setLoading(true)

        // Fetch tasks and assignees in parallel
        const [fetchedTasks, fetchedAssignees] = await Promise.all([getTasks(), getAssignees()])

        setTasks(fetchedTasks)
        setFilteredTasks(fetchedTasks)
        setAssignees(fetchedAssignees)
      } catch (error) {
        console.error("Failed to load tasks:", error)
        toast({
          variant: "destructive",
          title: "Error loading tasks",
          description: error instanceof Error ? error.message : "An unknown error occurred",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, toast])

  useEffect(() => {
    let result = [...tasks]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (task) => task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter((task) => task.priority === priorityFilter)
    }

    // Apply assignee filter
    if (assigneeFilter !== "all") {
      result = result.filter((task) => task.assignee_id === Number(assigneeFilter))
    }

    // Apply assigner filter
    if (assignerFilter !== "all") {
      result = result.filter((task) => task.assigner_id === Number(assignerFilter))
    }

    setFilteredTasks(result)
  }, [tasks, searchQuery, statusFilter, priorityFilter, assigneeFilter, assignerFilter])

  // Get unique assigners for filter dropdown
  const uniqueAssigners = Array.from(
    new Set(tasks.map((task) => ({ id: task.assigner_id, name: task.assigner_name }))),
  ).filter((assigner, index, self) => self.findIndex((a) => a.id === assigner.id) === index)

  if (!user) return null

  const isAssigner = user.role === "assigner"

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          {isAssigner && (
            <Link href="/dashboard/create-task">
              <Button className="gap-2 whitespace-nowrap">
                <PlusCircle className="h-4 w-4" />
                Create Task
              </Button>
            </Link>
          )}
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex flex-1 items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                      setPriorityFilter("all")
                      setAssigneeFilter("all")
                      setAssignerFilter("all")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    {assignees.map((assignee) => (
                      <SelectItem key={assignee.id} value={assignee.id.toString()}>
                        {assignee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={assignerFilter} onValueChange={setAssignerFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by assigner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assigners</SelectItem>
                    {uniqueAssigners.map((assigner) => (
                      <SelectItem key={assigner.id} value={assigner.id.toString()}>
                        {assigner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredTasks.length > 0 ? (
              <div className="mt-6 overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Title</TableHead>
                          <TableHead className="whitespace-nowrap">Priority</TableHead>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                          <TableHead className="whitespace-nowrap">Due Date</TableHead>
                          <TableHead className="whitespace-nowrap">Assigned To</TableHead>
                          <TableHead className="whitespace-nowrap">Assigned By</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTasks.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell className="font-medium max-w-[200px] truncate">{task.title}</TableCell>
                            <TableCell>
                              <PriorityBadge priority={task.priority as "low" | "medium" | "high"} />
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={task.status as "pending" | "in-progress" | "completed"} />
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {new Date(task.due_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate">{task.assignee_name}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{task.assigner_name}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/tasks/${task.id}`}>View Details</Link>
                                  </DropdownMenuItem>
                                  {isAssigner && task.assigner_id === Number(user.id) && (
                                    <DropdownMenuItem asChild>
                                      <Link href={`/dashboard/tasks/${task.id}/edit`}>Edit Task</Link>
                                    </DropdownMenuItem>
                                  )}
                                  {!isAssigner && task.assignee_id === Number(user.id) && (
                                    <DropdownMenuItem asChild>
                                      <Link href={`/dashboard/tasks/${task.id}`}>Update Status</Link>
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center mt-6">
                <ClipboardList className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery ||
                  statusFilter !== "all" ||
                  priorityFilter !== "all" ||
                  assigneeFilter !== "all" ||
                  assignerFilter !== "all"
                    ? "Try adjusting your filters to find what you're looking for."
                    : isAssigner
                      ? "You haven't assigned any tasks yet. Create your first task to get started."
                      : "You don't have any tasks assigned to you yet."}
                </p>
                {isAssigner && (
                  <div className="mt-6">
                    <Link href="/dashboard/create-task">
                      <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Create Task
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
