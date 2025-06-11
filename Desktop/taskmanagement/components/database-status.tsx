"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Database, Loader2, RefreshCw, BarChart3, Users, ClipboardList } from "lucide-react"

export function DatabaseStatus() {
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoadingStats(true)
      const response = await fetch("/api/stats")
      const result = await response.json()

      if (result.success) {
        setStats(result)
      }
    } catch (error) {
      console.error("Failed to load stats:", error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Status
        </CardTitle>
        <CardDescription>Neon PostgreSQL database status and statistics.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Database Stats */}
        {stats && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Database Statistics</h4>
              <Button variant="outline" size="sm" onClick={loadStats} disabled={isLoadingStats} className="h-8">
                {isLoadingStats ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Users</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Count:</span>
                  <Badge variant="secondary">{stats.userCount || 0}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Tasks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Count:</span>
                  <Badge variant="secondary">{stats.taskCount || 0}</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Connection:</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Connected
              </Badge>
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Your data is stored in Neon PostgreSQL and is accessible from anywhere on the internet.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <p className="font-medium">Demo Assigner:</p>
              <p className="text-muted-foreground">assigner@example.com</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Demo Assignee:</p>
              <p className="text-muted-foreground">assignee@example.com</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Password: password</p>
        </div>
      </CardContent>
    </Card>
  )
}
