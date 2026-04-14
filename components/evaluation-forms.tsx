"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ClipboardList,
  ChevronRight,
  Info,
  Check,
  Hash,
  ToggleLeft,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

export interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
  scoringType: "numeric" | "pass-fail";
  maxScore: number;
  weight: number;
}

export interface TeamEvaluationConfig {
  teamId: string;
  teamName: string;
  supervisorName: string;
  agentCount: number;
  enabled: boolean;
  formName: string;
  criteria: EvaluationCriterion[];
  lastUpdated: string;
}

const initialTeamConfigs: TeamEvaluationConfig[] = [
  {
    teamId: "team_001",
    teamName: "Billing & Refunds Team",
    supervisorName: "Sarah Johnson",
    agentCount: 4,
    enabled: true,
    formName: "Billing & Refunds Quality Scorecard",
    lastUpdated: "2 days ago",
    criteria: [
      {
        id: "c1",
        name: "Empathy & Tone",
        description: "Agent demonstrates genuine understanding of customer emotions and maintains a professional, warm tone throughout.",
        scoringType: "numeric",
        maxScore: 10,
        weight: 25,
      },
      {
        id: "c2",
        name: "Policy Compliance",
        description: "Agent follows all required verification steps, refund policies, and compliance protocols without skipping.",
        scoringType: "numeric",
        maxScore: 10,
        weight: 25,
      },
      {
        id: "c3",
        name: "First Contact Resolution",
        description: "Customer's issue is fully resolved in the interaction without requiring a callback or additional contacts.",
        scoringType: "pass-fail",
        maxScore: 10,
        weight: 30,
      },
      {
        id: "c4",
        name: "Communication Clarity",
        description: "Agent explains processes and next steps in clear, accessible language. Customer confirms understanding.",
        scoringType: "numeric",
        maxScore: 10,
        weight: 20,
      },
    ],
  },
  {
    teamId: "team_002",
    teamName: "Technical Support Team",
    supervisorName: "Emily Rodriguez",
    agentCount: 3,
    enabled: true,
    formName: "Technical Support Quality Scorecard",
    lastUpdated: "Yesterday",
    criteria: [
      {
        id: "c1",
        name: "Empathy & Tone",
        description: "Agent demonstrates genuine understanding of customer emotions and maintains a professional, warm tone throughout.",
        scoringType: "numeric",
        maxScore: 10,
        weight: 20,
      },
      {
        id: "c2",
        name: "Troubleshooting Methodology",
        description: "Agent follows structured troubleshooting steps, documents each step, and escalates at the correct threshold.",
        scoringType: "numeric",
        maxScore: 10,
        weight: 35,
      },
      {
        id: "c3",
        name: "Escalation Handling",
        description: "Escalations are triggered at the right time, with a complete case handover and clear customer communication.",
        scoringType: "pass-fail",
        maxScore: 10,
        weight: 25,
      },
      {
        id: "c4",
        name: "Technical Accuracy",
        description: "Agent provides technically correct information and does not give misleading guidance on product functionality.",
        scoringType: "numeric",
        maxScore: 10,
        weight: 20,
      },
    ],
  },
  {
    teamId: "team_003",
    teamName: "Customer Experience Team",
    supervisorName: "James Wilson",
    agentCount: 5,
    enabled: false,
    formName: "",
    lastUpdated: "5 days ago",
    criteria: [],
  },
];

export function EvaluationFormsTab() {
  const [teamConfigs, setTeamConfigs] = useState<TeamEvaluationConfig[]>(initialTeamConfigs);
  const [selectedTeam, setSelectedTeam] = useState<TeamEvaluationConfig | null>(null);
  const [criterionDialogOpen, setCriterionDialogOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<EvaluationCriterion | null>(null);
  const [criterionToDelete, setCriterionToDelete] = useState<EvaluationCriterion | null>(null);
  const [criterionForm, setCriterionForm] = useState({
    name: "",
    description: "",
    scoringType: "numeric" as "numeric" | "pass-fail",
    maxScore: 10,
    weight: 20,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingFormName, setEditingFormName] = useState(false);
  const [formNameDraft, setFormNameDraft] = useState("");

  const toggleTeamEnabled = (teamId: string) => {
    setTeamConfigs((prev) =>
      prev.map((t) =>
        t.teamId === teamId ? { ...t, enabled: !t.enabled } : t
      )
    );
    if (selectedTeam?.teamId === teamId) {
      setSelectedTeam((prev) => prev ? { ...prev, enabled: !prev.enabled } : null);
    }
  };

  const openAddCriterion = () => {
    setEditingCriterion(null);
    setCriterionForm({ name: "", description: "", scoringType: "numeric", maxScore: 10, weight: 20 });
    setFormErrors({});
    setCriterionDialogOpen(true);
  };

  const openEditCriterion = (criterion: EvaluationCriterion) => {
    setEditingCriterion(criterion);
    setCriterionForm({
      name: criterion.name,
      description: criterion.description,
      scoringType: criterion.scoringType,
      maxScore: criterion.maxScore,
      weight: criterion.weight,
    });
    setFormErrors({});
    setCriterionDialogOpen(true);
  };

  const validateCriterionForm = () => {
    const errors: Record<string, string> = {};
    if (!criterionForm.name.trim()) errors.name = "Name is required.";
    if (!criterionForm.description.trim()) errors.description = "Description is required.";
    if (criterionForm.scoringType === "numeric" && (criterionForm.maxScore < 1 || criterionForm.maxScore > 100)) {
      errors.maxScore = "Max score must be between 1 and 100.";
    }
    if (criterionForm.weight < 1 || criterionForm.weight > 100) errors.weight = "Weight must be between 1 and 100.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveCriterion = () => {
    if (!validateCriterionForm() || !selectedTeam) return;

    const updatedTeams = teamConfigs.map((team) => {
      if (team.teamId !== selectedTeam.teamId) return team;
      let newCriteria: EvaluationCriterion[];
      if (editingCriterion) {
        newCriteria = team.criteria.map((c) =>
          c.id === editingCriterion.id
            ? { ...c, ...criterionForm }
            : c
        );
      } else {
        newCriteria = [
          ...team.criteria,
          {
            id: `c${Date.now()}`,
            ...criterionForm,
          },
        ];
      }
      return { ...team, criteria: newCriteria, lastUpdated: "Just now" };
    });

    setTeamConfigs(updatedTeams);
    const updated = updatedTeams.find((t) => t.teamId === selectedTeam.teamId)!;
    setSelectedTeam(updated);
    setCriterionDialogOpen(false);
  };

  const deleteCriterion = () => {
    if (!criterionToDelete || !selectedTeam) return;
    const updatedTeams = teamConfigs.map((team) => {
      if (team.teamId !== selectedTeam.teamId) return team;
      return {
        ...team,
        criteria: team.criteria.filter((c) => c.id !== criterionToDelete.id),
        lastUpdated: "Just now",
      };
    });
    setTeamConfigs(updatedTeams);
    const updated = updatedTeams.find((t) => t.teamId === selectedTeam.teamId)!;
    setSelectedTeam(updated);
    setCriterionToDelete(null);
  };

  const saveFormName = () => {
    if (!selectedTeam) return;
    const updatedTeams = teamConfigs.map((t) =>
      t.teamId === selectedTeam.teamId ? { ...t, formName: formNameDraft, lastUpdated: "Just now" } : t
    );
    setTeamConfigs(updatedTeams);
    setSelectedTeam({ ...selectedTeam, formName: formNameDraft });
    setEditingFormName(false);
  };

  const totalWeight = selectedTeam
    ? selectedTeam.criteria.reduce((sum, c) => sum + c.weight, 0)
    : 0;

  // ─── List view ───────────────────────────────────────────────────────────────
  if (!selectedTeam) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Evaluation Forms</h2>
          <p className="text-muted-foreground">
            Configure quality evaluation criteria for each team. Criteria are applied automatically to agent contacts via Amazon Connect.
          </p>
        </div>

        <div className="grid gap-4">
          {teamConfigs.map((team) => (
            <Card
              key={team.teamId}
              className="hover:border-primary/40 transition-colors cursor-pointer group"
              onClick={() => setSelectedTeam(team)}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{team.teamName}</p>
                        {team.enabled ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                            Evaluation On
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Evaluation Off
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Supervisor: {team.supervisorName} · {team.agentCount} agents ·{" "}
                        {team.criteria.length} {team.criteria.length === 1 ? "criterion" : "criteria"}{" "}
                        {team.formName ? `· "${team.formName}"` : ""} ·{" "}
                        Updated {team.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div onClick={(e) => e.stopPropagation()}>
                      <Switch
                        checked={team.enabled}
                        onCheckedChange={() => toggleTeamEnabled(team.teamId)}
                      />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // ─── Detail view ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setSelectedTeam(null)}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="h-4 w-px bg-border" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">{selectedTeam.teamName}</h2>
          <p className="text-sm text-muted-foreground">
            Supervisor: {selectedTeam.supervisorName} · {selectedTeam.agentCount} agents
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Evaluation</span>
            <Switch
              checked={selectedTeam.enabled}
              onCheckedChange={() => toggleTeamEnabled(selectedTeam.teamId)}
            />
            {selectedTeam.enabled ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">On</Badge>
            ) : (
              <Badge variant="secondary">Off</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Form Name */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Evaluation Form Name</CardTitle>
          <CardDescription>
            This name appears on agent contact reviews to identify which form was used.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {editingFormName ? (
            <div className="flex items-center gap-2">
              <Input
                value={formNameDraft}
                onChange={(e) => setFormNameDraft(e.target.value)}
                placeholder="e.g. Billing Quality Scorecard"
                className="max-w-sm"
                autoFocus
              />
              <Button size="sm" onClick={saveFormName}>
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingFormName(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm">
                {selectedTeam.formName || (
                  <span className="text-muted-foreground italic">No form name set</span>
                )}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setFormNameDraft(selectedTeam.formName);
                  setEditingFormName(true);
                }}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weight distribution */}
      {selectedTeam.criteria.length > 0 && (
        <Card className={totalWeight === 100 ? "border-green-200 bg-green-50/30" : "border-amber-200 bg-amber-50/30"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Total weight distribution</span>
              <Badge
                className={
                  totalWeight === 100
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }
              >
                {totalWeight}% / 100%
              </Badge>
            </div>
            <Progress value={Math.min(totalWeight, 100)} className="h-2" />
            {totalWeight !== 100 && (
              <p className="text-xs text-amber-700 mt-2 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Weights should add up to 100%. Current total: {totalWeight}%.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Criteria list */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Evaluation Criteria</CardTitle>
              <CardDescription>
                Define the dimensions used to score agent contacts. Use numeric (0–max) or pass/fail scoring per criterion.
              </CardDescription>
            </div>
            <Button size="sm" onClick={openAddCriterion}>
              <Plus className="h-4 w-4 mr-1" />
              Add Criterion
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {selectedTeam.criteria.length === 0 ? (
            <div className="text-center py-12 px-6">
              <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-muted-foreground">No criteria yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add criteria to define how contacts for this team will be evaluated.
              </p>
              <Button size="sm" variant="outline" className="mt-4" onClick={openAddCriterion}>
                <Plus className="h-4 w-4 mr-1" />
                Add First Criterion
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Criterion</TableHead>
                  <TableHead>Scoring</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTeam.criteria.map((criterion) => (
                  <TableRow key={criterion.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{criterion.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-md">
                          {criterion.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {criterion.scoringType === "pass-fail" ? (
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <ToggleLeft className="h-3 w-3" />
                          Pass / Fail
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <Hash className="h-3 w-3" />
                          0 – {criterion.maxScore}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={criterion.weight} className="h-1.5 w-16" />
                        <span className="text-sm text-muted-foreground">{criterion.weight}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditCriterion(criterion)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setCriterionToDelete(criterion)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Amazon Connect info banner */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">Amazon Connect Integration</p>
              <p className="text-xs text-blue-700 mt-0.5">
                When enabled, these criteria are applied automatically to every contact handled by agents in this team. Scores appear in contact review cards and feed into challenge pattern detection and coaching plan generation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Criterion Dialog */}
      <Dialog open={criterionDialogOpen} onOpenChange={setCriterionDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCriterion ? "Edit Criterion" : "Add Criterion"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="crit-name">
                Criterion Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="crit-name"
                placeholder="e.g. Empathy & Tone"
                value={criterionForm.name}
                onChange={(e) => setCriterionForm((p) => ({ ...p, name: e.target.value }))}
              />
              {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="crit-desc">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="crit-desc"
                placeholder="Describe what this criterion measures and how it is evaluated..."
                rows={3}
                value={criterionForm.description}
                onChange={(e) => setCriterionForm((p) => ({ ...p, description: e.target.value }))}
              />
              {formErrors.description && <p className="text-xs text-destructive">{formErrors.description}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="crit-scoring">
                Scoring Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={criterionForm.scoringType}
                onValueChange={(val) => setCriterionForm((p) => ({ ...p, scoringType: val as "numeric" | "pass-fail" }))}
              >
                <SelectTrigger id="crit-scoring">
                  <SelectValue placeholder="Choose scoring type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="numeric">Numeric (0 – Max Score)</SelectItem>
                  <SelectItem value="pass-fail">Pass / Fail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {criterionForm.scoringType === "numeric" && (
              <div className="space-y-1.5">
                <Label htmlFor="crit-max">
                  Max Score <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="crit-max"
                  type="number"
                  min={1}
                  max={100}
                  value={criterionForm.maxScore}
                  onChange={(e) =>
                    setCriterionForm((p) => ({ ...p, maxScore: Number(e.target.value) }))
                  }
                />
                {formErrors.maxScore && <p className="text-xs text-destructive">{formErrors.maxScore}</p>}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="crit-weight">
                Weight (%) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="crit-weight"
                type="number"
                min={1}
                max={100}
                value={criterionForm.weight}
                onChange={(e) =>
                  setCriterionForm((p) => ({ ...p, weight: Number(e.target.value) }))
                }
              />
              {formErrors.weight && <p className="text-xs text-destructive">{formErrors.weight}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCriterionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveCriterion}>
              {editingCriterion ? "Save Changes" : "Add Criterion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!criterionToDelete} onOpenChange={(open) => !open && setCriterionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Criterion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{criterionToDelete?.name}"</strong>? This will remove it from the evaluation form and historical scores will no longer reference this criterion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={deleteCriterion}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
