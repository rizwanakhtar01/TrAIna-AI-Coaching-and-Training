"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  MessageSquare,
  Clock,
  Heart,
  Target,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Users,
  Star,
  ArrowRight,
  Eye,
  LogOut,
} from "lucide-react"
import { ContactReviewsList } from "./contact-review-card"
import { ChallengePatternsScreen } from "./challenge-patterns"
import { SentimentTrendsScreen } from "./sentiment-trends"
import { InteractiveCoachingScreen } from "./interactive-coaching"

interface AiCoachingDashboardProps {
  onLogout: () => void
}

export function AiCoachingDashboard({ onLogout }: AiCoachingDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  const navigateToReviews = () => setActiveTab("reviews")
  const navigateToPatterns = () => setActiveTab("patterns")
  const navigateToSentiment = () => setActiveTab("sentiment")
  const navigateToCoaching = () => setActiveTab("coaching")

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
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground font-medium">
              Agent View
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Rizwan - Agent</span>
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-medium text-primary-foreground">R</span>
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
          <TabsList className="grid w-full grid-cols-5 lg:w-[750px] bg-zinc-100">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            
            <TabsTrigger value="reviews">Contact Reviews</TabsTrigger>
            <TabsTrigger value="patterns">Challenge Patterns</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment Trends</TabsTrigger>
            <TabsTrigger value="coaching">Interactive Coaching</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={navigateToReviews}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Score</CardTitle>
                  <Star className="h-4 w-4 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">8.7/10</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +0.3 from yesterday
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                    <Eye className="h-3 w-3" />
                    View details
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={navigateToReviews}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interactions</CardTitle>
                  <MessageSquare className="h-4 w-4 text-chart-1" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">23</div>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="inline h-3 w-3 mr-1" />
                    Avg 4.2 min
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                    <Eye className="h-3 w-3" />
                    View reviews
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={navigateToSentiment}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                  <Heart className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">92%</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +5% this week
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                    <Eye className="h-3 w-3" />
                    View trends
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={navigateToPatterns}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Coaching Points</CardTitle>
                  <Target className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">2</div>
                  <p className="text-sm text-muted-foreground">Areas to improve</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                    <Eye className="h-3 w-3" />
                    View patterns
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Contact Review */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Latest Contact Review
                    </CardTitle>
                    <CardDescription>Customer inquiry about subscription cancellation - 2 minutes ago</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={navigateToReviews}>
                    View All Reviews
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-chart-4">
                      <CheckCircle className="h-4 w-4" />
                      What went well
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You clearly explained the refund process and timeline
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-chart-5">
                      <AlertTriangle className="h-4 w-4" />
                      Could improve
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Consider offering retention options before processing cancellation
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-accent">
                      <Lightbulb className="h-4 w-4" />
                      Tip for next time
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ask "Is there anything we can do to keep you as a customer?"
                    </p>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={navigateToReviews}>
                  View Full Transcript & Analysis
                </Button>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Weekly Progress
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={navigateToPatterns}>
                      View Coaching
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Empathy Score</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-muted-foreground">+15% improvement this week</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Response Speed</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    <p className="text-xs text-muted-foreground">+8% improvement this week</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Policy Compliance</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    <p className="text-xs text-muted-foreground">Consistent performance</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Team Comparison
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={navigateToSentiment}>
                      View Trends
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">Top 25%</div>
                    <p className="text-sm text-muted-foreground">Your ranking this week</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Customer Satisfaction</span>
                      <Badge variant="secondary" className="bg-chart-4/20 text-chart-4 font-medium">
                        Above Average
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Resolution Time</span>
                      <Badge variant="secondary" className="bg-chart-1/20 text-slate-800 font-medium">
                        Excellent
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">First Call Resolution</span>
                      <Badge variant="secondary" className="bg-chart-4/20 text-chart-4 font-medium">
                        Above Average
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={navigateToReviews}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Recent Reviews</h4>
                      <p className="text-sm text-muted-foreground">3 new reviews today</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={navigateToPatterns}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Coaching Areas</h4>
                      <p className="text-sm text-muted-foreground">2 patterns improving</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={navigateToSentiment}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-chart-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Sentiment Analysis</h4>
                      <p className="text-sm text-muted-foreground">65% positive this week</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Interactive Coaching */}
          <TabsContent value="coaching" className="space-y-6">
            <InteractiveCoachingScreen />
          </TabsContent>

          {/* Contact Reviews */}
          <TabsContent value="reviews" className="space-y-6">
            <ContactReviewsList />
          </TabsContent>

          {/* Challenge Patterns */}
          <TabsContent value="patterns" className="space-y-6">
            <ChallengePatternsScreen />
          </TabsContent>

          {/* Sentiment Trends */}
          <TabsContent value="sentiment" className="space-y-6">
            <SentimentTrendsScreen />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
