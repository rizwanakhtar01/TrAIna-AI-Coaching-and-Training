export interface TeamEvalConfig {
  teamId: string;
  teamName: string;
  evaluationFormId: string | null;
  agentNames: string[];
}

export const teamEvalConfigs: TeamEvalConfig[] = [
  {
    teamId: "team_001",
    teamName: "Billing Support Team",
    evaluationFormId: "form_1",
    agentNames: ["Sarah Mitchell", "John Davis"],
  },
  {
    teamId: "team_002",
    teamName: "Technical Support Team",
    evaluationFormId: null,
    agentNames: ["Lisa Kim", "Mike Rodriguez", "Emma Wilson"],
  },
];

export function isEvaluationEnabledForAgent(agentName: string): boolean {
  return teamEvalConfigs.some(
    (team) =>
      team.evaluationFormId !== null && team.agentNames.includes(agentName),
  );
}
