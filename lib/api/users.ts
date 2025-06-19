interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export class UsersAPI {
  private static baseUrl = "/api/user"

  static async getUsers(): Promise<APIResponse> {
    try {
      const response = await fetch(this.baseUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching users:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch users",
      }
    }
  }

  static async getUser(id: number): Promise<APIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: "User not found",
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching user:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch user",
      }
    }
  }

  static async getAssignableUsers(currentUserId: number): Promise<APIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/assignable?currentUserId=${currentUserId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching assignable users:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch assignable users",
      }
    }
  }
}
