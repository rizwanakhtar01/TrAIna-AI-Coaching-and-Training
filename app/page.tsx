"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { AiCoachingDashboard } from "@/components/ai-coaching-dashboard"
import { SupervisorDashboard } from "@/components/supervisor-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { SuperAdminDashboard } from "@/components/super-admin-dashboard"
import { AgentDesktop } from "@/components/agent-desktop"

type UserRole = "agent" | "supervisor" | "admin" | "superadmin" | null
type ViewMode = "login" | "agentDesktop" | "dashboard" | null

export default function Home() {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("login")

  const handleLogin = (role: UserRole) => {
    setUserRole(role)
    setViewMode("dashboard")
  }
  
  const handleAgentDesktop = () => {
    setViewMode("agentDesktop")
  }

  const handleLogout = () => {
    setUserRole(null)
    setViewMode("login")
  }

  if (viewMode === "login") {
    return <LoginScreen onLogin={handleLogin} onAgentDesktop={handleAgentDesktop} />
  }
  
  if (viewMode === "agentDesktop") {
    return <AgentDesktop onBack={() => setViewMode("login")} onCoachingDetails={() => {
      setUserRole("agent")
      setViewMode("dashboard")
    }} />
  }

  if (viewMode === "dashboard" && userRole) {
    switch (userRole) {
      case "agent":
        return <AiCoachingDashboard onLogout={handleLogout} />
      case "supervisor":
        return <SupervisorDashboard onLogout={handleLogout} />
      case "admin":
        return <AdminDashboard onLogout={handleLogout} />
      case "superadmin":
        return <SuperAdminDashboard onLogout={handleLogout} />
      default:
        return <LoginScreen onLogin={handleLogin} onAgentDesktop={handleAgentDesktop} />
    }
  }
  
  return <LoginScreen onLogin={handleLogin} onAgentDesktop={handleAgentDesktop} />
}
