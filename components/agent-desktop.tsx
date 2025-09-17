"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, MessageCircle, Phone, Mail, X, ChevronDown, ChevronUp, Eye, Clock, Users, BarChart3, Bell, Search, Star } from "lucide-react"

interface AgentDesktopProps {
  onBack: () => void
  onCoachingDetails: () => void
}

interface FloatingWidgetProps {
  agentName: string
  onSeeDetails: () => void
}

function FloatingCoachingWidget({ agentName, onSeeDetails }: FloatingWidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const yesterdayPerformance = {
    struggledAreas: [
      "Empathy in customer interactions",
      "Product policy explanations",
      "Call resolution time"
    ],
    contactReferences: [
      { id: "CNT-2024-001", issue: "Billing dispute - tone too formal", time: "14:32" },
      { id: "CNT-2024-002", issue: "Technical support - unclear explanation", time: "16:15" },
      { id: "CNT-2024-003", issue: "Refund request - policy not explained well", time: "17:45" }
    ],
    focusAreas: [
      "Practice active listening techniques",
      "Review product return policies",
      "Work on call pacing and efficiency"
    ],
    aiTip: "Try using more empathetic phrases like 'I understand your frustration' before explaining policies."
  }

  if (isCollapsed) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-16 h-16 flex items-center justify-center cursor-pointer shadow-lg bg-white/90 backdrop-blur-sm border-2 border-blue-200" 
              onClick={() => setIsCollapsed(false)}>
          <MessageCircle className="h-6 w-6 text-blue-600" />
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[80vh] overflow-hidden">
      <Card className="shadow-xl border-2 border-blue-200 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-semibold text-gray-900">
                Daily Coaching
              </CardTitle>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(true)}
                className="h-7 w-7 p-0"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(true)}
                className="h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription className="text-base font-medium text-blue-600">
            Hey {agentName}, Good day! 👋
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {/* Areas where agent struggled */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-red-500" />
              Yesterday's Challenge Areas
            </h4>
            <ul className="space-y-1">
              {yesterdayPerformance.struggledAreas.map((area, index) => (
                <li key={index} className="text-sm text-gray-600 pl-4 border-l-2 border-red-200">
                  • {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact references */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
              <Eye className="h-4 w-4 text-orange-500" />
              Recent Contact Issues
            </h4>
            <div className="space-y-2">
              {yesterdayPerformance.contactReferences.map((contact, index) => (
                <div key={index} className="p-2 bg-orange-50 rounded-md border border-orange-200">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs font-mono">
                      {contact.id}
                    </Badge>
                    <span className="text-xs text-gray-500">{contact.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{contact.issue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Areas to focus on today */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
              <Star className="h-4 w-4 text-blue-500" />
              Today's Focus Areas
            </h4>
            <ul className="space-y-1">
              {yesterdayPerformance.focusAreas.map((area, index) => (
                <li key={index} className="text-sm text-gray-600 pl-4 border-l-2 border-blue-200">
                  • {area}
                </li>
              ))}
            </ul>
          </div>

          {/* AI Tip */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border border-blue-200">
            <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              AI Coaching Tip
            </h4>
            <p className="text-sm text-gray-700 italic">
              {yesterdayPerformance.aiTip}
            </p>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={onSeeDetails} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            See Details
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function AgentDesktop({ onBack, onCoachingDetails }: AgentDesktopProps) {
  // Agent name from session (mock data for demo)
  const agentName = "Thomson"
  
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('/api/placeholder/1920/1080')`,
        backgroundColor: '#f8fafc'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Header with back button */}
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          
          <div className="text-white bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
            <h1 className="text-xl font-bold">OmniHive Agent Desktop</h1>
            <p className="text-sm opacity-90">Welcome back, {agentName}</p>
          </div>
        </div>
      </div>

      {/* Simulated Agent Desktop Interface */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Contact Statistics */}
            <Card className="lg:col-span-1 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Contact Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">80</div>
                    <div className="text-sm text-gray-600">Handled</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">45</div>
                    <div className="text-sm text-gray-600">Transfer</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">20</div>
                    <div className="text-sm text-gray-600">Missed</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">25</div>
                    <div className="text-sm text-gray-600">Conference</div>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900">26,751</div>
                  <div className="text-sm text-gray-600">Total Contacts</div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Performance Chart Placeholder</p>
                    <p className="text-xs text-gray-500 mt-1">Voice, Chat, Email, SMS Analytics</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agent Status */}
            <Card className="lg:col-span-1 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Agent Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Available</span>
                    <Badge variant="default" className="bg-green-500">03:58:03</Badge>
                  </div>
                  <Progress value={75} className="w-full" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Not Ready</span>
                    <span>00:30:15</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Busy</span>
                    <span>02:45:29</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">30</div>
                    <div className="text-sm text-gray-600">Waiting Contacts</div>
                    <Clock className="h-4 w-4 mx-auto mt-1 text-gray-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional mock sections */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Team Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">114</div>
                    <div className="text-xs text-gray-600">Inbound (25%)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">97</div>
                    <div className="text-xs text-gray-600">Outbound (33%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Queue Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Available</span>
                    <span>25</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Handled</span>
                    <span>356</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>In Queue</span>
                    <span>33</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Handle Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">00:15:03</div>
                  <div className="text-sm text-gray-600">Average Handle Time</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating AI Coaching Widget */}
      <FloatingCoachingWidget 
        agentName={agentName} 
        onSeeDetails={onCoachingDetails}
      />
    </div>
  )
}