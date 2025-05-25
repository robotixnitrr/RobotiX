// Enhanced API simulation with proper error handling and realistic delays
export class APISimulation {
  private static instance: APISimulation
  private requestCount = 0
  private failureRate = 0.05 // 5% failure rate for realism

  static getInstance(): APISimulation {
    if (!APISimulation.instance) {
      APISimulation.instance = new APISimulation()
    }
    return APISimulation.instance
  }

  private async simulateNetworkDelay(operation: string): Promise<void> {
    this.requestCount++

    // Simulate different delays based on operation type
    const delays = {
      read: 200 + Math.random() * 300, // 200-500ms for reads
      write: 500 + Math.random() * 500, // 500-1000ms for writes
      delete: 300 + Math.random() * 200, // 300-500ms for deletes
    }

    const delay = delays[operation as keyof typeof delays] || 300
    await new Promise((resolve) => setTimeout(resolve, delay))

    // Simulate occasional network failures
    if (Math.random() < this.failureRate) {
      throw new Error(`Network error: Failed to ${operation} data`)
    }
  }

  async simulateRead<T>(data: T, operation = "read"): Promise<T> {
    await this.simulateNetworkDelay(operation)
    return data
  }

  async simulateWrite<T>(data: T, operation = "write"): Promise<T> {
    await this.simulateNetworkDelay(operation)
    return data
  }

  async simulateDelete(operation = "delete"): Promise<void> {
    await this.simulateNetworkDelay(operation)
  }

  // Simulate pagination
  async simulatePagination<T>(
    data: T[],
    page = 1,
    limit = 10,
  ): Promise<{ data: T[]; total: number; page: number; totalPages: number }> {
    await this.simulateNetworkDelay("read")

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = data.slice(startIndex, endIndex)

    return {
      data: paginatedData,
      total: data.length,
      page,
      totalPages: Math.ceil(data.length / limit),
    }
  }

  // Simulate search with debouncing
  async simulateSearch<T>(data: T[], searchTerm: string, searchFields: (keyof T)[]): Promise<T[]> {
    await this.simulateNetworkDelay("read")

    if (!searchTerm.trim()) return data

    const lowercaseSearch = searchTerm.toLowerCase()
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field]
        return typeof value === "string" && value.toLowerCase().includes(lowercaseSearch)
      }),
    )
  }

  // Get request statistics
  getStats() {
    return {
      totalRequests: this.requestCount,
      failureRate: this.failureRate,
      uptime: "99.95%",
    }
  }

  // Reset statistics
  resetStats() {
    this.requestCount = 0
  }

  // Adjust failure rate for testing
  setFailureRate(rate: number) {
    this.failureRate = Math.max(0, Math.min(1, rate))
  }
}

// Enhanced error handling
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code = "INTERNAL_ERROR",
  ) {
    super(message)
    this.name = "APIError"
  }
}

// Retry mechanism
export async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error

      if (attempt === maxRetries) {
        throw lastError
      }

      // Exponential backoff
      const backoffDelay = delay * Math.pow(2, attempt - 1)
      await new Promise((resolve) => setTimeout(resolve, backoffDelay))
    }
  }

  throw lastError!
}

// Cache simulation
export class CacheSimulation {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl = 300000): void {
    // 5 minutes default TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)

    if (!cached) return null

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

export const apiSimulation = APISimulation.getInstance()
export const cacheSimulation = new CacheSimulation()
