"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Bot,
  Plus,
  Upload,
  Edit,
  Trash2,
  LogOut,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
  Database,
  Brain,
  Activity,
  ChevronLeft,
  ChevronRight,
  FileText,
  Lightbulb,
  Zap,
  Star,
  Users,
  CreditCard,
  Wrench,
  ShoppingCart,
  Settings,
  Play,
  Save,
  Check,
} from "lucide-react"

interface AdminDashboardProps {
  onLogout: () => void
}

// Enhanced interfaces for the Smart Agent Creation Wizard
interface AgentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  suggestedFocusAreas: string[];
  suggestedCoachingStyle: string;
  instructionTemplate: InstructionTemplate;
}

interface InstructionTemplate {
  generalApproach: string;
  mustDoActions: string[];
  mustAvoidActions: string[];
  keyPhrases: {
    greeting: string[];
    empathy: string[];
    resolution: string[];
    closing: string[];
  };
  escalationRules: string[];
  complianceRequirements: string[];
}

interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  type: 'policy' | 'procedure' | 'script' | 'faq' | 'example';
  qualityScore: number;
  relevanceScore: number;
  analysisResults: {
    hasAclearPolicies: boolean;
    hasExamples: boolean;
    hasEscalationRules: boolean;
    missingElements: string[];
  };
  suggestions: string[];
}

interface EnhancedAgentConfig {
  // Step 1: Quick Start
  useTemplate: boolean;
  selectedTemplate: string;
  
  // Step 2: Basic Config
  agentName: string;
  topicCategory: string;
  description: string;
  
  // Step 3: Documents
  documents: UploadedDocument[];
  
  // Step 4: Instructions
  instructions: InstructionTemplate;
  
  // Step 5: Test & Activate
  testResults: any[];
  readyToActivate: boolean;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(1)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [agentConfig, setAgentConfig] = useState<EnhancedAgentConfig>({
    useTemplate: true,
    selectedTemplate: '',
    agentName: '',
    topicCategory: '',
    description: '',
    documents: [],
    instructions: {
      generalApproach: '',
      mustDoActions: [],
      mustAvoidActions: [],
      keyPhrases: { greeting: [], empathy: [], resolution: [], closing: [] },
      escalationRules: [],
      complianceRequirements: []
    },
    testResults: [],
    readyToActivate: false
  })

  // Agent Templates
  const agentTemplates: AgentTemplate[] = [
    {
      id: 'billing',
      name: 'Billing & Payments',
      category: 'Financial Services',
      description: 'Handle billing inquiries, payment issues, and subscription management',
      icon: CreditCard,
      suggestedFocusAreas: ['Payment processing', 'Billing disputes', 'Subscription changes', 'Refund policies'],
      suggestedCoachingStyle: 'Empathetic but firm, policy-focused',
      instructionTemplate: {
        generalApproach: 'Agents should prioritize accuracy and empathy when handling billing inquiries. Always verify customer identity first and explain charges clearly.',
        mustDoActions: [
          'Verify customer identity before discussing account details',
          'Explain all charges clearly and provide itemized breakdown',
          'Offer payment plans proactively for large balances',
          'Document all changes made to customer accounts',
          'Provide clear follow-up timeline for any pending actions'
        ],
        mustAvoidActions: [
          'Never promise refunds without proper authorization',
          'Do not discuss other customers\' billing information',
          'Avoid using technical payment processing jargon',
          'Do not waive fees without supervisor approval'
        ],
        keyPhrases: {
          greeting: ['I\'d be happy to help with your billing inquiry', 'Let me review your account details'],
          empathy: ['I understand your concern about these charges', 'I can see why this would be confusing'],
          resolution: ['Here\'s what I can do to resolve this', 'Let me process this adjustment for you'],
          closing: ['Is there anything else about your billing I can clarify?', 'Your account has been updated successfully']
        },
        escalationRules: [
          'Disputes over $500 require supervisor approval',
          'Fraud claims must be escalated immediately',
          'Legal concerns mentioned by customer'
        ],
        complianceRequirements: [
          'PCI compliance for payment data handling',
          'Document all fee waivers and credits applied',
          'Maintain audit trail for account changes'
        ]
      }
    },
    {
      id: 'technical',
      name: 'Technical Support',
      category: 'Product Support',
      description: 'Provide technical assistance and troubleshooting guidance',
      icon: Wrench,
      suggestedFocusAreas: ['Troubleshooting', 'Product features', 'Integration support', 'Bug reporting'],
      suggestedCoachingStyle: 'Patient and methodical, solution-oriented',
      instructionTemplate: {
        generalApproach: 'Focus on systematic troubleshooting and clear step-by-step guidance. Always confirm customer understanding before proceeding.',
        mustDoActions: [
          'Gather detailed information about the issue',
          'Follow systematic troubleshooting steps',
          'Provide clear, step-by-step instructions',
          'Confirm each step is completed before proceeding',
          'Document resolution for knowledge base'
        ],
        mustAvoidActions: [
          'Do not skip diagnostic steps',
          'Avoid technical jargon without explanation',
          'Never assume customer technical expertise',
          'Do not provide workarounds for security features'
        ],
        keyPhrases: {
          greeting: ['I\'ll help you resolve this technical issue', 'Let\'s work through this step by step'],
          empathy: ['Technical issues can be frustrating', 'I understand this is affecting your workflow'],
          resolution: ['Let\'s try this solution', 'This should resolve the issue'],
          closing: ['Is everything working as expected now?', 'Feel free to contact us if you need further assistance']
        },
        escalationRules: [
          'Hardware failures require level 2 support',
          'Security vulnerabilities need immediate escalation',
          'Product bugs affecting multiple customers'
        ],
        complianceRequirements: [
          'Follow security protocols for account access',
          'Document all troubleshooting steps taken',
          'Maintain customer data confidentiality'
        ]
      }
    },
    {
      id: 'sales',
      name: 'Sales & Product Info',
      category: 'Sales Support',
      description: 'Assist with product information and sales inquiries',
      icon: ShoppingCart,
      suggestedFocusAreas: ['Product features', 'Pricing information', 'Upselling', 'Demo scheduling'],
      suggestedCoachingStyle: 'Consultative and informative, value-focused',
      instructionTemplate: {
        generalApproach: 'Focus on understanding customer needs and matching them with appropriate solutions. Always prioritize value over features.',
        mustDoActions: [
          'Understand customer use case and requirements',
          'Present solutions that match customer needs',
          'Provide accurate pricing and feature information',
          'Offer demos or trials when appropriate',
          'Follow up on qualified leads'
        ],
        mustAvoidActions: [
          'Do not oversell features customer doesn\'t need',
          'Avoid pressure tactics or urgency without cause',
          'Never promise features not yet available',
          'Do not discount without authorization'
        ],
        keyPhrases: {
          greeting: ['I\'d love to help you find the right solution', 'Let me understand your requirements'],
          empathy: ['I understand you want to make the right choice', 'Finding the right fit is important'],
          resolution: ['Based on your needs, I\'d recommend', 'This solution would address your requirements'],
          closing: ['Would you like to see a demo?', 'I\'ll send you the information we discussed']
        },
        escalationRules: [
          'Enterprise deals over $10,000 require sales manager',
          'Custom pricing requests need approval',
          'Competitive displacement situations'
        ],
        complianceRequirements: [
          'Maintain accurate lead tracking',
          'Follow GDPR guidelines for prospect data',
          'Document all pricing quotes provided'
        ]
      }
    },
    {
      id: 'account',
      name: 'Account Management',
      category: 'Customer Success',
      description: 'Handle account changes, upgrades, and general account inquiries',
      icon: Users,
      suggestedFocusAreas: ['Account updates', 'Service changes', 'User management', 'Renewals'],
      suggestedCoachingStyle: 'Professional and efficient, relationship-focused',
      instructionTemplate: {
        generalApproach: 'Prioritize customer satisfaction and long-term relationship building. Be proactive about identifying expansion opportunities.',
        mustDoActions: [
          'Verify account ownership before making changes',
          'Explain impact of any account modifications',
          'Identify opportunities for account growth',
          'Ensure smooth implementation of changes',
          'Follow up to confirm satisfaction'
        ],
        mustAvoidActions: [
          'Do not make account changes without proper verification',
          'Avoid downgrading without understanding reasons',
          'Never make promises about future product development',
          'Do not bypass security protocols'
        ],
        keyPhrases: {
          greeting: ['I\'ll help you with your account updates', 'Let me review your current configuration'],
          empathy: ['I want to make sure this works for your team', 'Your account setup is important to us'],
          resolution: ['I\'ll implement these changes for you', 'This will optimize your account setup'],
          closing: ['Your account has been updated successfully', 'Let me know if you need any other adjustments']
        },
        escalationRules: [
          'Account downgrades require retention specialist',
          'Security concerns need immediate attention',
          'Bulk user changes over 100 users'
        ],
        complianceRequirements: [
          'Maintain detailed change logs',
          'Follow data retention policies',
          'Ensure proper authorization for account changes'
        ]
      }
    }
  ];

  // Mock data for AI agents
  const aiAgents = [
    {
      id: "agent-001",
      intentName: "Refunds & Returns",
      description: "Handles customer refund requests and return processing",
      status: "active",
      lastUpdated: "2024-03-15",
      knowledgeBaseSize: "2.3 MB",
      trainingAccuracy: 94,
      usageCount: 1247,
    },
    {
      id: "agent-002",
      intentName: "Billing Inquiries",
      description: "Assists with billing questions and payment issues",
      status: "active",
      lastUpdated: "2024-03-14",
      knowledgeBaseSize: "1.8 MB",
      trainingAccuracy: 91,
      usageCount: 892,
    },
    {
      id: "agent-003",
      intentName: "Product Support",
      description: "Provides technical support and product guidance",
      status: "training",
      lastUpdated: "2024-03-16",
      knowledgeBaseSize: "3.1 MB",
      trainingAccuracy: 87,
      usageCount: 634,
    },
    {
      id: "agent-004",
      intentName: "Account Management",
      description: "Handles account changes and subscription management",
      status: "inactive",
      lastUpdated: "2024-03-10",
      knowledgeBaseSize: "1.5 MB",
      trainingAccuracy: 89,
      usageCount: 423,
    },
  ]

  const systemStats = {
    totalAgents: aiAgents.length,
    activeAgents: aiAgents.filter((a) => a.status === "active").length,
    totalInteractions: aiAgents.reduce((sum, agent) => sum + agent.usageCount, 0),
    avgAccuracy: Math.round(aiAgents.reduce((sum, agent) => sum + agent.trainingAccuracy, 0) / aiAgents.length),
  }

  const handleCreateAgent = () => {
    // Handle agent creation logic here
    console.log("Creating new AI agent:", agentConfig)
    setIsCreateWizardOpen(false)
    setWizardStep(1)
    setAgentConfig({
      useTemplate: true,
      selectedTemplate: '',
      agentName: '',
      topicCategory: '',
      description: '',
      documents: [],
      instructions: {
        generalApproach: '',
        mustDoActions: [],
        mustAvoidActions: [],
        keyPhrases: { greeting: [], empathy: [], resolution: [], closing: [] },
        escalationRules: [],
        complianceRequirements: []
      },
      testResults: [],
      readyToActivate: false
    })
  }

  // Validation functions for each step
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {}
    
    switch (step) {
      case 1:
        if (agentConfig.useTemplate && !agentConfig.selectedTemplate) {
          errors.template = 'Please select a template to continue'
        }
        break
      case 2:
        if (!agentConfig.agentName.trim()) {
          errors.agentName = 'Agent name is required'
        }
        if (!agentConfig.description.trim()) {
          errors.description = 'Description is required'
        }
        break
      case 3:
        if (agentConfig.documents.length === 0) {
          errors.documents = 'At least one document is required'
        }
        break
      case 4:
        if (!agentConfig.instructions.generalApproach.trim()) {
          errors.instructions = 'General approach is required'
        }
        if (agentConfig.instructions.mustDoActions.length === 0) {
          errors.mustDo = 'At least one must-do action is required'
        }
        break
      case 5:
        if (!agentConfig.readyToActivate) {
          errors.testing = 'Please run tests before activation'
        }
        break
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const analyzeDocument = (file: File): UploadedDocument => {
    // Deterministic quality analysis based on file properties
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const fileSizeKB = file.size / 1024
    
    // Base quality score on file type and size
    let qualityScore = 70
    let docType: UploadedDocument['type'] = 'policy'
    
    // File type analysis
    switch (fileExtension) {
      case 'pdf':
        qualityScore += 20
        docType = 'policy'
        break
      case 'docx':
        qualityScore += 15
        docType = 'procedure'
        break
      case 'txt':
        qualityScore += 10
        docType = 'script'
        break
      case 'csv':
        qualityScore += 5
        docType = 'faq'
        break
    }
    
    // File size consideration (optimal range 100KB - 5MB)
    if (fileSizeKB >= 100 && fileSizeKB <= 5120) {
      qualityScore += 10
    } else if (fileSizeKB < 50) {
      qualityScore -= 15
    }
    
    // Relevance based on filename keywords
    const filename = file.name.toLowerCase()
    let relevanceScore = 60
    const relevantKeywords = ['policy', 'procedure', 'guide', 'script', 'faq', 'billing', 'support', 'customer']
    relevantKeywords.forEach(keyword => {
      if (filename.includes(keyword)) relevanceScore += 8
    })
    
    relevanceScore = Math.min(100, relevanceScore)
    qualityScore = Math.min(100, Math.max(30, qualityScore))
    
    const missingElements = []
    const suggestions = []
    
    if (qualityScore < 80) {
      suggestions.push('Consider using a more structured document format')
    }
    if (relevanceScore < 70) {
      suggestions.push('Ensure document content is relevant to the agent\'s purpose')
      missingElements.push('Topic-specific content')
    }
    if (fileSizeKB < 100) {
      suggestions.push('Document may be too brief for comprehensive training')
      missingElements.push('Detailed examples and procedures')
    }
    
    return {
      id: Date.now().toString(),
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      type: docType,
      qualityScore,
      relevanceScore,
      analysisResults: {
        hasAclearPolicies: qualityScore > 85,
        hasExamples: fileSizeKB > 200,
        hasEscalationRules: filename.includes('escalation') || filename.includes('policy'),
        missingElements
      },
      suggestions
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    const newDocuments = files.map(analyzeDocument)
    
    setAgentConfig({
      ...agentConfig,
      documents: [...agentConfig.documents, ...newDocuments]
    })
    
    // Clear validation errors if documents are added
    if (validationErrors.documents) {
      setValidationErrors({ ...validationErrors, documents: '' })
    }
  }

  const removeDocument = (docId: string) => {
    setAgentConfig({
      ...agentConfig,
      documents: agentConfig.documents.filter(doc => doc.id !== docId)
    })
  }

  const nextStep = () => {
    if (validateStep(wizardStep) && wizardStep < 5) {
      setWizardStep(wizardStep + 1)
      setValidationErrors({})
    }
  }

  const prevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1)
    }
  }

  const selectTemplate = (templateId: string) => {
    const template = agentTemplates.find(t => t.id === templateId)
    if (template) {
      setAgentConfig({
        ...agentConfig,
        selectedTemplate: templateId,
        topicCategory: template.category,
        description: template.description,
        instructions: template.instructionTemplate
      })
      // Clear validation errors when template is selected
      if (validationErrors.template) {
        setValidationErrors({ ...validationErrors, template: '' })
      }
    }
  }

  const runAgentTest = async () => {
    // Simulate running tests
    const testScenarios = [
      'Customer requests refund',
      'Technical support inquiry',
      'Billing dispute escalation'
    ]
    
    const results = testScenarios.map(scenario => ({
      scenario,
      passed: Math.random() > 0.2, // 80% pass rate
      response: `Agent handled ${scenario.toLowerCase()} appropriately with coaching guidelines`,
      score: Math.floor(Math.random() * 30) + 70
    }))
    
    setAgentConfig({
      ...agentConfig,
      testResults: results,
      readyToActivate: results.every(r => r.passed)
    })
    
    if (validationErrors.testing) {
      setValidationErrors({ ...validationErrors, testing: '' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <Target className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">OmniHive Coaching and Training</h1>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 font-medium">
              Admin View
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>System Administrator</span>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xs font-medium text-purple-800">SA</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full grid-cols-3 lg:w-[450px] bg-zinc-100">
              <TabsTrigger value="overview">System Overview</TabsTrigger>
              <TabsTrigger value="agents">AI Agent Management</TabsTrigger>
              <TabsTrigger value="training">Training History</TabsTrigger>
            </TabsList>

            <Dialog open={isCreateWizardOpen} onOpenChange={setIsCreateWizardOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create AI Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Smart Agent Creation Wizard
                  </DialogTitle>
                  <DialogDescription>
                    Create and configure a new AI coaching agent with guided templates and intelligent suggestions
                  </DialogDescription>
                  
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-center mt-4">
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((step) => (
                        <div key={step} className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              step === wizardStep
                                ? 'bg-primary text-primary-foreground'
                                : step < wizardStep
                                ? 'bg-chart-4 text-white'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {step < wizardStep ? <Check className="h-4 w-4" /> : step}
                          </div>
                          {step < 5 && (
                            <div
                              className={`w-8 h-0.5 ${
                                step < wizardStep ? 'bg-chart-4' : 'bg-muted'
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground mt-2">
                    Step {wizardStep} of 5: {
                      wizardStep === 1 ? 'Quick Start' :
                      wizardStep === 2 ? 'Configure' :
                      wizardStep === 3 ? 'Documents' :
                      wizardStep === 4 ? 'Instructions' :
                      'Test & Activate'
                    }
                  </div>
                </DialogHeader>

                <div className="py-6">
                  {/* Step 1: Quick Start */}
                  {wizardStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">How would you like to start?</h3>
                        <p className="text-muted-foreground">Choose a template to get started faster, or build from scratch</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card 
                          className={`cursor-pointer transition-all ${agentConfig.useTemplate ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                          onClick={() => setAgentConfig({...agentConfig, useTemplate: true})}
                        >
                          <CardContent className="p-6 text-center">
                            <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                            <h4 className="font-semibold mb-2">Start from Template</h4>
                            <p className="text-sm text-muted-foreground">
                              Use pre-built templates with proven coaching patterns and best practices
                            </p>
                          </CardContent>
                        </Card>

                        <Card 
                          className={`cursor-pointer transition-all ${!agentConfig.useTemplate ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                          onClick={() => setAgentConfig({...agentConfig, useTemplate: false})}
                        >
                          <CardContent className="p-6 text-center">
                            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h4 className="font-semibold mb-2">Start from Scratch</h4>
                            <p className="text-sm text-muted-foreground">
                              Build a completely custom agent with full control over all configurations
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      {agentConfig.useTemplate && (
                        <div className="space-y-4">
                          <h4 className="font-medium">Choose a Template</h4>
                          {validationErrors.template && (
                            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                              {validationErrors.template}
                            </div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {agentTemplates.map((template) => (
                              <Card 
                                key={template.id}
                                className={`cursor-pointer transition-all ${agentConfig.selectedTemplate === template.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                                onClick={() => selectTemplate(template.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <template.icon className="h-6 w-6 text-primary mt-1" />
                                    <div className="flex-1">
                                      <h5 className="font-medium">{template.name}</h5>
                                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {template.suggestedFocusAreas.slice(0, 2).map((area, index) => (
                                          <Badge key={index} variant="secondary" className="text-xs">{area}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 2: Basic Configuration */}
                  {wizardStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Agent Configuration</h3>
                        <p className="text-muted-foreground">Set up the basic details for your AI agent</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="agentName">Agent Name *</Label>
                            <Input
                              id="agentName"
                              placeholder="e.g., Billing Support Assistant"
                              value={agentConfig.agentName}
                              onChange={(e) => {
                                setAgentConfig({...agentConfig, agentName: e.target.value})
                                if (validationErrors.agentName && e.target.value.trim()) {
                                  setValidationErrors({ ...validationErrors, agentName: '' })
                                }
                              }}
                              className={validationErrors.agentName ? 'border-destructive' : ''}
                            />
                            {validationErrors.agentName && (
                              <p className="text-sm text-destructive">{validationErrors.agentName}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="topicCategory">Topic Category</Label>
                            <Input
                              id="topicCategory"
                              placeholder="e.g., Financial Services"
                              value={agentConfig.topicCategory}
                              onChange={(e) => setAgentConfig({...agentConfig, topicCategory: e.target.value})}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                              id="description"
                              placeholder="Brief description of what this agent handles"
                              rows={3}
                              value={agentConfig.description}
                              onChange={(e) => {
                                setAgentConfig({...agentConfig, description: e.target.value})
                                if (validationErrors.description && e.target.value.trim()) {
                                  setValidationErrors({ ...validationErrors, description: '' })
                                }
                              }}
                              className={validationErrors.description ? 'border-destructive' : ''}
                            />
                            {validationErrors.description && (
                              <p className="text-sm text-destructive">{validationErrors.description}</p>
                            )}
                          </div>
                        </div>

                        {agentConfig.selectedTemplate && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-3">Template Suggestions</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-sm text-muted-foreground">Suggested Focus Areas</Label>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {agentTemplates.find(t => t.id === agentConfig.selectedTemplate)?.suggestedFocusAreas.map((area, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">{area}</Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm text-muted-foreground">Coaching Style</Label>
                                  <p className="text-sm mt-1">{agentTemplates.find(t => t.id === agentConfig.selectedTemplate)?.suggestedCoachingStyle}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Documents */}
                  {wizardStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Knowledge Base Documents</h3>
                        <p className="text-muted-foreground">Upload documents to train your agent with relevant knowledge</p>
                      </div>

                      <div className="space-y-4">
                        {validationErrors.documents && (
                          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                            {validationErrors.documents}
                          </div>
                        )}
                        <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
                          validationErrors.documents ? 'border-destructive/50' : 'border-muted-foreground/25'
                        }`}>
                          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <Label htmlFor="fileUpload" className="cursor-pointer">
                            <span className="text-lg font-medium">Upload Documents</span>
                            <p className="text-sm text-muted-foreground mt-1">
                              Drag & drop files here, or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Supports PDF, CSV, TXT, DOCX files
                            </p>
                          </Label>
                          <Input
                            id="fileUpload"
                            type="file"
                            accept=".pdf,.csv,.txt,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            multiple
                          />
                        </div>

                        {agentConfig.documents.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium">Uploaded Documents</h4>
                            {agentConfig.documents.map((doc) => (
                              <Card key={doc.id}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                      <FileText className="h-5 w-5 text-primary mt-1" />
                                      <div className="flex-1">
                                        <h5 className="font-medium">{doc.name}</h5>
                                        <p className="text-sm text-muted-foreground">
                                          {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} • {doc.size}
                                        </p>
                                        
                                        <div className="flex items-center gap-4 mt-2">
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">Quality:</span>
                                            <Badge variant={doc.qualityScore >= 90 ? "default" : doc.qualityScore >= 70 ? "secondary" : "destructive"}>
                                              {doc.qualityScore}/100
                                            </Badge>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">Relevance:</span>
                                            <Badge variant={doc.relevanceScore >= 90 ? "default" : doc.relevanceScore >= 70 ? "secondary" : "destructive"}>
                                              {doc.relevanceScore}/100
                                            </Badge>
                                          </div>
                                        </div>

                                        {doc.suggestions.length > 0 && (
                                          <div className="mt-3">
                                            <div className="flex items-center gap-2 mb-2">
                                              <Lightbulb className="h-4 w-4 text-amber-500" />
                                              <span className="text-sm font-medium">Suggestions</span>
                                            </div>
                                            {doc.suggestions.map((suggestion, index) => (
                                              <p key={index} className="text-sm text-muted-foreground">• {suggestion}</p>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => removeDocument(doc.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Instructions */}
                  {wizardStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Coaching Instructions</h3>
                        <p className="text-muted-foreground">Configure how your agent should coach and respond</p>
                      </div>

                      <div className="space-y-6">
                        {validationErrors.instructions && (
                          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                            {validationErrors.instructions}
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label>General Approach *</Label>
                          <Textarea
                            placeholder="Describe the overall coaching approach..."
                            rows={3}
                            value={agentConfig.instructions.generalApproach}
                            onChange={(e) => {
                              setAgentConfig({
                                ...agentConfig,
                                instructions: {...agentConfig.instructions, generalApproach: e.target.value}
                              })
                              if (validationErrors.instructions && e.target.value.trim()) {
                                setValidationErrors({ ...validationErrors, instructions: '' })
                              }
                            }}
                            className={validationErrors.instructions ? 'border-destructive' : ''}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label>Must Do Actions *</Label>
                            {validationErrors.mustDo && (
                              <p className="text-sm text-destructive">{validationErrors.mustDo}</p>
                            )}
                            <div className={`border rounded-md p-3 space-y-2 max-h-32 overflow-y-auto ${
                              validationErrors.mustDo ? 'border-destructive' : ''
                            }`}>
                              {agentConfig.instructions.mustDoActions.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No must-do actions defined yet</p>
                              ) : (
                                agentConfig.instructions.mustDoActions.map((action, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-chart-4" />
                                    <span className="text-sm">{action}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Must Avoid Actions</Label>
                            <div className="border rounded-md p-3 space-y-2 max-h-32 overflow-y-auto">
                              {agentConfig.instructions.mustAvoidActions.map((action, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-destructive" />
                                  <span className="text-sm">{action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Escalation Rules</Label>
                          <div className="border rounded-md p-3 space-y-2 max-h-24 overflow-y-auto">
                            {agentConfig.instructions.escalationRules.map((rule, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <ChevronRight className="h-4 w-4 text-amber-500" />
                                <span className="text-sm">{rule}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Test & Activate */}
                  {wizardStep === 5 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Test & Activate</h3>
                        <p className="text-muted-foreground">Test your agent before making it live</p>
                      </div>

                      {validationErrors.testing && (
                        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                          {validationErrors.testing}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Agent Preview */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Agent Preview</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <Label className="text-sm font-medium">Name:</Label>
                                <p className="text-sm">{agentConfig.agentName || 'Untitled Agent'}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Category:</Label>
                                <p className="text-sm">{agentConfig.topicCategory || 'General'}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Documents:</Label>
                                <p className="text-sm">{agentConfig.documents.length} document(s) uploaded</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Approach:</Label>
                                <p className="text-sm line-clamp-3">
                                  {agentConfig.instructions.generalApproach || 'No approach defined'}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Test Panel */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Test Results</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {agentConfig.testResults.length === 0 ? (
                              <div className="text-center py-8">
                                <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h4 className="font-semibold mb-2">Ready to Test</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Run test scenarios to validate your agent configuration.
                                </p>
                                <Button onClick={runAgentTest} variant="outline">
                                  <Play className="h-4 w-4 mr-2" />
                                  Run Tests
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-medium">Test Scenarios</span>
                                  <Badge variant={agentConfig.readyToActivate ? "default" : "destructive"}>
                                    {agentConfig.testResults.filter(r => r.passed).length}/{agentConfig.testResults.length} Passed
                                  </Badge>
                                </div>
                                {agentConfig.testResults.map((result, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                    {result.passed ? (
                                      <CheckCircle className="h-4 w-4 text-chart-4" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-destructive" />
                                    )}
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{result.scenario}</p>
                                      <p className="text-xs text-muted-foreground">Score: {result.score}/100</p>
                                    </div>
                                  </div>
                                ))}
                                <Button 
                                  onClick={runAgentTest} 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full mt-3"
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Re-run Tests
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                      
                      {agentConfig.readyToActivate && (
                        <Card className="border-chart-4">
                          <CardContent className="p-6 text-center">
                            <CheckCircle className="h-12 w-12 text-chart-4 mx-auto mb-4" />
                            <h4 className="font-semibold mb-2 text-chart-4">Ready for Activation</h4>
                            <p className="text-muted-foreground mb-4">
                              All tests passed! Your agent is ready to be activated and start coaching.
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </div>

                <DialogFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateWizardOpen(false)}
                    >
                      Cancel
                    </Button>
                    {wizardStep > 1 && (
                      <Button variant="outline" onClick={prevStep}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {wizardStep < 5 ? (
                      <Button 
                        onClick={nextStep}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleCreateAgent}
                        disabled={!agentConfig.readyToActivate}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {agentConfig.readyToActivate ? 'Create & Activate Agent' : 'Complete Tests First'}
                      </Button>
                    )}
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* System Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total AI Agents</CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.totalAgents}</div>
                  <p className="text-xs text-muted-foreground">{systemStats.activeAgents} active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
                  <Activity className="h-4 w-4 text-chart-1" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.totalInteractions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
                  <Brain className="h-4 w-4 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.avgAccuracy}%</div>
                  <p className="text-xs text-muted-foreground">Across all agents</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Knowledge Base Size</CardTitle>
                  <Database className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.7 MB</div>
                  <p className="text-xs text-muted-foreground">Total storage used</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
                <CardDescription>Latest updates and training activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-chart-4/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-chart-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Product Support agent training completed</p>
                      <p className="text-xs text-muted-foreground">2 hours ago • Accuracy improved to 87%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-chart-1/10 flex items-center justify-center">
                      <Upload className="h-4 w-4 text-chart-1" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New knowledge base uploaded for Billing Inquiries</p>
                      <p className="text-xs text-muted-foreground">1 day ago • 1.2 MB added</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-chart-2/10 flex items-center justify-center">
                      <Plus className="h-4 w-4 text-chart-2" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Refunds & Returns agent created</p>
                      <p className="text-xs text-muted-foreground">3 days ago • Initial training in progress</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">AI Agent Management</h2>
                <p className="text-muted-foreground">Manage your AI coaching agents and their configurations</p>
              </div>
            </div>

            <div className="grid gap-4">
              {aiAgents.map((agent) => (
                <Card key={agent.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{agent.intentName}</h3>
                          <p className="text-sm text-muted-foreground">{agent.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Last updated: {agent.lastUpdated}</span>
                            <span>Knowledge base: {agent.knowledgeBaseSize}</span>
                            <span>Usage: {agent.usageCount} interactions</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-foreground">{agent.trainingAccuracy}%</div>
                          <p className="text-xs text-muted-foreground">Accuracy</p>
                        </div>

                        <Badge
                          variant={
                            agent.status === "active"
                              ? "default"
                              : agent.status === "training"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {agent.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {agent.status === "training" && <Clock className="h-3 w-3 mr-1" />}
                          {agent.status === "inactive" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </Badge>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retrain
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Training History</h2>
                <p className="text-muted-foreground">Track AI agent training sessions and performance improvements</p>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export History
              </Button>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Product Support Agent</CardTitle>
                      <CardDescription>Training completed 2 hours ago</CardDescription>
                    </div>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Training Duration</p>
                      <p className="text-2xl font-bold">2h 34m</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Accuracy Improvement</p>
                      <p className="text-2xl font-bold text-chart-4">+3%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Data Points Processed</p>
                      <p className="text-2xl font-bold">1,247</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Billing Inquiries Agent</CardTitle>
                      <CardDescription>Training completed 1 day ago</CardDescription>
                    </div>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Training Duration</p>
                      <p className="text-2xl font-bold">1h 52m</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Accuracy Improvement</p>
                      <p className="text-2xl font-bold text-chart-4">+5%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Data Points Processed</p>
                      <p className="text-2xl font-bold">892</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Refunds & Returns Agent</CardTitle>
                      <CardDescription>Training failed 3 days ago</CardDescription>
                    </div>
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Failed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Training failed due to insufficient data quality. Please review and re-upload knowledge base.
                    </p>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Training
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
