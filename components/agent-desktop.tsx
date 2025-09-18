"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowLeft,
  MessageCircle,
  X,
  Eye,
  BarChart3,
  Star,
} from "lucide-react";

interface AgentDesktopProps {
  onBack: () => void;
  onCoachingDetails: () => void;
}

interface FloatingWidgetProps {
  agentName: string;
  onSeeDetails: () => void;
}

function FloatingCoachingWidget({
  agentName,
  onSeeDetails,
}: FloatingWidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const yesterdayPerformance = {
    struggledAreas: [
      "Maintained positive tone across most interactions",
      "Resolved 80% of issues on first call",
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
        id: "CNT-2024-001",
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
      "Use empathy phrases like “I completely understand how that feels” before explaining policies. This builds trust and makes customers more receptive.",
  };

  return (
    <AnimatePresence>
      {isCollapsed ? (
        <motion.div
          key="collapsed"
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="fixed top-1/2 right-0 -translate-y-1/2 z-50"
        >
          <div
            className="bg-blue-600 text-white px-4 py-3 h-12 w-30 rounded-l-lg flex items-center justify-center text-center leading-snug"
            onClick={() => setIsCollapsed(false)}
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium whitespace-normal break-words">
              Your AI Coach
            </span>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="expanded"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="fixed top-0 right-0 h-screen w-[400px] md:w-[500px] lg:w-[600px] z-50 overflow-hidden"
        >
          <Card className="h-full bg-white/95 backdrop-blur-sm rounded-none shadow-xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Hey {agentName}, Good day! 👋
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(true)}
                  className="h-7 w-7 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-base font-medium text-blue-600">
                I’m your AI Coach. Let’s reflect on yesterday and get ready for today 🚀
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-4 h-full overflow-hidden">
              {/* Areas where agent struggled */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-red-500" />
                  Yesterday’s Wins
                </h4>
                <ul className="space-y-1">
                  {yesterdayPerformance.struggledAreas.map((area, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 pl-4 border-l-2 border-red-200"
                    >
                      • {area}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact references */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4 text-orange-500" />
                  Recent Contacts to Learn From
                </h4>
                <div className="space-y-2">
                  {yesterdayPerformance.contactReferences.map(
                    (contact, index) => (
                      <div
                        key={index}
                        className="p-2 bg-orange-50 rounded-md border border-orange-200"
                      >
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="text-xs font-mono"
                          >
                            {contact.id}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {contact.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {contact.issue}
                        </p>
                      </div>
                    ),
                  )}
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
                    <li
                      key={index}
                      className="text-sm text-gray-600 pl-4 border-l-2 border-blue-200"
                    >
                      • {area}
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Tip */}
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border border-blue-200">
                <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  Pro Tip for Today
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AgentDesktop({ onBack, onCoachingDetails }: AgentDesktopProps) {
  const agentName = "Thomson";

  return (
    <div
      className="min-h-screen w-screen bg-cover bg-center bg-no-repeat relative overflow-y-auto"
      style={{
        backgroundImage: `url('/agent-dashboard.png')`,
        backgroundColor: "#f8fafc",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
      }}
    >
      {/* Back button */}
      <div className="relative z-10 p-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="fixed bottom-6 left-6 z-50 bg-white/80 backdrop-blur-sm hover:bg-primary hover:text-white/90 "
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Button>
      </div>

      {/* Spacer content */}
      <div className="h-[150vh]"></div>

      {/* Floating AI Coaching Widget */}
      <FloatingCoachingWidget
        agentName={agentName}
        onSeeDetails={onCoachingDetails}
      />
    </div>
  );
}
