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
  RefreshCw,
  CheckCircle,
  KeyRound,
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"email" | "code" | "success">("email");
  const [resetEmail, setResetEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [codeSentMessage, setCodeSentMessage] = useState(true);
  
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
  const [showSetupPassword, setShowSetupPassword] = useState(false);
  const [setupNewPassword, setSetupNewPassword] = useState("");
  const [setupConfirmPassword, setSetupConfirmPassword] = useState("");
  const [setupPasswordError, setSetupPasswordError] = useState("");
  const [setupPasswordLoading, setSetupPasswordLoading] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  useEffect(() => {
    const savedLoginState = localStorage.getItem("traina_logged_in");
    if (savedLoginState === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (email === "thomson@traina.com" && password === "1234") {
      if (isFirstTimeLogin) {
        setShowSetupPassword(true);
        setIsLoading(false);
        return;
      }
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

  const handleSetupPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupPasswordError("");

    if (setupNewPassword.length < 8) {
      setSetupPasswordError("Password must be at least 8 characters.");
      return;
    }

    if (setupNewPassword !== setupConfirmPassword) {
      setSetupPasswordError("Passwords do not match.");
      return;
    }

    setSetupPasswordLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoggedIn(true);
    if (rememberMe) {
      localStorage.setItem("traina_logged_in", "true");
    }
    setEmail("");
    setPassword("");
    setShowSetupPassword(false);
    setIsFirstTimeLogin(false);
    setSetupNewPassword("");
    setSetupConfirmPassword("");
    setSetupPasswordLoading(false);
  };

  const handleCancelSetupPassword = () => {
    setShowSetupPassword(false);
    setSetupNewPassword("");
    setSetupConfirmPassword("");
    setSetupPasswordError("");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("traina_logged_in");
    setEmail("");
    setPassword("");
    setRememberMe(false);
  };

  const handleRefreshFeedback = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsRefreshing(false);
  };

  const handleForgotPasswordOpen = () => {
    setShowForgotPassword(true);
    setForgotPasswordStep("email");
    setResetEmail("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotPasswordError("");
  };

  const handleForgotPasswordClose = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep("email");
    setResetEmail("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotPasswordError("");
  };

  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError("");
    setForgotPasswordLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setForgotPasswordError("Please enter a valid email address.");
      setForgotPasswordLoading(false);
      return;
    }

    setForgotPasswordStep("code");
    setResendCountdown(60);
    setCodeSentMessage(true);
    setForgotPasswordLoading(false);
  };

  const handleVerifyAndResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError("");

    if (verificationCode.length !== 6) {
      setForgotPasswordError("Verification code must be 6 digits.");
      return;
    }

    if (newPassword.length < 8) {
      setForgotPasswordError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotPasswordError("Passwords do not match.");
      return;
    }

    setForgotPasswordLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (verificationCode !== "123456") {
      setForgotPasswordError("Invalid verification code. Please try again.");
      setForgotPasswordLoading(false);
      return;
    }

    setForgotPasswordStep("success");
    setForgotPasswordLoading(false);
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0) return;
    setForgotPasswordLoading(true);
    setVerificationCode("");
    setForgotPasswordError("");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setResendCountdown(60);
    setCodeSentMessage(true);
    setForgotPasswordLoading(false);
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
                <div className="flex items-center gap-1 ml-auto">
                  {isLoggedIn && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefreshFeedback}
                      disabled={isRefreshing}
                      className="h-7 w-7 p-0"
                      title="Refresh feedback"
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    </Button>
                  )}
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
              {isLoggedIn && (
                <CardDescription className="text-base font-medium text-blue-600">
                  I'm your AI Coach. Let's reflect on yesterday and get ready
                  for today 🚀
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto">
              {!isLoggedIn ? (
                showForgotPassword ? (
                  <div className="space-y-4 py-4">
                    {forgotPasswordStep === "email" && (
                      <>
                        <div className="text-center space-y-2 mb-6">
                          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <KeyRound className="h-6 w-6 text-blue-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            Reset Your Password
                          </h3>
                          <p className="text-sm text-gray-600">
                            Enter your email and we'll send you a verification code
                          </p>
                        </div>

                        <form onSubmit={handleSendVerificationCode} className="space-y-4 px-6">
                          <div className="space-y-2">
                            <Label htmlFor="resetEmail" className="text-sm font-medium">
                              Email Address
                            </Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="resetEmail"
                                type="email"
                                placeholder="Enter your email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="pl-10 rounded-lg border-gray-300"
                                required
                                disabled={forgotPasswordLoading}
                              />
                            </div>
                          </div>

                          {forgotPasswordError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-600">{forgotPasswordError}</p>
                            </div>
                          )}

                          <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            disabled={forgotPasswordLoading}
                          >
                            {forgotPasswordLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              "Send Verification Code"
                            )}
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleForgotPasswordClose}
                          >
                            Back to Login
                          </Button>
                        </form>
                      </>
                    )}

                    {forgotPasswordStep === "code" && (
                      <>
                        <div className="text-center space-y-2 mb-4">
                          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Lock className="h-6 w-6 text-blue-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            Enter Verification Code
                          </h3>
                          <p className="text-sm text-gray-600">
                            We sent a code to <span className="font-medium">{resetEmail}</span>
                          </p>
                        </div>

                        <div className="mx-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <p className="text-sm text-green-700">
                            Verification code sent successfully!
                          </p>
                        </div>

                        <form onSubmit={handleVerifyAndResetPassword} className="space-y-4 px-6">
                          <div className="space-y-2">
                            <Label htmlFor="verificationCode" className="text-sm font-medium">
                              Verification Code
                            </Label>
                            <Input
                              id="verificationCode"
                              type="text"
                              placeholder="Enter 6-digit code"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              className="rounded-lg border-gray-300 text-center text-lg tracking-widest"
                              maxLength={6}
                              required
                              disabled={forgotPasswordLoading}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-sm font-medium">
                              New Password
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="newPassword"
                                type="password"
                                placeholder="At least 8 characters"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="pl-10 rounded-lg border-gray-300"
                                required
                                disabled={forgotPasswordLoading}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                              Confirm Password
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pl-10 rounded-lg border-gray-300"
                                required
                                disabled={forgotPasswordLoading}
                              />
                            </div>
                          </div>

                          {forgotPasswordError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-600">{forgotPasswordError}</p>
                            </div>
                          )}

                          <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            disabled={forgotPasswordLoading}
                          >
                            {forgotPasswordLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Resetting...
                              </>
                            ) : (
                              "Reset Password"
                            )}
                          </Button>

                          <div className="text-center">
                            {resendCountdown > 0 ? (
                              <p className="text-sm text-gray-500">
                                Resend code in {resendCountdown}s
                              </p>
                            ) : (
                              <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                onClick={handleResendCode}
                                disabled={forgotPasswordLoading}
                              >
                                Didn't receive code? Resend
                              </button>
                            )}
                          </div>

                          <p className="text-center text-sm text-gray-600">
                            Wrong Email?{" "}
                            <button
                              type="button"
                              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                              onClick={() => setForgotPasswordStep("email")}
                            >
                              Start Over
                            </button>
                          </p>
                        </form>
                      </>
                    )}

                    {forgotPasswordStep === "success" && (
                      <div className="text-center space-y-4 py-6 px-6">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          Password Reset Successful
                        </h3>
                        <p className="text-sm text-gray-600">
                          Your password has been updated. You can now sign in with your new password.
                        </p>
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                          onClick={handleForgotPasswordClose}
                        >
                          Back to Login
                        </Button>
                      </div>
                    )}
                  </div>
                ) : showSetupPassword ? (
                  <div className="space-y-4 py-4">
                    <div className="text-center space-y-2 mb-6">
                      <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <KeyRound className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Set Up Your Password
                      </h3>
                      <p className="text-sm text-gray-600">
                        Welcome! Please create a new password for your account.
                      </p>
                    </div>

                    <div className="mx-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        Logged in as <span className="font-medium">{email}</span>
                      </p>
                    </div>

                    <form onSubmit={handleSetupPassword} className="space-y-4 px-6">
                      <div className="space-y-2">
                        <Label htmlFor="setupNewPassword" className="text-sm font-medium">
                          New Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="setupNewPassword"
                            type="password"
                            placeholder="At least 8 characters"
                            value={setupNewPassword}
                            onChange={(e) => setSetupNewPassword(e.target.value)}
                            className="pl-10 rounded-lg border-gray-300"
                            required
                            disabled={setupPasswordLoading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="setupConfirmPassword" className="text-sm font-medium">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="setupConfirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={setupConfirmPassword}
                            onChange={(e) => setSetupConfirmPassword(e.target.value)}
                            className="pl-10 rounded-lg border-gray-300"
                            required
                            disabled={setupPasswordLoading}
                          />
                        </div>
                      </div>

                      {setupPasswordError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-600">{setupPasswordError}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        disabled={setupPasswordLoading}
                      >
                        {setupPasswordLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Setting up...
                          </>
                        ) : (
                          "Set Password & Continue"
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleCancelSetupPassword}
                      >
                        Cancel
                      </Button>
                    </form>
                  </div>
                ) : (
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
                      {/* <div className="flex items-center space-x-2">
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
                      </div> */}
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        disabled={isLoading}
                        onClick={handleForgotPasswordOpen}
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="firstTimeLogin"
                        checked={isFirstTimeLogin}
                        onCheckedChange={(checked) =>
                          setIsFirstTimeLogin(checked as boolean)
                        }
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor="firstTimeLogin"
                        className="text-sm text-gray-600 cursor-pointer"
                      >
                        First time login (setup new password)
                      </Label>
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
                )
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

                  {/* Acknowledge Button */}
                  <Button
                    onClick={() => setIsAcknowledged(true)}
                    disabled={isAcknowledged}
                    className={`w-full ${
                      isAcknowledged 
                        ? "bg-green-600 hover:bg-green-600 cursor-default" 
                        : "bg-amber-500 hover:bg-amber-600"
                    } text-white`}
                  >
                    {isAcknowledged ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Acknowledged
                      </>
                    ) : (
                      "Acknowledge"
                    )}
                  </Button>

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
