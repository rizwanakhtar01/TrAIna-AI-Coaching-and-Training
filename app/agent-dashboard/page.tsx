"use client";

import { AiCoachingDashboard } from "@/components/ai-coaching-dashboard";

export default function AgentDashboardPage() {
  const handleLogout = () => {
    window.close();
  };

  return <AiCoachingDashboard onLogout={handleLogout} />;
}
