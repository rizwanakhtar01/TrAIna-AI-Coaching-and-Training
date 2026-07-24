"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  BarChart3,
  ChevronRight,
  Calendar,
  Calendar as CalendarIcon,
} from "lucide-react"

interface ChallengePattern {
  id: string
  title: string
  description: string
  currentScore: number
  previousScore: number
  trend: "improving" | "declining" | "stable"
  trendPercentage: number
  priority: "high" | "medium" | "low"
  channels: string[]
  examples: {
    id: string
    contactId: string
    date: string
    channel: string
    situation: string
    whatHappened: string
    betterApproach: string
    impact: string
  }[]
  tips: string[]
  weeklyProgress: {
    week: string
    score: number
  }[]
}

const challengePatterns: ChallengePattern[] = [
  {
    id: "1",
    title: "Empathy in Escalations",
    description: "Opportunities to show more understanding when customers are frustrated",
    currentScore: 72,
    previousScore: 62,
    trend: "improving",
    trendPercentage: 16,
    priority: "high",
    channels: ["phone", "chat"],
    examples: [
      {
        id: "1",
        contactId: "CTX-048291",
        date: "2 days ago",
        channel: "phone",
        situation: "Customer angry about delayed refund",
        whatHappened: "Jumped straight into troubleshooting without acknowledging frustration",
        betterApproach: 'Start with "I completely understand how frustrating this delay must be for you"',
        impact: "Customer remained agitated throughout the call",
      },
      {
        id: "2",
        contactId: "CTX-051837",
        date: "1 week ago",
        channel: "chat",
        situation: "Third callback for same technical issue",
        whatHappened: "Focused on the technical problem immediately",
        betterApproach:
          'Acknowledge the inconvenience: "I can see this is your third contact about this - that must be really frustrating"',
        impact: "Customer expressed dissatisfaction with service",
      },
    ],
    tips: [
      "Always acknowledge the customer's emotion before diving into solutions",
      'Use phrases like "I understand how..." or "That must be..."',
      'Mirror their concern: "You\'re absolutely right to be concerned about this"',
      'Take ownership: "I\'m going to make sure we get this resolved for you today"',
    ],
    weeklyProgress: [
      { week: "Week 1", score: 58 },
      { week: "Week 2", score: 62 },
      { week: "Week 3", score: 68 },
      { week: "Week 4", score: 72 },
    ],
  },
  {
    id: "2",
    title: "Response Speed",
    description: "Taking time to provide faster initial responses to customer inquiries",
    currentScore: 78,
    previousScore: 71,
    trend: "improving",
    trendPercentage: 10,
    priority: "medium",
    channels: ["chat"],
    examples: [
      {
        id: "1",
        contactId: "CTX-039504",
        date: "3 days ago",
        channel: "chat",
        situation: "Customer asking about order status",
        whatHappened: "Took 45 seconds to respond while researching",
        betterApproach: 'Acknowledge immediately: "Let me look that up for you right now" then research',
        impact: 'Customer asked "Are you still there?" twice',
      },
    ],
    tips: [
      "Acknowledge receipt within 10 seconds, even if you need time to research",
      'Use holding phrases: "Let me check that for you" or "One moment please"',
      'Set expectations: "This might take 30 seconds to look up"',
      "Keep customers informed during longer research periods",
    ],
    weeklyProgress: [
      { week: "Week 1", score: 65 },
      { week: "Week 2", score: 71 },
      { week: "Week 3", score: 75 },
      { week: "Week 4", score: 78 },
    ],
  },
  {
    id: "3",
    title: "Resolution Confirmation",
    description: "Ensuring customers are satisfied before ending interactions",
    currentScore: 85,
    previousScore: 83,
    trend: "stable",
    trendPercentage: 2,
    priority: "low",
    channels: ["phone"],
    examples: [
      {
        id: "1",
        contactId: "CTX-062748",
        date: "1 day ago",
        channel: "phone",
        situation: "Subscription cancellation request",
        whatHappened: "Processed cancellation and ended chat without confirmation",
        betterApproach: 'Ask "Have I fully addressed your concern today?" before closing',
        impact: "Missed opportunity to ensure customer satisfaction",
      },
    ],
    tips: [
      'Always ask "Is there anything else I can help you with today?"',
      'Confirm resolution: "Did I fully resolve your issue?"',
      "Summarize what was accomplished",
      'Leave the door open: "Please don\'t hesitate to contact us if you need anything else"',
    ],
    weeklyProgress: [
      { week: "Week 1", score: 82 },
      { week: "Week 2", score: 83 },
      { week: "Week 3", score: 84 },
      { week: "Week 4", score: 85 },
    ],
  },
]

interface ChallengePatternCardProps {
  pattern: ChallengePattern
  onViewDetails: (pattern: ChallengePattern) => void
}

function ChallengePatternCard({ pattern, onViewDetails }: ChallengePatternCardProps) {
  const getTrendIcon = () => {
    if (pattern.trend === "improving") return <TrendingUp className="h-4 w-4 text-chart-4" />
    if (pattern.trend === "declining") return <TrendingDown className="h-4 w-4 text-destructive" />
    return <BarChart3 className="h-4 w-4 text-muted-foreground" />
  }

  const getTrendColor = () => {
    if (pattern.trend === "improving") return "text-chart-4"
    if (pattern.trend === "declining") return "text-destructive"
    return "text-muted-foreground"
  }

  const getPriorityColor = () => {
    switch (pattern.priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "medium":
        return "bg-chart-5/10 text-chart-5 border-chart-5/20"
      case "low":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20"
    }
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewDetails(pattern)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{pattern.title}</CardTitle>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>{pattern.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{pattern.examples.length} examples to review</span>
          <span>{pattern.tips.length} coaching tips</span>
        </div>
      </CardContent>
    </Card>
  )
}

interface ChallengeDetailViewProps {
  pattern: ChallengePattern
  onBack: () => void
}

function ChallengeDetailView({ pattern, onBack }: ChallengeDetailViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          ← Back to Patterns
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{pattern.title}</h2>
          <p className="text-muted-foreground">{pattern.description}</p>
        </div>
      </div>

      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              Coaching Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pattern.tips.map((tip, index) => (
                <div key={index} className="flex gap-3 p-3 bg-accent/5 rounded-lg border-l-2 border-accent">
                  <div className="flex-shrink-0 w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center text-xs font-medium text-accent">
                    {index + 1}
                  </div>
                  <p className="text-sm text-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-chart-5" />
              Recent Examples
            </CardTitle>
            <CardDescription>Specific situations where this pattern was identified</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pattern.examples.map((example) => (
                <div key={example.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {example.date}
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-mono">
                      {example.contactId}
                    </Badge>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-chart-5">
                        <AlertTriangle className="h-3 w-3" />
                        What happened
                      </div>
                      <p className="text-sm text-muted-foreground">{example.whatHappened}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-chart-4">
                        <CheckCircle className="h-3 w-3" />
                        Better approach
                      </div>
                      <p className="text-sm text-muted-foreground">{example.betterApproach}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-accent">
                        <Target className="h-3 w-3" />
                        Impact
                      </div>
                      <p className="text-sm text-muted-foreground">{example.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    </div>
  )
}

// Returns approximate number of days from a relative date string
function parseDateDays(date: string): number {
  const lower = date.toLowerCase()
  if (lower === "yesterday" || lower === "1 day ago") return 1
  const daysMatch = lower.match(/(\d+)\s*day/)
  if (daysMatch) return parseInt(daysMatch[1])
  const weeksMatch = lower.match(/(\d+)\s*week/)
  if (weeksMatch) return parseInt(weeksMatch[1]) * 7
  return 30
}

function getMaxDays(timeFilter: string): number {
  if (timeFilter === "yesterday") return 1
  if (timeFilter === "last3days") return 3
  if (timeFilter === "last7days") return 7
  return 999 // custom — show all
}

export function ChallengePatternsScreen() {
  const [selectedPattern, setSelectedPattern] = useState<ChallengePattern | null>(null)
  const [patternTimeFilter, setPatternTimeFilter] = useState("last7days")
  const [patternCustomDate, setPatternCustomDate] = useState<Date | undefined>(undefined)
  const [patternCalendarOpen, setPatternCalendarOpen] = useState(false)
  const [channelFilter, setChannelFilter] = useState("all")

  const filteredPatterns = challengePatterns
    .map((p) => {
      const filteredExamples = p.examples.filter((e) => {
        const withinTime = parseDateDays(e.date) <= getMaxDays(patternTimeFilter)
        const matchesChannel = channelFilter === "all" || e.channel === channelFilter
        return withinTime && matchesChannel
      })
      return { ...p, examples: filteredExamples }
    })
    .filter((p) => {
      if (channelFilter !== "all" && !p.channels.includes(channelFilter)) return false
      return p.examples.length > 0
    })

  if (selectedPattern) {
    const refreshed = filteredPatterns.find((p) => p.id === selectedPattern.id) ?? selectedPattern
    return <ChallengeDetailView pattern={refreshed} onBack={() => setSelectedPattern(null)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Challenge Patterns</h2>
          <p className="text-muted-foreground">Recurring coaching areas identified by AI analysis</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time filter */}
          <Select value={patternTimeFilter} onValueChange={(val) => {
            setPatternTimeFilter(val)
            if (val !== "custom") setPatternCustomDate(undefined)
            if (val === "custom") setPatternCalendarOpen(true)
          }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last3days">Last 3 Days</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="custom">Custom Date</SelectItem>
            </SelectContent>
          </Select>

          {patternTimeFilter === "custom" && (
            <Popover open={patternCalendarOpen} onOpenChange={setPatternCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-40 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  {patternCustomDate ? format(patternCustomDate, "MMM dd, yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarPicker
                  mode="single"
                  selected={patternCustomDate}
                  onSelect={(date) => {
                    setPatternCustomDate(date ?? undefined)
                    setPatternCalendarOpen(false)
                  }}
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          )}

          {/* Channel filter */}
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
            </SelectContent>
          </Select>

          {channelFilter !== "all" && (
            <Button variant="ghost" size="sm" onClick={() => setChannelFilter("all")}>
              Clear Filters
            </Button>
          )}

          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {filteredPatterns.length} Active Patterns
          </Badge>
        </div>
      </div>

      {filteredPatterns.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No patterns found</p>
          <p className="text-sm">No challenge patterns were identified for this time period or channel.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatterns.map((pattern) => (
            <ChallengePatternCard key={pattern.id} pattern={pattern} onViewDetails={setSelectedPattern} />
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Overall Progress Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-chart-4">
                {filteredPatterns.filter((p) => p.trend === "improving").length}
              </div>
              <div className="text-sm text-muted-foreground">Patterns Improving</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-muted-foreground">
                {filteredPatterns.filter((p) => p.trend === "stable").length}
              </div>
              <div className="text-sm text-muted-foreground">Patterns Stable</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-chart-4/5 rounded-lg border-l-4 border-chart-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-chart-4 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Great progress this month!</p>
                <p className="text-sm text-muted-foreground">
                  You've shown consistent improvement in empathy and response speed. Keep focusing on these areas and
                  you'll see continued growth.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
