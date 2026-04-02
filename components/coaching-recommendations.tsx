"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  Target,
  Star,
  AlertTriangle,
  Send,
  Activity,
  MessageSquare,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface CoachingCardData {
  objective: string
  talkTrackStandard: string
  talkTrackEdge: string
  policyDocs: string[]
  practiceScenario: string
  bestPractices: string[]
  generationDate: string
  contactCountBasis: number
  aiConfidenceScore: string
}

interface AgentPlan {
  id: string
  agentId: string
  agentName: string
  agentAvatar: string
  patternName: string
  areaToImprove: string
  assignedBy: string
  assignedDate: string
  dueDate: string
  status: "active" | "completed" | "overdue"
  supervisorNote?: string
  sections: { id: string; title: string; type: string; completed: boolean }[]
  timeline: { event: string; date: string; type: "assigned" | "opened" | "completed" | "section" }[]
}

// ─────────────────────────────────────────────────────────────────────────────
// COACHING CARD DATA (keyed by pattern name)
// ─────────────────────────────────────────────────────────────────────────────

const coachingCardsByPattern: Record<string, CoachingCardData> = {
  "Refund Processing": {
    objective:
      "Enable agents to confidently navigate refund processing workflows by clarifying policy boundaries, reducing system-related errors, and improving first-contact resolution rates for refund requests.",
    talkTrackStandard:
      '"I completely understand your frustration with the refund timeline. Let me pull up your account and walk you through exactly where we are in the process and what to expect next."',
    talkTrackEdge:
      '"I can see this has been a longer process than expected. While I can\'t override the system hold, I\'m going to escalate this directly to our billing team and make sure you receive an update within 24 hours — can I confirm the best contact number for you?"',
    policyDocs: [
      "Refund Policy — Standard Processing Times",
      "Refund Authorization Thresholds by Agent Level",
      "Dispute Escalation Workflow Guide",
      "System Timeout Recovery Procedures",
    ],
    practiceScenario:
      "A customer calls for the third time about a refund submitted 12 days ago. The system shows the refund is 'processing' but no further detail is available. The customer is frustrated and threatening to dispute with their bank. Guide the agent to acknowledge the delay, set clear expectations, and initiate the correct escalation path without making promises they cannot keep.",
    bestPractices: [
      "Acknowledge the wait time before explaining process — empathy first, then information",
      "Use specific timeframes rather than vague assurances ('within 3–5 business days' not 'soon')",
      "Always confirm the refund method matches the original payment before proceeding",
      "If the system is unresponsive, document and escalate rather than asking the customer to call back",
      "Close the interaction by summarising what will happen next and who will follow up",
    ],
    generationDate: "Yesterday at 2:14 PM",
    contactCountBasis: 47,
    aiConfidenceScore: "High (91%)",
  },
  "Billing Inquiries": {
    objective:
      "Help agents resolve billing inquiries accurately and efficiently by strengthening their understanding of billing structures, proration calculations, and invoice discrepancy resolution pathways.",
    talkTrackStandard:
      '"Great question about your bill. Let me walk you through exactly what each line item means and why the amount changed this month — I want to make sure it all makes sense before we finish."',
    talkTrackEdge:
      '"I can see there\'s a discrepancy between what you expected and what was charged. Rather than guessing, let me pull the exact billing audit for your account so we can work through this together with accurate numbers."',
    policyDocs: [
      "Billing Structure Explanation Guide",
      "Proration Calculation Reference Sheet",
      "Invoice Dispute Resolution Policy",
      "Payment Method Update Procedures",
    ],
    practiceScenario:
      "A customer is confused about why their bill is $23 higher than last month with no plan changes. The agent checks and finds the difference is due to a mid-cycle proration from an add-on that was activated and deactivated. Guide the agent through explaining this clearly and resolving any remaining concerns.",
    bestPractices: [
      "Never estimate billing figures — always reference the actual account data",
      "Use analogies to explain proration ('think of it like a daily rate for the days you used the service')",
      "Confirm the customer understands before moving on — 'Does that explanation make sense?'",
      "If a credit is warranted, state the exact amount and timeframe for it to appear",
      "Document every billing adjustment with reason codes for the audit trail",
    ],
    generationDate: "2 days ago at 9:47 AM",
    contactCountBasis: 38,
    aiConfidenceScore: "High (88%)",
  },
  "Technical Support": {
    objective:
      "Improve agent capability in handling complex technical issues by building structured troubleshooting habits, knowing escalation thresholds, and communicating technical steps in accessible language.",
    talkTrackStandard:
      '"Let\'s work through this together step by step. I\'m going to guide you through a quick check first, and if that doesn\'t solve it, we\'ll know exactly what to do next."',
    talkTrackEdge:
      '"This is more complex than a standard reset can fix. I\'m going to escalate this to our Level 2 technical team right now — I\'ll stay on the line with you to hand over the case so you don\'t have to repeat yourself."',
    policyDocs: [
      "Technical Troubleshooting Decision Tree",
      "Escalation Threshold Reference Guide",
      "Common Error Codes and Resolutions",
      "Customer-Friendly Technical Language Guide",
    ],
    practiceScenario:
      "A customer's device has been unresponsive for 48 hours following a firmware update. Standard reset steps have failed. The agent has exhausted Tier 1 resolution steps. Guide the agent to determine the correct escalation path, prepare a proper case handover, and keep the customer informed and calm throughout.",
    bestPractices: [
      "Always confirm the customer's technical literacy before choosing your explanation style",
      "Run all standard checks before escalating — document each step you tried",
      "Use numbered steps when walking customers through procedures so they can follow along",
      "Set a callback expectation before any warm transfer so the customer isn't surprised",
      "After resolution, confirm the fix is working before closing the contact",
    ],
    generationDate: "Yesterday at 11:32 AM",
    contactCountBasis: 62,
    aiConfidenceScore: "Medium (79%)",
  },
  "Account Cancellation": {
    objective:
      "Equip agents with effective retention techniques and empathetic language to reduce cancellation rates by addressing root dissatisfaction, offering targeted alternatives, and escalating appropriately.",
    talkTrackStandard:
      '"I\'m sorry to hear you\'re thinking of cancelling — before we process anything, I\'d love to understand what\'s not working for you. Would you mind sharing what\'s behind the decision?"',
    talkTrackEdge:
      '"I completely respect your decision. Let me make sure the process is as smooth as possible and briefly share one option that might fit your situation — if it doesn\'t work, we\'ll get things cancelled right away."',
    policyDocs: [
      "Retention Offer Options by Segment",
      "Cancellation Flow — Step-by-Step Guide",
      "Competitor Pricing Comparison Sheet",
      "Escalation to Retention Specialist: Criteria",
    ],
    practiceScenario:
      "A long-term customer wants to cancel because a competitor is offering a lower price. They are not hostile but firm. Guide the agent to listen first, identify the root concern, present one targeted retention offer without being pushy, and close positively regardless of outcome.",
    bestPractices: [
      "Never start with a retention pitch — listen fully before responding",
      "Match your retention offer to the specific reason for cancellation",
      "If the customer declines, process the request warmly and leave the door open",
      "Always escalate to a retention specialist when the account value is above threshold",
      "Document the cancellation reason accurately — it feeds product and service improvements",
    ],
    generationDate: "3 days ago at 4:20 PM",
    contactCountBasis: 29,
    aiConfidenceScore: "High (84%)",
  },
  "Escalation Handling": {
    objective:
      "Build agent confidence in identifying the right escalation triggers, preparing thorough case handovers, and managing customer expectations throughout the transfer process.",
    talkTrackStandard:
      '"I want to make sure this is handled by the right person. I\'m going to transfer you to a specialist now — I\'ll brief them fully so you won\'t need to repeat anything."',
    talkTrackEdge:
      '"I understand this has already taken longer than it should. I\'m escalating this as a priority right now and I\'m noting that context. You\'ll receive a call within 2 hours — is this number the best one to reach you on?"',
    policyDocs: [
      "Escalation Criteria by Issue Type",
      "Case Documentation Standards — Handover",
      "Priority Level Decision Matrix",
      "Supervisor Availability Protocols",
    ],
    practiceScenario:
      "A customer is on their third contact about the same unresolved issue and is becoming hostile. The agent has exhausted their authority level. Guide the agent to de-escalate the customer's frustration, complete a proper escalation case note, and execute a warm transfer without adding further delay.",
    bestPractices: [
      "Escalate based on criteria — not on how uncomfortable the conversation feels",
      "Complete the case note before initiating the transfer, not after",
      "Never put a customer on hold mid-escalation without explaining what's happening",
      "Acknowledge prior contacts explicitly: 'I can see you've spoken to us twice already'",
      "After transfer, follow up internally to confirm the case was picked up",
    ],
    generationDate: "Yesterday at 8:55 AM",
    contactCountBasis: 41,
    aiConfidenceScore: "High (87%)",
  },
}

const defaultCoachingCard: CoachingCardData = {
  objective:
    "Equip agents with the knowledge, language, and confidence to handle this pattern effectively — improving first-contact resolution and customer satisfaction across the team.",
  talkTrackStandard:
    '"I understand this is important to you. Let me take a moment to fully understand the situation so I can give you the right information and the best possible outcome."',
  talkTrackEdge:
    '"This falls outside what I\'m able to resolve directly, but I want to make sure it\'s handled properly. I\'m going to connect you with the right team and make sure they have full context so you don\'t have to repeat yourself."',
  policyDocs: [
    "Standard Resolution Guidelines",
    "Escalation Workflow Reference",
    "Customer Communication Best Practices",
    "Policy Overview — Key Decision Points",
  ],
  practiceScenario:
    "A customer contacts support with a complex, emotionally charged issue related to this pattern. Previous interactions have left them frustrated. Guide the agent to rebuild trust, navigate the process correctly, and close with a clear resolution or a credible next step.",
  bestPractices: [
    "Lead with empathy — acknowledge the customer's experience before addressing the issue",
    "Ask clarifying questions rather than making assumptions about the problem",
    "Communicate each step you're taking so the customer feels involved and informed",
    "Set realistic expectations — never over-promise on timelines or outcomes",
    "End every interaction by confirming the customer's concern is fully addressed",
  ],
  generationDate: "Today at 8:05 AM",
  contactCountBasis: 31,
  aiConfidenceScore: "High (85%)",
}

// ─────────────────────────────────────────────────────────────────────────────
// AGENT PLANS DATA (demo)
// ─────────────────────────────────────────────────────────────────────────────

const agentPlansData: AgentPlan[] = [
  {
    id: "plan-1",
    agentId: "1",
    agentName: "Sarah Chen",
    agentAvatar: "SC",
    patternName: "Refund Processing",
    areaToImprove: "Policy Clarity & Escalation",
    assignedBy: "Team Lead",
    assignedDate: "3 days ago",
    dueDate: "In 4 days",
    status: "active",
    supervisorNote:
      "Sarah — focus especially on the talk track for edge cases. I've seen a few contacts where setting expectations earlier would have reduced call time significantly. You've got this.",
    sections: [
      { id: "s1", title: "Coaching objective", type: "objective", completed: true },
      { id: "s2", title: "Talk tracks", type: "talkTracks", completed: true },
      { id: "s3", title: "Policy & knowledge base", type: "policy", completed: false },
      { id: "s4", title: "Practice scenario", type: "scenario", completed: false },
      { id: "s5", title: "Best practices", type: "bestPractices", completed: false },
    ],
    timeline: [
      { event: "Plan assigned by Team Lead", date: "3 days ago", type: "assigned" },
      { event: "Opened coaching plan", date: "2 days ago", type: "opened" },
      { event: "Completed: Coaching objective", date: "2 days ago", type: "section" },
      { event: "Completed: Talk tracks", date: "Yesterday", type: "section" },
    ],
  },
  {
    id: "plan-2",
    agentId: "2",
    agentName: "Marcus Johnson",
    agentAvatar: "MJ",
    patternName: "Escalation Handling",
    areaToImprove: "Escalation Criteria & Documentation",
    assignedBy: "Team Lead",
    assignedDate: "6 days ago",
    dueDate: "Yesterday",
    status: "overdue",
    sections: [
      { id: "s1", title: "Coaching objective", type: "objective", completed: true },
      { id: "s2", title: "Talk tracks", type: "talkTracks", completed: false },
      { id: "s3", title: "Policy & knowledge base", type: "policy", completed: false },
      { id: "s4", title: "Practice scenario", type: "scenario", completed: false },
      { id: "s5", title: "Best practices", type: "bestPractices", completed: false },
    ],
    timeline: [
      { event: "Plan assigned by Team Lead", date: "6 days ago", type: "assigned" },
      { event: "Opened coaching plan", date: "5 days ago", type: "opened" },
      { event: "Completed: Coaching objective", date: "4 days ago", type: "section" },
    ],
  },
  {
    id: "plan-3",
    agentId: "3",
    agentName: "Priya Patel",
    agentAvatar: "PP",
    patternName: "Billing Inquiries",
    areaToImprove: "Proration Explanation",
    assignedBy: "Team Lead",
    assignedDate: "8 days ago",
    dueDate: "Completed",
    status: "completed",
    sections: [
      { id: "s1", title: "Coaching objective", type: "objective", completed: true },
      { id: "s2", title: "Talk tracks", type: "talkTracks", completed: true },
      { id: "s3", title: "Policy & knowledge base", type: "policy", completed: true },
      { id: "s4", title: "Practice scenario", type: "scenario", completed: true },
      { id: "s5", title: "Best practices", type: "bestPractices", completed: true },
    ],
    timeline: [
      { event: "Plan assigned by Team Lead", date: "8 days ago", type: "assigned" },
      { event: "Opened coaching plan", date: "7 days ago", type: "opened" },
      { event: "Completed: Coaching objective", date: "7 days ago", type: "section" },
      { event: "Completed: Talk tracks", date: "6 days ago", type: "section" },
      { event: "Completed: Policy & knowledge base", date: "5 days ago", type: "section" },
      { event: "Completed: Practice scenario", date: "4 days ago", type: "section" },
      { event: "Completed: Best practices", date: "3 days ago", type: "section" },
    ],
  },
  {
    id: "plan-4",
    agentId: "4",
    agentName: "David Kim",
    agentAvatar: "DK",
    patternName: "Technical Support",
    areaToImprove: "Escalation Thresholds",
    assignedBy: "Team Lead",
    assignedDate: "2 days ago",
    dueDate: "In 5 days",
    status: "active",
    supervisorNote:
      "David, pay close attention to the escalation criteria section. Your recent contacts show you're holding too long before escalating — the practice scenario here will help.",
    sections: [
      { id: "s1", title: "Coaching objective", type: "objective", completed: true },
      { id: "s2", title: "Talk tracks", type: "talkTracks", completed: false },
      { id: "s3", title: "Policy & knowledge base", type: "policy", completed: false },
      { id: "s4", title: "Practice scenario", type: "scenario", completed: false },
      { id: "s5", title: "Best practices", type: "bestPractices", completed: false },
    ],
    timeline: [
      { event: "Plan assigned by Team Lead", date: "2 days ago", type: "assigned" },
      { event: "Opened coaching plan", date: "Yesterday", type: "opened" },
      { event: "Completed: Coaching objective", date: "Yesterday", type: "section" },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getCard(patternName: string): CoachingCardData {
  return coachingCardsByPattern[patternName] ?? defaultCoachingCard
}

function getPlanProgress(plan: AgentPlan) {
  const done = plan.sections.filter((s) => s.completed).length
  const total = plan.sections.length
  return { done, total, pct: Math.round((done / total) * 100) }
}

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
  if (status === "overdue") return <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>
  return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Active</Badge>
}

// ─────────────────────────────────────────────────────────────────────────────
// AI RECOMMENDATION CARD (added inline to supervisor pattern detail)
// ─────────────────────────────────────────────────────────────────────────────

interface AiRecommendationCardProps {
  patternName: string
  onReviewCard: () => void
}

export function AiRecommendationCard({ patternName, onReviewCard }: AiRecommendationCardProps) {
  return (
    <Card className="border-green-300 bg-green-50/40">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">AI coaching recommendation</p>
            <div>
              <p className="font-semibold text-foreground">{patternName}</p>
              <p className="text-sm text-muted-foreground">Area to improve</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">Ready for review</Badge>
              <span className="text-xs text-muted-foreground">5 sections: Coaching objective, Talk tracks, Policy & KB, Practice scenario, Best practices</span>
            </div>
          </div>
          <Button className="flex-shrink-0" onClick={onReviewCard}>
            Review card
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 2 — COACHING CARD REVIEW (Supervisor)
// ─────────────────────────────────────────────────────────────────────────────

interface CoachingCardReviewProps {
  patternName: string
  occurrences: number
  affectedAgentsCount: number
  timeframe: string
  impactedAgents: { id: string; name: string; avatar: string }[]
  onBack: () => void
  onGoToProgress: () => void
  onLogout: () => void
}

export function CoachingCardReview({
  patternName,
  occurrences,
  affectedAgentsCount,
  timeframe,
  impactedAgents,
  onBack,
  onGoToProgress,
  onLogout,
}: CoachingCardReviewProps) {
  const card = getCard(patternName)

  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["talkTracks"]))
  const [approved, setApproved] = useState(false)
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(
    new Set(impactedAgents.slice(0, Math.ceil(impactedAgents.length * 0.6)).map((a) => a.id))
  )
  const [supervisorNote, setSupervisorNote] = useState("")
  const dueDate = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  })()

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const toggleAgent = (id: string) => {
    setSelectedAgents((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const aboveThresholdIds = new Set(
    impactedAgents.slice(0, Math.ceil(impactedAgents.length * 0.6)).map((a) => a.id)
  )

  // ── Approval success state ──
  if (approved) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-lg w-full border-green-200 bg-green-50">
          <CardContent className="p-10 text-center space-y-6">
            <div className="flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-green-800">Coaching card approved</h2>
              <p className="text-green-700">
                Card saved to agent profiles for {selectedAgents.size} agent
                {selectedAgents.size !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-green-600">
                Pattern: <span className="font-medium">{patternName}</span>
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <Button
                variant="outline"
                className="border-green-300 text-green-800 hover:bg-green-100"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to pattern
              </Button>
              <Button className="bg-primary text-primary-foreground" onClick={onGoToProgress}>
                Go to Coaching Progress
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Accordion section config ──
  const sections = [
    { key: "talkTracks", label: "Talk track examples", icon: <MessageSquare className="h-4 w-4" /> },
    { key: "policy", label: "Policy & knowledge base", icon: <FileText className="h-4 w-4" /> },
    { key: "scenario", label: "Practice scenario", icon: <Target className="h-4 w-4" /> },
    { key: "bestPractices", label: "Best practices from top performers", icon: <Star className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pattern
            </Button>
            <div className="h-4 w-px bg-border" />
            <h1 className="text-lg font-semibold text-foreground">Coaching Card Review</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
              Supervisor View
            </Badge>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="flex gap-6 max-w-7xl mx-auto">
          {/* ── Left column (65%) ── */}
          <div className="flex-[65] space-y-5 min-w-0">
            {/* Header card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground">{patternName}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Area to improve</p>
                <div className="flex gap-6 mt-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Occurrences: </span>
                    <span className="font-semibold">{occurrences}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Agents affected: </span>
                    <span className="font-semibold">{affectedAgentsCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Timeframe: </span>
                    <span className="font-semibold">{timeframe}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coaching objective */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-800 text-base">
                  <Target className="h-4 w-4" />
                  Coaching objective
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-900 leading-relaxed">{card.objective}</p>
              </CardContent>
            </Card>

            {/* Accordion sections */}
            {sections.map(({ key, label, icon }) => (
              <Card key={key}>
                <button className="w-full text-left" onClick={() => toggleSection(key)}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        {icon}
                        {label}
                      </div>
                      {openSections.has(key) ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </button>
                {openSections.has(key) && (
                  <CardContent className="pt-0 space-y-3">
                    {key === "talkTracks" && (
                      <>
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Standard scenario</p>
                          <p className="text-sm italic text-foreground">{card.talkTrackStandard}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Edge case handling</p>
                          <p className="text-sm italic text-foreground">{card.talkTrackEdge}</p>
                        </div>
                      </>
                    )}
                    {key === "policy" && (
                      <>
                        <p className="text-xs text-muted-foreground">Attach relevant policy documents</p>
                        {card.policyDocs.map((doc, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"
                          >
                            <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <span className="text-sm text-blue-800">{doc}</span>
                          </div>
                        ))}
                      </>
                    )}
                    {key === "scenario" && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                        <p className="text-sm text-purple-900 leading-relaxed">{card.practiceScenario}</p>
                        <p className="text-xs text-purple-600 border-t border-purple-200 pt-3">
                          Interactive practice available in Phase 2
                        </p>
                      </div>
                    )}
                    {key === "bestPractices" && (
                      <ul className="space-y-2">
                        {card.bestPractices.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Star className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* ── Right sidebar (35%) ── */}
          <div className="flex-[35] min-w-0">
            <div className="sticky top-24 space-y-4">
              <Card>
                <CardContent className="p-5 space-y-3">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                    onClick={() => setApproved(true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve card
                  </Button>
                  <Button variant="outline" className="w-full">
                    Edit sections
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    onClick={onBack}
                  >
                    Reject card
                  </Button>

                  <div className="border-t pt-4 space-y-4">
                    {/* Assign to agents */}
                    <div>
                      <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Assign to agents
                      </p>
                      <div className="space-y-2.5">
                        {impactedAgents.map((agent) => {
                          const isAbove = aboveThresholdIds.has(agent.id)
                          return (
                            <div key={agent.id} className="flex items-start gap-2">
                              <Checkbox
                                id={`agent-${agent.id}`}
                                checked={selectedAgents.has(agent.id)}
                                onCheckedChange={() => toggleAgent(agent.id)}
                                className="mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <label
                                  htmlFor={`agent-${agent.id}`}
                                  className="text-sm cursor-pointer leading-tight"
                                >
                                  {agent.name}
                                </label>
                                {!isAbove && (
                                  <p className="text-xs text-muted-foreground">Below impact threshold</p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Due date */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Due date</label>
                      <Input type="text" defaultValue={dueDate} className="text-sm" />
                    </div>

                    {/* Note */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        Note for agent{" "}
                        <span className="text-muted-foreground font-normal">(optional)</span>
                      </label>
                      <Textarea
                        placeholder="Add a personal note..."
                        value={supervisorNote}
                        onChange={(e) => setSupervisorNote(e.target.value)}
                        rows={3}
                        className="text-sm resize-none"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="border-t pt-3 space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Generated</span>
                        <span>{card.generationDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contact basis</span>
                        <span>{card.contactCountBasis} contacts</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI confidence</span>
                        <span>{card.aiConfidenceScore}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 3 — COACHING PROGRESS TRACKER (Supervisor)
// ─────────────────────────────────────────────────────────────────────────────

export function CoachingProgressTracker() {
  const [view, setView] = useState<"agent" | "plan">("agent")
  const [drilldownAgentId, setDrilldownAgentId] = useState<string | null>(null)

  const totalPlans = agentPlansData.length
  const activePlans = agentPlansData.filter((p) => p.status === "active").length
  const completedPlans = agentPlansData.filter((p) => p.status === "completed").length
  const overduePlans = agentPlansData.filter((p) => p.status === "overdue").length
  const totalSections = agentPlansData.reduce((sum, p) => sum + p.sections.length, 0)
  const completedSections = agentPlansData.reduce(
    (sum, p) => sum + p.sections.filter((s) => s.completed).length,
    0
  )

  const overduePlansList = agentPlansData.filter((p) => p.status === "overdue")

  // ── Agent drill-down ──
  if (drilldownAgentId) {
    const plan = agentPlansData.find((p) => p.agentId === drilldownAgentId)
    if (!plan) return null
    const { done, total, pct } = getPlanProgress(plan)

    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setDrilldownAgentId(null)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to agent list
        </Button>

        {/* Agent header */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-medium text-primary">{plan.agentAvatar}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold">{plan.agentName}</h3>
            <p className="text-sm text-muted-foreground">
              1 active plan · {pct}% overall progress
            </p>
          </div>
        </div>

        {/* Overdue alert */}
        {plan.status === "overdue" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">This plan is overdue. Due date has passed.</span>
            </div>
            <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
              <Send className="h-3 w-3 mr-1" />
              Send reminder
            </Button>
          </div>
        )}

        {/* Plan card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{plan.patternName}</CardTitle>
                <CardDescription>{plan.areaToImprove}</CardDescription>
              </div>
              <StatusBadge status={plan.status} />
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Assigned {plan.assignedDate}</span>
              <span>Due: {plan.dueDate}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {done}/{total} sections
                </span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
            <div className="flex flex-wrap gap-2">
              {plan.sections.map((section) => (
                <div
                  key={section.id}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                    section.completed
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-muted border-transparent text-muted-foreground"
                  }`}
                >
                  {section.completed ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-current" />
                  )}
                  {section.title}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" />
              Activity timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.timeline.map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                      event.type === "assigned"
                        ? "bg-blue-500"
                        : event.type === "opened"
                        ? "bg-amber-500"
                        : event.type === "section"
                        ? "bg-green-500"
                        : "bg-muted"
                    }`}
                  />
                  <div>
                    <p className="text-sm">{event.event}</p>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Main tracker view ──
  return (
    <div className="space-y-6">
      {/* 5 stat cards */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Total plans", value: totalPlans, color: "text-foreground" },
          { label: "Active", value: activePlans, color: "text-blue-600" },
          { label: "Completed", value: completedPlans, color: "text-green-600" },
          { label: "Overdue", value: overduePlans, color: "text-red-600" },
          { label: "Sections done", value: `${completedSections}/${totalSections}`, color: "text-foreground" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overdue alert banner */}
      {overduePlans > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                {overduePlans} overdue plan{overduePlans !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-red-700">
                {overduePlansList
                  .map((p) => `${p.agentName} (${p.patternName})`)
                  .join(", ")}
              </p>
            </div>
          </div>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0">
            <Send className="h-3 w-3 mr-1" />
            Send reminders
          </Button>
        </div>
      )}

      {/* View toggle */}
      <div className="flex items-center gap-1 bg-muted p-1 rounded-lg w-fit">
        {(["agent", "plan"] as const).map((v) => (
          <button
            key={v}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === v
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setView(v)}
          >
            {v === "agent" ? "By agent" : "By plan"}
          </button>
        ))}
      </div>

      {/* By agent */}
      {view === "agent" && (
        <div className="grid gap-4">
          {agentPlansData.map((plan) => {
            const { done, total, pct } = getPlanProgress(plan)
            return (
              <Card
                key={plan.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  plan.status === "overdue" ? "border-red-200" : ""
                }`}
                onClick={() => setDrilldownAgentId(plan.agentId)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary">{plan.agentAvatar}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{plan.agentName}</span>
                          <StatusBadge status={plan.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          1 plan · {plan.patternName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm flex-shrink-0">
                      <span className="font-semibold">{done}/{total}</span>
                      <span className="text-muted-foreground ml-1">sections</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Progress value={pct} className="h-1.5" />
                    <div className="flex flex-wrap gap-1.5">
                      {plan.sections.map((s) => (
                        <span
                          key={s.id}
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            s.completed
                              ? "bg-green-100 text-green-700"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {s.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* By plan */}
      {view === "plan" && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="grid grid-cols-6 px-5 py-3 text-xs font-medium text-muted-foreground border-b">
                <span className="col-span-2">Agent</span>
                <span>Pattern</span>
                <span>Status</span>
                <span>Progress</span>
                <span>Due date</span>
              </div>
              {[...agentPlansData]
                .sort((a, b) => {
                  const order = { overdue: 0, active: 1, completed: 2 }
                  return order[a.status] - order[b.status]
                })
                .map((plan) => {
                  const { done, total, pct } = getPlanProgress(plan)
                  return (
                    <div
                      key={plan.id}
                      className={`grid grid-cols-6 px-5 py-4 items-center hover:bg-muted/40 transition-colors ${
                        plan.status === "overdue" ? "bg-red-50/50" : ""
                      }`}
                    >
                      <div className="col-span-2 flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-primary">{plan.agentAvatar}</span>
                        </div>
                        <span className="text-sm font-medium">{plan.agentName}</span>
                      </div>
                      <span className="text-sm">{plan.patternName}</span>
                      <StatusBadge status={plan.status} />
                      <div className="space-y-1">
                        <Progress value={pct} className="h-1.5 w-20" />
                        <span className="text-xs text-muted-foreground">
                          {done}/{total}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{plan.dueDate}</span>
                        {plan.status === "overdue" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 text-xs h-7"
                          >
                            Nudge
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 4 — AGENT COACHING PLANS (Agent tab content)
// ─────────────────────────────────────────────────────────────────────────────

interface AgentCoachingPlansProps {
  onViewPlan: (planId: string) => void
}

export function AgentCoachingPlans({ onViewPlan }: AgentCoachingPlansProps) {
  // Demo: agent "1" is the logged-in agent (Sarah Chen)
  const myPlans = agentPlansData.filter((p) => p.agentId === "1")
  const activePlans = myPlans.filter((p) => p.status === "active")
  const completedPlans = myPlans.filter((p) => p.status === "completed")

  const totalSections = myPlans.reduce((sum, p) => sum + p.sections.length, 0)
  const doneSections = myPlans.reduce(
    (sum, p) => sum + p.sections.filter((s) => s.completed).length,
    0
  )
  const overdue = myPlans.filter((p) => p.status === "overdue").length

  return (
    <div className="space-y-6">
      {/* 4 stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active plans", value: activePlans.length, color: "text-blue-600" },
          { label: "Sections completed", value: `${doneSections}/${totalSections}`, color: "text-green-600" },
          { label: "Due this week", value: activePlans.length, color: "text-amber-600" },
          {
            label: "Overdue",
            value: overdue,
            color: overdue > 0 ? "text-red-600" : "text-green-600",
          },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active plans */}
      {activePlans.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Active plans</h3>
          {activePlans.map((plan) => {
            const { done, total, pct } = getPlanProgress(plan)
            return (
              <Card
                key={plan.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onViewPlan(plan.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{plan.patternName}</h4>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Area to improve: {plan.areaToImprove}
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Assigned {plan.assignedDate}</span>
                        <span>Due {plan.dueDate}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold">
                        {done}/{total}
                      </div>
                      <div className="text-xs text-muted-foreground">sections</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Progress value={pct} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">{pct}% complete</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Completed plans */}
      {completedPlans.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-muted-foreground">Completed</h3>
          {completedPlans.map((plan) => (
            <Card key={plan.id} className="opacity-70">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium line-through text-muted-foreground">
                    {plan.patternName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Completed · {plan.dueDate}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 5 — AGENT PLAN DETAIL
// ─────────────────────────────────────────────────────────────────────────────

interface AgentPlanDetailProps {
  planId: string
  onBack: () => void
}

export function AgentPlanDetail({ planId, onBack }: AgentPlanDetailProps) {
  const initial = agentPlansData.find((p) => p.id === planId)
  const [plan, setPlan] = useState<AgentPlan | null>(initial ?? null)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["s1"]))
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  if (!plan) return null

  const card = getCard(plan.patternName)
  const { done, total, pct } = getPlanProgress(plan)
  const allDone = done === total

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const markComplete = (sectionId: string) => {
    setPlan((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, completed: true } : s)),
      }
    })
  }

  const renderSectionContent = (section: AgentPlan["sections"][0]) => {
    switch (section.type) {
      case "objective":
        return <p className="text-sm text-muted-foreground leading-relaxed">{card.objective}</p>
      case "talkTracks":
        return (
          <div className="space-y-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Standard scenario</p>
              <p className="text-sm italic">{card.talkTrackStandard}</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Edge case handling</p>
              <p className="text-sm italic">{card.talkTrackEdge}</p>
            </div>
          </div>
        )
      case "policy":
        return (
          <div className="space-y-2">
            {card.policyDocs.map((doc, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-blue-800">{doc}</span>
              </div>
            ))}
          </div>
        )
      case "scenario":
        return (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
            <p className="text-sm text-purple-900 leading-relaxed">{card.practiceScenario}</p>
            <p className="text-xs text-purple-600 border-t border-purple-200 pt-3">
              Interactive practice available in Phase 2
            </p>
          </div>
        )
      case "bestPractices":
        return (
          <ul className="space-y-2">
            {card.bestPractices.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Star className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to My Coaching Plans
      </Button>

      {/* Header card */}
      <Card
        className={`border-l-4 ${
          plan.status === "overdue" ? "border-l-red-500" : "border-l-blue-500"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">{plan.patternName}</h2>
              <p className="text-sm text-muted-foreground">
                Area to improve: {plan.areaToImprove}
              </p>
            </div>
            <StatusBadge status={plan.status} />
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground mb-4">
            <span>
              Assigned by: <span className="font-medium text-foreground">{plan.assignedBy}</span>
            </span>
            <span>
              Due: <span className="font-medium text-foreground">{plan.dueDate}</span>
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall progress</span>
              <span className="font-medium">
                {done}/{total} sections
              </span>
            </div>
            <Progress value={pct} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Supervisor note */}
      {plan.supervisorNote && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-amber-700 mb-1">Note from your supervisor</p>
            <p className="text-sm text-amber-900 italic">{plan.supervisorNote}</p>
          </CardContent>
        </Card>
      )}

      {/* Section cards */}
      <div className="space-y-3">
        {plan.sections.map((section, idx) => (
          <Card key={section.id} className={section.completed ? "border-green-200" : ""}>
            <button className="w-full text-left" onClick={() => toggleSection(section.id)}>
              <CardHeader
                className={`pb-3 rounded-t-lg ${section.completed ? "bg-green-50" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        section.completed
                          ? "bg-green-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {section.completed ? "✓" : idx + 1}
                    </span>
                    {section.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {!section.completed ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          markComplete(section.id)
                        }}
                      >
                        Mark complete
                      </Button>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 text-xs">✓ Completed</Badge>
                    )}
                    {openSections.has(section.id) ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </button>
            {openSections.has(section.id) && (
              <CardContent className="pt-0">{renderSectionContent(section)}</CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Celebration card */}
      {allDone && (
        <Card className="bg-green-50 border-green-300">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-4xl">🎉</div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-green-800">All sections completed!</h3>
              <p className="text-sm text-green-700">Your supervisor has been notified</p>
            </div>
            <Button
              variant="outline"
              className="border-green-300 text-green-800 hover:bg-green-100"
              onClick={() => setFeedbackSubmitted(true)}
              disabled={feedbackSubmitted}
            >
              {feedbackSubmitted ? "Feedback submitted ✓" : "Submit feedback"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
