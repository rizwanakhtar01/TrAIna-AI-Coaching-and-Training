"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Plug,
  Brain,
  ClipboardCheck,
  CheckCircle2,
  CheckCircle,
  Info,
} from "lucide-react";

interface WizardFormData {
  companyName: string;
  primaryAdminEmail: string;
  licenseEndDate: string;
  amazonConnectInstanceId: string;
  numberOfAgents: string;
  region: string;
  llmApiKey: string;
  aiCoachingTier: "none" | "base" | "standard" | "advanced";
  training: boolean;
  evalCoachingEnabled: boolean;
  coachingTrigger: "always" | "below_threshold";
  thresholdValue: number;
  ingestionFrequency: "real_time" | "daily" | "manual";
}

interface CustomerOnboardingWizardProps {
  onClose: () => void;
  onCreate: (data: WizardFormData) => void;
}

const STEPS = [
  { number: 1, label: "Business details",    icon: Building2     },
  { number: 2, label: "Amazon Connect",      icon: Plug          },
  { number: 3, label: "AI configuration",   icon: Brain         },
  { number: 4, label: "Eval coaching",       icon: ClipboardCheck },
  { number: 5, label: "Review",             icon: CheckCircle2  },
];

const REGIONS = [
  { value: "us-east-1",      label: "US East (N. Virginia)"       },
  { value: "us-west-2",      label: "US West (Oregon)"            },
  { value: "eu-west-2",      label: "Europe (London)"             },
  { value: "eu-central-1",   label: "Europe (Frankfurt)"          },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)"    },
  { value: "ap-southeast-2", label: "Asia Pacific (Sydney)"       },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)"        },
];

const defaultForm: WizardFormData = {
  companyName: "",
  primaryAdminEmail: "",
  licenseEndDate: "",
  amazonConnectInstanceId: "",
  numberOfAgents: "",
  region: "",
  llmApiKey: "",
  aiCoachingTier: "none",
  training: false,
  evalCoachingEnabled: false,
  coachingTrigger: "always",
  thresholdValue: 70,
  ingestionFrequency: "daily",
};

function RadioCard({
  selected,
  onClick,
  title,
  description,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40 hover:bg-muted/40"
      }`}
    >
      <span
        className={`mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
          selected ? "border-primary" : "border-muted-foreground/40"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-primary block" />}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
        {children}
      </div>
    </button>
  );
}

function ReviewRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-4">
      <span className="text-sm text-muted-foreground flex-shrink-0">{label}</span>
      <span className={`text-sm text-right ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

export function CustomerOnboardingWizard({
  onClose,
  onCreate,
}: CustomerOnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<WizardFormData>(defaultForm);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof WizardFormData, value: WizardFormData[keyof WizardFormData]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const regionLabel = REGIONS.find((r) => r.value === form.region)?.label ?? form.region;

  const canProceed = () => {
    if (step === 1) return !!form.companyName && !!form.primaryAdminEmail;
    if (step === 2) return !!form.amazonConnectInstanceId && !!form.numberOfAgents && !!form.region;
    if (step === 3) return form.aiCoachingTier !== "none";
    return true;
  };

  const handleBack = () => {
    if (step === 1) onClose();
    else setStep((s) => s - 1);
  };

  const handleNext = () => setStep((s) => s + 1);

  const handleSubmit = () => {
    onCreate(form);
    setSubmitted(true);
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 border-2 border-primary bg-background flex flex-col">
        {/* header */}
        <header className="bg-card border-b border-border px-6 flex-shrink-0 flex h-16 items-center">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to customers
          </Button>
        </header>

        {/* body */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="max-w-md w-full mx-auto px-6 py-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Customer created</h2>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{form.companyName}</span> has been
                added to the platform.
              </p>
            </div>
            <div className="bg-muted/40 border rounded-lg p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Business</span>
                <span className="font-medium">{form.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Admin email</span>
                <span className="font-medium">{form.primaryAdminEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI Coaching tier</span>
                <span className="font-medium capitalize">{form.aiCoachingTier}</span>
              </div>
              {form.evalCoachingEnabled && (
                <>
                  <hr className="border-border" />
                  <div>
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      Evaluation coaching enabled
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coaching trigger</span>
                    <span className="font-medium">
                      {form.coachingTrigger === "always" ? "Always" : `Below ${form.thresholdValue}%`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ingestion</span>
                    <span className="font-medium">
                      {form.ingestionFrequency === "real_time"
                        ? "Real-time"
                        : form.ingestionFrequency === "daily"
                        ? "Daily"
                        : "Manual only"}
                    </span>
                  </div>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              An invitation email will be sent to {form.primaryAdminEmail} to set up their account.
            </p>
            <Button className="w-full" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Wizard ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 border-2 border-primary bg-background flex flex-col">

      {/* Header — matches app pattern: bg-card border-b, back button top-left */}
      <header className="bg-card border-b border-border px-6 flex-shrink-0 flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-lg font-semibold">Create new customer</h1>
        </div>
        <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 font-medium">
          Super Admin
        </Badge>
      </header>

      {/* Step indicator strip */}
      <div className="bg-muted/30 border-b border-border px-6 py-3 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-center">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isActive = s.number === step;
            const isDone = s.number < step;
            return (
              <div key={s.number} className="flex items-center flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center border-2 transition-all ${
                      isDone
                        ? "bg-primary border-primary text-white"
                        : isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Icon className="h-3 w-3" />
                    )}
                  </div>
                  <span
                    className={`text-xs whitespace-nowrap ${
                      isActive
                        ? "text-primary font-medium"
                        : isDone
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-3 transition-all ${
                      s.number < step ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scrollable content — form + action buttons (no separator) */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

          {/* ── Step 1: Business details ────────────────────────────────── */}
          {step === 1 && (
            <>
              <div>
                <h2 className="text-xl font-semibold">Business details</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Basic information about the customer organization.
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">
                    Business Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    value={form.companyName}
                    onChange={(e) => set("companyName", e.target.value)}
                    placeholder="Acme Corp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={form.primaryAdminEmail}
                    onChange={(e) => set("primaryAdminEmail", e.target.value)}
                    placeholder="admin@company.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    An email will be sent with Admin Portal Credentials
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseEndDate">License End Date</Label>
                  <Input
                    id="licenseEndDate"
                    type="date"
                    value={form.licenseEndDate}
                    onChange={(e) => set("licenseEndDate", e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* ── Step 2: Amazon Connect setup ────────────────────────────── */}
          {step === 2 && (
            <>
              <div>
                <h2 className="text-xl font-semibold">Amazon Connect setup</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect to the customer's Amazon Connect instance.
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="connectInstanceId">
                    Amazon Connect Instance ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="connectInstanceId"
                    value={form.amazonConnectInstanceId}
                    onChange={(e) => set("amazonConnectInstanceId", e.target.value)}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberOfAgents">
                    No. of Agents <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="numberOfAgents"
                    type="number"
                    value={form.numberOfAgents}
                    onChange={(e) => set("numberOfAgents", e.target.value)}
                    placeholder="e.g. 50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">
                    Region (Amazon Connect) <span className="text-destructive">*</span>
                  </Label>
                  <Select value={form.region} onValueChange={(v) => set("region", v)}>
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* ── Step 3: AI configuration ────────────────────────────────── */}
          {step === 3 && (
            <>
              <div>
                <h2 className="text-xl font-semibold">AI configuration</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure the AI coaching capabilities for this customer.
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="llmApiKey">LLM API Key</Label>
                  <Input
                    id="llmApiKey"
                    type="password"
                    value={form.llmApiKey}
                    onChange={(e) => set("llmApiKey", e.target.value)}
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>
                <div className="space-y-3">
                  <Label>
                    AI Coaching tier <span className="text-destructive">*</span>
                  </Label>
                  <div className="space-y-2">
                    <RadioCard
                      selected={form.aiCoachingTier === "base"}
                      onClick={() => set("aiCoachingTier", "base")}
                      title="Base"
                    >
                      <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                        <li>• Consolidated AI-generated feedback per agent</li>
                        <li>• Behavioral and communication quality assessment based on defined evaluation criteria</li>
                        <li>• High-level coaching insights without message-level breakdown</li>
                      </ul>
                    </RadioCard>
                    <RadioCard
                      selected={form.aiCoachingTier === "standard"}
                      onClick={() => set("aiCoachingTier", "standard")}
                      title="Standard"
                    >
                      <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                        <li>• Consolidated AI-generated feedback per agent</li>
                        <li>• Message-by-message coaching on agent responses</li>
                        <li>• Behavioral, tone, and communication quality evaluation for every interaction</li>
                      </ul>
                    </RadioCard>
                    <RadioCard
                      selected={form.aiCoachingTier === "advanced"}
                      onClick={() => set("aiCoachingTier", "advanced")}
                      title="Advanced"
                    >
                      <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                        <li>• Consolidated daily feedback covering agent behavior and performance</li>
                        <li>• Message-level coaching to improve clarity, tone, and empathy</li>
                        <li>• Validation of agent responses against uploaded knowledge base to flag incorrect information</li>
                      </ul>
                    </RadioCard>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Step 4: Evaluation coaching ─────────────────────────────── */}
          {step === 4 && (
            <>
              <div>
                <h2 className="text-xl font-semibold">Evaluation coaching</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically trigger coaching from Amazon Connect evaluation results.
                </p>
              </div>

              {/* Enable toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Enable evaluation coaching</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {form.evalCoachingEnabled
                      ? "Coaching plans will be generated from evaluation scores"
                      : "Can be enabled later from admin panel"}
                  </p>
                </div>
                <Switch
                  checked={form.evalCoachingEnabled}
                  onCheckedChange={(v) => set("evalCoachingEnabled", v)}
                />
              </div>

              {form.evalCoachingEnabled && (
                <div className="space-y-5">
                  {/* Coaching trigger */}
                  <div className="space-y-3">
                    <Label>Coaching trigger</Label>
                    <div className="space-y-2">
                      <RadioCard
                        selected={form.coachingTrigger === "always"}
                        onClick={() => set("coachingTrigger", "always")}
                        title="Always"
                        description="Generate a coaching plan after every evaluation, regardless of score."
                      />
                      <RadioCard
                        selected={form.coachingTrigger === "below_threshold"}
                        onClick={() => set("coachingTrigger", "below_threshold")}
                        title="Below threshold"
                        description="Only coach when a section score falls below the configured value."
                      />
                    </div>
                  </div>

                  {/* Threshold slider */}
                  {form.coachingTrigger === "below_threshold" && (
                    <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <Label>Threshold value</Label>
                        <span className="text-sm font-semibold text-primary">{form.thresholdValue}%</span>
                      </div>
                      <input
                        type="range"
                        min={30}
                        max={90}
                        step={5}
                        value={form.thresholdValue}
                        onChange={(e) => set("thresholdValue", parseInt(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>More coaching (30%)</span>
                        <span>Less coaching (90%)</span>
                      </div>
                    </div>
                  )}

                  {/* Ingestion frequency */}
                  <div className="space-y-3">
                    <Label>Ingestion frequency</Label>
                    <div className="space-y-2">
                      <RadioCard
                        selected={form.ingestionFrequency === "real_time"}
                        onClick={() => set("ingestionFrequency", "real_time")}
                        title="Real-time"
                        description="Evaluations are processed immediately as they are completed in Amazon Connect."
                      />
                      <RadioCard
                        selected={form.ingestionFrequency === "daily"}
                        onClick={() => set("ingestionFrequency", "daily")}
                        title="Daily"
                        description="Evaluations are batched and processed once per day during off-peak hours."
                      />
                      <RadioCard
                        selected={form.ingestionFrequency === "manual"}
                        onClick={() => set("ingestionFrequency", "manual")}
                        title="Manual only"
                        description="Evaluations are only ingested when an admin triggers a manual sync from the admin panel."
                      />
                    </div>
                  </div>

                  {/* Info callout */}
                  <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-500" />
                    <p>
                      TrAIna will automatically read the evaluation form structure — section names,
                      questions, and score scales — from the data. No manual mapping needed. Coaching
                      topics will use the evaluation section names as they appear in Connect.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Step 5: Review & create ──────────────────────────────────── */}
          {step === 5 && (
            <>
              <div>
                <h2 className="text-xl font-semibold">Review & create</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Check everything looks right before creating the customer.
                </p>
              </div>
              <div className="space-y-4">
                {/* Business details */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/40 px-4 py-2.5 border-b flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Business details
                    </span>
                  </div>
                  <div className="divide-y">
                    <ReviewRow label="Business Name" value={form.companyName} />
                    <ReviewRow label="Email Address" value={form.primaryAdminEmail} />
                    <ReviewRow label="License End Date" value={form.licenseEndDate || "Not set"} />
                  </div>
                </div>

                {/* Amazon Connect */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/40 px-4 py-2.5 border-b flex items-center gap-2">
                    <Plug className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Amazon Connect
                    </span>
                  </div>
                  <div className="divide-y">
                    <ReviewRow label="Instance ID" value={form.amazonConnectInstanceId} mono />
                    <ReviewRow label="No. of Agents" value={form.numberOfAgents} />
                    <ReviewRow label="Region" value={regionLabel} />
                  </div>
                </div>

                {/* AI Configuration */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/40 px-4 py-2.5 border-b flex items-center gap-2">
                    <Brain className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      AI configuration
                    </span>
                  </div>
                  <div className="divide-y">
                    <ReviewRow
                      label="LLM API Key"
                      value={form.llmApiKey ? "••••••••••••••••" : "Not set"}
                    />
                    <ReviewRow
                      label="AI Coaching tier"
                      value={<span className="capitalize font-medium">{form.aiCoachingTier}</span>}
                    />
                  </div>
                </div>

                {/* Evaluation coaching */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/40 px-4 py-2.5 border-b flex items-center gap-2">
                    <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Evaluation coaching
                    </span>
                  </div>
                  {form.evalCoachingEnabled ? (
                    <div className="divide-y">
                      <ReviewRow
                        label="Status"
                        value={
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                            Enabled
                          </Badge>
                        }
                      />
                      <ReviewRow
                        label="Coaching trigger"
                        value={
                          form.coachingTrigger === "always"
                            ? "Always"
                            : `Below threshold (${form.thresholdValue}%)`
                        }
                      />
                      <ReviewRow
                        label="Ingestion frequency"
                        value={
                          form.ingestionFrequency === "real_time"
                            ? "Real-time"
                            : form.ingestionFrequency === "daily"
                            ? "Daily"
                            : "Manual only"
                        }
                      />
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      Not enabled — can be configured later from the admin panel.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── Navigation buttons — inside scroll area, no separator ────── */}
          <div className="flex justify-end pt-2 pb-4">
            {step < STEPS.length ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Create customer
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
