"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface LoginScreenProps {
  onLogin: (role: "agent" | "supervisor" | "admin") => void
  onAgentDesktop: () => void
}

export function LoginScreen({ onLogin, onAgentDesktop }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simple role-based authentication
    const credentials = {
      "agent@omnihive.com": { password: "1234", role: "agent" as const },
      "supervisor@omnihive.com": { password: "1234", role: "supervisor" as const },
      "admin@omnihive.com": { password: "1234", role: "admin" as const },
    }

    const user = credentials[email as keyof typeof credentials]

    if (!user || user.password !== password) {
      setError("Invalid email or password")
      setIsLoading(false)
      return
    }

    // Simulate login delay
    setTimeout(() => {
      onLogin(user.role)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Top-right Agent Desktop link */}
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
          <CardTitle className="text-2xl font-bold text-gray-900">OmniHive AI Coaching</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
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
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Continue"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <div>
                <strong>Agent:</strong> agent@omnihive.com / 1234
              </div>
              <div>
                <strong>Supervisor:</strong> supervisor@omnihive.com / 1234
              </div>
              <div>
                <strong>Admin:</strong> admin@omnihive.com / 1234
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
