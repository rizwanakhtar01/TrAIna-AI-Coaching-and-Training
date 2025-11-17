"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Eye,
  BarChart3,
  Star,
} from "lucide-react";

export function AgentDesktopDemo() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const yesterdayPerformance = {
    struggledAreas: [
      "Maintained positive tone across most interactions",
      "Resolved 80% of issues on first call",
    ],
    challengingAreas: [
      "Showing empathy in tough conversations",
      "Explaining product policies clearly",
      "Managing call resolution time efficiently",
    ],
    contactReferences: [
      {
        id: "CNT-2024-001",
        issue: "Billing dispute - tone too formal",
        time: "14:32",
      },
      {
        id: "CNT-2024-002",
        issue: "Technical support - unclear explanation",
        time: "16:15",
      },
      {
        id: "CNT-2024-003",
        issue: "Refund request - policy not explained well",
        time: "17:45",
      },
    ],
    focusAreas: [
      "Practice active listening: repeat back what the customer says before replying",
      "Review product return policy (Knowledge Base > Policies)",
      "Work on pacing: aim to resolve within target handle time",
    ],
    aiTip:
      "Use empathy phrases like 'I completely understand how that feels' before explaining policies. This builds trust and makes customers more receptive.",
  };

  return (
    <div className="min-h-screen bg-[#e8f2fb] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agent Desktop
          </h1>
          <p className="text-gray-600">Customer service workspace with AI coaching</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Contact</CardTitle>
                <CardDescription>Active customer interaction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Sarah Johnson</h3>
                      <p className="text-sm text-gray-600">
                        Customer ID: CUST-2024-5678
                      </p>
                    </div>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Issue Type</p>
                      <p className="font-medium">Billing Question</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Priority</p>
                      <p className="font-medium">Medium</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-medium">8:34</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Sentiment</p>
                      <p className="font-medium">Neutral</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">sarah.johnson@example.com</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium">(555) 123-4567</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Account Status</p>
                    <p className="font-medium">Active - Premium</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Member Since</p>
                    <p className="font-medium">Jan 2022</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="relative"
              >
                <Card className="border-2 border-primary shadow-lg">
                  <CardHeader className="pb-3 space-y-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base">TrAIna AI Coach</CardTitle>
                          <CardDescription className="text-xs">
                            Personalized insights
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(true)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 mb-1">
                            What You're Doing Well
                          </p>
                          <ul className="space-y-1 text-gray-700">
                            {yesterdayPerformance.struggledAreas.map(
                              (area, idx) => (
                                <li key={idx} className="text-xs">
                                  • {area}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <BarChart3 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 mb-1">
                            Areas to Improve
                          </p>
                          <ul className="space-y-1 text-gray-700">
                            {yesterdayPerformance.challengingAreas.map(
                              (area, idx) => (
                                <li key={idx} className="text-xs">
                                  • {area}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Eye className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 mb-1">
                            Example Contacts
                          </p>
                          <div className="space-y-1.5">
                            {yesterdayPerformance.contactReferences.map(
                              (contact, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs bg-blue-50 p-2 rounded"
                                >
                                  <p className="font-medium text-blue-900">
                                    {contact.id}
                                  </p>
                                  <p className="text-blue-700">{contact.issue}</p>
                                  <p className="text-blue-600">Time: {contact.time}</p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MessageCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 mb-1">
                            Focus Areas for Today
                          </p>
                          <ul className="space-y-1 text-gray-700">
                            {yesterdayPerformance.focusAreas.map((area, idx) => (
                              <li key={idx} className="text-xs">
                                • {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 rounded-lg border border-primary/20">
                        <div className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="text-xs">
                            <p className="font-semibold text-primary mb-1">
                              AI Coaching Tip
                            </p>
                            <p className="text-gray-700">
                              {yesterdayPerformance.aiTip}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                    >
                      View Full Coaching Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed bottom-6 right-6"
              >
                <Button
                  onClick={() => setIsCollapsed(false)}
                  className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-br from-primary to-secondary hover:shadow-2xl transition-all"
                  size="icon"
                >
                  <Sparkles className="h-6 w-6" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
