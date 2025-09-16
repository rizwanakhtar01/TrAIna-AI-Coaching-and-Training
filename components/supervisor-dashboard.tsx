"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  AlertTriangle,
  BarChart3,
  Download,
  Award,
  BookOpen,
  LogOut,
  Eye,
  ArrowRight,
  Star,
} from "lucide-react"

interface SupervisorDashboardProps {
  onLogout: () => void
}

export function SupervisorDashboard({ onLogout }: SupervisorDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeFilter, setTimeFilter] = useState("weekly")
  const [agentFilter, setAgentFilter] = useState("all")

  // Mock data for team analytics
  const teamStats = {
    totalAgents: 12,
    activeToday: 10,
    avgScore: 8.4,
    completionRate: 78,
    atRiskAgents: 3,
  }

  const challengingPatterns = [
    { issue: "Refund Processing", frequency: 45, trend: "up", agents: ["Sarah M.", "John D.", "Mike R."] },
    { issue: "Billing Inquiries", frequency: 38, trend: "down", agents: ["Lisa K.", "Tom W."] },
    { issue: "Product Support", frequency: 32, trend: "stable", agents: ["Emma L.", "David P.", "Anna S."] },
    { issue: "Account Management", frequency: 28, trend: "up", agents: ["Chris B.", "Maria G."] },
  ]

  const agentProgress = [
    {
      name: "Sarah Mitchell",
      id: "SM001",
      sessionsCompleted: 8,
      lastSession: "2 hours ago",
      improvementAreas: ["Empathy", "Resolution Time"],
      overallScore: 8.7,
      trend: "up",
      status: "on-track",
    },
    {
      name: "John Davis",
      id: "JD002",
      sessionsCompleted: 3,
      lastSession: "1 day ago",
      improvementAreas: ["Policy Compliance", "Customer Satisfaction"],
      overallScore: 7.2,
      trend: "down",
      status: "at-risk",
    },
    {
      name: "Lisa Kim",
      id: "LK003",
      sessionsCompleted: 12,
      lastSession: "30 minutes ago",
      improvementAreas: ["Response Speed"],
      overallScore: 9.1,
      trend: "up",
      status: "excellent",
    },
    {
      name: "Mike Rodriguez",
      id: "MR004",
      sessionsCompleted: 6,
      lastSession: "4 hours ago",
      improvementAreas: ["Refund Processing", "Empathy"],
      overallScore: 8.0,
      trend: "stable",
      status: "on-track",
    },
  ]

  const improvementMetrics = [
    { metric: "Customer Satisfaction", before: 82, after: 89, improvement: 7 },
    { metric: "First Call Resolution", before: 74, after: 81, improvement: 7 },
    { metric: "Average Handle Time", before: 6.2, after: 5.4, improvement: -0.8 },
    { metric: "Empathy Score", before: 7.8, after: 8.5, improvement: 0.7 },
  ]

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
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
              Supervisor View
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Team Lead - Customer Support</span>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs font-medium text-blue-800">TL</span>
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
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-zinc-100">
              <TabsTrigger value="overview">Team Overview</TabsTrigger>
              <TabsTrigger value="patterns">Challenge Patterns</TabsTrigger>
              <TabsTrigger value="progress">Agent Progress</TabsTrigger>
              <TabsTrigger value="insights">Improvement Insights</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Team Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamStats.totalAgents}</div>
                  <p className="text-xs text-muted-foreground">{teamStats.activeToday} active today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Average Score</CardTitle>
                  <Star className="h-4 w-4 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamStats.avgScore}/10</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +0.2 this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Coaching Completion</CardTitle>
                  <BookOpen className="h-4 w-4 text-chart-1" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamStats.completionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +5% this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">At Risk Agents</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{teamStats.atRiskAgents}</div>
                  <p className="text-xs text-muted-foreground">Need immediate attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
                  <Award className="h-4 w-4 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">Above 9.0 score</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab("patterns")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Urgent Issues</h4>
                      <p className="text-sm text-muted-foreground">3 patterns need attention</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab("progress")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-chart-1" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Agent Reviews</h4>
                      <p className="text-sm text-muted-foreground">5 pending this week</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab("insights")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-chart-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Team Insights</h4>
                      <p className="text-sm text-muted-foreground">Weekly improvement report</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Challenging Patterns</h2>
                <p className="text-muted-foreground">Aggregate view of recurring issues across your team</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={agentFilter} onValueChange={setAgentFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    <SelectItem value="at-risk">At Risk Only</SelectItem>
                    <SelectItem value="top-performers">Top Performers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              {challengingPatterns.map((pattern, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{pattern.issue}</h3>
                          <Badge
                            variant={
                              pattern.trend === "up"
                                ? "destructive"
                                : pattern.trend === "down"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {pattern.trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                            {pattern.trend === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
                            {pattern.frequency} occurrences
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Affected agents:</span>
                          {pattern.agents.map((agent, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {agent}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Agent Progress Tracker</h2>
                <p className="text-muted-foreground">Individual coaching progress and performance metrics</p>
              </div>
            </div>

            <div className="grid gap-4">
              {agentProgress.map((agent, index) => (
                <Card key={index} className={agent.status === "at-risk" ? "border-destructive/50" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-medium text-primary">
                            {agent.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{agent.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {agent.id} • Last session: {agent.lastSession}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">{agent.sessionsCompleted}</div>
                          <p className="text-xs text-muted-foreground">Sessions</p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center gap-1">
                            <span className="text-2xl font-bold text-foreground">{agent.overallScore}</span>
                            {agent.trend === "up" && <TrendingUp className="h-4 w-4 text-chart-4" />}
                            {agent.trend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
                          </div>
                          <p className="text-xs text-muted-foreground">Overall Score</p>
                        </div>

                        <Badge
                          variant={
                            agent.status === "excellent"
                              ? "default"
                              : agent.status === "at-risk"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {agent.status === "excellent" && "Excellent"}
                          {agent.status === "at-risk" && "At Risk"}
                          {agent.status === "on-track" && "On Track"}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">Focus Areas:</p>
                          <div className="flex gap-2">
                            {agent.improvementAreas.map((area, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Progress
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Improvement Insights</h2>
                <p className="text-muted-foreground">Before vs After coaching performance comparison</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {improvementMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{metric.metric}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Before Coaching</span>
                      <span className="font-medium">
                        {metric.before}
                        {metric.metric.includes("Time") ? " min" : "%"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">After Coaching</span>
                      <span className="font-medium">
                        {metric.after}
                        {metric.metric.includes("Time") ? " min" : "%"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm font-medium">Improvement</span>
                      <div className="flex items-center gap-1">
                        {metric.improvement > 0 ? (
                          <TrendingUp className="h-4 w-4 text-chart-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-chart-4" />
                        )}
                        <span className="font-bold text-chart-4">
                          {metric.improvement > 0 ? "+" : ""}
                          {metric.improvement}
                          {metric.metric.includes("Time") ? " min" : metric.metric.includes("Score") ? "" : "%"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Team Summary</CardTitle>
                <CardDescription>Export detailed progress report for management review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Last generated: March 15, 2024</p>
                    <p className="text-xs text-muted-foreground">
                      Includes all agent metrics, coaching completion rates, and improvement trends
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
