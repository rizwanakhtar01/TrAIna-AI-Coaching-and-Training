"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Play,
  MessageCircle,
  Brain,
  Trophy,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
  Star,
  FileText,
  BookOpen,
  CreditCard,
  Headphones,
  AlertCircle,
  Download,
  Phone,
  Mic,
  PhoneCall,
  BarChart3,
  Loader2,
  X,
} from "lucide-react"

type CoachingStep = "banner" | "materials" | "roleplay" | "quiz" | "summary" | "mockcall" | "mockanalysis" | "analyzing"

const documentContent: Record<string, string> = {
  "Escalation Guidelines": `# Escalation Guidelines

## When to Escalate

Escalate a customer issue when:
- Technical complexity exceeds your authority level
- Customer requests supervisor/manager intervention
- Issue requires specialized department involvement
- Customer is extremely dissatisfied despite best efforts

## Escalation Process

### Step 1: Prepare the Escalation
- Document all troubleshooting steps taken
- Gather customer account details
- Note customer sentiment and urgency level
- Prepare a brief summary of the issue

### Step 2: Inform the Customer
Use empathetic language:
"I want to make sure this gets resolved for you. Let me connect you with a specialist who can help with this specific situation."

### Step 3: Transfer Properly
- Use warm transfer when possible
- Brief the receiving agent fully
- Stay on the line until handoff is complete
- Thank the customer for their patience

## Best Practices
- Never escalate as first resort
- Always attempt resolution first
- Document everything in the system
- Follow up after escalation when appropriate`,

  "Problem-Solving Framework": `# Problem-Solving Framework

## The 5-Step Approach

### 1. Listen Actively
- Let customer explain fully
- Take detailed notes
- Ask clarifying questions
- Acknowledge their frustration

### 2. Identify the Core Issue
- Separate symptoms from root cause
- Ask probing questions
- Review account history
- Check for patterns

### 3. Explore Solutions
- Review available options
- Consider customer preferences
- Check policy guidelines
- Think creatively within boundaries

### 4. Implement Resolution
- Explain solution clearly
- Set expectations on timeline
- Confirm customer understanding
- Take immediate action

### 5. Follow Up
- Verify resolution worked
- Document outcome
- Learn from the experience
- Share insights with team

## Common Pitfalls to Avoid
- Jumping to solutions too quickly
- Not documenting properly
- Making promises you can't keep
- Ignoring customer emotions`,

  "Common Issues Playbook": `# Common Issues Playbook

## Billing Disputes
**Symptoms**: Customer questions charges
**Resolution**: Review transaction history, explain charges clearly, offer payment plan if appropriate

## Technical Problems
**Symptoms**: Service not working properly
**Resolution**: Follow standard troubleshooting, escalate if beyond scope

## Account Access Issues
**Symptoms**: Can't log in or reset password
**Resolution**: Verify identity, guide through reset process, check for account locks

## Product Returns
**Symptoms**: Customer wants to return item
**Resolution**: Check return policy eligibility, initiate return process, explain refund timeline

## Service Cancellations
**Symptoms**: Customer wants to cancel
**Resolution**: Understand reason, offer alternatives, process if requested, confirm cancellation`,

  "Refund Policy Guide": `# Refund Policy Guide

## Standard Refund Policy

### Eligibility Requirements
- Purchase within 30 days
- Product in original condition
- Proof of purchase required
- Original packaging preferred

### Processing Time
- 3-5 business days after approval
- Refund to original payment method
- Email confirmation sent

## Exceptions
- Digital products: No refunds after download
- Custom orders: Case-by-case basis
- Damaged items: Full refund regardless of timeframe

## How to Process
1. Verify purchase date and receipt
2. Check product condition
3. Confirm refund method
4. Process in system
5. Send confirmation email`,

  "Return Process Checklist": `# Return Process Checklist

## Pre-Return Verification
□ Confirm purchase date
□ Check return window eligibility
□ Verify product condition requirements
□ Review refund/exchange preference

## Documentation Required
□ Order number or receipt
□ Customer contact information
□ Reason for return
□ Photos if damaged/defective

## Processing Steps
□ Create return authorization
□ Generate return shipping label
□ Email instructions to customer
□ Update order status
□ Set reminder for return tracking

## Post-Return
□ Inspect returned item
□ Process refund/exchange
□ Send confirmation email
□ Update customer record`,

  "Exception Handling Rules": `# Exception Handling Rules

## When to Make Exceptions

Exceptions may be granted for:
- Long-term loyal customers
- Extenuating circumstances
- Company error situations
- Items outside window by <7 days

## Approval Requirements
- <$50: Agent discretion
- $50-$200: Supervisor approval
- >$200: Manager approval

## Documentation
ALL exceptions must include:
- Customer ID and order number
- Reason for exception
- Approval authority
- Expected customer impact`,

  "Billing System Guide": `# Billing System Guide

## Understanding the Billing Cycle

### Monthly Billing
- Bills generated on the 1st of each month
- Charges from previous month included
- Payment due within 15 days

### Pro-rated Charges
- New services charged from activation date
- Cancellations credited from termination date
- No partial month refunds on cancelled services

## Common Billing Questions

### Duplicate Charges
1. Check transaction history
2. Verify charge dates
3. Contact payment processor if confirmed duplicate
4. Process refund within 3-5 business days

### Payment Failed
1. Verify payment method on file
2. Check for insufficient funds
3. Update payment information
4. Retry payment processing`,

  "Payment Methods Overview": `# Payment Methods Overview

## Accepted Payment Methods

### Credit/Debit Cards
- Visa, MasterCard, American Express, Discover
- Cards must be valid and not expired
- Billing address verification required

### Digital Wallets
- PayPal
- Apple Pay
- Google Pay

### Bank Transfer
- Available for business accounts
- 3-5 business days processing time
- No transaction fees

## Updating Payment Information
1. Log into account settings
2. Navigate to Payment Methods
3. Add new or update existing method
4. Set as default if desired`,

  "Dispute Resolution Process": `# Dispute Resolution Process

## Steps to Handle Billing Disputes

### 1. Listen and Document
- Let customer explain the dispute fully
- Document all details
- Note dates, amounts, and transaction IDs

### 2. Investigate
- Review account history
- Check transaction logs
- Verify billing accuracy

### 3. Resolve
- If error found: Issue immediate correction
- If charge valid: Explain clearly with evidence
- Offer payment plan if appropriate

### 4. Follow Up
- Confirm resolution within 24 hours
- Document outcome in customer record
- Escalate if customer remains unsatisfied`,

  "Product Feature Guide": `# Product Feature Guide

## Core Features

### User Dashboard
- Real-time analytics and reporting
- Customizable widgets
- Export data capabilities

### Account Management
- User profile settings
- Team collaboration tools
- Access control and permissions

### Integration Capabilities
- API access for developers
- Third-party app connections
- Webhook notifications

### Support Resources
- In-app knowledge base
- Live chat support
- Video tutorials

## Advanced Features

### Automation Tools
- Scheduled tasks
- Workflow automation
- Custom triggers and actions

### Reporting & Analytics
- Custom report builder
- Data visualization
- Scheduled email reports`,

  "Troubleshooting Steps": `# Troubleshooting Steps

## Common Issues & Solutions

### Login Problems
**Issue**: Cannot log in to account
**Steps**:
1. Verify username/email is correct
2. Check caps lock is off
3. Try password reset
4. Clear browser cache and cookies
5. Try different browser
6. Contact support if issue persists

### Slow Performance
**Issue**: System running slowly
**Steps**:
1. Check internet connection speed
2. Close unnecessary browser tabs
3. Clear browser cache
4. Disable browser extensions
5. Try incognito/private mode
6. Check system status page

### Feature Not Working
**Issue**: Specific feature unavailable
**Steps**:
1. Verify user has proper permissions
2. Check if feature is enabled for account
3. Try logging out and back in
4. Clear cache and refresh page
5. Check for scheduled maintenance
6. Report bug if issue continues`,

  "Setup Instructions": `# Setup Instructions

## Initial Account Setup

### Step 1: Create Account
1. Go to signup page
2. Enter email address
3. Create secure password
4. Verify email address

### Step 2: Complete Profile
1. Add company information
2. Upload logo (optional)
3. Set timezone preferences
4. Configure notification settings

### Step 3: Configure Settings
1. Set up payment method
2. Invite team members
3. Customize workspace
4. Connect integrations

### Step 4: Start Using
1. Complete onboarding tutorial
2. Import existing data (if applicable)
3. Explore feature guides
4. Contact support with questions

## Best Practices
- Use strong, unique passwords
- Enable two-factor authentication
- Regularly review security settings
- Keep contact information updated`,
}

const coachingAreas = [
  {
    id: "problem-resolution",
    title: "Problem Resolution",
    icon: AlertCircle,
    description: "Handle complex customer issues effectively",
    priority: "high",
    documents: [
      { name: "Escalation Guidelines", type: "PDF", size: "2.1 MB" },
      { name: "Problem-Solving Framework", type: "DOC", size: "1.8 MB" },
      { name: "Common Issues Playbook", type: "PDF", size: "3.2 MB" },
    ],
    quizQuestions: [
      {
        id: "pr1",
        question: "When a customer reports a technical issue you can't immediately resolve, what's your first step?",
        options: [
          "Transfer them to technical support immediately",
          "Acknowledge the issue and gather detailed information",
          "Suggest they try restarting their device",
          "Tell them it's a known issue",
        ],
        correct: "Acknowledge the issue and gather detailed information",
      },
      {
        id: "pr2",
        question:
          "A customer is frustrated because their issue hasn't been resolved after multiple contacts. How do you respond?",
        options: [
          "I understand your frustration. Let me review your case history and ensure we resolve this today.",
          "You should have followed the instructions we gave you before.",
          "These things take time, please be patient.",
          "Let me transfer you to someone else.",
        ],
        correct: "I understand your frustration. Let me review your case history and ensure we resolve this today.",
      },
    ],
  },
  {
    id: "refunds",
    title: "Refunds & Returns",
    icon: CreditCard,
    description: "Process refunds and handle return requests",
    priority: "medium",
    documents: [
      { name: "Refund Policy Guide", type: "PDF", size: "1.5 MB" },
      { name: "Return Process Checklist", type: "DOC", size: "900 KB" },
      { name: "Exception Handling Rules", type: "PDF", size: "2.3 MB" },
    ],
    quizQuestions: [
      {
        id: "rf1",
        question: "What must you confirm before processing a refund?",
        options: [
          "Customer satisfaction with resolution",
          "Original payment method and purchase date",
          "Manager approval",
          "Customer's reason for refund",
        ],
        correct: "Original payment method and purchase date",
      },
      {
        id: "rf2",
        question: "A customer wants a refund outside the policy window. What's the best approach?",
        options: [
          "Deny the request immediately",
          "Explain the policy and explore alternative solutions",
          "Process it anyway to avoid escalation",
          "Transfer to a supervisor",
        ],
        correct: "Explain the policy and explore alternative solutions",
      },
    ],
  },
  {
    id: "billing",
    title: "Billing Inquiries",
    icon: FileText,
    description: "Resolve billing questions and payment issues",
    priority: "low",
    documents: [
      { name: "Billing System Guide", type: "PDF", size: "2.8 MB" },
      { name: "Payment Methods Overview", type: "DOC", size: "1.2 MB" },
      { name: "Dispute Resolution Process", type: "PDF", size: "1.9 MB" },
    ],
    quizQuestions: [
      {
        id: "bl1",
        question: "When explaining a billing charge to a confused customer, what should you do first?",
        options: [
          "Read the charge description exactly as it appears",
          "Ask them to check their email for receipts",
          "Break down the charge in simple terms and verify their understanding",
          "Suggest they contact their bank",
        ],
        correct: "Break down the charge in simple terms and verify their understanding",
      },
    ],
  },
  {
    id: "product-support",
    title: "Product Support",
    icon: Headphones,
    description: "Provide technical assistance and product guidance",
    priority: "medium",
    documents: [
      { name: "Product Feature Guide", type: "PDF", size: "4.1 MB" },
      { name: "Troubleshooting Steps", type: "DOC", size: "2.7 MB" },
      { name: "Setup Instructions", type: "PDF", size: "3.5 MB" },
    ],
    quizQuestions: [
      {
        id: "ps1",
        question: "When guiding a customer through technical steps, what's most important?",
        options: [
          "Complete the steps as quickly as possible",
          "Use technical terminology to be precise",
          "Go at their pace and confirm each step",
          "Send them a link to the manual",
        ],
        correct: "Go at their pace and confirm each step",
      },
    ],
  },
]

export function InteractiveCoachingScreen() {
  const [currentStep, setCurrentStep] = useState<CoachingStep>("banner")
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [agentResponse, setAgentResponse] = useState("")
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0)
  const [isMockCallActive, setIsMockCallActive] = useState(false)
  const [mockCallDuration, setMockCallDuration] = useState(0)
  const [mockCallScore, setMockCallScore] = useState(0)
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [isDocumentOpen, setIsDocumentOpen] = useState(false)

  const startCoaching = () => setCurrentStep("materials")
  const startRoleplay = () => setCurrentStep("roleplay")
  const goToQuiz = () => setCurrentStep("quiz")
  const goToSummary = () => setCurrentStep("summary")
  const startMockCall = () => setCurrentStep("mockcall")
  const goToAnalyzing = () => setCurrentStep("analyzing")
  const goToMockAnalysis = () => setCurrentStep("mockanalysis")
  const backToBanner = () => setCurrentStep("banner")

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const nextQuestion = () => {
    const allQuestions = selectedAreas.flatMap(
      (areaId) => coachingAreas.find((area) => area.id === areaId)?.quizQuestions || [],
    )

    if (currentQuizQuestion < allQuestions.length - 1) {
      setCurrentQuizQuestion((prev) => prev + 1)
    } else {
      goToSummary()
    }
  }

  const getAIRecommendations = () => {
    return [
      { areaId: "problem-resolution", reason: "Based on recent escalations, focus on de-escalation techniques" },
      { areaId: "refunds", reason: "Refund processing accuracy dropped 5% this week" },
    ]
  }

  const toggleMockCall = () => {
    setIsMockCallActive(!isMockCallActive)
    if (!isMockCallActive) {
      const interval = setInterval(() => {
        setMockCallDuration((prev) => prev + 1)
      }, 1000)

      setTimeout(() => {
        setIsMockCallActive(false)
        setMockCallScore(Math.floor(Math.random() * 20) + 80)
        clearInterval(interval)
        goToAnalyzing()
      }, 180000)
    }
  }

  const endMockCall = () => {
    setIsMockCallActive(false)
    setMockCallScore(Math.floor(Math.random() * 20) + 80)
    goToAnalyzing()
  }

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const openDocument = (documentName: string) => {
    setSelectedDocument(documentName)
    setIsDocumentOpen(true)
  }

  const downloadDocument = (documentName: string, fileType: string) => {
    const content = documentContent[documentName] || "Document content not available"
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${documentName}.${fileType.toLowerCase()}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (currentStep === "banner") {
    return (
      <div className="space-y-6">
        <Card className="border-accent bg-gradient-to-r from-accent/5 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Play className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">New Coaching Session Available</h3>
                  <p className="text-muted-foreground">Practice today's tricky scenarios — 5 minutes</p>
                </div>
              </div>
              <Button onClick={startCoaching} className="bg-accent hover:bg-accent/90">
                Start Coaching
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Your Coaching Progress
            </CardTitle>
            <CardDescription>Track your skill improvements over time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-accent/5">
                <div className="text-2xl font-bold text-accent">7</div>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/5">
                <div className="text-2xl font-bold text-primary">85%</div>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-chart-4/5">
                <div className="text-2xl font-bold text-chart-4">3</div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium">Skill Progress</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Empathy & Tone</span>
                    <span className="font-medium text-chart-4">+15%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Refund Policy Knowledge</span>
                    <span className="font-medium text-accent">+10%</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Problem Resolution</span>
                    <span className="font-medium text-primary">+8%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-chart-4/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-chart-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Refund Scenarios</p>
                    <p className="text-xs text-muted-foreground">Yesterday • 4/5 correct</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-chart-4/10 text-chart-4">
                  Completed
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-accent/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Billing Inquiries</p>
                    <p className="text-xs text-muted-foreground">2 days ago • 5/5 correct</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  Perfect
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === "materials") {
    const recommendations = getAIRecommendations()

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={backToBanner}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-8 rounded-full bg-accent"></div>
              <div className="h-2 w-8 rounded-full bg-muted"></div>
              <div className="h-2 w-8 rounded-full bg-muted"></div>
              <div className="h-2 w-8 rounded-full bg-muted"></div>
            </div>
            <span className="text-sm text-muted-foreground">Step 1 of 4</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Coaching Materials & Focus Areas
            </CardTitle>
            <CardDescription>
              Review materials and select areas to focus on. AI recommendations are highlighted.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <div className="flex items-start gap-2 mb-3">
                <Brain className="h-4 w-4 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-accent">AI Coach Recommendations</p>
                  <p className="text-xs text-muted-foreground">Based on your recent performance data</p>
                </div>
              </div>
              <div className="space-y-2">
                {recommendations.map((rec) => {
                  const area = coachingAreas.find((a) => a.id === rec.areaId)
                  return (
                    <div key={rec.areaId} className="flex items-center gap-2 text-sm">
                      <Target className="h-3 w-3 text-accent" />
                      <span className="font-medium">{area?.title}:</span>
                      <span className="text-muted-foreground">{rec.reason}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {coachingAreas.map((area) => {
                const Icon = area.icon
                const isRecommended = recommendations.some((r) => r.areaId === area.id)
                const isSelected = selectedAreas.includes(area.id)

                return (
                  <Card
                    key={area.id}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "ring-2 ring-accent bg-accent/5"
                        : isRecommended
                          ? "border-accent/50 bg-accent/5"
                          : ""
                    }`}
                    onClick={() => {
                      setSelectedAreas((prev) =>
                        prev.includes(area.id) ? prev.filter((id) => id !== area.id) : [...prev, area.id],
                      )
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{area.title}</h3>
                        </div>
                        <div className="flex gap-1">
                          {isRecommended && (
                            <Badge variant="secondary" className="bg-accent/10 text-accent text-xs">
                              Recommended
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              area.priority === "high"
                                ? "border-destructive/50 text-destructive"
                                : area.priority === "medium"
                                  ? "border-orange-500/50 text-orange-600"
                                  : "border-muted-foreground/50 text-muted-foreground"
                            }`}
                          >
                            {area.priority} priority
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{area.description}</p>

                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Available Materials
                        </h4>
                        <div className="space-y-1">
                          {area.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between text-xs group">
                              <div 
                                className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openDocument(doc.name)
                                }}
                              >
                                <FileText className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                                <span className="underline decoration-dotted underline-offset-2">{doc.name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <span>{doc.type}</span>
                                <span>•</span>
                                <span>{doc.size}</span>
                                <Download 
                                  className="h-3 w-3 cursor-pointer hover:text-primary transition-colors" 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    downloadDocument(doc.name, doc.type)
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={startRoleplay}
                disabled={selectedAreas.length === 0}
                className="bg-accent hover:bg-accent/90"
              >
                Start Coaching Session ({selectedAreas.length} areas)
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === "roleplay") {
    const selectedArea = coachingAreas.find((area) => selectedAreas.includes(area.id))
    const scenario =
      selectedArea?.id === "problem-resolution"
        ? "A customer has been experiencing recurring technical issues and is frustrated after multiple failed attempts to resolve it."
        : selectedArea?.id === "refunds"
          ? "A customer is demanding an immediate refund for a purchase made 45 days ago, outside the 30-day policy window."
          : "A customer is confused about multiple charges on their bill and suspects they've been overcharged."

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setCurrentStep("materials")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-8 rounded-full bg-accent"></div>
              <div className="h-2 w-8 rounded-full bg-accent"></div>
              <div className="h-2 w-8 rounded-full bg-muted"></div>
              <div className="h-2 w-8 rounded-full bg-muted"></div>
            </div>
            <span className="text-sm text-muted-foreground">Step 2 of 4</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Scenario Role-Play: {selectedArea?.title}
            </CardTitle>
            <CardDescription>Practice handling this scenario with empathy and professionalism.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border-l-4 border-destructive">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-destructive/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-destructive">C</span>
                </div>
                <span className="text-sm font-medium">Customer</span>
              </div>
              <p className="text-sm">{scenario}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="response">Your Response</Label>
              <Textarea
                id="response"
                placeholder="Type your response here..."
                value={agentResponse}
                onChange={(e) => setAgentResponse(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {agentResponse.length > 20 && (
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-accent">AI Coach Feedback</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Good start! Try acknowledging their frustration first before explaining the process. Consider: "I
                      completely understand your frustration..."
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={goToQuiz} disabled={agentResponse.length < 10}>
                Continue to Quiz
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === "quiz") {
    const allQuestions = selectedAreas.flatMap(
      (areaId) => coachingAreas.find((area) => area.id === areaId)?.quizQuestions || [],
    )
    const currentQuestion = allQuestions[currentQuizQuestion]

    if (!currentQuestion) {
      goToSummary()
      return null
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setCurrentStep("roleplay")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-8 rounded-full bg-accent"></div>
              <div className="h-2 w-8 rounded-full bg-accent"></div>
              <div className="h-2 w-8 rounded-full bg-accent"></div>
              <div className="h-2 w-8 rounded-full bg-muted"></div>
            </div>
            <span className="text-sm text-muted-foreground">Step 3 of 4</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Knowledge Check
            </CardTitle>
            <CardDescription>
              Question {currentQuizQuestion + 1} of {allQuestions.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-medium">{currentQuestion.question}</h3>

              <RadioGroup
                value={quizAnswers[currentQuestion.id] || ""}
                onValueChange={(value) => handleQuizAnswer(currentQuestion.id, value)}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-sm cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-end">
              <Button onClick={nextQuestion} disabled={!quizAnswers[currentQuestion.id]}>
                {currentQuizQuestion === allQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === "summary") {
    const allQuestions = selectedAreas.flatMap(
      (areaId) => coachingAreas.find((area) => area.id === areaId)?.quizQuestions || [],
    )
    const correctAnswers = allQuestions.filter((q) => quizAnswers[q.id] === q.correct).length
    const score = allQuestions.length > 0 ? Math.round((correctAnswers / allQuestions.length) * 100) : 0

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={backToBanner}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-8 rounded-full bg-accent"></div>
              <div className="h-2 w-8 rounded-full bg-accent"></div>
              <div className="h-2 w-8 rounded-full bg-accent"></div>
              <div className="h-2 w-8 rounded-full bg-accent"></div>
            </div>
            <span className="text-sm text-muted-foreground">Complete!</span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-chart-4/10 flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-chart-4" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2">Coaching Session Complete!</CardTitle>
            <CardDescription>Great job practicing {selectedAreas.length} focus areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 rounded-lg bg-accent/5">
              <div className="text-4xl font-bold text-accent mb-2">{score}%</div>
              <p className="text-muted-foreground">
                Session Score ({correctAnswers}/{allQuestions.length} correct)
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium">Areas Practiced</h4>
                <div className="grid gap-2">
                  {selectedAreas.map((areaId) => {
                    const area = coachingAreas.find((a) => a.id === areaId)
                    const Icon = area?.icon || FileText
                    return (
                      <div key={areaId} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{area?.title}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2 text-chart-4">
                  <CheckCircle className="h-4 w-4" />
                  Strengths Identified
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-chart-4"></div>
                    <span>Excellent empathy and active listening</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-chart-4"></div>
                    <span>Clear communication and explanation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-chart-4"></div>
                    <span>Professional tone maintained throughout</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Key Insights
              </h4>

              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-chart-4/5">
                  <CheckCircle className="h-4 w-4 text-chart-4 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">You improved on empathy this week</p>
                    <p className="text-xs text-muted-foreground">Better acknowledgment of customer frustration</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/5">
                  <TrendingUp className="h-4 w-4 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Refund policy knowledge +10%</p>
                    <p className="text-xs text-muted-foreground">From 70% to 80% accuracy</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Continue Learning
              </h4>

              <div className="grid gap-2">
                <Button variant="outline" className="justify-start bg-transparent">
                  <Clock className="h-4 w-4 mr-2" />
                  Practice more refund scenarios
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  <Star className="h-4 w-4 mr-2" />
                  Review empathy techniques
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <PhoneCall className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-primary">Ready for a Mock Call?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Test your skills with a simulated customer call. AI will analyze your performance in real-time.
              </p>
              <Button onClick={startMockCall} className="w-full bg-primary hover:bg-primary/90">
                <Phone className="h-4 w-4 mr-2" />
                Start Mock Call
              </Button>
            </div>

            <Button onClick={backToBanner} className="w-full bg-transparent" variant="outline">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === "mockcall") {
    const selectedArea = coachingAreas.find((area) => selectedAreas.includes(area.id))
    const mockScenario =
      selectedArea?.id === "problem-resolution"
        ? "Hi, I've been trying to fix this login issue for weeks and nothing works. This is my fourth call about the same problem!"
        : selectedArea?.id === "refunds"
          ? "I want my money back immediately! I bought this 2 months ago and it doesn't work as advertised."
          : "Why am I being charged $50 extra this month? I never authorized any additional services!"

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setCurrentStep("summary")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Mock Call Session
          </Badge>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <PhoneCall className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Mock Customer Call</CardTitle>
            <CardDescription>Practice scenario: {selectedArea?.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isMockCallActive ? (
              <>
                <div className="p-4 rounded-lg bg-muted/50 border-l-4 border-primary">
                  <h4 className="font-medium mb-2">Scenario Setup</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a simulated customer call. Respond naturally as you would in a real situation. AI
                    will analyze your tone, empathy, problem-solving approach, and adherence to best practices.
                  </p>
                </div>

                <div className="text-center">
                  <Button onClick={toggleMockCall} size="lg" className="bg-primary hover:bg-primary/90">
                    <Phone className="h-5 w-5 mr-2" />
                    Answer Incoming Call
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center p-6 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-sm font-medium">Call in Progress</span>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">{formatCallTime(mockCallDuration)}</div>
                  <p className="text-sm text-muted-foreground">AI is analyzing your conversation</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border-l-4 border-destructive">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-destructive/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-destructive">C</span>
                    </div>
                    <span className="text-sm font-medium">Customer</span>
                  </div>
                  <p className="text-sm">{mockScenario}</p>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="sm">
                    <Mic className="h-4 w-4 mr-2" />
                    Mute
                  </Button>
                  <Button onClick={endMockCall} variant="destructive" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    End Call
                  </Button>
                </div>

                <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="h-4 w-4 text-accent" />
                    <span className="font-medium text-accent">Live AI Analysis</span>
                  </div>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <div>✓ Good opening greeting</div>
                    <div>✓ Empathetic tone detected</div>
                    <div>→ Consider asking clarifying questions</div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === "analyzing") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={backToBanner}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Analyzing Call
          </Badge>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <CardTitle>Analyzing Your Call Performance</CardTitle>
            <CardDescription>AI is processing your conversation and generating insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-lg font-medium text-primary mb-2">
                Call Duration: {formatCallTime(mockCallDuration)}
              </div>
              <p className="text-sm text-muted-foreground">Processing complete conversation...</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="h-2 w-2 rounded-full bg-chart-4 animate-pulse"></div>
                <span className="text-sm">Analyzing tone and empathy levels</span>
                <CheckCircle className="h-4 w-4 text-chart-4 ml-auto" />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="h-2 w-2 rounded-full bg-chart-4 animate-pulse"></div>
                <span className="text-sm">Evaluating problem-solving approach</span>
                <CheckCircle className="h-4 w-4 text-chart-4 ml-auto" />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse"></div>
                <span className="text-sm">Checking adherence to best practices</span>
                <Loader2 className="h-4 w-4 text-accent animate-spin ml-auto" />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                <span className="text-sm text-muted-foreground">Generating personalized recommendations</span>
                <div className="h-4 w-4 ml-auto"></div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">AI Analysis in Progress</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Our AI is analyzing multiple aspects of your call including communication style, problem resolution
                techniques, and customer satisfaction indicators. This typically takes 30-60 seconds.
              </p>
            </div>

            <div className="text-center">
              <Button onClick={goToMockAnalysis} className="bg-primary hover:bg-primary/90" disabled={false}>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analysis Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === "mockanalysis") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={backToBanner}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Badge variant="secondary" className="bg-chart-4/10 text-chart-4">
            Call Analysis Complete
          </Badge>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-chart-4/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-chart-4" />
            </div>
            <CardTitle>Mock Call Analysis</CardTitle>
            <CardDescription>AI evaluation of your customer interaction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 rounded-lg bg-chart-4/5">
              <div className="text-4xl font-bold text-chart-4 mb-2">{mockCallScore}%</div>
              <p className="text-muted-foreground">Overall Performance Score</p>
              <p className="text-xs text-muted-foreground mt-1">Call Duration: {formatCallTime(mockCallDuration)}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2 text-chart-4">
                  <CheckCircle className="h-4 w-4" />
                  Strengths Identified
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-chart-4"></div>
                    <span>Excellent empathy and active listening</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-chart-4"></div>
                    <span>Clear communication and explanation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-chart-4"></div>
                    <span>Professional tone maintained throughout</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2 text-accent">
                  <Target className="h-4 w-4" />
                  Areas for Improvement
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                    <span>Could probe deeper into root cause</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                    <span>Offer more proactive solutions</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                AI Coaching Recommendations
              </h4>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  Based on this call, focus on asking more discovery questions early in the conversation. Try phrases
                  like "Help me understand..." or "Can you walk me through..." to gather comprehensive information
                  before proposing solutions.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={startMockCall} variant="outline" className="flex-1 bg-transparent">
                <Phone className="h-4 w-4 mr-2" />
                Try Another Call
              </Button>
              <Button onClick={backToBanner} className="flex-1">
                Complete Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Dialog open={isDocumentOpen} onOpenChange={setIsDocumentOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {selectedDocument}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedDocument) {
                    const docType = coachingAreas
                      .flatMap(area => area.documents)
                      .find(doc => doc.name === selectedDocument)?.type || 'PDF'
                    downloadDocument(selectedDocument, docType)
                  }
                }}
                className="ml-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </DialogTitle>
            <DialogDescription>
              Training material - Click download to save a copy
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm font-sans bg-muted p-4 rounded-lg">
                {selectedDocument && (documentContent[selectedDocument] || "Document content not available")}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {null}
    </>
  )
}
