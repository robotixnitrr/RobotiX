"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ArrowLeft, X, Plus, Save, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import DashboardLayout from "@/components/dashboard-layout"
import { ProjectsAPI } from "@/lib/api/projects"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProjectFormData {
  title: string
  description: string
  longDescription: string
  status: "planning" | "in-progress" | "completed" | "on-hold"
  category: "robotics" | "ai-ml" | "iot" | "automation" | "research" | "competition" | undefined
  priority: "low" | "medium" | "high"
  startDate: string
  endDate: string
  technologies: string[]
  tags: string[]
  budget: string
  progressPercentage: number
  links: {
    github: string
    repository: string
    demo: string
    documentation: string
  }
  teamLeadId: number
  imageUrl: string
  isFeatured: boolean
}

const statusOptions = [
  { value: "planning", label: "Planning", color: "bg-yellow-100 text-yellow-800" },
  { value: "in-progress", label: "In progress", color: "bg-green-100 text-green-800" },
  { value: "completed", label: "Completed", color: "bg-blue-100 text-blue-800" },
  { value: "on-hold", label: "On Hold", color: "bg-gray-100 text-gray-800" },
]

const categoryOptions = [
  { title: "Web Development", value: 'web' },
  { title: "AI/ML", value: "ai-ml" },
  { title: "Research", value: "research" },
  { title: "Robotics", value: "robotics" },
  { title: "IoT", value: "iot" },
  { title: "Automation", value: "automation" },
  { title: "Competition", value: "competition" },
]

const priorityOptions = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800" },
]

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newTech, setNewTech] = useState("")
  const [newTag, setNewTag] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    longDescription: "",
    status: "planning",
    category: undefined,
    priority: "medium",
    startDate: "",
    endDate: "",
    technologies: [],
    tags: [],
    budget: "",
    progressPercentage: 0,
    links: {
      github: "",
      repository: "",
      demo: "",
      documentation: "",
    },
    teamLeadId: 0,
    imageUrl: "",
    isFeatured: false,
  })

  const canEdit = user?.position === "head-coordinator" || user?.position === "overall-coordinator"

  const loadProject = async () => {
    setLoading(true)
    try {
      const projectResponse = await ProjectsAPI.getProject(Number(params.id))

      if (projectResponse.success && projectResponse.data) {
        const project = projectResponse.data
        setFormData({
          title: project.title || "",
          description: project.description || "",
          longDescription: project.longDescription || "",
          status: project.status || "planning",
          category: project.category || "",
          priority: project.priority || "medium",
          startDate: project.startDate || "",
          endDate: project.endDate || "",
          technologies: project.technologies || [],
          tags: project.tags || [],
          budget: project.budget?.toString() || "",
          progressPercentage: project.progressPercentage || 0,
          links: {
            github: project.githubUrl || "",
            repository: project.repositoryUrl || "",
            demo: project.demoUrl || "",
            documentation: project.documentationUrl || "",
          },
          teamLeadId: project.teamLeadId || 0,
          imageUrl: project.imageUrl || "",
          isFeatured: project.isFeatured || false,
        })
      } else {
        toast({
          title: "Error",
          description: projectResponse.error || "Failed to load project",
          variant: "destructive",
        })
        router.push("/dashboard/projects")
      }
    } catch (error) {
      console.error("Error loading project:", error)
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive",
      })
      router.push("/dashboard/projects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!canEdit) {
      router.push("/dashboard/projects")
      return
    }

    loadProject()
  }, [canEdit, router, params.id])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Project description is required"
    }

    if (!formData.category) {
      newErrors.category = "Project category is required"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "End date must be after start date"
    }

    if (formData.budget && isNaN(Number(formData.budget))) {
      newErrors.budget = "Budget must be a valid number"
    }

    if (formData.progressPercentage < 0 || formData.progressPercentage > 100) {
      newErrors.progressPercentage = "Progress must be between 0 and 100"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTech.trim()],
      })
      setNewTech("")
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    })
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        longDescription: formData.longDescription,
        status: formData.status,
        category: formData.category,
        priority: formData.priority,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        technologies: formData.technologies,
        tags: formData.tags,
        budget: formData.budget ? Number(formData.budget) : undefined,
        progressPercentage: formData.progressPercentage,
        githubUrl: formData.links.github || undefined,
        repositoryUrl: formData.links.repository || undefined,
        demoUrl: formData.links.demo || undefined,
        documentationUrl: formData.links.documentation || undefined,
        imageUrl: formData.imageUrl || undefined,
        isFeatured: formData.isFeatured,
      }

      const response = await ProjectsAPI.updateProject(Number(params.id), updateData)

      if (response.success) {
        toast({
          title: "Success",
          description: "Project updated successfully",
        })
        router.push(`/dashboard/projects/${params.id}`)
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update project",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (!canEdit) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">You don't have permission to edit projects.</p>
              <Link href="/dashboard/projects">
                <Button variant="outline" className="w-full">
                  Back to Projects
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/projects/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Project</h1>
            <p className="text-muted-foreground">Update project details and settings</p>
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please fix the following errors: {Object.values(errors).join(", ")}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={errors.title ? "border-red-500" : ""}
                      required
                    />
                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <Label htmlFor="description">Short Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className={errors.description ? "border-red-500" : ""}
                      required
                    />
                    {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <Label htmlFor="longDescription">Detailed Description</Label>
                    <Textarea
                      id="longDescription"
                      value={formData.longDescription}
                      onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                      rows={6}
                      placeholder="Provide a comprehensive description of the project..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="imageUrl">Project Image URL</Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Technologies */}
              <Card>
                <CardHeader>
                  <CardTitle>Technologies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add technology..."
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTechnology())}
                    />
                    <Button type="button" onClick={handleAddTechnology}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTechnology(tech)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" onClick={handleAddTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Project Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="github">GitHub Repository</Label>
                    <Input
                      id="github"
                      type="url"
                      placeholder="https://github.com/..."
                      value={formData.links.github}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: { ...formData.links, github: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="repository">Repository URL</Label>
                    <Input
                      id="repository"
                      type="url"
                      placeholder="https://gitlab.com/... or other repository"
                      value={formData.links.repository}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: { ...formData.links, repository: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="demo">Live Demo</Label>
                    <Input
                      id="demo"
                      type="url"
                      placeholder="https://demo.example.com"
                      value={formData.links.demo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: { ...formData.links, demo: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="documentation">Documentation</Label>
                    <Input
                      id="documentation"
                      type="url"
                      placeholder="https://docs.example.com"
                      value={formData.links.documentation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          links: { ...formData.links, documentation: e.target.value },
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${option.color}`} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: (value as "robotics" | "ai-ml" | "iot" | "automation" | "research" | "competition" | undefined) })}
                    >
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${option.color}`} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={errors.startDate ? "border-red-500" : ""}
                      required
                    />
                    {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>}
                  </div>

                  <div>
                    <Label htmlFor="endDate">Expected End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className={errors.endDate ? "border-red-500" : ""}
                    />
                    {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>}
                  </div>

                  <div>
                    <Label htmlFor="budget">Budget ($)</Label>
                    <Input
                      id="budget"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className={errors.budget ? "border-red-500" : ""}
                    />
                    {errors.budget && <p className="text-sm text-red-500 mt-1">{errors.budget}</p>}
                  </div>

                  <div>
                    <Label htmlFor="progress">Progress Percentage</Label>
                    <Input
                      id="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progressPercentage}
                      onChange={(e) => setFormData({ ...formData, progressPercentage: Number(e.target.value) })}
                      className={errors.progressPercentage ? "border-red-500" : ""}
                    />
                    {errors.progressPercentage && (
                      <p className="text-sm text-red-500 mt-1">{errors.progressPercentage}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="featured">Featured Project</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href={`/dashboard/projects/${params.id}`}>Cancel</Link>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
