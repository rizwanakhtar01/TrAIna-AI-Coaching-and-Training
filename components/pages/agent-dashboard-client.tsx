"use client";

import { AiCoachingDashboard } from "@/components/ai-coaching-dashboard";

export function AgentDashboardClient() {
  return <AiCoachingDashboard onLogout={() => window.close()} />;
}
