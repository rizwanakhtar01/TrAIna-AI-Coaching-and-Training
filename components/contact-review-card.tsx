"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Clock,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Search,
  User,
  MapPin,
  Calendar,
  Play,
  Pause,
  Volume2,
  ClipboardList,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format, isToday, isYesterday, isSameDay, subDays } from "date-fns";

const getToday = () => format(new Date(), "yyyy-MM-dd");
const getYesterday = () => format(subDays(new Date(), 1), "yyyy-MM-dd");

export interface EvaluationQuestionResult {
  questionId: string;
  questionText: string;
  scoringType: "numeric" | "pass-fail";
  score: number;
  maxScore: number;
  notes?: string;
}

export interface EvaluationSectionResult {
  sectionId: string;
  sectionName: string;
  aiFeedback?: string;
  questions: EvaluationQuestionResult[];
}

export interface EvaluationResult {
  formName: string;
  evaluationDate: string;
  sections: EvaluationSectionResult[];
}

interface ContactReview {
  id: string;
  timestamp: string;
  duration: string;
  channel: "chat" | "phone" | "email";
  customerIssue: string;
  contactSummary: string;
  queue: string;
  agentName?: string;
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
  evaluations?: EvaluationResult[];
}

const sampleReviews: ContactReview[] = [
  {
    id: "1",
    timestamp: "2 minutes ago",
    duration: "3:45",
    channel: "chat",
    customerIssue: "Subscription cancellation request",
    contactSummary:
      "Customer requested subscription cancellation due to low usage. Refund processed successfully but missed retention opportunity.",
    queue: "Billing & Subscriptions",
    agentName: "Sarah Mitchell",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      contactTimestamp: `${getToday()} 14:32:15`,
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
    evaluations: [
      {
        formName: "Billing & Refunds Quality Scorecard",
        evaluationDate: "Today, 14:35",
        sections: [
          {
            sectionId: "sec_01",
            sectionName: "Opening & Empathy",
            aiFeedback: "You opened this call with real warmth and professionalism — that sets the stage for everything. Next time, use that empathetic connection as a natural moment to explore whether the customer might be open to staying before processing the cancellation. A brief retention conversation there can make all the difference.",
            questions: [
              { questionId: "q01", questionText: "Agent greeted the customer professionally and introduced themselves", scoringType: "pass-fail", score: 10, maxScore: 10 },
              { questionId: "q02", questionText: "Agent acknowledged the customer's concern with empathy before moving to resolution", scoringType: "numeric", score: 7, maxScore: 10 },
            ],
          },
          {
            sectionId: "sec_02",
            sectionName: "Policy & Resolution",
            aiFeedback: "You nailed the policy side of this interaction — correct verification, accurate timeline, clear communication throughout. That's the standard to hold yourself to on every billing call. Keep building on this consistency.",
            questions: [
              { questionId: "q03", questionText: "Agent followed correct refund authorization and verification steps", scoringType: "pass-fail", score: 10, maxScore: 10 },
              { questionId: "q04", questionText: "Agent communicated refund timeline clearly and accurately to the customer", scoringType: "numeric", score: 9, maxScore: 10 },
            ],
          },
          {
            sectionId: "sec_03",
            sectionName: "Closing",
            aiFeedback: "You closed this call exactly right — the customer left knowing what had been done and what to expect next. That kind of clarity at the end of a call is what turns a good interaction into a great one. Keep finishing strong.",
            questions: [
              { questionId: "q05", questionText: "Agent confirmed the issue was fully resolved before ending the contact", scoringType: "pass-fail", score: 10, maxScore: 10 },
              { questionId: "q06", questionText: "Agent summarized the action taken and set clear next-step expectations", scoringType: "numeric", score: 8, maxScore: 10 },
            ],
          },
        ],
      },
      {
        formName: "Customer Experience & Communication Scorecard",
        evaluationDate: "Today, 14:40",
        sections: [
          {
            sectionId: "cx_01",
            sectionName: "Tone & Professionalism",
            aiFeedback: "Your language was clear and easy to follow throughout — the customer never had to ask for clarification, and that's a real skill. Keep using plain, accessible language, especially on billing calls where jargon can add unnecessary stress.",
            questions: [
              { questionId: "cx_q01", questionText: "Agent used clear, jargon-free language throughout the interaction", scoringType: "numeric", score: 9, maxScore: 10 },
              { questionId: "cx_q02", questionText: "Agent maintained a calm and professional tone even when the customer expressed frustration", scoringType: "numeric", score: 8, maxScore: 10 },
            ],
          },
          {
            sectionId: "cx_02",
            sectionName: "First Contact Resolution",
            aiFeedback: "You took full ownership here and resolved everything in a single contact — that's something to feel proud of. First-contact resolution is one of the most meaningful things you can do for a customer. Keep that ownership mindset front and centre.",
            questions: [
              { questionId: "cx_q03", questionText: "Agent resolved the customer's issue without requiring a follow-up contact", scoringType: "pass-fail", score: 10, maxScore: 10 },
              { questionId: "cx_q04", questionText: "Agent took full ownership of the issue without transferring unnecessarily", scoringType: "numeric", score: 9, maxScore: 10 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    timestamp: "15 minutes ago",
    duration: "6:12",
    channel: "phone",
    customerIssue: "Refund inquiry - 10 days overdue",
    contactSummary:
      "Customer frustrated about delayed refund. Issue escalated to expedite processing. Good recovery after initial misstep.",
    queue: "Customer Support",
    agentName: "John Davis",
    customer: {
      name: "Michael Chen",
      email: "m.chen@company.com",
      phone: "+1 (555) 987-6543",
      contactTimestamp: `${getToday()} 14:15:22`,
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
    evaluations: [
      {
        formName: "Billing & Refunds Quality Scorecard",
        evaluationDate: "Today, 14:17",
        sections: [
          {
            sectionId: "sec_01",
            sectionName: "Opening & Empathy",
            aiFeedback: "Here's a key moment to work on: next time a customer arrives frustrated, try pausing before jumping into account lookup and say something like 'I completely understand how stressful a delayed refund can be — let's get this sorted right now.' That small acknowledgment changes the whole tone of the call.",
            questions: [
              { questionId: "q01", questionText: "Agent greeted the customer professionally and introduced themselves", scoringType: "pass-fail", score: 10, maxScore: 10 },
              { questionId: "q02", questionText: "Agent acknowledged the customer's concern with empathy before moving to resolution", scoringType: "numeric", score: 4, maxScore: 10 },
            ],
          },
          {
            sectionId: "sec_02",
            sectionName: "Policy & Resolution",
            aiFeedback: "You handled a difficult situation really well here — correct escalation steps, a clear timeline, and a proactive push to expedite the refund. That combination of process knowledge and quick thinking is exactly what great support looks like. Build on this.",
            questions: [
              { questionId: "q03", questionText: "Agent followed correct refund authorization and verification steps", scoringType: "pass-fail", score: 10, maxScore: 10 },
              { questionId: "q04", questionText: "Agent communicated refund timeline clearly and accurately to the customer", scoringType: "numeric", score: 9, maxScore: 10 },
            ],
          },
          {
            sectionId: "sec_03",
            sectionName: "Closing",
            aiFeedback: "Before ending a call where the issue is still in progress, always anchor the customer with a clear next step — something like 'I'll send you a confirmation email and you can expect an update within 48 hours.' That reassurance is what the customer takes away from the call, so make it count.",
            questions: [
              { questionId: "q05", questionText: "Agent confirmed the issue was fully resolved before ending the contact", scoringType: "pass-fail", score: 0, maxScore: 10 },
              { questionId: "q06", questionText: "Agent summarized the action taken and set clear next-step expectations", scoringType: "numeric", score: 7, maxScore: 10 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    timestamp: "1 hour ago",
    duration: "8:23",
    channel: "email",
    customerIssue: "Technical support - third contact attempt",
    contactSummary:
      "Repeat technical issue with login. Customer frustrated after multiple failed attempts. Finally escalated to technical team.",
    queue: "Technical Support",
    agentName: "Lisa Kim",
    customer: {
      name: "Emma Rodriguez",
      email: "emma.rodriguez@startup.io",
      contactTimestamp: `${getYesterday()} 13:20:45`,
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
  },
];

// ─── Evaluation Scores Panel ──────────────────────────────────────────────────

export function EvaluationScoresPanel({ evaluation }: { evaluation: EvaluationResult }) {
  const [isOpen, setIsOpen] = useState(false);
  const { formName, sections } = evaluation;

  const getSectionAvgPct = (section: EvaluationSectionResult) => {
    const numQs = section.questions.filter((q) => q.scoringType !== "pass-fail");
    if (numQs.length === 0) return null;
    return Math.round(numQs.reduce((sum, q) => sum + (q.score / q.maxScore) * 100, 0) / numQs.length);
  };

  const allQuestions = sections.flatMap((s) => s.questions);
  const overallPct = Math.round(
    allQuestions.reduce((sum, q) => sum + (q.score / q.maxScore) * 100, 0) / allQuestions.length
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border rounded-lg overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-3 bg-slate-50/80 hover:bg-slate-100/80 transition-colors text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <ClipboardList className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm font-medium">{formName}</span>
              <Badge variant="outline" className="text-xs border border-border text-muted-foreground">
                {overallPct}%
              </Badge>
              <span className="text-xs text-muted-foreground">· Amazon Connect Evaluation</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0 ml-2">
              <span className="text-xs">{isOpen ? "Hide" : "Show details"}</span>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t bg-white">
            {/* Sections */}
            <div className="divide-y">
              {sections.map((section, sIdx) => {
                const sectionPct = getSectionAvgPct(section);
                return (
                  <div key={section.sectionId} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground bg-muted rounded px-1.5 py-0.5">{sIdx + 1}</span>
                        <span className="text-sm font-semibold text-foreground">{section.sectionName}</span>
                      </div>
                      {sectionPct !== null && (
                        <Badge variant="outline" className="text-xs border border-border text-muted-foreground">
                          Evaluation Score: {sectionPct}%
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-3 pl-2">
                      {section.questions.map((q, qIdx) => {
                        const pct = Math.round((q.score / q.maxScore) * 100);
                        const evalAnswer = pct > 70 ? "Yes" : pct < 50 ? "No" : null;
                        return (
                          <div key={q.questionId} className="space-y-1">
                            <div className="flex items-start justify-between gap-3">
                              <span className="text-xs text-muted-foreground mt-0.5 w-4 flex-shrink-0">{qIdx + 1}.</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-xs text-foreground leading-relaxed">{q.questionText}</p>
                                  <Badge variant="outline" className="text-xs border border-border text-muted-foreground flex-shrink-0">
                                    {pct}%
                                  </Badge>
                                </div>
                                {evalAnswer && (
                                  <p className="text-xs text-muted-foreground mt-0.5 pl-0">{evalAnswer}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {section.aiFeedback && (
                      <div className="text-xs text-accent bg-accent/10 p-2 rounded border-l-2 border-accent mt-3">
                        <strong>AI Coaching:</strong> {section.aiFeedback}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

interface ContactReviewCardProps {
  review: ContactReview;
  evaluationEnabled?: boolean;
}

function ContactReviewCard({ review, evaluationEnabled = true }: ContactReviewCardProps) {
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
            </div>
            <Badge variant="secondary" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              {review.queue}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {review.timestamp}
            </span>
          </div>
        </div>
        <div className="bg-muted/30 p-3 rounded-md border-l-4 border-primary/30">
          <p className="text-sm text-foreground font-medium mb-1">
            Contact Summary
          </p>
          <p className="text-sm text-muted-foreground">
            {review.contactSummary}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-chart-4">
              <CheckCircle className="h-4 w-4" />
              What went well
            </div>
            <p className="text-sm text-muted-foreground">
              {review.whatWentWell}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-chart-5">
              <AlertTriangle className="h-4 w-4" />
              Could improve
            </div>
            <p className="text-sm text-muted-foreground">
              {review.couldImprove}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-accent">
              <Lightbulb className="h-4 w-4" />
              Tip for next time
            </div>
            <p className="text-sm text-muted-foreground">
              {review.tipForNextTime}
            </p>
          </div>
        </div>

        {evaluationEnabled && review.evaluations && review.evaluations.map((ev, idx) => (
          <EvaluationScoresPanel key={idx} evaluation={ev} />
        ))}

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Hide Transcript & Analysis
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  View Full Transcript & Analysis
                </>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-3 mt-4">
            <div className="border rounded-lg p-4 bg-card">
              <h4 className="font-medium mb-3 text-sm">
                Conversation Transcript
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {review.transcript.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md ${getHighlightColor(message.highlight)}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium capitalize text-foreground">
                        {message.speaker}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-2">
                      {message.message}
                    </p>
                    {message.aiNote && (
                      <div className="text-xs text-accent bg-accent/10 p-2 rounded border-l-2 border-accent">
                        <strong>AI Note:</strong> {message.aiNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

interface ContactReviewsListProps {
  agentName?: string;
  storageKeyPrefix?: string;
  // Controlled mode props - when provided, filters are controlled externally
  controlledSearchTerm?: string;
  controlledFilterChannel?: string;
  controlledFilterTime?: "today" | "yesterday" | "last3days" | "last7days" | "custom";
  controlledCustomDate?: Date;
  hideFilters?: boolean;
  evaluationEnabled?: boolean;
}

export function ContactReviewsList({ 
  agentName, 
  storageKeyPrefix = "",
  controlledSearchTerm,
  controlledFilterChannel,
  controlledFilterTime,
  controlledCustomDate,
  hideFilters = false,
  evaluationEnabled = true,
}: ContactReviewsListProps) {
  const isControlled = controlledFilterTime !== undefined;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterChannel, setFilterChannel] = useState("all");
  const [filterTime, setFilterTime] = useState<"today" | "yesterday" | "last3days" | "last7days" | "custom">("today");
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [pendingCustomDate, setPendingCustomDate] = useState<Date | undefined>(undefined);

  // Use controlled values if provided, otherwise use internal state
  const effectiveSearchTerm = isControlled ? (controlledSearchTerm ?? "") : searchTerm;
  const effectiveFilterChannel = isControlled ? (controlledFilterChannel ?? "all") : filterChannel;
  const effectiveFilterTime = isControlled ? controlledFilterTime : filterTime;
  const effectiveCustomDate = isControlled ? controlledCustomDate : customDate;

  const storageKey = storageKeyPrefix ? `${storageKeyPrefix}_contactReviewTimeFilter` : "contactReviewTimeFilter";
  const storageDateKey = storageKeyPrefix ? `${storageKeyPrefix}_contactReviewCustomDate` : "contactReviewCustomDate";

  // Load persisted filter from localStorage on mount (only in uncontrolled mode)
  useEffect(() => {
    if (isControlled) return;
    
    const savedFilter = localStorage.getItem(storageKey);
    const savedCustomDate = localStorage.getItem(storageDateKey);
    
    if (savedFilter) {
      const parsed = JSON.parse(savedFilter);
      if (parsed.type === "today" || parsed.type === "yesterday") {
        setFilterTime(parsed.type);
      } else if (parsed.type === "custom" && savedCustomDate) {
        const date = new Date(savedCustomDate);
        if (!isNaN(date.getTime()) && date <= new Date()) {
          setFilterTime("custom");
          setCustomDate(date);
        }
      }
    }
  }, [storageKey, storageDateKey, isControlled]);

  // Persist filter to localStorage
  const persistFilter = (type: "today" | "yesterday" | "custom", date?: Date) => {
    localStorage.setItem(storageKey, JSON.stringify({ type }));
    if (type === "custom" && date) {
      localStorage.setItem(storageDateKey, date.toISOString());
    } else {
      localStorage.removeItem(storageDateKey);
    }
  };

  const filteredReviews = sampleReviews.filter((review) => {
    // Filter by agent name if provided
    if (agentName && review.agentName !== agentName) return false;

    const matchesSearch =
      review.customerIssue.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
      review.whatWentWell.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
      review.couldImprove.toLowerCase().includes(effectiveSearchTerm.toLowerCase());

    const matchesChannel =
      effectiveFilterChannel === "all" || review.channel === effectiveFilterChannel;

    const reviewDate = new Date(review.customer.contactTimestamp);
    const matchesTime =
      effectiveFilterTime === "today" ? isToday(reviewDate) :
      effectiveFilterTime === "yesterday" ? isYesterday(reviewDate) :
      effectiveFilterTime === "custom" && effectiveCustomDate ? isSameDay(reviewDate, effectiveCustomDate) : true;

    return matchesSearch && matchesChannel && matchesTime;
  });

  const getTimeLabel = () => {
    if (effectiveFilterTime === "today") return "Today";
    if (effectiveFilterTime === "yesterday") return "Yesterday";
    if (effectiveFilterTime === "custom" && effectiveCustomDate) {
      return format(effectiveCustomDate, "MMM d, yyyy");
    }
    return "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Recent Contact Reviews</h3>
          <p className="text-sm text-muted-foreground">
            AI-generated feedback from your customer interactions
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {filteredReviews.length} Review{filteredReviews.length !== 1 ? "s" : ""} {getTimeLabel()}
        </Badge>
      </div>

      {!hideFilters && (
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Popover 
            open={isCalendarOpen} 
            onOpenChange={(open) => {
              setIsCalendarOpen(open);
              if (!open) {
                setPendingCustomDate(undefined);
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[150px] justify-between"
              >
                <span className="truncate">
                  {filterTime === "custom" && customDate
                    ? `Custom: ${format(customDate, "d MMM")}`
                    : filterTime === "today"
                      ? "Today"
                      : filterTime === "yesterday"
                        ? "Yesterday"
                        : "Today"}
                </span>
                <Calendar className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-2 border-b flex gap-1">
                <Button
                  variant={filterTime === "today" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setFilterTime("today");
                    setCustomDate(undefined);
                    setPendingCustomDate(undefined);
                    persistFilter("today");
                    setIsCalendarOpen(false);
                  }}
                >
                  Today
                </Button>
                <Button
                  variant={filterTime === "yesterday" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setFilterTime("yesterday");
                    setCustomDate(undefined);
                    setPendingCustomDate(undefined);
                    persistFilter("yesterday");
                    setIsCalendarOpen(false);
                  }}
                >
                  Yesterday
                </Button>
                <Button
                  variant={filterTime === "custom" || pendingCustomDate ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setPendingCustomDate(customDate || new Date());
                  }}
                >
                  Custom
                </Button>
              </div>
              <CalendarPicker
                mode="single"
                selected={pendingCustomDate || customDate}
                onSelect={(date) => {
                  setPendingCustomDate(date);
                }}
                disabled={(date) => date > new Date()}
                initialFocus
              />
              <div className="p-2 border-t flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPendingCustomDate(undefined);
                    setIsCalendarOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={!pendingCustomDate}
                  onClick={() => {
                    if (pendingCustomDate) {
                      setFilterTime("custom");
                      setCustomDate(pendingCustomDate);
                      persistFilter("custom", pendingCustomDate);
                      setPendingCustomDate(undefined);
                      setIsCalendarOpen(false);
                    }
                  }}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Select value={filterChannel} onValueChange={setFilterChannel}>
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
      )}

      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <ContactReviewCard key={review.id} review={review} evaluationEnabled={evaluationEnabled} />
        ))}

        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No reviews match your current filters.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterChannel("all");
                  setFilterTime("today");
                  setCustomDate(undefined);
                }}
                className="mt-2"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
