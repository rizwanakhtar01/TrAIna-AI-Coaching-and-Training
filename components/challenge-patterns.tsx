"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  examples: {
    id: string
    date: string
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
    examples: [
      {
        id: "1",
        date: "2 days ago",
        situation: "Customer angry about delayed refund",
        whatHappened: "Jumped straight into troubleshooting without acknowledging frustration",
        betterApproach: 'Start with "I completely understand how frustrating this delay must be for you"',
        impact: "Customer remained agitated throughout the call",
      },
      {
        id: "2",
        date: "1 week ago",
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
    examples: [
      {
        id: "1",
        date: "3 days ago",
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
    examples: [
      {
        id: "1",
        date: "1 day ago",
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
            <Badge variant="outline" className={getPriorityColor()}>
              {pattern.priority} priority
            </Badge>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>{pattern.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">{pattern.currentScore}%</div>
            <div className="text-xs text-muted-foreground">Current Score</div>
          </div>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="font-medium">
              {pattern.trend === "improving" ? "+" : pattern.trend === "declining" ? "-" : ""}
              {pattern.trendPercentage}%
            </span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{pattern.currentScore}%</span>
          </div>
          <Progress value={pattern.currentScore} className="h-2" />
        </div>

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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Progress Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">{pattern.currentScore}%</div>
                <p className="text-sm text-muted-foreground">Current Score</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-chart-4">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">+{pattern.trendPercentage}% improvement</span>
                </div>
              </div>

              <div className="space-y-2">
                {pattern.weeklyProgress.map((week, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{week.week}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={week.score} className="h-2 w-20" />
                      <span className="text-sm font-medium w-10">{week.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

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
      </div>

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
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {example.date}
                  </Badge>
                  <span className="text-sm font-medium text-foreground">{example.situation}</span>
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

export function ChallengePatternsScreen() {
  const [selectedPattern, setSelectedPattern] = useState<ChallengePattern | null>(null)

  if (selectedPattern) {
    return <ChallengeDetailView pattern={selectedPattern} onBack={() => setSelectedPattern(null)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Challenge Patterns</h2>
          <p className="text-muted-foreground">Recurring coaching areas identified by AI analysis</p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {challengePatterns.length} Active Patterns
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {challengePatterns.map((pattern) => (
          <ChallengePatternCard key={pattern.id} pattern={pattern} onViewDetails={setSelectedPattern} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Overall Progress Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-chart-4">2</div>
              <div className="text-sm text-muted-foreground">Patterns Improving</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-muted-foreground">1</div>
              <div className="text-sm text-muted-foreground">Patterns Stable</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-foreground">78%</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
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
