"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, CheckCircle, KeyRound, Lock, Loader2, Mail } from "lucide-react";

interface LoginScreenProps {
  onLogin: (role: "agent" | "supervisor" | "admin" | "superadmin") => void;
  onAgentDesktop: () => void;
}

export function LoginScreen({ onLogin, onAgentDesktop }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
  const [showSetupPassword, setShowSetupPassword] = useState(false);
  const [setupPassword, setSetupPassword] = useState("");
  const [setupConfirmPassword, setSetupConfirmPassword] = useState("");
  const [setupPasswordError, setSetupPasswordError] = useState("");

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

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const credentials = {
      "agent@traina.com": { password: "1234", role: "agent" as const },
      "supervisor@traina.com": {
        password: "1234",
        role: "supervisor" as const,
      },
      "admin@traina.com": { password: "1234", role: "admin" as const },
      "superadmin@traina.com": { password: "1234", role: "superadmin" as const },
    };

    const user = credentials[email as keyof typeof credentials];

    if (!user || user.password !== password) {
      setError("Invalid email or password");
      setIsLoading(false);
      return;
    }

    if (isFirstTimeLogin) {
      setShowSetupPassword(true);
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      onLogin(user.role);
      setIsLoading(false);
    }, 1000);
  };

  const handleSetupPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSetupPasswordError("");

    if (setupPassword.length < 8) {
      setSetupPasswordError("Password must be at least 8 characters");
      return;
    }

    if (setupPassword !== setupConfirmPassword) {
      setSetupPasswordError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const credentials = {
        "agent@traina.com": { role: "agent" as const },
        "supervisor@traina.com": { role: "supervisor" as const },
        "admin@traina.com": { role: "admin" as const },
        "superadmin@traina.com": { role: "superadmin" as const },
      };
      const user = credentials[email as keyof typeof credentials];
      if (user) {
        onLogin(user.role);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleForgotPasswordSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError("");

    if (!resetEmail.includes("@")) {
      setForgotPasswordError("Please enter a valid email address");
      return;
    }

    setForgotPasswordLoading(true);
    setTimeout(() => {
      setForgotPasswordStep("code");
      setResendCountdown(60);
      setCodeSentMessage(true);
      setForgotPasswordLoading(false);
    }, 1500);
  };

  const handleForgotPasswordSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError("");

    if (verificationCode !== "123456") {
      setForgotPasswordError("Invalid verification code. Use 123456 for demo.");
      return;
    }

    if (newPassword.length < 8) {
      setForgotPasswordError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotPasswordError("Passwords do not match");
      return;
    }

    setForgotPasswordLoading(true);
    setTimeout(() => {
      setForgotPasswordStep("success");
      setForgotPasswordLoading(false);
    }, 1500);
  };

  const handleResendCode = () => {
    if (resendCountdown > 0) return;
    setForgotPasswordLoading(true);
    setTimeout(() => {
      setResendCountdown(60);
      setCodeSentMessage(true);
      setForgotPasswordLoading(false);
    }, 1000);
  };

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep("email");
    setResetEmail("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotPasswordError("");
    setCodeSentMessage(false);
  };

  const resetSetupPassword = () => {
    setShowSetupPassword(false);
    setSetupPassword("");
    setSetupConfirmPassword("");
    setSetupPasswordError("");
    setIsFirstTimeLogin(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          onClick={onAgentDesktop}
          className="bg-white/80 backdrop-blur-sm hover:bg-primary hover:text-white/90 "
        >
          Agent Desktop
        </Button>
      </div>

      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              TrAIna - AI Coaching and Training
            </CardTitle>
            <CardDescription>
              {showSetupPassword
                ? "Set up your new password"
                : showForgotPassword
                ? "Reset your password"
                : "Sign in to access your dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showSetupPassword ? (
              <form onSubmit={handleSetupPassword} className="space-y-4">
                <div className="text-center space-y-2 mb-6">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Create New Password</h3>
                  <p className="text-sm text-gray-500">
                    Please set up a new password for your account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="setupPassword">New Password</Label>
                  <Input
                    id="setupPassword"
                    type="password"
                    placeholder="Enter new password (min 8 characters)"
                    value={setupPassword}
                    onChange={(e) => setSetupPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="setupConfirmPassword">Confirm Password</Label>
                  <Input
                    id="setupConfirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={setupConfirmPassword}
                    onChange={(e) => setSetupConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                {setupPasswordError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    {setupPasswordError}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
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
                  variant="ghost"
                  className="w-full"
                  onClick={resetSetupPassword}
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </form>
            ) : showForgotPassword ? (
              <div className="space-y-4">
                {forgotPasswordStep === "email" && (
                  <form onSubmit={handleForgotPasswordSubmitEmail} className="space-y-4">
                    <div className="text-center space-y-2 mb-6">
                      <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <KeyRound className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Forgot Password</h3>
                      <p className="text-sm text-gray-500">
                        Enter your email to receive a verification code
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resetEmail">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="resetEmail"
                          type="email"
                          placeholder="Enter your email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="pl-10"
                          required
                          disabled={forgotPasswordLoading}
                        />
                      </div>
                    </div>

                    {forgotPasswordError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {forgotPasswordError}
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={forgotPasswordLoading}>
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
                      variant="ghost"
                      className="w-full"
                      onClick={resetForgotPassword}
                      disabled={forgotPasswordLoading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Button>
                  </form>
                )}

                {forgotPasswordStep === "code" && (
                  <form onSubmit={handleForgotPasswordSubmitCode} className="space-y-4">
                    <div className="text-center space-y-2 mb-4">
                      <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Lock className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Reset Password</h3>
                      <p className="text-sm text-gray-500">
                        Enter the code sent to {resetEmail}
                      </p>
                    </div>

                    {codeSentMessage && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700 text-center">
                          Verification code sent! Use <strong>123456</strong> for demo.
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="verificationCode">Verification Code</Label>
                      <Input
                        id="verificationCode"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        required
                        disabled={forgotPasswordLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password (min 8 characters)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-10"
                          required
                          disabled={forgotPasswordLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                          required
                          disabled={forgotPasswordLoading}
                        />
                      </div>
                    </div>

                    {forgotPasswordError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        {forgotPasswordError}
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={forgotPasswordLoading}>
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

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={resetForgotPassword}
                      disabled={forgotPasswordLoading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Button>
                  </form>
                )}

                {forgotPasswordStep === "success" && (
                  <div className="text-center space-y-4 py-6">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Password Reset Successful
                    </h3>
                    <p className="text-sm text-gray-500">
                      Your password has been updated. You can now login with your new password.
                    </p>
                    <Button
                      className="w-full"
                      onClick={resetForgotPassword}
                    >
                      Back to Login
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center justify-between">
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
                        First time login
                      </Label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Demo Credentials:
                  </p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>
                      <strong>Agent:</strong> agent@traina.com / 1234
                    </div>
                    <div>
                      <strong>Supervisor:</strong> supervisor@traina.com / 1234
                    </div>
                    <div>
                      <strong>Admin:</strong> admin@traina.com / 1234
                    </div>
                    <div>
                      <strong>Super Admin:</strong> superadmin@traina.com / 1234
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
