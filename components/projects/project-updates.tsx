"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { ProjectsAPI } from "@/lib/api/projects"
import { MessageSquare, Send, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Update the interface and component logic
interface ProjectUpdate {
    id: number
    title: string
    description?: string
    updateType?: string
    createdAt: string
    user: {
        id: number
        name: string
        email: string
        avatarUrl?: string
    }
}

interface ProjectUpdatesProps {
    projectId: number
    canEdit: boolean
    initialUpdates: ProjectUpdate[]
}

export function ProjectUpdates({ projectId, canEdit, initialUpdates }: ProjectUpdatesProps) {
    const [updates, setUpdates] = useState<ProjectUpdate[]>(initialUpdates)
    // Update the form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        updateType: "general",
    })
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
    const { toast } = useToast()

    useEffect(() => {
        setUpdates(initialUpdates)
    }, [initialUpdates])

    // Update the handleAddUpdate function
    const handleAddUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title.trim() || !formData.description.trim()) return

        setLoading(true)
        try {
            const response = await ProjectsAPI.createProjectUpdate(projectId, {
                title: formData.title.trim(),
                description: formData.description.trim(),
                updateType: formData.updateType,
            })

            if (response.success) {
                // Add the new update to the beginning of the list
                const updatedList = [response.data, ...updates]
                setUpdates(updatedList)
                setFormData({ title: "", description: "", updateType: "general" })
                toast({
                    title: "Success",
                    description: "Update posted successfully",
                })
            } else {
                toast({
                    title: "Error",
                    description: response.error || "Failed to post update",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to post update",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Add Update Form */}
            {canEdit && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Post Update</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Update the form JSX */}
                        <form onSubmit={handleAddUpdate} className="space-y-4">
                            <div>
                                <Label htmlFor="title">Update Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Brief title for this update..."
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Share project progress, announcements, or important information..."
                                    rows={3}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="updateType">Update Type</Label>
                                <Select
                                    value={formData.updateType}
                                    onValueChange={(value) => setFormData({ ...formData, updateType: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General Update</SelectItem>
                                        <SelectItem value="milestone">Milestone</SelectItem>
                                        <SelectItem value="announcement">Announcement</SelectItem>
                                        <SelectItem value="issue">Issue</SelectItem>
                                        <SelectItem value="achievement">Achievement</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={loading || !formData.title.trim() || !formData.description.trim()}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Post Update
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Updates List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Recent Activity
                </h3>

                {updates.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground">No updates yet</p>
                            {canEdit && (
                                <p className="text-sm text-muted-foreground mt-1">Post the first update to keep the team informed</p>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {/* Update the display of updates */}
                        {updates.map((update) => (
                            <Card key={update.id}>
                                <CardContent className="p-4">
                                    <div className="flex gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={update.user.avatarUrl || "/placeholder.svg"} alt={update.user.name} />
                                            <AvatarFallback>
                                                {update.user.name
                                                    .split(" ")
                                                    .map((n: string) => n[0])
                                                    .join("")
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium text-sm">{update.user.name}</p>
                                                {update.updateType && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {update.updateType}
                                                    </Badge>
                                                )}
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <h4 className="font-medium text-sm mb-1">{update.title}</h4>
                                            {update.description && (
                                                <p className="text-sm leading-relaxed text-muted-foreground">{update.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
