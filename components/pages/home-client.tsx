"use client";

import { useState } from "react";
import { LoginScreen } from "@/components/login-screen";
import { AiCoachingDashboard } from "@/components/ai-coaching-dashboard";
import { SupervisorDashboard } from "@/components/supervisor-dashboard";
import { AdminDashboard } from "@/components/admin-dashboard";
import { SuperAdminDashboard } from "@/components/super-admin-dashboard";
import { AgentDesktop } from "@/components/agent-desktop";
import { TeamEvalProvider } from "@/contexts/team-eval-context";

type UserRole = "agent" | "supervisor" | "admin" | "superadmin" | null;
type ViewMode = "login" | "agentDesktop" | "dashboard" | null;

export function HomeClient() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("login");

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setViewMode("dashboard");
  };

  const handleAgentDesktop = () => {
    setViewMode("agentDesktop");
  };

  const handleLogout = () => {
    setUserRole(null);
    setViewMode("login");
  };

  if (viewMode === "login") {
    return <LoginScreen onLogin={handleLogin} onAgentDesktop={handleAgentDesktop} />;
  }

  return (
    <TeamEvalProvider>
      {viewMode === "agentDesktop" && (
        <AgentDesktop
          onBack={() => setViewMode("login")}
          onCoachingDetails={() => {
            setUserRole("agent");
            setViewMode("dashboard");
          }}
        />
      )}
      {viewMode === "dashboard" && userRole === "agent" && (
        <AiCoachingDashboard
          onLogout={handleLogout}
          onSwitchToSupervisor={() => setUserRole("supervisor")}
        />
      )}
      {viewMode === "dashboard" && userRole === "supervisor" && (
        <SupervisorDashboard
          onLogout={handleLogout}
          onSwitchToAgent={() => setUserRole("agent")}
        />
      )}
      {viewMode === "dashboard" && userRole === "admin" && (
        <AdminDashboard onLogout={handleLogout} />
      )}
      {viewMode === "dashboard" && userRole === "superadmin" && (
        <SuperAdminDashboard onLogout={handleLogout} />
      )}
      {viewMode === "dashboard" && !userRole && (
        <LoginScreen onLogin={handleLogin} onAgentDesktop={handleAgentDesktop} />
      )}
    </TeamEvalProvider>
  );
}
