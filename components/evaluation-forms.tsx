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
  ChevronDown,
  ChevronRight,
  Info,
  Check,
  Hash,
  ToggleLeft,
  GripVertical,
  FilePlus2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface EvaluationQuestion {
  id: string;
  text: string;
  description?: string;
  scoringType: "numeric" | "pass-fail";
  maxScore: number;
  weight: number;
}

export interface EvaluationFormSection {
  id: string;
  name: string;
  questions: EvaluationQuestion[];
}

export interface EvaluationForm {
  id: string;
  name: string;
  sections: EvaluationFormSection[];
  lastUpdated: string;
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

export const initialEvaluationForms: EvaluationForm[] = [
  {
    id: "form_001",
    name: "Billing & Refunds Quality Scorecard",
    lastUpdated: "2 days ago",
    sections: [
      {
        id: "sec_01",
        name: "Opening & Empathy",
        questions: [
          {
            id: "q01",
            text: "Agent greeted the customer professionally and introduced themselves",
            description: "Standard greeting per company script",
            scoringType: "pass-fail",
            maxScore: 10,
            weight: 30,
          },
          {
            id: "q02",
            text: "Agent acknowledged the customer's concern with empathy before moving to resolution",
            description: "Look for empathic language before jumping to solution steps",
            scoringType: "numeric",
            maxScore: 10,
            weight: 70,
          },
        ],
      },
      {
        id: "sec_02",
        name: "Policy & Resolution",
        questions: [
          {
            id: "q03",
            text: "Agent followed correct refund authorization and verification steps",
            description: "All required verification steps completed before processing refund",
            scoringType: "pass-fail",
            maxScore: 10,
            weight: 50,
          },
          {
            id: "q04",
            text: "Agent communicated refund timeline clearly and accurately to the customer",
            description: "Timeline stated must match company policy (5–7 business days)",
            scoringType: "numeric",
            maxScore: 10,
            weight: 50,
          },
        ],
      },
      {
        id: "sec_03",
        name: "Closing",
        questions: [
          {
            id: "q05",
            text: "Agent confirmed the issue was fully resolved before ending the contact",
            description: "Customer verbally confirmed issue resolved or agreed to pending action",
            scoringType: "pass-fail",
            maxScore: 10,
            weight: 50,
          },
          {
            id: "q06",
            text: "Agent summarized the action taken and set clear next-step expectations",
            description: "Summary covers what was done and what happens next",
            scoringType: "numeric",
            maxScore: 10,
            weight: 50,
          },
        ],
      },
    ],
  },
  {
    id: "form_002",
    name: "Technical Support Quality Scorecard",
    lastUpdated: "Yesterday",
    sections: [
      {
        id: "sec_01",
        name: "Opening & Empathy",
        questions: [
          {
            id: "q01",
            text: "Agent greeted customer and acknowledged their technical issue",
            scoringType: "pass-fail",
            maxScore: 10,
            weight: 40,
          },
          {
            id: "q02",
            text: "Agent demonstrated empathy when customer expressed frustration",
            description: "Empathy phrases such as 'I understand how frustrating that must be'",
            scoringType: "numeric",
            maxScore: 10,
            weight: 60,
          },
        ],
      },
      {
        id: "sec_02",
        name: "Troubleshooting Methodology",
        questions: [
          {
            id: "q03",
            text: "Agent followed a structured approach: verify → isolate → resolve",
            description: "Troubleshooting steps are methodical, not random",
            scoringType: "numeric",
            maxScore: 10,
            weight: 50,
          },
          {
            id: "q04",
            text: "Agent escalated to technical team at the correct threshold",
            description: "Escalation criteria: 2+ failed troubleshooting attempts on same issue",
            scoringType: "pass-fail",
            maxScore: 10,
            weight: 50,
          },
        ],
      },
      {
        id: "sec_03",
        name: "Technical Accuracy",
        questions: [
          {
            id: "q05",
            text: "All technical guidance provided was accurate and up to date",
            description: "No misleading or outdated information given to the customer",
            scoringType: "numeric",
            maxScore: 10,
            weight: 60,
          },
          {
            id: "q06",
            text: "Agent documented the issue and troubleshooting steps in the system",
            description: "Case notes include error details, steps tried, and outcome",
            scoringType: "pass-fail",
            maxScore: 10,
            weight: 40,
          },
        ],
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

type View = "forms-list" | "form-detail";

interface QuestionDialogState {
  open: boolean;
  sectionId: string | null;
  editing: EvaluationQuestion | null;
}

interface QuestionFormState {
  text: string;
  description: string;
  scoringType: "numeric" | "pass-fail";
  maxScore: number;
  weight: number;
}

const BLANK_QUESTION: QuestionFormState = {
  text: "",
  description: "",
  scoringType: "numeric",
  maxScore: 10,
  weight: 50,
};

interface EvaluationFormsTabProps {
  forms: EvaluationForm[];
  onFormsChange: (forms: EvaluationForm[]) => void;
}

export function EvaluationFormsTab({ forms, onFormsChange }: EvaluationFormsTabProps) {
  const setForms = (updater: EvaluationForm[] | ((prev: EvaluationForm[]) => EvaluationForm[])) => {
    if (typeof updater === "function") {
      onFormsChange(updater(forms));
    } else {
      onFormsChange(updater);
    }
  };
  const [view, setView] = useState<View>("forms-list");
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Form-level editing
  const [editingFormName, setEditingFormName] = useState(false);
  const [formNameDraft, setFormNameDraft] = useState("");

  // New form dialog
  const [newFormDialogOpen, setNewFormDialogOpen] = useState(false);
  const [newFormName, setNewFormName] = useState("");

  // Section editing
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionNameDraft, setSectionNameDraft] = useState("");
  const [addingSectionName, setAddingSectionName] = useState("");
  const [showAddSection, setShowAddSection] = useState(false);

  // Question dialog
  const [questionDialog, setQuestionDialog] = useState<QuestionDialogState>({
    open: false,
    sectionId: null,
    editing: null,
  });
  const [questionForm, setQuestionForm] = useState<QuestionFormState>({ ...BLANK_QUESTION });
  const [questionErrors, setQuestionErrors] = useState<Record<string, string>>({});

  // Delete states
  const [formToDelete, setFormToDelete] = useState<EvaluationForm | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<{ formId: string; sectionId: string; name: string } | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<{ formId: string; sectionId: string; question: EvaluationQuestion } | null>(null);

  const selectedForm = forms.find((f) => f.id === selectedFormId) ?? null;

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const updateForm = (formId: string, updater: (f: EvaluationForm) => EvaluationForm) => {
    setForms((prev) => prev.map((f) => (f.id === formId ? updater(f) : f)));
    if (selectedFormId === formId) {
      // trigger re-render via setSelectedFormId (same id)
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  // ─── Form-level CRUD ──────────────────────────────────────────────────────

  const createForm = () => {
    if (!newFormName.trim()) return;
    const f: EvaluationForm = {
      id: `form_${Date.now()}`,
      name: newFormName.trim(),
      sections: [],
      lastUpdated: "Just now",
    };
    setForms((prev) => [...prev, f]);
    setNewFormName("");
    setNewFormDialogOpen(false);
  };

  const deleteForm = () => {
    if (!formToDelete) return;
    setForms((prev) => prev.filter((f) => f.id !== formToDelete.id));
    setFormToDelete(null);
    if (selectedFormId === formToDelete.id) {
      setView("forms-list");
      setSelectedFormId(null);
    }
  };

  const saveFormName = () => {
    if (!selectedFormId || !formNameDraft.trim()) return;
    updateForm(selectedFormId, (f) => ({ ...f, name: formNameDraft.trim(), lastUpdated: "Just now" }));
    setEditingFormName(false);
  };

  // ─── Section CRUD ─────────────────────────────────────────────────────────

  const addSection = () => {
    if (!addingSectionName.trim() || !selectedFormId) return;
    const sec: EvaluationFormSection = {
      id: `sec_${Date.now()}`,
      name: addingSectionName.trim(),
      questions: [],
    };
    updateForm(selectedFormId, (f) => ({
      ...f,
      sections: [...f.sections, sec],
      lastUpdated: "Just now",
    }));
    setExpandedSections((prev) => new Set(prev).add(sec.id));
    setAddingSectionName("");
    setShowAddSection(false);
  };

  const saveSectionName = (formId: string, sectionId: string) => {
    if (!sectionNameDraft.trim()) return;
    updateForm(formId, (f) => ({
      ...f,
      sections: f.sections.map((s) =>
        s.id === sectionId ? { ...s, name: sectionNameDraft.trim() } : s
      ),
      lastUpdated: "Just now",
    }));
    setEditingSectionId(null);
  };

  const deleteSection = () => {
    if (!sectionToDelete) return;
    updateForm(sectionToDelete.formId, (f) => ({
      ...f,
      sections: f.sections.filter((s) => s.id !== sectionToDelete.sectionId),
      lastUpdated: "Just now",
    }));
    setSectionToDelete(null);
  };

  // ─── Question CRUD ────────────────────────────────────────────────────────

  const openAddQuestion = (sectionId: string) => {
    setQuestionForm({ ...BLANK_QUESTION });
    setQuestionErrors({});
    setQuestionDialog({ open: true, sectionId, editing: null });
  };

  const openEditQuestion = (sectionId: string, question: EvaluationQuestion) => {
    setQuestionForm({
      text: question.text,
      description: question.description ?? "",
      scoringType: question.scoringType,
      maxScore: question.maxScore,
      weight: question.weight,
    });
    setQuestionErrors({});
    setQuestionDialog({ open: true, sectionId, editing: question });
  };

  const validateQuestion = () => {
    const errors: Record<string, string> = {};
    if (!questionForm.text.trim()) errors.text = "Question text is required.";
    if (questionForm.scoringType === "numeric" && (questionForm.maxScore < 1 || questionForm.maxScore > 100)) {
      errors.maxScore = "Max score must be between 1 and 100.";
    }
    if (questionForm.weight < 1 || questionForm.weight > 100) errors.weight = "Weight must be between 1 and 100.";
    setQuestionErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveQuestion = () => {
    if (!validateQuestion() || !selectedFormId || !questionDialog.sectionId) return;
    updateForm(selectedFormId, (f) => ({
      ...f,
      sections: f.sections.map((s) => {
        if (s.id !== questionDialog.sectionId) return s;
        const q: EvaluationQuestion = {
          id: questionDialog.editing?.id ?? `q${Date.now()}`,
          text: questionForm.text.trim(),
          description: questionForm.description.trim() || undefined,
          scoringType: questionForm.scoringType,
          maxScore: questionForm.scoringType === "pass-fail" ? 10 : questionForm.maxScore,
          weight: questionForm.weight,
        };
        return {
          ...s,
          questions: questionDialog.editing
            ? s.questions.map((qn) => (qn.id === q.id ? q : qn))
            : [...s.questions, q],
        };
      }),
      lastUpdated: "Just now",
    }));
    setQuestionDialog({ open: false, sectionId: null, editing: null });
  };

  const deleteQuestion = () => {
    if (!questionToDelete) return;
    updateForm(questionToDelete.formId, (f) => ({
      ...f,
      sections: f.sections.map((s) =>
        s.id === questionToDelete.sectionId
          ? { ...s, questions: s.questions.filter((q) => q.id !== questionToDelete.question.id) }
          : s
      ),
      lastUpdated: "Just now",
    }));
    setQuestionToDelete(null);
  };

  // ─── Views ────────────────────────────────────────────────────────────────

  if (view === "forms-list") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Evaluation Forms</h2>
            <p className="text-muted-foreground">
              Build quality scorecards with sections and scored questions. Assign forms to teams via Team Management.
            </p>
          </div>
          <Button onClick={() => setNewFormDialogOpen(true)}>
            <FilePlus2 className="h-4 w-4 mr-2" />
            New Form
          </Button>
        </div>

        {forms.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium text-muted-foreground">No evaluation forms yet</p>
              <p className="text-sm text-muted-foreground mt-1">Create a form to define quality criteria for your teams.</p>
              <Button size="sm" variant="outline" className="mt-4" onClick={() => setNewFormDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Create First Form
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {forms.map((form) => {
              const totalQ = form.sections.reduce((n, s) => n + s.questions.length, 0);
              return (
                <Card key={form.id} className="hover:border-primary/40 transition-colors cursor-pointer group" onClick={() => { setSelectedFormId(form.id); setView("form-detail"); }}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <ClipboardList className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{form.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {form.sections.length} {form.sections.length === 1 ? "section" : "sections"} · {totalQ} {totalQ === 1 ? "question" : "questions"} · Updated {form.lastUpdated}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setFormToDelete(form)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* New Form Dialog */}
        <Dialog open={newFormDialogOpen} onOpenChange={setNewFormDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>New Evaluation Form</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <Label htmlFor="new-form-name">Form Name <span className="text-destructive">*</span></Label>
              <Input id="new-form-name" placeholder="e.g. Billing Quality Scorecard" value={newFormName} onChange={(e) => setNewFormName(e.target.value)} autoFocus onKeyDown={(e) => e.key === "Enter" && createForm()} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewFormDialogOpen(false)}>Cancel</Button>
              <Button onClick={createForm} disabled={!newFormName.trim()}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Form Confirm */}
        <AlertDialog open={!!formToDelete} onOpenChange={(open) => !open && setFormToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Evaluation Form</AlertDialogTitle>
              <AlertDialogDescription>
                Delete <strong>"{formToDelete?.name}"</strong>? All sections and questions will be permanently removed. Teams assigned to this form will need to be re-linked.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={deleteForm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // ─── Form Detail View ─────────────────────────────────────────────────────

  if (!selectedForm) return null;

  const totalWeight = selectedForm.sections.reduce(
    (sum, s) => sum + s.questions.reduce((sq, q) => sq + q.weight, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="sm" onClick={() => { setView("forms-list"); setSelectedFormId(null); setEditingFormName(false); setShowAddSection(false); }}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Evaluation Forms
        </Button>
        <span className="text-muted-foreground">/</span>
        {editingFormName ? (
          <div className="flex items-center gap-2">
            <Input value={formNameDraft} onChange={(e) => setFormNameDraft(e.target.value)} className="h-8 text-sm max-w-xs" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveFormName(); if (e.key === "Escape") setEditingFormName(false); }} />
            <Button size="sm" onClick={saveFormName}><Check className="h-4 w-4" /></Button>
            <Button size="sm" variant="ghost" onClick={() => setEditingFormName(false)}>Cancel</Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{selectedForm.name}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setFormNameDraft(selectedForm.name); setEditingFormName(true); }}>
              <Edit className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
        <Badge variant="secondary" className="ml-auto">
          {selectedForm.sections.length} {selectedForm.sections.length === 1 ? "section" : "sections"} · {selectedForm.sections.reduce((n, s) => n + s.questions.length, 0)} questions
        </Badge>
      </div>

      {/* Amazon Connect banner */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              <strong className="text-blue-800">Amazon Connect Integration: </strong>
              This form is applied automatically to contacts handled by teams linked to it. Scores surface in contact review cards and drive challenge pattern detection and coaching plan creation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      {selectedForm.sections.length === 0 && !showAddSection && (
        <Card>
          <CardContent className="py-12 text-center">
            <GripVertical className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium text-muted-foreground">No sections yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add sections to organize your evaluation criteria (e.g. Opening, Resolution, Closing).</p>
            <Button size="sm" variant="outline" className="mt-4" onClick={() => setShowAddSection(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add First Section
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {selectedForm.sections.map((section, sIndex) => {
          const isExpanded = expandedSections.has(section.id);
          const sectionWeight = section.questions.reduce((s, q) => s + q.weight, 0);
          return (
            <Card key={section.id} className="overflow-hidden">
              <Collapsible open={isExpanded} onOpenChange={() => toggleSection(section.id)}>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/40 transition-colors select-none">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-primary">{sIndex + 1}</div>
                    {editingSectionId === section.id ? (
                      <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                        <Input value={sectionNameDraft} onChange={(e) => setSectionNameDraft(e.target.value)} className="h-7 text-sm max-w-xs" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveSectionName(selectedForm.id, section.id); if (e.key === "Escape") setEditingSectionId(null); }} />
                        <Button size="sm" className="h-7 px-2" onClick={() => saveSectionName(selectedForm.id, section.id)}><Check className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setEditingSectionId(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center gap-2">
                        <span className="font-medium text-sm">{section.name}</span>
                        <Badge variant="outline" className="text-xs">{section.questions.length} questions</Badge>
                      </div>
                    )}
                    <div className="flex items-center gap-1 ml-auto" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setSectionNameDraft(section.name); setEditingSectionId(section.id); }}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setSectionToDelete({ formId: selectedForm.id, sectionId: section.id, name: section.name })}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" /> : <ChevronRight className="h-4 w-4 text-muted-foreground ml-1" />}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t bg-white">
                    {section.questions.length === 0 ? (
                      <div className="py-6 text-center text-muted-foreground text-sm">No questions yet in this section.</div>
                    ) : (
                      <div className="divide-y">
                        {section.questions.map((q, qIndex) => {
                          const isPassFail = q.scoringType === "pass-fail";
                          return (
                            <div key={q.id} className="flex items-start gap-3 p-4 hover:bg-muted/20">
                              <span className="text-xs text-muted-foreground font-mono mt-0.5 w-5 flex-shrink-0">{qIndex + 1}.</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">{q.text}</p>
                                {q.description && <p className="text-xs text-muted-foreground mt-0.5">{q.description}</p>}
                                <div className="flex items-center gap-2 mt-1.5">
                                  {isPassFail ? (
                                    <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit">
                                      <ToggleLeft className="h-3 w-3" />Pass / Fail
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit">
                                      <Hash className="h-3 w-3" />0 – {q.maxScore}
                                    </Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">Weight: {q.weight}%</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditQuestion(section.id, q)}>
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setQuestionToDelete({ formId: selectedForm.id, sectionId: section.id, question: q })}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="p-3 border-t bg-muted/20 flex items-center justify-between">
                      <Button size="sm" variant="outline" onClick={() => { openAddQuestion(section.id); setExpandedSections((p) => new Set(p).add(section.id)); }}>
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Question
                      </Button>
                      {section.questions.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          Section weight total: <span className={sectionWeight !== 100 ? "text-amber-600 font-medium" : "text-green-600 font-medium"}>{sectionWeight}%</span>
                        </span>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {/* Add Section UI */}
      {showAddSection ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Section name (e.g. Opening, Resolution, Closing)"
                value={addingSectionName}
                onChange={(e) => setAddingSectionName(e.target.value)}
                className="flex-1"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") addSection(); if (e.key === "Escape") { setShowAddSection(false); setAddingSectionName(""); } }}
              />
              <Button size="sm" onClick={addSection} disabled={!addingSectionName.trim()}>
                <Check className="h-4 w-4 mr-1" />
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setShowAddSection(false); setAddingSectionName(""); }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" className="w-full" onClick={() => setShowAddSection(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      )}

      {/* Question Dialog */}
      <Dialog open={questionDialog.open} onOpenChange={(open) => !open && setQuestionDialog({ open: false, sectionId: null, editing: null })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{questionDialog.editing ? "Edit Question" : "Add Question"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="q-text">Question <span className="text-destructive">*</span></Label>
              <Textarea id="q-text" placeholder="What is being evaluated?" rows={2} value={questionForm.text} onChange={(e) => setQuestionForm((p) => ({ ...p, text: e.target.value }))} />
              {questionErrors.text && <p className="text-xs text-destructive">{questionErrors.text}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-desc">Description / Evaluation Guidance <span className="text-muted-foreground text-xs font-normal">(optional)</span></Label>
              <Textarea id="q-desc" placeholder="Guidance for evaluators on how to score this question..." rows={2} value={questionForm.description} onChange={(e) => setQuestionForm((p) => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="q-scoring">Scoring Type <span className="text-destructive">*</span></Label>
              <Select value={questionForm.scoringType} onValueChange={(val) => setQuestionForm((p) => ({ ...p, scoringType: val as "numeric" | "pass-fail" }))}>
                <SelectTrigger id="q-scoring"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="numeric">Numeric (0 – Max Score)</SelectItem>
                  <SelectItem value="pass-fail">Pass / Fail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {questionForm.scoringType === "numeric" && (
              <div className="space-y-1.5">
                <Label htmlFor="q-max">Max Score <span className="text-destructive">*</span></Label>
                <Input id="q-max" type="number" min={1} max={100} value={questionForm.maxScore} onChange={(e) => setQuestionForm((p) => ({ ...p, maxScore: Number(e.target.value) }))} />
                {questionErrors.maxScore && <p className="text-xs text-destructive">{questionErrors.maxScore}</p>}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="q-weight">Weight within section (%) <span className="text-destructive">*</span></Label>
              <Input id="q-weight" type="number" min={1} max={100} value={questionForm.weight} onChange={(e) => setQuestionForm((p) => ({ ...p, weight: Number(e.target.value) }))} />
              {questionErrors.weight && <p className="text-xs text-destructive">{questionErrors.weight}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuestionDialog({ open: false, sectionId: null, editing: null })}>Cancel</Button>
            <Button onClick={saveQuestion}>{questionDialog.editing ? "Save Changes" : "Add Question"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Section Confirm */}
      <AlertDialog open={!!sectionToDelete} onOpenChange={(open) => !open && setSectionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>Delete section <strong>"{sectionToDelete?.name}"</strong>? All questions within it will also be removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={deleteSection}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Question Confirm */}
      <AlertDialog open={!!questionToDelete} onOpenChange={(open) => !open && setQuestionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>Delete this question from the evaluation form? Historical scores for this question will no longer be displayed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={deleteQuestion}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
