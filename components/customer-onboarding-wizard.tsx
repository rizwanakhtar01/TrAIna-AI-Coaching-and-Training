"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, BookOpen, CheckCircle, Info } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WizardFormData {
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
}

interface CustomerOnboardingWizardProps {
  onClose: () => void;
  onCreate: (data: WizardFormData) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Business details" },
  { number: 2, label: "Connect setup" },
  { number: 3, label: "AI configuration" },
  { number: 4, label: "Evaluation coaching" },
  { number: 5, label: "Review & create" },
];

const REGIONS = [
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  { value: "eu-west-2", label: "Europe (London)" },
  { value: "eu-central-1", label: "Europe (Frankfurt)" },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
  { value: "ap-southeast-2", label: "Asia Pacific (Sydney)" },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)" },
];

const DEFAULT_FORM: WizardFormData = {
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
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({
  children,
  htmlFor,
  description,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  description?: string;
}) {
  return (
    <div className="space-y-0.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-primary cursor-pointer"
      >
        {children}
      </label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

function RadioCard({
  selected,
  onClick,
  title,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40 hover:bg-muted/30"
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
      <span className="text-sm text-muted-foreground flex-shrink-0">
        {label}
      </span>
      <span className={`text-sm text-right ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Wizard ───────────────────────────────────────────────────────────────────

export function CustomerOnboardingWizard({
  onClose,
  onCreate,
}: CustomerOnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<WizardFormData>(DEFAULT_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  const set = <K extends keyof WizardFormData>(
    field: K,
    value: WizardFormData[K],
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const regionLabel =
    REGIONS.find((r) => r.value === form.region)?.label ?? form.region;

  const hasChanges = () =>
    form.companyName !== DEFAULT_FORM.companyName ||
    form.primaryAdminEmail !== DEFAULT_FORM.primaryAdminEmail ||
    form.licenseEndDate !== DEFAULT_FORM.licenseEndDate ||
    form.amazonConnectInstanceId !== DEFAULT_FORM.amazonConnectInstanceId ||
    form.numberOfAgents !== DEFAULT_FORM.numberOfAgents ||
    form.region !== DEFAULT_FORM.region ||
    form.llmApiKey !== DEFAULT_FORM.llmApiKey ||
    form.aiCoachingTier !== DEFAULT_FORM.aiCoachingTier ||
    form.training !== DEFAULT_FORM.training ||
    form.evalCoachingEnabled !== DEFAULT_FORM.evalCoachingEnabled;

  const handleTopBack = () => {
    if (hasChanges()) setShowBackConfirm(true);
    else onClose();
  };

  const canProceed = () => {
    if (step === 1) return !!form.companyName && !!form.primaryAdminEmail;
    if (step === 2)
      return (
        !!form.amazonConnectInstanceId && !!form.numberOfAgents && !!form.region
      );
    if (step === 3) return form.aiCoachingTier !== "none";
    return true;
  };

  const handleBack = () => {
    if (step === 1) {
      if (hasChanges()) setShowBackConfirm(true);
      else onClose();
    } else {
      setStep((s) => s - 1);
    }
  };

  const handleNext = () => setStep((s) => s + 1);

  const handleSubmit = () => {
    onCreate(form);
    setSubmitted(true);
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-y-auto flex items-center justify-center p-6">
        <div className="bg-card rounded-xl border border-border shadow-sm w-full max-w-md p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Customer created</h2>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {form.companyName}
              </span>{" "}
              has been added to the platform.
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
              <span className="font-medium capitalize">
                {form.aiCoachingTier}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">AI Training</span>
              <span className="font-medium">
                {form.training ? "Enabled" : "Disabled"}
              </span>
            </div>
            {form.evalCoachingEnabled && (
              <>
                <hr className="border-border" />
                <div>
                  <Badge
                    variant="outline"
                    className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                  >
                    Evaluation coaching enabled
                  </Badge>
                </div>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            An invitation email will be sent to {form.primaryAdminEmail} to set
            up their account.
          </p>
          <Button className="w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  // ── Step indicator ──────────────────────────────────────────────────────────
  const StepIndicator = () => (
    <div className="flex items-start w-full">
      {STEPS.map((s, idx) => {
        const isActive = s.number === step;
        const isDone = s.number < step;
        return (
          <div key={s.number} className="flex items-start flex-1 min-w-0">
            {/* Circle + label stacked */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : isDone
                      ? "bg-primary/20 text-primary border-2 border-primary"
                      : "bg-transparent border-2 border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {isDone ? <CheckCircle className="h-4 w-4" /> : s.number}
              </div>
              <span
                className={`text-xs text-center mt-1.5 leading-tight max-w-[72px] transition-all ${
                  isActive
                    ? "font-semibold text-primary"
                    : isDone
                      ? "text-foreground/70"
                      : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
            {/* Connector line — sits at circle mid-height */}
            {idx < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px mt-4 mx-2 transition-all ${
                  isDone ? "bg-primary/40" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  // ── Page shell ──────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto flex flex-col">
      {/* Card — centered, wider */}
      <div className="flex-1 flex justify-center px-4 py-10 pb-12">
        <div className="bg-card rounded-xl border border-border shadow-sm w-full max-w-3xl">
          {/* Card header — back button + title */}
          <div className="flex items-center px-8 py-5 border-b border-border">
            <button
              onClick={handleTopBack}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mr-4 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <h1 className="flex-1 text-center text-xl font-bold pr-16">
              Create Customer
            </h1>
          </div>

          {/* Step indicator — inside the card */}
          <div className="px-8 py-6 border-b border-border">
            <StepIndicator />
          </div>

          <div className="p-8 space-y-6">
            {/* ── Step 1: Business details ───────────────────────────────── */}
            {step === 1 && (
              <>
                <div>
                  <h2 className="text-xl font-bold">Business details</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Basic information about the customer being onboarded
                  </p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="companyName">Business Name</FieldLabel>
                    <Input
                      id="companyName"
                      value={form.companyName}
                      onChange={(e) => set("companyName", e.target.value)}
                      placeholder="Enter business name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel
                      htmlFor="adminEmail"
                      description="An email will be sent with Admin Portal credentials"
                    >
                      Email Address
                    </FieldLabel>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={form.primaryAdminEmail}
                      onChange={(e) => set("primaryAdminEmail", e.target.value)}
                      placeholder="admin@company.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="licenseEndDate">
                      License End Date
                    </FieldLabel>
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

            {/* ── Step 2: Connect setup ──────────────────────────────────── */}
            {step === 2 && (
              <>
                <div>
                  <h2 className="text-xl font-bold">Connect setup</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect to the customer's Amazon Connect instance
                  </p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="connectInstanceId">
                      Amazon Connect Instance ID
                    </FieldLabel>
                    <Input
                      id="connectInstanceId"
                      value={form.amazonConnectInstanceId}
                      onChange={(e) =>
                        set("amazonConnectInstanceId", e.target.value)
                      }
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="numberOfAgents">
                      No. of Agents
                    </FieldLabel>
                    <Input
                      id="numberOfAgents"
                      type="number"
                      value={form.numberOfAgents}
                      onChange={(e) => set("numberOfAgents", e.target.value)}
                      placeholder="e.g. 50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="region">
                      Region (Amazon Connect)
                    </FieldLabel>
                    <Select
                      value={form.region}
                      onValueChange={(v) => set("region", v)}
                    >
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

            {/* ── Step 3: AI configuration ───────────────────────────────── */}
            {step === 3 && (
              <>
                <div>
                  <h2 className="text-xl font-bold">AI configuration</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure the AI coaching capabilities for this customer
                  </p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <FieldLabel htmlFor="llmApiKey">LLM API Key</FieldLabel>
                    <Input
                      id="llmApiKey"
                      type="password"
                      value={form.llmApiKey}
                      onChange={(e) => set("llmApiKey", e.target.value)}
                      placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                  </div>
                  <div className="space-y-3">
                    <FieldLabel>AI Coaching Tier</FieldLabel>
                    <div className="space-y-2">
                      <RadioCard
                        selected={form.aiCoachingTier === "base"}
                        onClick={() => {
                          set("aiCoachingTier", "base");
                          set("training", false);
                        }}
                        title="Base"
                      >
                        <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                          <li>
                            • Consolidated AI-generated feedback per agent
                          </li>
                          <li>
                            • Behavioral and communication quality assessment
                          </li>
                          <li>• High-level coaching insights</li>
                        </ul>
                      </RadioCard>
                      <RadioCard
                        selected={form.aiCoachingTier === "standard"}
                        onClick={() => {
                          set("aiCoachingTier", "standard");
                          set("training", false);
                        }}
                        title="Standard"
                      >
                        <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                          <li>
                            • Consolidated AI-generated feedback per agent
                          </li>
                          <li>
                            • Message-by-message coaching on agent responses
                          </li>
                          <li>
                            • Behavioral, tone, and communication quality
                            evaluation
                          </li>
                        </ul>
                      </RadioCard>
                      <RadioCard
                        selected={form.aiCoachingTier === "advanced"}
                        onClick={() => set("aiCoachingTier", "advanced")}
                        title="Advanced"
                      >
                        <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                          <li>
                            • Consolidated daily feedback on agent behavior
                          </li>
                          <li>
                            • Message-level coaching for clarity, tone, and
                            empathy
                          </li>
                          <li>
                            • Knowledge base validation against uploaded content
                          </li>
                        </ul>
                      </RadioCard>
                    </div>
                  </div>

                  {/* AI Training toggle */}
                  <div
                    className={`flex items-center justify-between p-4 border rounded-lg transition-opacity ${
                      form.aiCoachingTier !== "advanced" ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen
                        className={`h-5 w-5 flex-shrink-0 ${
                          form.training
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-sm">
                          AI based Agent Training
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {form.aiCoachingTier !== "advanced"
                            ? "Requires Advanced tier to enable"
                            : "Interactive training modules and assessments"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={form.training}
                      onCheckedChange={(v) => set("training", v)}
                      disabled={form.aiCoachingTier !== "advanced"}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── Step 4: Evaluation coaching ────────────────────────────── */}
            {step === 4 && (
              <>
                <div>
                  <h2 className="text-xl font-bold">Evaluation coaching</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically trigger coaching from Amazon Connect
                    evaluation results
                  </p>
                </div>
                <div className="space-y-5">
                  {/* Toggle */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">
                        Enable evaluation coaching
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {form.evalCoachingEnabled
                          ? "Coaching plans will be generated from evaluation scores"
                          : "Can be enabled later from the admin panel"}
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
                      <div className="space-y-2">
                        <FieldLabel>Coaching trigger</FieldLabel>
                        <div className="space-y-2">
                          <RadioCard
                            selected={form.coachingTrigger === "always"}
                            onClick={() => set("coachingTrigger", "always")}
                            title="Always"
                          >
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Generate a coaching plan after every evaluation,
                              regardless of score.
                            </p>
                          </RadioCard>
                          <RadioCard
                            selected={
                              form.coachingTrigger === "below_threshold"
                            }
                            onClick={() =>
                              set("coachingTrigger", "below_threshold")
                            }
                            title="Below threshold"
                          >
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Only coach when a section score falls below the
                              configured value.
                            </p>
                          </RadioCard>
                        </div>
                      </div>

                      {/* Threshold slider */}
                      {form.coachingTrigger === "below_threshold" && (
                        <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                          <div className="flex items-center justify-between">
                            <FieldLabel>Threshold value</FieldLabel>
                            <span className="text-sm font-semibold text-primary">
                              {form.thresholdValue}%
                            </span>
                          </div>
                          <div className="relative flex items-center h-5">
                            {/* Track background */}
                            <div className="absolute inset-x-0 h-2 rounded-full bg-border overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{
                                  width: `${((form.thresholdValue - 30) / 60) * 100}%`,
                                }}
                              />
                            </div>
                            {/* Range input — transparent, sits on top for interaction */}
                            <input
                              type="range"
                              min={30}
                              max={90}
                              step={5}
                              value={form.thresholdValue}
                              onChange={(e) =>
                                set("thresholdValue", parseInt(e.target.value))
                              }
                              className="relative w-full appearance-none bg-transparent cursor-pointer accent-primary"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>More coaching (30%)</span>
                            <span>Less coaching (90%)</span>
                          </div>
                        </div>
                      )}


                      {/* Info callout */}
                      {/* <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                        <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-500" />
                        <p>
                          TrAIna will automatically read the evaluation form
                          structure from the data. No manual mapping needed.
                        </p>
                      </div> */}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── Step 5: Review & create ────────────────────────────────── */}
            {step === 5 && (
              <>
                <div>
                  <h2 className="text-xl font-bold">Review & create</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Check everything looks right before creating the customer
                  </p>
                </div>
                <div className="space-y-4">
                  {/* Business details */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/40 px-4 py-2.5 border-b">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Business details
                      </span>
                    </div>
                    <div className="divide-y">
                      <ReviewRow
                        label="Business Name"
                        value={form.companyName}
                      />
                      <ReviewRow
                        label="Email Address"
                        value={form.primaryAdminEmail}
                      />
                      <ReviewRow
                        label="License End Date"
                        value={form.licenseEndDate || "Not set"}
                      />
                    </div>
                  </div>

                  {/* Amazon Connect */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/40 px-4 py-2.5 border-b">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Amazon Connect
                      </span>
                    </div>
                    <div className="divide-y">
                      <ReviewRow
                        label="Instance ID"
                        value={form.amazonConnectInstanceId}
                        mono
                      />
                      <ReviewRow
                        label="No. of Agents"
                        value={form.numberOfAgents}
                      />
                      <ReviewRow label="Region" value={regionLabel} />
                    </div>
                  </div>

                  {/* AI Configuration */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/40 px-4 py-2.5 border-b">
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
                        value={
                          <span className="capitalize font-medium">
                            {form.aiCoachingTier}
                          </span>
                        }
                      />
                      <ReviewRow
                        label="AI Training"
                        value={
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              form.training
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {form.training ? "Enabled" : "Disabled"}
                          </Badge>
                        }
                      />
                    </div>
                  </div>

                  {/* Evaluation coaching */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/40 px-4 py-2.5 border-b">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Evaluation coaching
                      </span>
                    </div>
                    {form.evalCoachingEnabled ? (
                      <div className="divide-y">
                        <ReviewRow
                          label="Status"
                          value={
                            <Badge
                              variant="outline"
                              className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                            >
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
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-sm text-muted-foreground">
                        Not enabled — can be configured later from the admin
                        panel.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── Navigation buttons ─────────────────────────────────────── */}
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              {step < STEPS.length ? (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Continue
                </Button>
              ) : (
                <Button onClick={handleSubmit}>Create customer</Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation dialog — shown when leaving with unsaved data */}
      {showBackConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-xl border border-border shadow-xl w-full max-w-sm mx-4 p-6 space-y-4">
            <h3 className="text-base font-semibold">Leave without saving?</h3>
            <p className="text-sm text-muted-foreground">
              You have unsaved changes. If you go back now, all the information
              you&apos;ve entered will be lost.
            </p>
            <div className="flex gap-3 justify-end pt-1">
              <Button
                variant="outline"
                onClick={() => setShowBackConfirm(false)}
              >
                Keep editing
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowBackConfirm(false);
                  onClose();
                }}
              >
                Leave
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
