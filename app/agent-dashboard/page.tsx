"use client";

export const dynamic = "force-dynamic";

import { AiCoachingDashboard } from "@/components/ai-coaching-dashboard";

export default function AgentDashboardPage() {
  const handleLogout = () => {
    window.close();
  };

  return <AiCoachingDashboard onLogout={handleLogout} />;
}
