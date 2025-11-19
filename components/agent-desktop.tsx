"use client";

import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  MessageCircle,
  X,
  Eye,
  BarChart3,
  Star,
  Lock,
  Mail,
  Loader2,
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedLoginState = localStorage.getItem("traina_logged_in");
    if (savedLoginState === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (email === "thomson@traina.com" && password === "1234") {
      setIsLoggedIn(true);
      if (rememberMe) {
        localStorage.setItem("traina_logged_in", "true");
      }
      setEmail("");
      setPassword("");
    } else {
      setError("Invalid credentials. Please try again.");
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("traina_logged_in");
    setEmail("");
    setPassword("");
    setRememberMe(false);
  };

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
            <Sparkles className="h-7 w-7" />
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
          className="fixed top-0 right-0 h-screen border-l w-[300px] md:w-[400px] lg:w-[500px] z-50 overflow-hidden"
        >
          <Card className="h-full bg-white/95 backdrop-blur-sm rounded-none shadow-xl overflow-hidden flex flex-col">
            <CardHeader
              className={`pb-3 ${isLoggedIn ? "border-b border-gray-100" : ""}`}
            >
              <div className="flex items-center justify-between">
                {isLoggedIn && (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Hey {agentName}, Good day! 👋
                    </CardTitle>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(true)}
                  className="h-7 w-7 p-0 ml-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {isLoggedIn && (
                <CardDescription className="text-base font-medium text-blue-600">
                  I'm your AI Coach. Let's reflect on yesterday and get ready
                  for today 🚀
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto">
              {!isLoggedIn ? (
                <div className="space-y-4 py-4">
                  <div className="text-center space-y-2 mb-6">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Lock className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Sign in to TrAIna
                    </h3>
                    <p className="text-sm text-gray-600">
                      Access your personalized coaching insights
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4 px-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email / Username
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="text"
                          placeholder="coach@omnihive.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 rounded-lg border-gray-300"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 rounded-lg border-gray-300"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) =>
                            setRememberMe(checked as boolean)
                          }
                          disabled={isLoading}
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          Remember me
                        </Label>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        disabled={isLoading}
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </div>
              ) : (
                <>
                  {/* Areas where agent struggled */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-red-500" />
                      Yesterday’s Wins
                    </h4>
                    <ul className="space-y-1">
                      {yesterdayPerformance.struggledAreas.map(
                        (area, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 pl-4 border-l-2 border-red-200"
                          >
                            • {area}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  {/* Challenging Areas */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-red-500" />
                      Challenging Areas
                    </h4>
                    <ul className="space-y-1">
                      {yesterdayPerformance.challengingAreas.map(
                        (area, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 pl-4 border-l-2 border-red-200"
                          >
                            • {area}
                          </li>
                        ),
                      )}
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
                    onClick={() => window.open('/agent-dashboard', '_blank')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    See Details
                  </Button>

                  {/* Logout button */}
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full"
                  >
                    Logout
                  </Button>
                </>
              )}
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
