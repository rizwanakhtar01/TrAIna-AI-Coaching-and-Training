"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
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
  Clock,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Activity,
  FileText,
  Filter,
  Bell,
  BellOff,
  Edit3,
  Save,
  ArrowLeft,
} from "lucide-react"

// Comprehensive data models for supervisor dashboard
interface Agent {
  id: string
  name: string
  email: string
  avatar: string
  sessionsCompleted: number
  sessionsTarget: number
  averageScore: number
  previousScore: number
  engagementTime: number // in minutes
  status: 'excellent' | 'good' | 'needs-attention' | 'at-risk'
  lastSession: string
  improvementAreas: string[]
  notes: string
}

interface ChallengingPattern {
  id: string
  name: string
  category: string
  errorRate: number
  frequency: number
  trend: 'up' | 'down' | 'stable'
  affectedAgents: string[]
  intents: string[]
  channels: string[]
  dateRange: string
}

interface CoachingSession {
  id: string
  agentId: string
  date: string
  scenario: string
  score: number
  duration: number
  feedback: string
  skillsImproved: string[]
}

interface Alert {
  id: string
  type: 'warning' | 'error' | 'info'
  title: string
  message: string
  agentId?: string
  timestamp: string
  isRead: boolean
}

interface SupervisorDashboardProps {
  onLogout: () => void
}

export function SupervisorDashboard({ onLogout }: SupervisorDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [timeFilter, setTimeFilter] = useState("weekly")
  const [agentFilter, setAgentFilter] = useState("all")
  const [intentFilter, setIntentFilter] = useState("all")
  const [channelFilter, setChannelFilter] = useState("all")
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [newNote, setNewNote] = useState("")
  const [showAlerts, setShowAlerts] = useState(false)
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null)
  const [showPatternDetails, setShowPatternDetails] = useState(false)

  // Comprehensive mock data for supervisor dashboard
  const agents: Agent[] = [
    {
      id: 'AGT001',
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@company.com',
      avatar: 'SM',
      sessionsCompleted: 8,
      sessionsTarget: 10,
      averageScore: 8.7,
      previousScore: 8.2,
      engagementTime: 245,
      status: 'excellent',
      lastSession: '2 hours ago',
      improvementAreas: ['Empathy', 'Resolution Time'],
      notes: 'Excellent progress on empathy training. Shows consistent improvement.'
    },
    {
      id: 'AGT002',
      name: 'John Davis',
      email: 'john.davis@company.com',
      avatar: 'JD',
      sessionsCompleted: 3,
      sessionsTarget: 10,
      averageScore: 7.2,
      previousScore: 7.8,
      engagementTime: 145,
      status: 'at-risk',
      lastSession: '1 day ago',
      improvementAreas: ['Policy Compliance', 'Customer Satisfaction'],
      notes: 'Needs immediate attention. Missing sessions regularly.'
    },
    {
      id: 'AGT003',
      name: 'Lisa Kim',
      email: 'lisa.kim@company.com',
      avatar: 'LK',
      sessionsCompleted: 12,
      sessionsTarget: 10,
      averageScore: 9.1,
      previousScore: 8.8,
      engagementTime: 320,
      status: 'excellent',
      lastSession: '30 minutes ago',
      improvementAreas: ['Response Speed'],
      notes: 'Top performer. Consider for mentoring role.'
    },
    {
      id: 'AGT004',
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@company.com',
      avatar: 'MR',
      sessionsCompleted: 6,
      sessionsTarget: 10,
      averageScore: 8.0,
      previousScore: 7.9,
      engagementTime: 190,
      status: 'good',
      lastSession: '4 hours ago',
      improvementAreas: ['Refund Processing', 'Empathy'],
      notes: 'Steady improvement in refund handling scenarios.'
    },
    {
      id: 'AGT005',
      name: 'Emma Wilson',
      email: 'emma.wilson@company.com',
      avatar: 'EW',
      sessionsCompleted: 5,
      sessionsTarget: 10,
      averageScore: 7.8,
      previousScore: 7.5,
      engagementTime: 165,
      status: 'needs-attention',
      lastSession: '6 hours ago',
      improvementAreas: ['Technical Support', 'Confidence'],
      notes: 'Improving but needs more practice with technical scenarios.'
    },
    {
      id: 'AGT006',
      name: 'David Chen',
      email: 'david.chen@company.com',
      avatar: 'DC',
      sessionsCompleted: 9,
      sessionsTarget: 10,
      averageScore: 8.5,
      previousScore: 8.1,
      engagementTime: 275,
      status: 'excellent',
      lastSession: '1 hour ago',
      improvementAreas: ['Billing Inquiries'],
      notes: 'Strong performance across all metrics. Great team player.'
    }
  ]

  const challengingPatterns: ChallengingPattern[] = [
    {
      id: 'CP001',
      name: 'Refund Processing',
      category: 'Financial',
      errorRate: 23,
      frequency: 145,
      trend: 'up',
      affectedAgents: ['AGT001', 'AGT002', 'AGT004'],
      intents: ['process_refund', 'refund_status', 'cancel_order'],
      channels: ['phone', 'chat', 'email'],
      dateRange: 'Last 7 days'
    },
    {
      id: 'CP002',
      name: 'Billing Inquiries',
      category: 'Financial',
      errorRate: 18,
      frequency: 98,
      trend: 'down',
      affectedAgents: ['AGT005', 'AGT006'],
      intents: ['billing_question', 'payment_issue', 'invoice_dispute'],
      channels: ['phone', 'chat'],
      dateRange: 'Last 7 days'
    },
    {
      id: 'CP003',
      name: 'Technical Support',
      category: 'Technical',
      errorRate: 31,
      frequency: 76,
      trend: 'stable',
      affectedAgents: ['AGT003', 'AGT005'],
      intents: ['tech_support', 'troubleshooting', 'setup_help'],
      channels: ['chat', 'email'],
      dateRange: 'Last 7 days'
    }
  ]

  const coachingSessions: CoachingSession[] = [
    {
      id: 'CS001',
      agentId: 'AGT001',
      date: '2025-03-15',
      scenario: 'Empathy Training - Difficult Refund',
      score: 8.5,
      duration: 35,
      feedback: 'Great improvement in showing empathy while maintaining policy compliance.',
      skillsImproved: ['Empathy', 'Active Listening']
    },
    {
      id: 'CS002',
      agentId: 'AGT002',
      date: '2025-03-14',
      scenario: 'Policy Compliance - Billing Dispute',
      score: 6.8,
      duration: 28,
      feedback: 'Needs more practice with policy explanations.',
      skillsImproved: ['Policy Knowledge']
    }
  ]

  const alerts: Alert[] = [
    {
      id: 'AL001',
      type: 'warning',
      title: 'Agent Missing Sessions',
      message: 'John Davis has missed 3 scheduled coaching sessions this week.',
      agentId: 'AGT002',
      timestamp: '2 hours ago',
      isRead: false
    },
    {
      id: 'AL002',
      type: 'error',
      title: 'Recurring Pattern Alert',
      message: 'Refund Processing errors increased by 15% this week.',
      timestamp: '4 hours ago',
      isRead: false
    },
    {
      id: 'AL003',
      type: 'info',
      title: 'Weekly Report Ready',
      message: 'Team coaching summary for Week 11 is ready for export.',
      timestamp: '1 day ago',
      isRead: true
    }
  ]

  const teamOverviewData = {
    totalAgentsCoached: agents.filter(a => a.sessionsCompleted > 0).length,
    topChallenges: challengingPatterns.slice(0, 3),
    teamImprovementPercent: 12,
    previousWeekImprovement: 8
  }

  const performanceTimelineData = [
    { week: 'Week 8', score: 7.8, sessions: 45 },
    { week: 'Week 9', score: 8.1, sessions: 52 },
    { week: 'Week 10', score: 8.3, sessions: 58 },
    { week: 'Week 11', score: 8.6, sessions: 61 }
  ]

  // Helper functions
  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'needs-attention': return 'text-yellow-600'
      case 'at-risk': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBadge = (status: Agent['status']) => {
    switch (status) {
      case 'excellent': return { variant: 'default' as const, icon: '🟢', text: 'Excellent' }
      case 'good': return { variant: 'secondary' as const, icon: '🟢', text: 'Good' }
      case 'needs-attention': return { variant: 'outline' as const, icon: '🟡', text: 'Needs Attention' }
      case 'at-risk': return { variant: 'destructive' as const, icon: '🔴', text: 'At Risk' }
      default: return { variant: 'secondary' as const, icon: '⚪', text: 'Unknown' }
    }
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const getEngagementLevel = (minutes: number) => {
    if (minutes >= 200) return { level: 'High', color: 'text-green-600', percent: 100 }
    if (minutes >= 150) return { level: 'Medium', color: 'text-yellow-600', percent: 70 }
    return { level: 'Low', color: 'text-red-600', percent: 40 }
  }

  const saveNote = (agentId: string) => {
    // In real implementation, this would save to backend
    const agent = agents.find(a => a.id === agentId)
    if (agent) {
      agent.notes = newNote
    }
    setEditingNotes(null)
    setNewNote('')
  }

  const unreadAlertsCount = alerts.filter(a => !a.isRead).length

  // Export functionality
  const exportToPDF = () => {
    // In real implementation, this would use a library like jsPDF
    console.log('Exporting to PDF...')
    // Mock export functionality
    const blob = new Blob(['PDF Export Placeholder'], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `supervisor-report-${new Date().toISOString().split('T')[0]}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToCSV = () => {
    const csvData = agents.map(agent => ({
      Name: agent.name,
      Email: agent.email,
      'Sessions Completed': agent.sessionsCompleted,
      'Sessions Target': agent.sessionsTarget,
      'Average Score': agent.averageScore,
      'Previous Score': agent.previousScore,
      'Engagement Time (min)': agent.engagementTime,
      Status: agent.status,
      'Last Session': agent.lastSession,
      'Improvement Areas': agent.improvementAreas.join('; '),
      Notes: agent.notes
    }))

    const headers = Object.keys(csvData[0])
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `supervisor-report-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Filter functions
  const getFilteredPatterns = () => {
    return challengingPatterns.filter(pattern => {
      if (agentFilter !== 'all') {
        const agentIds = pattern.affectedAgents
        if (agentFilter === 'at-risk') {
          const atRiskAgentIds = agents.filter(a => a.status === 'at-risk').map(a => a.id)
          if (!agentIds.some(id => atRiskAgentIds.includes(id))) return false
        }
        if (agentFilter === 'top') {
          const topAgentIds = agents.filter(a => a.status === 'excellent').map(a => a.id)
          if (!agentIds.some(id => topAgentIds.includes(id))) return false
        }
      }
      
      if (intentFilter !== 'all') {
        if (!pattern.intents.some(intent => intent.includes(intentFilter))) return false
      }
      
      if (channelFilter !== 'all') {
        if (!pattern.channels.includes(channelFilter)) return false
      }
      
      return true
    })
  }

  const getFilteredAgents = () => {
    return agents.filter(agent => {
      if (agentFilter === 'at-risk') return agent.status === 'at-risk'
      if (agentFilter === 'top') return agent.status === 'excellent'
      if (agentFilter === 'affected' && selectedPattern) {
        const pattern = challengingPatterns.find(p => p.id === selectedPattern)
        return pattern ? pattern.affectedAgents.includes(agent.id) : true
      }
      return true
    })
  }

  // If viewing agent detail, show that page
  if (selectedAgent) {
    const agent = agents.find(a => a.id === selectedAgent)
    if (!agent) return null

    const agentSessions = coachingSessions.filter(s => s.agentId === selectedAgent)
    const engagement = getEngagementLevel(agent.engagementTime)
    const statusBadge = getStatusBadge(agent.status)

    return (
      <div className="space-y-6">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedAgent(null)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Progress
              </Button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                  <Target className="h-4 w-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-semibold text-foreground">Agent Progress Detail</h1>
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

        <div className="p-6 space-y-6">
          {/* Agent Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{agent.avatar}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{agent.name}</h2>
                <p className="text-muted-foreground">{agent.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge {...statusBadge}>
                    {statusBadge.icon} {statusBadge.text}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Last session: {agent.lastSession}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">{agent.averageScore}</div>
              <div className="flex items-center gap-1">
                {getTrendIcon(agent.averageScore, agent.previousScore)}
                <span className="text-sm text-muted-foreground">Current Score</span>
              </div>
            </div>
          </div>

          {/* Performance Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>Weekly trend chart showing score improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis domain={[7, 10]} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                    name="Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Session History */}
            <Card>
              <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription>Recent coaching sessions and outcomes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {agentSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{session.scenario}</h4>
                      <Badge variant="outline">{session.score}/10</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{session.feedback}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{session.date}</span>
                      <span>{session.duration} min</span>
                      <div className="flex gap-1">
                        {session.skillsImproved.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Before vs After Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Before vs After Coaching</CardTitle>
                <CardDescription>Performance improvement metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Score</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{agent.previousScore}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span className="font-medium">{agent.averageScore}</span>
                      {getTrendIcon(agent.averageScore, agent.previousScore)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sessions Completed</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{agent.sessionsCompleted}/{agent.sessionsTarget}</span>
                      <Progress value={(agent.sessionsCompleted / agent.sessionsTarget) * 100} className="w-16" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Engagement Level</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${engagement.color}`}>{engagement.level}</span>
                      <span className="text-sm text-muted-foreground">({agent.engagementTime}min)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Supervisor Notes */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Supervisor Notes</CardTitle>
                {editingNotes !== agent.id ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingNotes(agent.id)
                      setNewNote(agent.notes)
                    }}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Notes
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => saveNote(agent.id)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingNotes(null)
                        setNewNote('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editingNotes === agent.id ? (
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add notes about this agent's progress..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {agent.notes || 'No notes added yet.'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
              Supervisor View
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            {/* Alerts Notification */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadAlertsCount}
                  </span>
                )}
              </Button>
              {showAlerts && (
                <div className="absolute right-0 top-10 w-80 bg-card border rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {alerts.map((alert) => (
                      <div key={alert.id} className={`p-3 border-b ${!alert.isRead ? 'bg-blue-50' : ''}`}>
                        <div className="flex items-start gap-2">
                          <div className="mt-1">
                            {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                            {alert.type === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
                            {alert.type === 'info' && <CheckCircle className="h-4 w-4 text-blue-600" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{alert.title}</h4>
                            <p className="text-xs text-muted-foreground">{alert.message}</p>
                            <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="patterns">Challenging Patterns</TabsTrigger>
              <TabsTrigger value="progress">Coaching Progress</TabsTrigger>
              <TabsTrigger value="reports">Weekly Reports</TabsTrigger>
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
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Team Overview Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Team Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agents Coached This Week</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamOverviewData.totalAgentsCoached}</div>
                  <p className="text-xs text-muted-foreground">+2 from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Improvement</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+{teamOverviewData.teamImprovementPercent}%</div>
                  <p className="text-xs text-muted-foreground">vs last week (+{teamOverviewData.previousWeekImprovement}%)</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">At Risk Agents</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{agents.filter(a => a.status === 'at-risk').length}</div>
                  <p className="text-xs text-muted-foreground">Need immediate attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
                  <Award className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{agents.filter(a => a.status === 'excellent').length}</div>
                  <p className="text-xs text-muted-foreground">Excellent rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Top 3 Recurring Challenges */}
            <Card>
              <CardHeader>
                <CardTitle>Top 3 Recurring Challenges</CardTitle>
                <CardDescription>Most frequent issues across your team this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamOverviewData.topChallenges.map((challenge, index) => (
                    <div key={challenge.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{challenge.name}</h4>
                          <p className="text-sm text-muted-foreground">{challenge.category} • {challenge.frequency} occurrences</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">{challenge.errorRate}% error rate</Badge>
                        {challenge.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-600" />}
                        {challenge.trend === 'down' && <TrendingDown className="h-4 w-4 text-green-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance Trend</CardTitle>
                <CardDescription>Average team score and session completion over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="week" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                      name="Avg Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Challenging Patterns Explorer */}
          <TabsContent value="patterns" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Challenging Patterns Explorer</h2>
                <p className="text-muted-foreground">Aggregated team-wide problem areas with drill-down capability</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={agentFilter} onValueChange={setAgentFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    <SelectItem value="at-risk">At Risk</SelectItem>
                    <SelectItem value="top">Top Performers</SelectItem>
                    <SelectItem value="affected">Affected by Pattern</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={intentFilter} onValueChange={setIntentFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Intents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Intents</SelectItem>
                    <SelectItem value="refund">Refunds</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={channelFilter} onValueChange={setChannelFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Channels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
                {(agentFilter !== 'all' || intentFilter !== 'all' || channelFilter !== 'all') && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setAgentFilter('all')
                      setIntentFilter('all')
                      setChannelFilter('all')
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              {getFilteredPatterns().map((pattern) => (
                <Card key={pattern.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{pattern.name}</h3>
                          <Badge variant="outline">{pattern.category}</Badge>
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
                            {pattern.errorRate}% error rate
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Frequency: </span>
                            <span className="font-medium">{pattern.frequency} occurrences</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Affected Agents: </span>
                            <span className="font-medium">{pattern.affectedAgents.length}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date Range: </span>
                            <span className="font-medium">{pattern.dateRange}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          setSelectedPattern(pattern.id)
                          setShowPatternDetails(true)
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          // Drill down to affected agents
                          const affectedAgents = agents.filter(a => pattern.affectedAgents.includes(a.id))
                          if (affectedAgents.length > 0) {
                            setActiveTab('progress')
                            setAgentFilter('affected')
                          }
                        }}>
                          <Users className="h-4 w-4 mr-2" />
                          Drill Down
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">Top Intents: </span>
                          <div className="flex gap-1 mt-1">
                            {pattern.intents.slice(0, 3).map((intent, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {intent}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Channels: </span>
                          <div className="flex gap-1 mt-1">
                            {pattern.channels.map((channel, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Coaching Progress Tracker */}
          <TabsContent value="progress" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Coaching Progress Tracker</h2>
                <p className="text-muted-foreground">Individual coaching progress with traffic light indicators</p>
                {agentFilter === 'affected' && selectedPattern && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">Showing agents affected by pattern</Badge>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setAgentFilter('all')
                      setSelectedPattern(null)
                    }}>
                      <ArrowLeft className="h-3 w-3 mr-1" />
                      Back to All Agents
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select value={agentFilter} onValueChange={setAgentFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter agents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    <SelectItem value="at-risk">At Risk Only</SelectItem>
                    <SelectItem value="top">Top Performers</SelectItem>
                    <SelectItem value="excellent">Excellent Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              {getFilteredAgents().map((agent) => {
                const statusBadge = getStatusBadge(agent.status)
                const engagement = getEngagementLevel(agent.engagementTime)
                
                return (
                  <Card key={agent.id} className={`hover:shadow-md transition-shadow cursor-pointer ${
                    agent.status === 'at-risk' ? 'border-red-200 bg-red-50/50' : ''
                  }`}
                  onClick={() => setSelectedAgent(agent.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium text-primary">{agent.avatar}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{agent.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {agent.email} • Last session: {agent.lastSession}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          {/* Sessions Completed */}
                          <div className="text-center">
                            <div className="text-2xl font-bold text-foreground">
                              {agent.sessionsCompleted}/{agent.sessionsTarget}
                            </div>
                            <p className="text-xs text-muted-foreground">Sessions</p>
                            <Progress value={(agent.sessionsCompleted / agent.sessionsTarget) * 100} className="w-16 mt-1" />
                          </div>

                          {/* Average Score Trend */}
                          <div className="text-center">
                            <div className="flex items-center gap-1">
                              <span className="text-2xl font-bold text-foreground">{agent.averageScore}</span>
                              {getTrendIcon(agent.averageScore, agent.previousScore)}
                            </div>
                            <p className="text-xs text-muted-foreground">Avg Score</p>
                          </div>

                          {/* Engagement Level */}
                          <div className="text-center">
                            <div className={`text-lg font-bold ${engagement.color}`}>
                              {engagement.level}
                            </div>
                            <p className="text-xs text-muted-foreground">{agent.engagementTime}min</p>
                          </div>

                          {/* Traffic Light Status */}
                          <div className="text-center">
                            <Badge {...statusBadge}>
                              {statusBadge.icon} {statusBadge.text}
                            </Badge>
                          </div>

                          <Button variant="outline" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">Improvement Areas:</p>
                            <div className="flex gap-2">
                              {agent.improvementAreas.map((area, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Weekly Reports */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Weekly Coaching Summary Reports</h2>
                <p className="text-muted-foreground">Auto-generated per-agent and team-level reports</p>
              </div>
            </div>

            {/* Team-level Report Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance Summary - Week 11, 2025</CardTitle>
                <CardDescription>Comprehensive team coaching analytics and improvement metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">+{teamOverviewData.teamImprovementPercent}%</div>
                    <p className="text-sm text-muted-foreground">Overall Improvement</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">8.4</div>
                    <p className="text-sm text-muted-foreground">Average Team Score</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">87%</div>
                    <p className="text-sm text-muted-foreground">Session Completion</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Top 3 Improved Skills</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Empathy & Active Listening</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">+18% improvement</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">First Call Resolution</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">+15% improvement</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Policy Compliance</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">+12% improvement</Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Top 3 Areas Needing Focus</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Technical Troubleshooting</span>
                      <Badge variant="destructive" className="bg-red-100 text-red-800">-5% decline</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Billing Dispute Resolution</span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">No change</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Upselling & Cross-selling</span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">+2% improvement</Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">AI-Generated Summary</h4>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      This week showed significant improvement in team empathy scores, with 5 out of 6 agents demonstrating enhanced active listening skills. 
                      However, technical support scenarios continue to challenge the team, particularly complex billing disputes. 
                      Recommendation: Schedule focused technical training sessions and consider pairing struggling agents with top performers for mentorship.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Generated: March 15, 2025 at 9:00 AM</p>
                    <p className="text-xs text-muted-foreground">
                      Report covers March 8-14, 2025 • 6 agents • 61 total sessions
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportToPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToCSV}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Individual Agent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Individual Agent Reports</CardTitle>
                <CardDescription>Per-agent performance summaries and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.slice(0, 3).map((agent) => {
                    const statusBadge = getStatusBadge(agent.status)
                    return (
                      <div key={agent.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-medium text-primary">{agent.avatar}</span>
                            </div>
                            <div>
                              <h4 className="font-medium">{agent.name}</h4>
                              <p className="text-sm text-muted-foreground">{agent.sessionsCompleted} sessions completed</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge {...statusBadge}>
                              {statusBadge.icon} {statusBadge.text}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => setSelectedAgent(agent.id)}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <p>Key improvements: {agent.improvementAreas.join(', ')}</p>
                          <p>Current focus: Maintaining {agent.averageScore} average score with consistent engagement</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
