"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { AiCoachingDashboard } from "@/components/ai-coaching-dashboard"
import { SupervisorDashboard } from "@/components/supervisor-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"

type UserRole = "agent" | "supervisor" | "admin" | null

export default function Home() {
  const [userRole, setUserRole] = useState<UserRole>(null)

  const handleLogin = (role: UserRole) => {
    setUserRole(role)
  }

  const handleLogout = () => {
    setUserRole(null)
  }

  if (!userRole) {
    return <LoginScreen onLogin={handleLogin} />
  }

  switch (userRole) {
    case "agent":
      return <AiCoachingDashboard onLogout={handleLogout} />
    case "supervisor":
      return <SupervisorDashboard onLogout={handleLogout} />
    case "admin":
      return <AdminDashboard onLogout={handleLogout} />
    default:
      return <LoginScreen onLogin={handleLogin} />
  }
}
