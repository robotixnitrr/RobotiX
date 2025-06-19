import type { ProjectQueryInput, CreateProjectInput, UpdateProjectInput } from "@/lib/validations/project"
import type { ProjectWithDetails } from "@/db/schema"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: any
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class ProjectsAPI {
  private static baseUrl = "/api/projects"

  static async getProjects(params?: Partial<ProjectQueryInput>) {
    try {
      const searchParams = new URLSearchParams()

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value))
          }
        })
      }

      const url = `${this.baseUrl}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching projects:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch projects",
      }
    }
  }

  static async getProject(id: number) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: "Project not found",
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const res = await response.json()
      return res
    } catch (error) {
      console.error("Error fetching project:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch project",
      }
    }
  }

  static async createProject(data: CreateProjectInput): Promise<ApiResponse<ProjectWithDetails>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Failed to create project",
          details: result.details,
        }
      }

      return result
    } catch (error) {
      console.error("Error creating project:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create project",
      }
    }
  }

  static async updateProject(id: number, data: Partial<UpdateProjectInput>): Promise<ApiResponse<ProjectWithDetails>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Failed to update project",
          details: result.details,
        }
      }

      return result
    } catch (error) {
      console.error("Error updating project:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update project",
      }
    }
  }

  static async deleteProject(id: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Failed to delete project",
          details: result.details,
        }
      }

      return result
    } catch (error) {
      console.error("Error deleting project:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete project",
      }
    }
  }

  static async getProjectStats(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching project stats:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch project statistics",
      }
    }
  }

  // Milestone related methods
  static async getProjectMilestones(projectId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${projectId}/milestones`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching project milestones:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch project milestones",
      }
    }
  }

  static async createMilestone(
    projectId: number,
    data: {
      title: string
      description?: string
      date: string
      completed?: boolean
    },
  ): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${projectId}/milestones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating milestone:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create milestone",
      }
    }
  }

  static async updateMilestone(
    projectId: number,
    milestoneId: number,
    data: {
      title?: string
      description?: string
      date?: string
      completed?: boolean
    },
  ): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${projectId}/milestones/${milestoneId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating milestone:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update milestone",
      }
    }
  }

  static async deleteMilestone(projectId: number, milestoneId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${projectId}/milestones/${milestoneId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error deleting milestone:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete milestone",
      }
    }
  }

  // Project members related methods
  static async getProjectMembers(projectId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${projectId}/members`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching project members:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch project members",
      }
    }
  }

  static async addProjectMember(
    projectId: number,
    data: {
      userId: number
      role?: string
    },
  ): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${projectId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error adding project member:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to add project member",
      }
    }
  }

  static async removeProjectMember(projectId: number, userId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${projectId}/members/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error removing project member:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to remove project member",
      }
    }
  }

  static async createProjectUpdate(
    projectId: number,
    data: {
      title: string
      description: string
      updateType?: string
    },
  ): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${projectId}/updates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating project update:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create project update",
      }
    }
  }

  static async getProjectUpdates(projectId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${projectId}/updates`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching project updates:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch project updates",
      }
    }
  }
}

