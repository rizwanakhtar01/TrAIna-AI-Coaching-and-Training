"use client";

import { useState, useEffect } from "react";
import { format, isToday, isYesterday, isSameDay, subDays } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { ContactReviewsList } from "@/components/contact-review-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  AlertTriangle,
  BarChart3,
  Download,
  Award,
  BookOpen,
  LogOut,
  Eye,
  ArrowRight,
  Star,
  Clock,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Activity,
  FileText,
  Filter,
  Bell,
  BellOff,
  Edit3,
  Save,
  ArrowLeft,
  Minus,
  Phone,
  Mail,
  Play,
  Pause,
  Search,
  Calendar as CalendarIcon,
} from "lucide-react";

// Contact Review interface for supervisor view
interface ContactReview {
  id: string;
  timestamp: string;
  duration: string;
  channel: "chat" | "phone" | "email";
  customerIssue: string;
  contactSummary: string;
  queue: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    contactTimestamp: string;
    previousContacts: number;
  };
  overallScore: number;
  whatWentWell: string;
  couldImprove: string;
  tipForNextTime: string;
  transcript: {
    speaker: "agent" | "customer";
    message: string;
    timestamp: string;
    highlight?: "positive" | "negative" | "neutral";
    aiNote?: string;
  }[];
  agentName: string; // Add agent mapping
}

// Comprehensive data models for supervisor dashboard
interface Agent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  sessionsCompleted: number;
  sessionsTarget: number;
  averageScore: number;
  previousScore: number;
  engagementTime: number; // in minutes
  status: "excellent" | "good" | "needs-attention" | "at-risk";
  lastSession: string;
  improvementAreas: string[];
  notes: string;
}

interface ChallengingPattern {
  id: string;
  name: string;
  category: string;
  errorRate: number;
  frequency: number;
  trend: "up" | "down" | "stable";
  affectedAgents: string[];
  intents: string[];
  channels: string[];
  dateRange: string;
}

interface CoachingSession {
  id: string;
  agentId: string;
  date: string;
  scenario: string;
  score: number;
  duration: number;
  feedback: string;
  skillsImproved: string[];
}

interface Alert {
  id: string;
  type: "warning" | "error" | "info";
  title: string;
  message: string;
  agentId?: string;
  timestamp: string;
  isRead: boolean;
}

interface SupervisorDashboardProps {
  onLogout: () => void;
}

export function SupervisorDashboard({ onLogout }: SupervisorDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState("daily");
  const [agentFilter, setAgentFilter] = useState("at-risk");
  const [intentFilter, setIntentFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [showAlerts, setShowAlerts] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [showPatternDetails, setShowPatternDetails] = useState(false);

  // State for daily summary agent details
  const [showDailyAgentDetails, setShowDailyAgentDetails] = useState(false);
  const [contactReviewTimeFilter, setContactReviewTimeFilter] = useState<"today" | "yesterday" | "custom">("today");
  const [contactReviewCustomDate, setContactReviewCustomDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [pendingCustomDate, setPendingCustomDate] = useState<Date | undefined>(undefined);
  const [contactReviewChannelFilter, setContactReviewChannelFilter] = useState("all");
  const [contactReviewScoreFilter, setContactReviewScoreFilter] = useState("all");
  const [contactReviewAgentFilter, setContactReviewAgentFilter] = useState("all");

  // Load persisted filter from localStorage on mount
  useEffect(() => {
    const savedFilter = localStorage.getItem("supervisorContactReviewTimeFilter");
    const savedCustomDate = localStorage.getItem("supervisorContactReviewCustomDate");
    
    if (savedFilter) {
      const parsed = JSON.parse(savedFilter);
      if (parsed.type === "today" || parsed.type === "yesterday") {
        setContactReviewTimeFilter(parsed.type);
      } else if (parsed.type === "custom" && savedCustomDate) {
        const date = new Date(savedCustomDate);
        if (!isNaN(date.getTime()) && date <= new Date()) {
          setContactReviewTimeFilter("custom");
          setContactReviewCustomDate(date);
        }
      }
    }
  }, []);

  // Persist filter to localStorage
  const persistContactReviewFilter = (type: "today" | "yesterday" | "custom", date?: Date) => {
    localStorage.setItem("supervisorContactReviewTimeFilter", JSON.stringify({ type }));
    if (type === "custom" && date) {
      localStorage.setItem("supervisorContactReviewCustomDate", date.toISOString());
    } else {
      localStorage.removeItem("supervisorContactReviewCustomDate");
    }
  };
  const [selectedDailyAgent, setSelectedDailyAgent] = useState<string | null>(
    null,
  );
  
  // Agent detail view filters
  const [agentDetailSearchTerm, setAgentDetailSearchTerm] = useState("");
  const [agentDetailFilterChannel, setAgentDetailFilterChannel] = useState("all");
  const [agentDetailFilterTime, setAgentDetailFilterTime] = useState<"today" | "yesterday" | "custom">("today");
  const [agentDetailCustomDate, setAgentDetailCustomDate] = useState<Date | undefined>(undefined);
  const [agentDetailCalendarOpen, setAgentDetailCalendarOpen] = useState(false);
  const [agentDetailPendingDate, setAgentDetailPendingDate] = useState<Date | undefined>(undefined);

  // Comprehensive mock data for supervisor dashboard
  const agents: Agent[] = [
    {
      id: "AGT001",
      name: "Sarah Mitchell",
      email: "sarah.mitchell@company.com",
      avatar: "SM",
      sessionsCompleted: 8,
      sessionsTarget: 10,
      averageScore: 8.7,
      previousScore: 8.2,
      engagementTime: 245,
      status: "excellent",
      lastSession: "2 hours ago",
      improvementAreas: ["Empathy", "Resolution Time"],
      notes:
        "Excellent progress on empathy training. Shows consistent improvement.",
    },
    {
      id: "AGT002",
      name: "John Davis",
      email: "john.davis@company.com",
      avatar: "JD",
      sessionsCompleted: 3,
      sessionsTarget: 10,
      averageScore: 7.2,
      previousScore: 7.8,
      engagementTime: 145,
      status: "at-risk",
      lastSession: "1 day ago",
      improvementAreas: ["Policy Compliance", "Customer Satisfaction"],
      notes: "Needs immediate attention. Missing sessions regularly.",
    },
    {
      id: "AGT003",
      name: "Lisa Kim",
      email: "lisa.kim@company.com",
      avatar: "LK",
      sessionsCompleted: 12,
      sessionsTarget: 10,
      averageScore: 9.1,
      previousScore: 8.8,
      engagementTime: 320,
      status: "excellent",
      lastSession: "30 minutes ago",
      improvementAreas: ["Response Speed"],
      notes: "Top performer. Consider for mentoring role.",
    },
    {
      id: "AGT004",
      name: "Mike Rodriguez",
      email: "mike.rodriguez@company.com",
      avatar: "MR",
      sessionsCompleted: 6,
      sessionsTarget: 10,
      averageScore: 8.0,
      previousScore: 7.9,
      engagementTime: 190,
      status: "good",
      lastSession: "4 hours ago",
      improvementAreas: ["Refund Processing", "Empathy"],
      notes: "Steady improvement in refund handling scenarios.",
    },
    {
      id: "AGT005",
      name: "Emma Wilson",
      email: "emma.wilson@company.com",
      avatar: "EW",
      sessionsCompleted: 5,
      sessionsTarget: 10,
      averageScore: 7.8,
      previousScore: 7.5,
      engagementTime: 165,
      status: "needs-attention",
      lastSession: "6 hours ago",
      improvementAreas: ["Technical Support", "Confidence"],
      notes: "Improving but needs more practice with technical scenarios.",
    },
    {
      id: "AGT006",
      name: "David Chen",
      email: "david.chen@company.com",
      avatar: "DC",
      sessionsCompleted: 9,
      sessionsTarget: 10,
      averageScore: 8.5,
      previousScore: 8.1,
      engagementTime: 275,
      status: "excellent",
      lastSession: "1 hour ago",
      improvementAreas: ["Billing Inquiries"],
      notes: "Strong performance across all metrics. Great team player.",
    },
  ];

  // Daily team coaching summary data
  const dailyTeamSummary = {
    date: "2024-01-15",
    team_performance: {
      overall_score: 8.2,
      improvement_vs_yesterday: 0.3,
      agents_above_target: 9,
      agents_below_target: 3,
      coaching_sessions_needed: 4,
    },
    individual_agent_insights: [
      {
        agent: "Sarah Mitchell",
        daily_score: 8.7,
        trend: "improving",
        strengths: ["empathy", "problem_resolution"],
        improvement_areas: ["efficiency"],
        coaching_priority: "low",
        coaching_prep: {
          talking_points: [
            "Congratulate on excellent empathy scores",
            "Discuss time management techniques",
            "Share Call #2847 as best practice example",
          ],
          suggested_duration: "15 minutes",
          focus_area: "efficiency_improvement",
        },
        ai_coaching_feedback: {
          yesterdaysWins: [
            "Maintained positive tone across all interactions",
            "Resolved 85% of issues on first call",
          ],
          challengingAreas: [
            "Managing average handle time on complex calls",
            "Balancing thoroughness with efficiency",
          ],
          focusAreas: [
            "Practice streamlined troubleshooting workflows",
            "Review quick resolution templates in Knowledge Base",
          ],
          proTip: "Try setting micro time goals for each call phase - greeting (30s), discovery (2min), resolution (3min). This helps maintain efficiency without sacrificing quality.",
        },
      },
      {
        agent: "John Davis",
        daily_score: 6.8,
        trend: "declining",
        strengths: ["technical_knowledge"],
        improvement_areas: ["compliance", "soft_skills"],
        coaching_priority: "high",
        coaching_prep: {
          talking_points: [
            "Address compliance warning dismissals",
            "Review identity verification process",
            "Practice customer acknowledgment techniques",
          ],
          suggested_duration: "30 minutes",
          focus_area: "compliance_and_soft_skills",
        },
        ai_coaching_feedback: {
          yesterdaysWins: [
            "Demonstrated strong technical knowledge on product issues",
            "Quickly identified root causes of technical problems",
          ],
          challengingAreas: [
            "Showing empathy in tough conversations",
            "Following compliance verification steps",
            "Acknowledging customer frustrations before troubleshooting",
          ],
          focusAreas: [
            "Review identity verification checklist before each call",
            "Practice empathy phrases: 'I understand how frustrating this must be'",
            "Complete compliance refresher module",
          ],
          proTip: "Start each interaction by acknowledging the customer's situation before diving into solutions. A simple 'I can see why that would be frustrating' builds trust quickly.",
        },
      },
      {
        agent: "Lisa Kim",
        daily_score: 9.1,
        trend: "stable",
        strengths: ["empathy", "technical_knowledge", "problem_resolution"],
        improvement_areas: ["response_speed"],
        coaching_priority: "low",
        coaching_prep: {
          talking_points: [
            "Recognize exceptional performance across all areas",
            "Explore mentoring opportunities for junior agents",
            "Discuss response time optimization techniques",
          ],
          suggested_duration: "10 minutes",
          focus_area: "mentoring_development",
        },
        ai_coaching_feedback: {
          yesterdaysWins: [
            "Exceptional empathy scores - customers felt truly heard",
            "Perfect compliance adherence on all calls",
            "Resolved complex billing disputes efficiently",
          ],
          challengingAreas: [
            "Response times slightly above target on chat channels",
          ],
          focusAreas: [
            "Practice using canned responses for common inquiries",
            "Review keyboard shortcuts for faster navigation",
          ],
          proTip: "You're doing amazing! Consider sharing your empathy techniques with the team during the next huddle. Your approach to difficult customers could help others improve.",
        },
      },
      {
        agent: "Mike Rodriguez",
        daily_score: 7.5,
        trend: "improving",
        strengths: ["product_knowledge"],
        improvement_areas: ["empathy", "resolution_time"],
        coaching_priority: "medium",
        coaching_prep: {
          talking_points: [
            "Acknowledge improvement in product knowledge application",
            "Practice active listening techniques",
            "Review efficient troubleshooting workflows",
          ],
          suggested_duration: "20 minutes",
          focus_area: "soft_skills_development",
        },
        ai_coaching_feedback: {
          yesterdaysWins: [
            "Great product knowledge application on subscription questions",
            "Improved from last week's scores",
          ],
          challengingAreas: [
            "Active listening - sometimes jumping to solutions too quickly",
            "Resolution times above target on complex issues",
          ],
          focusAreas: [
            "Practice repeating back customer concerns before offering solutions",
            "Review the 5-step troubleshooting guide for faster resolutions",
          ],
          proTip: "Try the 'pause and reflect' technique - after the customer finishes speaking, pause for 2 seconds before responding. This helps ensure you've fully understood their concern.",
        },
      },
      {
        agent: "Emma Wilson",
        daily_score: 7.8,
        trend: "improving",
        strengths: ["communication"],
        improvement_areas: ["technical_knowledge", "confidence"],
        coaching_priority: "medium",
        coaching_prep: {
          talking_points: [
            "Praise improvement in customer communication",
            "Provide additional technical training resources",
            "Build confidence through structured practice sessions",
          ],
          suggested_duration: "25 minutes",
          focus_area: "technical_skills_building",
        },
        ai_coaching_feedback: {
          yesterdaysWins: [
            "Clear and friendly communication style",
            "Customers appreciated the patience shown",
          ],
          challengingAreas: [
            "Technical troubleshooting for advanced product features",
            "Confidence when handling escalation requests",
          ],
          focusAreas: [
            "Complete the Advanced Features training module",
            "Practice escalation scenarios with a buddy",
            "Review the escalation decision tree",
          ],
          proTip: "It's okay to say 'Let me look that up for you' - customers appreciate honesty. Use the Knowledge Base search while on calls to build your technical confidence.",
        },
      },
      {
        agent: "David Chen",
        daily_score: 8.5,
        trend: "stable",
        strengths: ["problem_resolution", "efficiency"],
        improvement_areas: ["empathy"],
        coaching_priority: "low",
        coaching_prep: {
          talking_points: [
            "Commend efficiency and problem-solving skills",
            "Discuss customer emotional needs recognition",
            "Share examples of empathetic responses",
          ],
          suggested_duration: "15 minutes",
          focus_area: "empathy_enhancement",
        },
        ai_coaching_feedback: {
          yesterdaysWins: [
            "Excellent efficiency - consistently under target handle time",
            "Strong problem-solving on complex technical issues",
          ],
          challengingAreas: [
            "Recognizing when customers need emotional support vs quick solutions",
            "Pacing conversations to match customer comfort level",
          ],
          focusAreas: [
            "Practice identifying emotional cues in customer language",
            "Review empathy response templates",
          ],
          proTip: "When a customer sounds frustrated, try acknowledging their feelings first: 'I can hear this has been really frustrating for you.' Then proceed with the solution.",
        },
      },
    ],
  };

  // Helper to get today and yesterday dates
  const getToday = () => new Date();
  const getYesterday = () => subDays(new Date(), 1);

  // Sample contact reviews data mapped to agents
  const sampleContactReviews: ContactReview[] = [
    // TODAY's contacts
    {
      id: "1",
      timestamp: getToday().toISOString(),
      duration: "3:45",
      channel: "chat",
      customerIssue: "Subscription cancellation request",
      contactSummary:
        "Customer requested subscription cancellation due to low usage. Refund processed successfully but missed retention opportunity.",
      queue: "Billing & Subscriptions",
      customer: {
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1 (555) 123-4567",
        contactTimestamp: format(getToday(), "yyyy-MM-dd HH:mm:ss"),
        previousContacts: 2,
      },
      overallScore: 8.2,
      whatWentWell:
        "You clearly explained the refund process and timeline to the customer",
      couldImprove:
        "Consider offering retention options before processing cancellation",
      tipForNextTime:
        'Ask "Is there anything we can do to keep you as a customer?" before proceeding',
      transcript: [
        {
          speaker: "customer",
          message: "Hi, I want to cancel my subscription",
          timestamp: "14:32",
          highlight: "neutral",
        },
        {
          speaker: "agent",
          message:
            "I understand you'd like to cancel. Can I ask what's prompting this decision?",
          timestamp: "14:33",
          highlight: "positive",
          aiNote: "Good empathetic opening",
        },
        {
          speaker: "customer",
          message: "I'm not using the service enough to justify the cost",
          timestamp: "14:33",
        },
        {
          speaker: "agent",
          message:
            "I can process that cancellation for you right away. Your refund will be processed within 5-7 business days.",
          timestamp: "14:34",
          highlight: "negative",
          aiNote: "Missed opportunity to offer retention options",
        },
        {
          speaker: "customer",
          message: "Thank you for the quick help",
          timestamp: "14:35",
        },
      ],
      agentName: "Sarah Mitchell",
    },
    {
      id: "2",
      timestamp: getToday().toISOString(),
      duration: "6:12",
      channel: "phone",
      customerIssue: "Refund inquiry - 10 days overdue",
      contactSummary:
        "Customer frustrated about delayed refund. Issue escalated to expedite processing. Good recovery after initial misstep.",
      queue: "Customer Support",
      customer: {
        name: "Michael Chen",
        email: "m.chen@company.com",
        phone: "+1 (555) 987-6543",
        contactTimestamp: format(getToday(), "yyyy-MM-dd HH:mm:ss"),
        previousContacts: 1,
      },
      overallScore: 7.8,
      whatWentWell: "Clear explanation of refund policy and next steps",
      couldImprove: "Opening lacked empathy for customer frustration",
      tipForNextTime:
        'Start with "I understand how frustrating delayed refunds can be" to acknowledge their concern',
      transcript: [
        {
          speaker: "agent",
          message: "Hello, how can I help you today?",
          timestamp: "14:15",
          highlight: "neutral",
        },
        {
          speaker: "customer",
          message:
            "My refund hasn't arrived after 10 days. This is unacceptable!",
          timestamp: "14:15",
          highlight: "negative",
        },
        {
          speaker: "agent",
          message:
            "Let me look into your account. Can you provide your order number?",
          timestamp: "14:16",
          highlight: "negative",
          aiNote: "Should acknowledge frustration first",
        },
        { speaker: "customer", message: "It's ORD-12345", timestamp: "14:16" },
        {
          speaker: "agent",
          message:
            "I see the refund was processed 8 days ago. Sometimes bank processing takes 7-10 business days. I'll escalate this to expedite it.",
          timestamp: "14:17",
          highlight: "positive",
          aiNote: "Good explanation and proactive solution",
        },
      ],
      agentName: "John Davis",
    },
    {
      id: "3",
      timestamp: getToday().toISOString(),
      duration: "8:23",
      channel: "email",
      customerIssue: "Technical support - third contact attempt",
      contactSummary:
        "Repeat technical issue with login. Customer frustrated after multiple failed attempts. Finally escalated to technical team.",
      queue: "Technical Support",
      customer: {
        name: "Emma Rodriguez",
        email: "emma.rodriguez@startup.io",
        contactTimestamp: format(getToday(), "yyyy-MM-dd HH:mm:ss"),
        previousContacts: 3,
      },
      overallScore: 6.5,
      whatWentWell: "Remained calm and professional under pressure",
      couldImprove: "Should have escalated to technical team sooner",
      tipForNextTime:
        "For repeat technical issues, escalate after the second failed troubleshooting attempt",
      transcript: [
        {
          speaker: "customer",
          message:
            "This is my third email about the same login issue. I've tried everything you suggested twice already.",
          timestamp: "13:20",
          highlight: "negative",
        },
        {
          speaker: "agent",
          message:
            "I apologize for the continued inconvenience. Let me try a different approach to resolve this.",
          timestamp: "13:25",
          highlight: "positive",
          aiNote: "Good acknowledgment of frustration",
        },
        {
          speaker: "agent",
          message: "Can you try clearing your browser cache and cookies again?",
          timestamp: "13:26",
          highlight: "negative",
          aiNote: "Repeating previous solutions - should escalate",
        },
        {
          speaker: "customer",
          message: "I already did that twice. This is getting ridiculous.",
          timestamp: "13:30",
          highlight: "negative",
        },
        {
          speaker: "agent",
          message:
            "Let me escalate this to our technical team immediately for a priority resolution.",
          timestamp: "13:35",
          highlight: "positive",
          aiNote: "Good recovery and escalation",
        },
      ],
      agentName: "Lisa Kim",
    },
    {
      id: "4",
      timestamp: getToday().toISOString(),
      duration: "4:15",
      channel: "chat",
      customerIssue: "Product information inquiry",
      contactSummary:
        "Customer asking about advanced features and pricing options. Agent provided comprehensive information and guided toward upgrade.",
      queue: "Sales Support",
      customer: {
        name: "James Wilson",
        email: "james.w@example.com",
        contactTimestamp: format(getToday(), "yyyy-MM-dd HH:mm:ss"),
        previousContacts: 0,
      },
      overallScore: 9.1,
      whatWentWell:
        "Excellent product knowledge and clear communication of features and benefits",
      couldImprove:
        "Could have been more proactive in suggesting trial options",
      tipForNextTime:
        "Offer free trial or demo when customers show interest in premium features",
      transcript: [
        {
          speaker: "customer",
          message: "Can you tell me about your premium features?",
          timestamp: "12:15",
          highlight: "neutral",
        },
        {
          speaker: "agent",
          message:
            "I'd be happy to help! Our premium plan includes advanced analytics, custom integrations, and priority support. What specific features are you most interested in?",
          timestamp: "12:16",
          highlight: "positive",
          aiNote: "Good qualifying question",
        },
        {
          speaker: "customer",
          message:
            "I'm particularly interested in the analytics and custom integrations",
          timestamp: "12:16",
        },
        {
          speaker: "agent",
          message:
            "Perfect! Our analytics dashboard provides real-time insights with custom reporting, and we support integrations with over 50 popular tools. Would you like me to send you some examples?",
          timestamp: "12:17",
          highlight: "positive",
          aiNote: "Great product knowledge demonstration",
        },
      ],
      agentName: "Mike Rodriguez",
    },
    // YESTERDAY's contacts
    {
      id: "5",
      timestamp: getYesterday().toISOString(),
      duration: "5:30",
      channel: "phone",
      customerIssue: "Account setup assistance",
      contactSummary:
        "New customer needed help setting up their account and understanding the platform. Agent provided thorough walkthrough and follow-up resources.",
      queue: "Customer Onboarding",
      customer: {
        name: "Maria Garcia",
        email: "maria.garcia@startup.com",
        phone: "+1 (555) 456-7890",
        contactTimestamp: format(getYesterday(), "yyyy-MM-dd HH:mm:ss"),
        previousContacts: 0,
      },
      overallScore: 8.8,
      whatWentWell:
        "Patient guidance and comprehensive explanation of platform features",
      couldImprove:
        "Could have scheduled a follow-up call to ensure successful onboarding",
      tipForNextTime:
        "Offer scheduled follow-up calls for new customers to ensure smooth onboarding experience",
      transcript: [
        {
          speaker: "agent",
          message:
            "Welcome to our platform! I'm here to help you get set up. What would you like to start with?",
          timestamp: "11:30",
          highlight: "positive",
          aiNote: "Warm, welcoming opening",
        },
        {
          speaker: "customer",
          message: "I'm completely new to this. I'm not sure where to begin.",
          timestamp: "11:31",
        },
        {
          speaker: "agent",
          message:
            "No problem at all! Let's start with the basics. I'll walk you through creating your first project step by step.",
          timestamp: "11:31",
          highlight: "positive",
          aiNote: "Reassuring tone, structured approach",
        },
        {
          speaker: "customer",
          message: "That sounds great, thank you!",
          timestamp: "11:32",
        },
      ],
      agentName: "Emma Wilson",
    },
    {
      id: "6",
      timestamp: getYesterday().toISOString(),
      duration: "7:45",
      channel: "email",
      customerIssue: "Billing discrepancy resolution",
      contactSummary:
        "Customer questioned unexpected charges on their account. Agent investigated, found system error, and processed refund with apology.",
      queue: "Billing & Subscriptions",
      customer: {
        name: "Robert Taylor",
        email: "robert.taylor@company.org",
        contactTimestamp: format(getYesterday(), "yyyy-MM-dd HH:mm:ss"),
        previousContacts: 1,
      },
      overallScore: 8.5,
      whatWentWell:
        "Thorough investigation and quick resolution with appropriate compensation",
      couldImprove:
        "Could have provided more explanation about how the error occurred",
      tipForNextTime:
        "When system errors cause billing issues, explain the root cause to build customer confidence",
      transcript: [
        {
          speaker: "customer",
          message:
            "I was charged twice for my subscription this month. Can you help me understand why?",
          timestamp: "10:45",
          highlight: "neutral",
        },
        {
          speaker: "agent",
          message:
            "I sincerely apologize for this billing error. Let me investigate your account immediately to understand what happened.",
          timestamp: "10:50",
          highlight: "positive",
          aiNote: "Immediate acknowledgment and action",
        },
        {
          speaker: "agent",
          message:
            "I found the issue - there was a system glitch during our recent update. I'm processing a full refund for the duplicate charge right now.",
          timestamp: "10:55",
          highlight: "positive",
          aiNote: "Clear explanation and immediate solution",
        },
        {
          speaker: "customer",
          message: "Thank you for resolving this so quickly!",
          timestamp: "11:00",
        },
      ],
      agentName: "David Chen",
    },
  ];

  // Contact Review Card Component for Supervisor Dashboard
  function ContactReviewCard({ review }: { review: ContactReview }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration] = useState(225); // 3:45 in seconds

    const getChannelIcon = (channel: string) => {
      switch (channel) {
        case "phone":
          return <Phone className="h-4 w-4" />;
        case "email":
          return <Mail className="h-4 w-4" />;
        default:
          return <MessageSquare className="h-4 w-4" />;
      }
    };

    const getScoreColor = (score: number) => {
      if (score >= 8) return "text-chart-4";
      if (score >= 7) return "text-chart-5";
      return "text-destructive";
    };

    const getHighlightColor = (highlight?: string) => {
      switch (highlight) {
        case "positive":
          return "bg-chart-4/10 border-l-4 border-chart-4";
        case "negative":
          return "bg-destructive/10 border-l-4 border-destructive";
        default:
          return "bg-muted/50";
      }
    };

    const togglePlayback = () => {
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
        const interval = setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= duration) {
              setIsPlaying(false);
              clearInterval(interval);
              return 0;
            }
            return prev + 1;
          });
        }, 1000);
      }
    };

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-primary">
                {getChannelIcon(review.channel)}
                <Badge variant="outline" className="capitalize">
                  {review.channel}
                </Badge>
                {review.channel === "phone" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePlayback}
                    className="h-7 px-2 text-xs bg-transparent"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        {formatTime(currentTime)}
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        {review.duration}
                      </>
                    )}
                  </Button>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {review.timestamp}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`text-lg font-bold ${getScoreColor(review.overallScore)}`}
              >
                {review.overallScore}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0"
              >
                {isExpanded ? (
                  <TrendingUp className="h-4 w-4 rotate-180" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              {review.customerIssue}
            </h4>
            <p className="text-sm text-muted-foreground">
              {review.contactSummary}
            </p>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <h5 className="font-medium text-sm">Customer Information</h5>
                <p className="text-sm">{review.customer.name}</p>
                <p className="text-xs text-muted-foreground">
                  {review.customer.email}
                </p>
                {review.customer.phone && (
                  <p className="text-xs text-muted-foreground">
                    {review.customer.phone}
                  </p>
                )}
              </div>
              <div>
                <h5 className="font-medium text-sm">Contact Details</h5>
                <p className="text-sm">Queue: {review.queue}</p>
                <p className="text-xs text-muted-foreground">
                  Duration: {review.duration}
                </p>
                <p className="text-xs text-muted-foreground">
                  Previous contacts: {review.customer.previousContacts}
                </p>
              </div>
            </div>

            {/* AI Feedback */}
            <div className="grid grid-cols-1 gap-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="font-medium text-green-800 text-sm mb-1">
                  What Went Well
                </h5>
                <p className="text-sm text-green-700">{review.whatWentWell}</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <h5 className="font-medium text-orange-800 text-sm mb-1">
                  Could Improve
                </h5>
                <p className="text-sm text-orange-700">{review.couldImprove}</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-medium text-blue-800 text-sm mb-1">
                  Tip for Next Time
                </h5>
                <p className="text-sm text-blue-700">{review.tipForNextTime}</p>
              </div>
            </div>

            {/* Transcript */}
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Conversation Transcript</h5>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {review.transcript.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${getHighlightColor(message.highlight)}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-xs capitalize">
                        {message.speaker}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                    {message.aiNote && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        AI Note: {message.aiNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    );
  }

  const challengingPatterns: ChallengingPattern[] = [
    {
      id: "CP001",
      name: "Refund Processing",
      category: "Financial",
      errorRate: 23,
      frequency: 145,
      trend: "up",
      affectedAgents: ["AGT001", "AGT002", "AGT004"],
      intents: ["process_refund", "refund_status", "cancel_order"],
      channels: ["phone", "chat", "email"],
      dateRange: "Last 7 days",
    },
    {
      id: "CP002",
      name: "Billing Inquiries",
      category: "Financial",
      errorRate: 18,
      frequency: 98,
      trend: "down",
      affectedAgents: ["AGT005", "AGT006"],
      intents: ["billing_question", "payment_issue", "invoice_dispute"],
      channels: ["phone", "chat"],
      dateRange: "Last 7 days",
    },
    {
      id: "CP003",
      name: "Technical Support",
      category: "Technical",
      errorRate: 31,
      frequency: 76,
      trend: "stable",
      affectedAgents: ["AGT003", "AGT005"],
      intents: ["tech_support", "troubleshooting", "setup_help"],
      channels: ["chat", "email"],
      dateRange: "Last 7 days",
    },
  ];

  const coachingSessions: CoachingSession[] = [
    {
      id: "CS001",
      agentId: "AGT001",
      date: "2025-03-15",
      scenario: "Empathy Training - Difficult Refund",
      score: 8.5,
      duration: 35,
      feedback:
        "Great improvement in showing empathy while maintaining policy compliance.",
      skillsImproved: ["Empathy", "Active Listening"],
    },
    {
      id: "CS002",
      agentId: "AGT002",
      date: "2025-03-14",
      scenario: "Policy Compliance - Billing Dispute",
      score: 6.8,
      duration: 28,
      feedback: "Needs more practice with policy explanations.",
      skillsImproved: ["Policy Knowledge"],
    },
  ];

  const alerts: Alert[] = [
    {
      id: "AL001",
      type: "warning",
      title: "Agent Missing Sessions",
      message: "John Davis has missed 3 scheduled coaching sessions this week.",
      agentId: "AGT002",
      timestamp: "2 hours ago",
      isRead: false,
    },
    {
      id: "AL002",
      type: "error",
      title: "Recurring Pattern Alert",
      message: "Refund Processing errors increased by 15% this week.",
      timestamp: "4 hours ago",
      isRead: false,
    },
    {
      id: "AL003",
      type: "info",
      title: "Weekly Report Ready",
      message: "Team coaching summary for Week 11 is ready for export.",
      timestamp: "1 day ago",
      isRead: true,
    },
  ];

  const teamOverviewData = {
    totalAgentsCoached: agents.filter((a) => a.sessionsCompleted > 0).length,
    topChallenges: challengingPatterns.slice(0, 3),
    teamImprovementPercent: 12,
    previousWeekImprovement: 8,
  };

  const performanceTimelineData = [
    { week: "Week 8", score: 7.8, sessions: 45 },
    { week: "Week 9", score: 8.1, sessions: 52 },
    { week: "Week 10", score: 8.3, sessions: 58 },
    { week: "Week 11", score: 8.6, sessions: 61 },
  ];

  // Helper functions
  const getStatusColor = (status: Agent["status"]) => {
    switch (status) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "needs-attention":
        return "text-yellow-600";
      case "at-risk":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (status: Agent["status"]) => {
    switch (status) {
      case "excellent":
        return { variant: "default" as const, icon: "🟢", text: "Excellent" };
      case "good":
        return { variant: "secondary" as const, icon: "🟢", text: "Good" };
      case "needs-attention":
        return {
          variant: "outline" as const,
          icon: "🟡",
          text: "Needs Attention",
        };
      case "at-risk":
        return { variant: "destructive" as const, icon: "🔴", text: "At Risk" };
      default:
        return { variant: "secondary" as const, icon: "⚪", text: "Unknown" };
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous)
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (current < previous)
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getEngagementLevel = (minutes: number) => {
    if (minutes >= 200)
      return { level: "High", color: "text-green-600", percent: 100 };
    if (minutes >= 150)
      return { level: "Medium", color: "text-yellow-600", percent: 70 };
    return { level: "Low", color: "text-red-600", percent: 40 };
  };

  const saveNote = (agentId: string) => {
    // In real implementation, this would save to backend
    const agent = agents.find((a) => a.id === agentId);
    if (agent) {
      agent.notes = newNote;
    }
    setEditingNotes(null);
    setNewNote("");
  };

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  // Export functionality
  const exportToPDF = () => {
    // In real implementation, this would use a library like jsPDF
    console.log("Exporting to PDF...");
    // Mock export functionality
    const blob = new Blob(["PDF Export Placeholder"], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `supervisor-report-${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const csvData = agents.map((agent) => ({
      Name: agent.name,
      Email: agent.email,
      "Sessions Completed": agent.sessionsCompleted,
      "Sessions Target": agent.sessionsTarget,
      "Average Score": agent.averageScore,
      "Previous Score": agent.previousScore,
      "Engagement Time (min)": agent.engagementTime,
      Status: agent.status,
      "Last Session": agent.lastSession,
      "Improvement Areas": agent.improvementAreas.join("; "),
      Notes: agent.notes,
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        headers
          .map((header) => `"${row[header as keyof typeof row]}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `supervisor-report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter functions
  const getFilteredPatterns = () => {
    return challengingPatterns.filter((pattern) => {
      const agentIds = pattern.affectedAgents;
      if (agentFilter === "at-risk") {
        const atRiskAgentIds = agents
          .filter((a) => a.status === "at-risk")
          .map((a) => a.id);
        if (!agentIds.some((id) => atRiskAgentIds.includes(id))) return false;
      }
      if (agentFilter === "top") {
        const topAgentIds = agents
          .filter((a) => a.status === "excellent")
          .map((a) => a.id);
        if (!agentIds.some((id) => topAgentIds.includes(id))) return false;
      }

      if (intentFilter !== "all") {
        if (!pattern.intents.some((intent) => intent.includes(intentFilter)))
          return false;
      }

      if (channelFilter !== "all") {
        if (!pattern.channels.includes(channelFilter)) return false;
      }

      return true;
    });
  };

  const getFilteredAgents = () => {
    return agents.filter((agent) => {
      if (agentFilter === "affected" && selectedPattern) {
        const pattern = challengingPatterns.find(
          (p) => p.id === selectedPattern,
        );
        return pattern ? pattern.affectedAgents.includes(agent.id) : true;
      }

      if (agentFilter === "at-risk") return agent.status === "at-risk";
      if (agentFilter === "top") return agent.status === "excellent";

      return true;
    });
  };

  const getPerformanceTimelineData = () => {
    if (timeFilter === "daily") {
      return [
        { period: "Mon", score: 8.2, sessions: 12 },
        { period: "Tue", score: 8.4, sessions: 14 },
        { period: "Wed", score: 8.3, sessions: 13 },
        { period: "Thu", score: 8.5, sessions: 15 },
        { period: "Fri", score: 8.6, sessions: 16 },
        { period: "Sat", score: 8.4, sessions: 11 },
        { period: "Sun", score: 8.3, sessions: 10 },
      ];
    } else if (timeFilter === "monthly") {
      return [
        { period: "Aug", score: 7.5, sessions: 180 },
        { period: "Sep", score: 7.8, sessions: 195 },
        { period: "Oct", score: 8.2, sessions: 210 },
        { period: "Nov", score: 8.6, sessions: 225 },
      ];
    } else {
      return [
        { period: "Week 8", score: 7.8, sessions: 45 },
        { period: "Week 9", score: 8.1, sessions: 52 },
        { period: "Week 10", score: 8.3, sessions: 58 },
        { period: "Week 11", score: 8.6, sessions: 61 },
      ];
    }
  };

  const getFilteredTeamMetrics = () => {
    const filteredAgents = getFilteredAgents();

    const totalAgentsCoached = filteredAgents.filter(
      (a) => a.sessionsCompleted > 0,
    ).length;
    const atRiskAgents = filteredAgents.filter(
      (a) => a.status === "at-risk",
    ).length;
    const topPerformers = filteredAgents.filter(
      (a) => a.status === "excellent",
    ).length;

    const avgScore =
      filteredAgents.length > 0
        ? filteredAgents.reduce((sum, a) => sum + a.averageScore, 0) /
          filteredAgents.length
        : 0;

    const avgPrevScore =
      filteredAgents.length > 0
        ? filteredAgents.reduce((sum, a) => sum + a.previousScore, 0) /
          filteredAgents.length
        : 0;

    const improvementPercent =
      avgPrevScore > 0 ? ((avgScore - avgPrevScore) / avgPrevScore) * 100 : 0;

    const previousWeekImprovement =
      timeFilter === "daily" ? 8 : timeFilter === "monthly" ? 15 : 12;

    const totalSessions = filteredAgents.reduce(
      (sum, a) => sum + a.sessionsCompleted,
      0,
    );
    const totalTargetSessions = filteredAgents.reduce(
      (sum, a) => sum + a.sessionsTarget,
      0,
    );
    const sessionCompletionRate =
      totalTargetSessions > 0
        ? Math.round((totalSessions / totalTargetSessions) * 100)
        : 0;

    return {
      totalAgentsCoached,
      atRiskAgents,
      topPerformers,
      teamImprovementPercent: Math.round(improvementPercent * 10) / 10,
      previousWeekImprovement,
      avgScore: Math.round(avgScore * 10) / 10,
      sessionCompletionRate,
    };
  };

  const getFilteredDailySummary = () => {
    const filteredAgents = getFilteredAgents();
    const agentNames = filteredAgents.map((a) => a.name);

    const filteredInsights = dailyTeamSummary.individual_agent_insights.filter(
      (insight) => agentNames.includes(insight.agent),
    );

    const overall_score =
      filteredInsights.length > 0
        ? filteredInsights.reduce(
            (sum, insight) => sum + insight.daily_score,
            0,
          ) / filteredInsights.length
        : 0;

    const agents_above_target = filteredInsights.filter(
      (i) => i.daily_score >= 8.0,
    ).length;
    const agents_below_target = filteredInsights.filter(
      (i) => i.daily_score < 8.0,
    ).length;
    const coaching_sessions_needed = filteredInsights.filter(
      (i) => i.coaching_priority !== "low",
    ).length;

    return {
      date: dailyTeamSummary.date,
      team_performance: {
        overall_score: Math.round(overall_score * 10) / 10,
        improvement_vs_yesterday: 0.3,
        agents_above_target,
        agents_below_target,
        coaching_sessions_needed,
      },
      individual_agent_insights: filteredInsights,
    };
  };

  const getFilteredContactReviews = () => {
    const filteredAgents = getFilteredAgents();
    const agentNames = filteredAgents.map((a) => a.name);

    return sampleContactReviews.filter((review) =>
      agentNames.includes(review.agentName),
    );
  };

  // If viewing agent detail, show that page
  if (selectedAgent) {
    const agent = agents.find((a) => a.id === selectedAgent);
    if (!agent) return null;

    const agentSessions = coachingSessions.filter(
      (s) => s.agentId === selectedAgent,
    );
    const engagement = getEngagementLevel(agent.engagementTime);
    const statusBadge = getStatusBadge(agent.status);

    return (
      <div className="space-y-6">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAgent(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Progress
              </Button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                  <Target className="h-4 w-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-semibold text-foreground">
                  Agent Progress Detail
                </h1>
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 font-medium"
              >
                Supervisor View
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Team Lead - Customer Support</span>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-800">TL</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Agent Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {agent.avatar}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {agent.name}
                </h2>
                <p className="text-muted-foreground">{agent.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  {/* <Badge {...statusBadge}>
                    {statusBadge.icon} {statusBadge.text}
                  </Badge> */}
                  <span className="text-sm text-muted-foreground">
                    Last session: {agent.lastSession}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">
                {agent.averageScore}
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(agent.averageScore, agent.previousScore)}
                <span className="text-sm text-muted-foreground">
                  Current Score
                </span>
              </div>
            </div>
          </div>

          {/* Performance Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>
                Weekly trend chart showing score improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getPerformanceTimelineData()}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="period" className="text-xs" />
                  <YAxis domain={[7, 10]} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                    name="Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed Agent Analysis */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Comparison vs team averages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 45% error rate vs team average 23%</li>
                  <li>• 12.5 min avg handle time vs team 8.2 min</li>
                  <li>• Customer satisfaction: 3.1/5 vs team 4.2/5</li>
                  <li>• 3 escalations in last 7 days</li>
                </ul>
              </CardContent>
            </Card>

            {/* Error Pattern Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Error Pattern Analysis</CardTitle>
                <CardDescription>
                  Where issues most frequently occur
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Most common error: Policy interpretation (60%)</li>
                  <li>• System navigation struggles: 25%</li>
                  <li>• Documentation issues: 15%</li>
                  <li>• Timing: Errors spike during complex cases</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Specific Interaction Examples */}
          {/* <Card>
              <CardHeader>
                <CardTitle>Specific Interaction Examples</CardTitle>
                <CardDescription>
                  Representative successes and failures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Failed Interaction #1: Partial refund confusion</li>
                  <li>
                    • Failed Interaction #2: Authorization escalation missed
                  </li>
                  <li>• Success Example: Simple return handled correctly</li>
                </ul>
              </CardContent>
            </Card> */}

          {/* AI Coaching Recommendations */}
          {/* <Card>
              <CardHeader>
                <CardTitle>AI Coaching Recommendations</CardTitle>
                <CardDescription>Prioritized plan of action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Priority 1: Refund policy deep-dive training</li>
                  <li>• Priority 2: System workflow practice sessions</li>
                  <li>• Priority 3: Pair with Sarah M. for mentoring</li>
                  <li>• Suggested timeline: 2-week intensive support plan</li>
                </ul>
              </CardContent>
            </Card> */}

          {/* Progress Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>AI Coaching Recommendations</CardTitle>
              <CardDescription>Prioritized plan of action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Priority 1: Refund policy deep-dive training</li>
                <li>• Priority 2: System workflow practice sessions</li>
                <li>• Priority 3: Pair with Sarah M. for mentoring</li>
                <li>• Suggested timeline: 2-week intensive support plan</li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Session History */}
            <Card>
              <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription>
                  Recent coaching sessions and outcomes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {agentSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{session.scenario}</h4>
                      <Badge variant="outline">{session.score}/10</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {session.feedback}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{session.date}</span>
                      <span>{session.duration} min</span>
                      <div className="flex gap-1">
                        {session.skillsImproved.map((skill, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Before vs After Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Before vs After Coaching</CardTitle>
                <CardDescription>
                  Performance improvement metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Score</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {agent.previousScore}
                      </span>
                      <ArrowRight className="h-3 w-3" />
                      <span className="font-medium">{agent.averageScore}</span>
                      {getTrendIcon(agent.averageScore, agent.previousScore)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sessions Completed</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {agent.sessionsCompleted}/{agent.sessionsTarget}
                      </span>
                      <Progress
                        value={
                          (agent.sessionsCompleted / agent.sessionsTarget) * 100
                        }
                        className="w-16"
                      />
                    </div>
                  </div>
                  {/* <div className="flex justify-between items-center">
                    <span className="text-sm">Engagement Level</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${engagement.color}`}>
                        {engagement.level}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({agent.engagementTime}min)
                      </span>
                    </div>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Supervisor Notes */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Supervisor Notes</CardTitle>
                {editingNotes !== agent.id ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingNotes(agent.id);
                      setNewNote(agent.notes);
                    }}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Notes
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => saveNote(agent.id)}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingNotes(null);
                        setNewNote("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editingNotes === agent.id ? (
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add notes about this agent's progress..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {agent.notes || "No notes added yet."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If viewing pattern details, show that page
  if (showPatternDetails && selectedPattern) {
    const pattern = challengingPatterns.find((p) => p.id === selectedPattern);
    if (!pattern) return null;

    const affectedAgentsData = agents.filter((a) =>
      pattern.affectedAgents.includes(a.id),
    );

    // Generate detailed data based on pattern type
    const getPatternDetails = (pattern: ChallengingPattern) => {
      const baseData = {
        errorRateTrend: [
          { day: "Day 1", rate: pattern.errorRate - 8 },
          { day: "Day 7", rate: pattern.errorRate - 5 },
          { day: "Day 14", rate: pattern.errorRate - 3 },
          { day: "Day 21", rate: pattern.errorRate - 1 },
          { day: "Day 28", rate: pattern.errorRate },
        ],
        peakTimes: ["10:00-11:00 AM", "2:00-3:00 PM", "7:00-8:00 PM"],
        volumeSpikes: [
          "Monday mornings",
          "Friday afternoons",
          "Month-end periods",
        ],
      };

      switch (pattern.name) {
        case "Refund Processing":
          return {
            ...baseData,
            rootCauses: [
              { type: "Policy unclear explanation", frequency: "35%" },
              { type: "System timeout during processing", frequency: "28%" },
              { type: "Agent lacks refund authorization", frequency: "20%" },
              { type: "Customer documentation incomplete", frequency: "12%" },
              { type: "Processing workflow confusion", frequency: "5%" },
            ],
            impact: {
              customerSatisfaction: "-0.8 points",
              handleTime: "+2.3 minutes",
              escalationRate: "15% higher than baseline",
              revenueImpact: "$12,400 in delayed refunds",
            },
          };
        case "Billing Inquiries":
          return {
            ...baseData,
            rootCauses: [
              {
                type: "Complex billing structure explanation",
                frequency: "40%",
              },
              { type: "Proration calculation errors", frequency: "25%" },
              { type: "Invoice discrepancy resolution", frequency: "18%" },
              { type: "Payment method update issues", frequency: "12%" },
              { type: "Billing cycle misunderstanding", frequency: "5%" },
            ],
            impact: {
              customerSatisfaction: "-0.5 points",
              handleTime: "+1.8 minutes",
              escalationRate: "8% higher than baseline",
              revenueImpact: "$8,200 in billing disputes",
            },
          };
        case "Technical Support":
          return {
            ...baseData,
            rootCauses: [
              { type: "Complex troubleshooting steps", frequency: "45%" },
              { type: "Agent technical knowledge gaps", frequency: "30%" },
              { type: "Escalation threshold uncertainty", frequency: "15%" },
              { type: "Tool/system limitations", frequency: "7%" },
              { type: "Customer technical literacy", frequency: "3%" },
            ],
            impact: {
              customerSatisfaction: "-1.2 points",
              handleTime: "+3.5 minutes",
              escalationRate: "22% higher than baseline",
              revenueImpact: "$15,600 in support overhead",
            },
          };
        default:
          return {
            ...baseData,
            rootCauses: [
              { type: "Process complexity", frequency: "30%" },
              { type: "Training gaps", frequency: "25%" },
              { type: "System limitations", frequency: "20%" },
              { type: "Policy confusion", frequency: "15%" },
              { type: "Communication barriers", frequency: "10%" },
            ],
            impact: {
              customerSatisfaction: "-0.6 points",
              handleTime: "+2.0 minutes",
              escalationRate: "10% higher than baseline",
              revenueImpact: "$9,500 in efficiency loss",
            },
          };
      }
    };

    const patternDetails = getPatternDetails(pattern);

    return (
      <div className="space-y-6">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowPatternDetails(false);
                  setSelectedPattern(null);
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Challenge Patterns
              </Button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-semibold text-foreground">
                  {pattern.name} Challenge Pattern
                </h1>
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 font-medium"
              >
                Supervisor View
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Team Lead - Customer Support</span>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-800">TL</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Pattern Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Pattern Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">
                    {pattern.errorRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Error Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {pattern.frequency}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Occurrences
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {pattern.affectedAgents.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Affected Agents
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-5">
                    {pattern.dateRange}
                  </div>
                  <div className="text-sm text-muted-foreground">Timeframe</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Rate Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-chart-1" />
                Error Rate Trend (Last 30 days)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patternDetails.errorRateTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">
                    Peak Error Days and Times
                  </h4>
                  <ul className="space-y-1">
                    {patternDetails.peakTimes.map((time, index) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <Clock className="h-3 w-3" />
                        {time}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    Correlation with Volume Spikes
                  </h4>
                  <ul className="space-y-1">
                    {patternDetails.volumeSpikes.map((spike, index) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <Activity className="h-3 w-3" />
                        {spike}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Root Cause Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-chart-2" />
                Root Cause Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">
                  Top 5 Error Types and Frequencies
                </h4>
                <div className="space-y-2">
                  {patternDetails.rootCauses.map((cause, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <span className="text-sm">{cause.type}</span>
                      <Badge variant="outline">{cause.frequency}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h4 className="font-medium mb-2">System/Process Issues</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>• Workflow complexity and system limitations</p>
                    <p>• Integration delays and timeout issues</p>
                    <p>• Authorization and access restrictions</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Agent Skill Issues</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>• Knowledge gaps in policy interpretation</p>
                    <p>• Communication and explanation skills</p>
                    <p>• Decision-making confidence levels</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-chart-3" />
                Impact Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-sm font-medium">
                      Customer Satisfaction Impact
                    </span>
                    <span className="text-red-600 font-bold">
                      {patternDetails.impact.customerSatisfaction}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="text-sm font-medium">
                      Average Handle Time Increase
                    </span>
                    <span className="text-orange-600 font-bold">
                      {patternDetails.impact.handleTime}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <span className="text-sm font-medium">Escalation Rate</span>
                    <span className="text-yellow-600 font-bold">
                      {patternDetails.impact.escalationRate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-sm font-medium">Revenue Impact</span>
                    <span className="text-purple-600 font-bold">
                      {patternDetails.impact.revenueImpact}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Performance Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-chart-4" />
                Agent Performance Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-chart-4">
                    High Performers
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Agents handling this issue well
                  </p>
                  <div className="space-y-2">
                    {affectedAgentsData
                      .filter(
                        (agent) =>
                          agent.status === "excellent" ||
                          agent.status === "good",
                      )
                      .map((agent) => (
                        <div
                          key={agent.id}
                          className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200"
                        >
                          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-green-800">
                              {agent.avatar}
                            </span>
                          </div>
                          <span className="text-sm">{agent.name}</span>
                          <CheckCircle className="h-3 w-3 text-green-600 ml-auto" />
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-destructive">
                    Struggling Agents
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Needing immediate support
                  </p>
                  <div className="space-y-2">
                    {affectedAgentsData
                      .filter(
                        (agent) =>
                          agent.status === "at-risk" ||
                          agent.status === "needs-attention",
                      )
                      .map((agent) => (
                        <div
                          key={agent.id}
                          className="flex items-center gap-2 p-2 bg-red-50 rounded border border-red-200"
                        >
                          <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-red-800">
                              {agent.avatar}
                            </span>
                          </div>
                          <span className="text-sm">{agent.name}</span>
                          <XCircle className="h-3 w-3 text-red-600 ml-auto" />
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-chart-5">
                    Training Status
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Completion by agent
                  </p>
                  <div className="space-y-3">
                    {affectedAgentsData.map((agent) => {
                      const completionRate = Math.floor(
                        (agent.sessionsCompleted / agent.sessionsTarget) * 100,
                      );
                      return (
                        <div key={agent.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{agent.name}</span>
                            <span>{completionRate}%</span>
                          </div>
                          <Progress value={completionRate} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If viewing daily agent details, show that page
  if (showDailyAgentDetails && selectedDailyAgent) {
    const agentInsight = dailyTeamSummary.individual_agent_insights.find(
      (a) => a.agent === selectedDailyAgent,
    );
    if (!agentInsight) return null;

    const getTrendIcon = (trend: string) => {
      switch (trend) {
        case "improving":
          return <TrendingUp className="h-4 w-4 text-green-600" />;
        case "declining":
          return <TrendingDown className="h-4 w-4 text-red-600" />;
        case "stable":
          return <Minus className="h-4 w-4 text-blue-600" />;
        default:
          return <Minus className="h-4 w-4 text-gray-600" />;
      }
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "high":
          return "text-red-600 bg-red-50 border-red-200";
        case "medium":
          return "text-orange-600 bg-orange-50 border-orange-200";
        case "low":
          return "text-green-600 bg-green-50 border-green-200";
        default:
          return "text-gray-600 bg-gray-50 border-gray-200";
      }
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowDailyAgentDetails(false);
                  setSelectedDailyAgent(null);
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {agentInsight.agent
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h1 className="text-xl font-semibold text-foreground">
                  {agentInsight.agent} - Coaching Details
                </h1>
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 font-medium"
              >
                Agent Performance Review
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Team Lead - Customer Support</span>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-800">TL</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Search and Filters */}
          <div className="pb-2">
            <div className="flex gap-4 items-center flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={agentDetailSearchTerm}
                    onChange={(e) => setAgentDetailSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Popover 
                  open={agentDetailCalendarOpen} 
                  onOpenChange={(open) => {
                    setAgentDetailCalendarOpen(open);
                    if (!open) {
                      setAgentDetailPendingDate(undefined);
                    }
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[150px] justify-between"
                    >
                      <span className="truncate">
                        {agentDetailFilterTime === "custom" && agentDetailCustomDate
                          ? `Custom: ${format(agentDetailCustomDate, "d MMM")}`
                          : agentDetailFilterTime === "today"
                            ? "Today"
                            : agentDetailFilterTime === "yesterday"
                              ? "Yesterday"
                              : "Today"}
                      </span>
                      <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-2 border-b flex gap-1">
                      <Button
                        variant={agentDetailFilterTime === "today" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setAgentDetailFilterTime("today");
                          setAgentDetailCustomDate(undefined);
                          setAgentDetailPendingDate(undefined);
                          setAgentDetailCalendarOpen(false);
                        }}
                      >
                        Today
                      </Button>
                      <Button
                        variant={agentDetailFilterTime === "yesterday" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setAgentDetailFilterTime("yesterday");
                          setAgentDetailCustomDate(undefined);
                          setAgentDetailPendingDate(undefined);
                          setAgentDetailCalendarOpen(false);
                        }}
                      >
                        Yesterday
                      </Button>
                      <Button
                        variant={agentDetailFilterTime === "custom" || agentDetailPendingDate ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setAgentDetailPendingDate(agentDetailCustomDate || new Date());
                        }}
                      >
                        Custom
                      </Button>
                    </div>
                    <CalendarPicker
                      mode="single"
                      selected={agentDetailPendingDate || agentDetailCustomDate}
                      onSelect={(date) => {
                        setAgentDetailPendingDate(date);
                      }}
                      disabled={(date: Date) => date > new Date()}
                      initialFocus
                    />
                    <div className="p-2 border-t flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAgentDetailPendingDate(undefined);
                          setAgentDetailCalendarOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={!agentDetailPendingDate}
                        onClick={() => {
                          if (agentDetailPendingDate) {
                            setAgentDetailFilterTime("custom");
                            setAgentDetailCustomDate(agentDetailPendingDate);
                            setAgentDetailPendingDate(undefined);
                            setAgentDetailCalendarOpen(false);
                          }
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Select value={agentDetailFilterChannel} onValueChange={setAgentDetailFilterChannel}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>

          {/* AI Coaching Feedback - What agent sees in their widget */}
          {agentInsight.ai_coaching_feedback && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  AI Coaching Feedback
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                    {agentDetailFilterTime === "today" 
                      ? "Today" 
                      : agentDetailFilterTime === "yesterday" 
                        ? "Yesterday" 
                        : agentDetailCustomDate 
                          ? format(agentDetailCustomDate, "MMM d, yyyy") 
                          : "Today"}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  This is the feedback {agentInsight.agent} {agentDetailFilterTime === "today" ? "sees" : "saw"} in their TrAIna coaching widget
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Prior Day Wins */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-500" />
                      {agentDetailFilterTime === "today" ? "Yesterday's" : "Prior Day"} Wins
                    </h4>
                    <ul className="space-y-1">
                      {agentInsight.ai_coaching_feedback.yesterdaysWins.map((win, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground pl-4 border-l-2 border-green-200"
                        >
                          • {win}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Challenging Areas */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      Challenging Areas
                    </h4>
                    <ul className="space-y-1">
                      {agentInsight.ai_coaching_feedback.challengingAreas.map((area, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground pl-4 border-l-2 border-orange-200"
                        >
                          • {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Focus Areas */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Star className="h-4 w-4 text-blue-500" />
                    {agentDetailFilterTime === "today" ? "Today's" : "Daily"} Focus Areas
                  </h4>
                  <ul className="space-y-1">
                    {agentInsight.ai_coaching_feedback.focusAreas.map((area, index) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground pl-4 border-l-2 border-blue-200"
                      >
                        • {area}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pro Tip */}
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border border-blue-200">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    Pro Tip {agentDetailFilterTime === "today" ? "for Today" : ""}
                  </h4>
                  <p className="text-sm text-muted-foreground italic">
                    {agentInsight.ai_coaching_feedback.proTip}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Reviews Section */}
          <ContactReviewsList 
            agentName={agentInsight.agent} 
            storageKeyPrefix={`agent_${agentInsight.agent.replace(/\s+/g, '_')}`}
            controlledSearchTerm={agentDetailSearchTerm}
            controlledFilterChannel={agentDetailFilterChannel}
            controlledFilterTime={agentDetailFilterTime}
            controlledCustomDate={agentDetailCustomDate}
            hideFilters={true}
          />

          {/* Coaching Preparation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-chart-4" />
                Coaching Preparation
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Ready-to-use talking points and session structure for your
                coaching conversation
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Session Details */}
              {/* <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Suggested Duration
                  </h4>
                  <div className="text-2xl font-bold text-blue-600">
                    {agentInsight.coaching_prep.suggested_duration}
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-2">
                    Focus Area
                  </h4>
                  <div className="text-lg font-semibold text-purple-600 capitalize">
                    {agentInsight.coaching_prep.focus_area.replace("_", " ")}
                  </div>
                </div>
              </div> */}

              {/* Talking Points */}
              <div>
                {/* <h4 className="font-medium mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Coaching Talking Points
                </h4> */}
                <div className="space-y-2">
                  {agentInsight.coaching_prep.talking_points.map(
                    (point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg"
                      >
                        <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm flex-1">{point}</p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Notes
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Preparation Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-auto flex items-center justify-center">
                <img
                  src="/Omnitraina Logo.png/"
                  alt="Logo"
                  className="h-full w-auto object-contain"
                />
              </div>

              <h1 className="text-xl font-semibold text-foreground">
                AI Coaching and Training
              </h1>
            </div>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 font-medium"
            >
              Supervisor View
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            {/* Alerts Notification */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadAlertsCount}
                  </span>
                )}
              </Button>
              {showAlerts && (
                <div className="absolute right-0 top-10 w-80 bg-card border rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 border-b ${!alert.isRead ? "bg-blue-50" : ""}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-1">
                            {alert.type === "warning" && (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            )}
                            {alert.type === "error" && (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            {alert.type === "info" && (
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">
                              {alert.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {alert.message}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {alert.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Team Lead - Customer Support</span>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs font-medium text-blue-800">TL</span>
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
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <TabsList className="flex w-auto bg-zinc-100">
              <TabsTrigger value="dashboard" className="px-4">Dashboard</TabsTrigger>
              <TabsTrigger value="daily-summary" className="px-4">Agent Performance Review</TabsTrigger>
              <TabsTrigger value="patterns" className="px-4">Challenging Patterns</TabsTrigger>
              <TabsTrigger value="progress" className="px-4">Coaching Progress</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="top">Top Performers</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Team Overview Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Team Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Agents Coached This{" "}
                    {timeFilter === "daily"
                      ? "Day"
                      : timeFilter === "monthly"
                        ? "Month"
                        : "Week"}
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {getFilteredTeamMetrics().totalAgentsCoached}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Out of {getFilteredAgents().length}{" "}
                    {agentFilter} agents
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Team Improvement
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${getFilteredTeamMetrics().teamImprovementPercent > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {getFilteredTeamMetrics().teamImprovementPercent > 0
                      ? "+"
                      : ""}
                    {getFilteredTeamMetrics().teamImprovementPercent}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    vs last{" "}
                    {timeFilter === "daily"
                      ? "day"
                      : timeFilter === "monthly"
                        ? "month"
                        : "week"}{" "}
                    (+{getFilteredTeamMetrics().previousWeekImprovement}%)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    At Risk Agents
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {getFilteredTeamMetrics().atRiskAgents}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Need immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Top Performers
                  </CardTitle>
                  <Award className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {getFilteredTeamMetrics().topPerformers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Excellent rating
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Top 3 Recurring Challenges */}
            <Card>
              <CardHeader>
                <CardTitle>Top 3 Recurring Challenges</CardTitle>
                <CardDescription>
                  Most frequent issues across your team this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamOverviewData.topChallenges.map((challenge, index) => (
                    <div
                      key={challenge.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{challenge.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {challenge.category} • {challenge.frequency}{" "}
                            occurrences
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">
                          {challenge.errorRate}% error rate
                        </Badge>
                        {challenge.trend === "up" && (
                          <TrendingUp className="h-4 w-4 text-red-600" />
                        )}
                        {challenge.trend === "down" && (
                          <TrendingDown className="h-4 w-4 text-green-600" />
                        )}
                        
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance Trend</CardTitle>
                <CardDescription>
                  Average team score and session completion over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getPerformanceTimelineData()}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis dataKey="period" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                      name="Avg Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Challenging Patterns Explorer */}
          <TabsContent value="patterns" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Challenging Patterns Explorer
                </h2>
                <p className="text-muted-foreground">
                  Aggregated team-wide problem areas with drill-down capability
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={agentFilter} onValueChange={setAgentFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    <SelectItem value="at-risk">At Risk</SelectItem>
                    <SelectItem value="top">Top Performers</SelectItem>
                    <SelectItem value="affected">
                      Affected by Pattern
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select value={intentFilter} onValueChange={setIntentFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Intents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Intents</SelectItem>
                    <SelectItem value="refund">Refunds</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={channelFilter} onValueChange={setChannelFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Channels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
                {(intentFilter !== "all" ||
                  channelFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIntentFilter("all");
                      setChannelFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              {getFilteredPatterns().map((pattern) => (
                <Card
                  key={pattern.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {pattern.name}
                          </h3>
                          <Badge variant="outline">{pattern.category}</Badge>
                          <Badge
                            variant={
                              pattern.trend === "up"
                                ? "destructive"
                                : pattern.trend === "down"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {pattern.trend === "up" && (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            )}
                            {pattern.trend === "down" && (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {pattern.errorRate}% error rate
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Frequency:{" "}
                            </span>
                            <span className="font-medium">
                              {pattern.frequency} occurrences
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Affected Agents:{" "}
                            </span>
                            <span className="font-medium">
                              {pattern.affectedAgents.length}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Date Range:{" "}
                            </span>
                            <span className="font-medium">
                              {pattern.dateRange}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPattern(pattern.id);
                            setShowPatternDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">
                            Top Intents:{" "}
                          </span>
                          <div className="flex gap-1 mt-1">
                            {pattern.intents.slice(0, 3).map((intent, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs"
                              >
                                {intent}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Channels:{" "}
                          </span>
                          <div className="flex gap-1 mt-1">
                            {pattern.channels.map((channel, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs"
                              >
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Coaching Progress Tracker */}
          <TabsContent value="progress" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Coaching Progress Tracker
                </h2>
                <p className="text-muted-foreground">
                  Individual coaching progress
                </p>
                {agentFilter === "affected" && selectedPattern && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">
                      Showing agents affected by pattern
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAgentFilter("all");
                        setSelectedPattern(null);
                      }}
                    >
                      <ArrowLeft className="h-3 w-3 mr-1" />
                      Back to All Agents
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select value={agentFilter} onValueChange={setAgentFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter agents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    <SelectItem value="at-risk">At Risk Only</SelectItem>
                    <SelectItem value="top">Top Performers</SelectItem>
                    <SelectItem value="excellent">Excellent Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              {getFilteredAgents().map((agent) => {
                const statusBadge = getStatusBadge(agent.status);
                const engagement = getEngagementLevel(agent.engagementTime);

                return (
                  <Card
                    key={agent.id}
                    className={`hover:shadow-md transition-shadow cursor-pointer ${
                      agent.status === "at-risk"
                        ? "border-red-200 bg-red-50/50"
                        : ""
                    }`}
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium text-primary">
                              {agent.avatar}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {agent.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {agent.email} • Last session: {agent.lastSession}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          {/* Sessions Completed */}
                          <div className="text-center">
                            <div className="text-2xl font-bold text-foreground">
                              {agent.sessionsCompleted}/{agent.sessionsTarget}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Sessions
                            </p>
                            <Progress
                              value={
                                (agent.sessionsCompleted /
                                  agent.sessionsTarget) *
                                100
                              }
                              className="w-16 mt-1"
                            />
                          </div>

                          {/* Average Score Trend */}
                          <div className="text-center">
                            <div className="flex items-center gap-1">
                              <span className="text-2xl font-bold text-foreground">
                                {agent.averageScore}
                              </span>
                              {getTrendIcon(
                                agent.averageScore,
                                agent.previousScore,
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Avg Score
                            </p>
                          </div>

                          {/* Engagement Level */}
                          {/* <div className="text-center">
                            <div
                              className={`text-lg font-bold ${engagement.color}`}
                            >
                              {engagement.level}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {agent.engagementTime}min
                            </p>
                          </div> */}

                          {/* Traffic Light Status */}
                          {/* <div className="text-center">
                            <Badge {...statusBadge}>
                              {statusBadge.icon} {statusBadge.text}
                            </Badge>
                          </div> */}

                          <Button variant="outline" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">
                              Improvement Areas:
                            </p>
                            <div className="flex gap-2">
                              {agent.improvementAreas.map((area, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Daily Team Coaching Summary */}
          <TabsContent value="daily-summary" className="space-y-6">
            {/* Individual Agent Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Individual Agent Performance
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Daily performance insights and coaching preparation for each
                  team member
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {getFilteredDailySummary().individual_agent_insights.map(
                  (agentInsight, index) => {
                    const getTrendIcon = (trend: string) => {
                      switch (trend) {
                        case "improving":
                          return (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          );
                        case "declining":
                          return (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          );
                        case "stable":
                          return <Minus className="h-4 w-4 text-blue-600" />;
                        default:
                          return <Minus className="h-4 w-4 text-gray-600" />;
                      }
                    };

                    return (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-medium text-primary">
                                {agentInsight.agent
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold">
                                {agentInsight.agent}
                              </h4>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDailyAgent(agentInsight.agent);
                              setShowDailyAgentDetails(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Strengths:{" "}
                            </span>
                            <span className="font-medium">
                              {agentInsight.strengths
                                .map((s) => s.replace("_", " "))
                                .join(", ")}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Improvement Areas:{" "}
                            </span>
                            <span className="font-medium">
                              {agentInsight.improvement_areas
                                .map((a) => a.replace("_", " "))
                                .join(", ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
