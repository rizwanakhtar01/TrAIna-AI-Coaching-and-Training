"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Bot,
  Plus,
  Upload,
  Edit,
  Trash2,
  LogOut,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
  Database,
  Brain,
  Activity,
} from "lucide-react"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newAgent, setNewAgent] = useState({
    intentName: "",
    description: "",
    instructions: "",
    knowledgeBase: null as File | null,
  })

  // Mock data for AI agents
  const aiAgents = [
    {
      id: "agent-001",
      intentName: "Refunds & Returns",
      description: "Handles customer refund requests and return processing",
      status: "active",
      lastUpdated: "2024-03-15",
      knowledgeBaseSize: "2.3 MB",
      trainingAccuracy: 94,
      usageCount: 1247,
    },
    {
      id: "agent-002",
      intentName: "Billing Inquiries",
      description: "Assists with billing questions and payment issues",
      status: "active",
      lastUpdated: "2024-03-14",
      knowledgeBaseSize: "1.8 MB",
      trainingAccuracy: 91,
      usageCount: 892,
    },
    {
      id: "agent-003",
      intentName: "Product Support",
      description: "Provides technical support and product guidance",
      status: "training",
      lastUpdated: "2024-03-16",
      knowledgeBaseSize: "3.1 MB",
      trainingAccuracy: 87,
      usageCount: 634,
    },
    {
      id: "agent-004",
      intentName: "Account Management",
      description: "Handles account changes and subscription management",
      status: "inactive",
      lastUpdated: "2024-03-10",
      knowledgeBaseSize: "1.5 MB",
      trainingAccuracy: 89,
      usageCount: 423,
    },
  ]

  const systemStats = {
    totalAgents: aiAgents.length,
    activeAgents: aiAgents.filter((a) => a.status === "active").length,
    totalInteractions: aiAgents.reduce((sum, agent) => sum + agent.usageCount, 0),
    avgAccuracy: Math.round(aiAgents.reduce((sum, agent) => sum + agent.trainingAccuracy, 0) / aiAgents.length),
  }

  const handleCreateAgent = () => {
    // Handle agent creation logic here
    console.log("Creating new AI agent:", newAgent)
    setIsCreateDialogOpen(false)
    setNewAgent({ intentName: "", description: "", instructions: "", knowledgeBase: null })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewAgent({ ...newAgent, knowledgeBase: file })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <Target className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">OmniHive Coaching and Training</h1>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 font-medium">
              Admin View
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>System Administrator</span>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xs font-medium text-purple-800">SA</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full grid-cols-3 lg:w-[450px] bg-zinc-100">
              <TabsTrigger value="overview">System Overview</TabsTrigger>
              <TabsTrigger value="agents">AI Agent Management</TabsTrigger>
              <TabsTrigger value="training">Training History</TabsTrigger>
            </TabsList>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create AI Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New AI Agent</DialogTitle>
                  <DialogDescription>
                    Configure a new AI coaching agent for specific customer service intents
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="intentName">Intent Name</Label>
                    <Input
                      id="intentName"
                      placeholder="e.g., Subscription Cancellations"
                      value={newAgent.intentName}
                      onChange={(e) => setNewAgent({ ...newAgent, intentName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of what this agent handles"
                      value={newAgent.description}
                      onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Specific Instructions</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Guidelines for LLM training, e.g., 'Always prioritize empathy before policy explanation'"
                      rows={4}
                      value={newAgent.instructions}
                      onChange={(e) => setNewAgent({ ...newAgent, instructions: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="knowledgeBase">Knowledge Base Upload</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="knowledgeBase"
                        type="file"
                        accept=".pdf,.csv,.txt,.docx"
                        onChange={handleFileUpload}
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    {newAgent.knowledgeBase && (
                      <p className="text-sm text-muted-foreground">Selected: {newAgent.knowledgeBase.name}</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAgent}>Create Agent</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* System Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total AI Agents</CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.totalAgents}</div>
                  <p className="text-xs text-muted-foreground">{systemStats.activeAgents} active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
                  <Activity className="h-4 w-4 text-chart-1" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.totalInteractions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
                  <Brain className="h-4 w-4 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.avgAccuracy}%</div>
                  <p className="text-xs text-muted-foreground">Across all agents</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Knowledge Base Size</CardTitle>
                  <Database className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.7 MB</div>
                  <p className="text-xs text-muted-foreground">Total storage used</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
                <CardDescription>Latest updates and training activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-chart-4/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-chart-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Product Support agent training completed</p>
                      <p className="text-xs text-muted-foreground">2 hours ago • Accuracy improved to 87%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-chart-1/10 flex items-center justify-center">
                      <Upload className="h-4 w-4 text-chart-1" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New knowledge base uploaded for Billing Inquiries</p>
                      <p className="text-xs text-muted-foreground">1 day ago • 1.2 MB added</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-chart-2/10 flex items-center justify-center">
                      <Plus className="h-4 w-4 text-chart-2" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Refunds & Returns agent created</p>
                      <p className="text-xs text-muted-foreground">3 days ago • Initial training in progress</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">AI Agent Management</h2>
                <p className="text-muted-foreground">Manage your AI coaching agents and their configurations</p>
              </div>
            </div>

            <div className="grid gap-4">
              {aiAgents.map((agent) => (
                <Card key={agent.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{agent.intentName}</h3>
                          <p className="text-sm text-muted-foreground">{agent.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Last updated: {agent.lastUpdated}</span>
                            <span>Knowledge base: {agent.knowledgeBaseSize}</span>
                            <span>Usage: {agent.usageCount} interactions</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-foreground">{agent.trainingAccuracy}%</div>
                          <p className="text-xs text-muted-foreground">Accuracy</p>
                        </div>

                        <Badge
                          variant={
                            agent.status === "active"
                              ? "default"
                              : agent.status === "training"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {agent.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {agent.status === "training" && <Clock className="h-3 w-3 mr-1" />}
                          {agent.status === "inactive" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </Badge>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retrain
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Training History</h2>
                <p className="text-muted-foreground">Track AI agent training sessions and performance improvements</p>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export History
              </Button>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Product Support Agent</CardTitle>
                      <CardDescription>Training completed 2 hours ago</CardDescription>
                    </div>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Training Duration</p>
                      <p className="text-2xl font-bold">2h 34m</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Accuracy Improvement</p>
                      <p className="text-2xl font-bold text-chart-4">+3%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Data Points Processed</p>
                      <p className="text-2xl font-bold">1,247</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Billing Inquiries Agent</CardTitle>
                      <CardDescription>Training completed 1 day ago</CardDescription>
                    </div>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Training Duration</p>
                      <p className="text-2xl font-bold">1h 52m</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Accuracy Improvement</p>
                      <p className="text-2xl font-bold text-chart-4">+5%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Data Points Processed</p>
                      <p className="text-2xl font-bold">892</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Refunds & Returns Agent</CardTitle>
                      <CardDescription>Training failed 3 days ago</CardDescription>
                    </div>
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Failed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Training failed due to insufficient data quality. Please review and re-upload knowledge base.
                    </p>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Training
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
