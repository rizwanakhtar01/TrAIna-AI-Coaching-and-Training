"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { teamEvalConfigs } from "@/lib/team-eval-config";

export interface TeamEvalSetting {
  teamId: string;
  evaluationEnabled: boolean;
  evaluationFormId: string | null;
  agentNames: string[];
}

interface TeamEvalContextValue {
  teamSettings: TeamEvalSetting[];
  upsertTeamEvalSetting: (
    teamId: string,
    enabled: boolean,
    formId: string | null,
    agentNames?: string[],
  ) => void;
  removeTeamEvalSetting: (teamId: string) => void;
  isEvaluationEnabledForTeam: (teamId: string) => boolean;
  isEvaluationEnabledForAgentName: (agentName: string) => boolean;
  getFormIdForTeam: (teamId: string) => string | null;
}

const TeamEvalContext = createContext<TeamEvalContextValue | null>(null);

export function TeamEvalProvider({ children }: { children: ReactNode }) {
  const [teamSettings, setTeamSettings] = useState<TeamEvalSetting[]>(
    teamEvalConfigs.map((t) => ({
      teamId: t.teamId,
      evaluationEnabled: t.evaluationFormId !== null,
      evaluationFormId: t.evaluationFormId,
      agentNames: t.agentNames,
    })),
  );

  const upsertTeamEvalSetting = (
    teamId: string,
    enabled: boolean,
    formId: string | null,
    agentNames?: string[],
  ) => {
    setTeamSettings((prev) => {
      const existing = prev.find((s) => s.teamId === teamId);
      if (existing) {
        return prev.map((s) =>
          s.teamId === teamId
            ? {
                ...s,
                evaluationEnabled: enabled,
                evaluationFormId: formId,
                agentNames: agentNames ?? s.agentNames,
              }
            : s,
        );
      }
      return [
        ...prev,
        {
          teamId,
          evaluationEnabled: enabled,
          evaluationFormId: formId,
          agentNames: agentNames ?? [],
        },
      ];
    });
  };

  const removeTeamEvalSetting = (teamId: string) => {
    setTeamSettings((prev) => prev.filter((s) => s.teamId !== teamId));
  };

  const isEvaluationEnabledForTeam = (teamId: string): boolean => {
    const setting = teamSettings.find((s) => s.teamId === teamId);
    return setting?.evaluationEnabled ?? false;
  };

  const isEvaluationEnabledForAgentName = (agentName: string): boolean => {
    const setting = teamSettings.find(
      (s) => s.evaluationEnabled && s.agentNames.includes(agentName),
    );
    return setting !== undefined;
  };

  const getFormIdForTeam = (teamId: string): string | null => {
    const setting = teamSettings.find((s) => s.teamId === teamId);
    return setting?.evaluationFormId ?? null;
  };

  return (
    <TeamEvalContext.Provider
      value={{
        teamSettings,
        upsertTeamEvalSetting,
        removeTeamEvalSetting,
        isEvaluationEnabledForTeam,
        isEvaluationEnabledForAgentName,
        getFormIdForTeam,
      }}
    >
      {children}
    </TeamEvalContext.Provider>
  );
}

export function useTeamEval() {
  const ctx = useContext(TeamEvalContext);
  if (!ctx) throw new Error("useTeamEval must be used within TeamEvalProvider");
  return ctx;
}
