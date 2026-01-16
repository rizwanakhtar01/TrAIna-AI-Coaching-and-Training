"use client";

import { useState } from "react";
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
} from "lucide-react";
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

interface ContactReviewCardProps {
  review: ContactReview;
}

function ContactReviewCard({ review }: ContactReviewCardProps) {
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
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Recording
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {review.duration}
            </div>
            <Badge variant="secondary" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              {review.queue}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-lg font-semibold ${getScoreColor(review.overallScore)}`}
            >
              {review.overallScore}/10
            </span>
            <span className="text-xs text-muted-foreground">
              {review.timestamp}
            </span>
          </div>
        </div>
        {review.channel === "phone" && isPlaying && (
          <div className="bg-muted/30 p-3 rounded-md border">
            <div className="flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Call Recording</span>
                  <span>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <CardTitle className="text-base">{review.customerIssue}</CardTitle>
        <div className="bg-muted/30 p-3 rounded-md border-l-4 border-primary/30">
          <p className="text-sm text-foreground font-medium mb-1">
            Contact Summary
          </p>
          <p className="text-sm text-muted-foreground">
            {review.contactSummary}
          </p>
        </div>
        <div className="bg-card border rounded-md p-3">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Customer Information</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <span className="ml-2 font-medium">{review.customer.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <span className="ml-2 font-medium">{review.customer.email}</span>
            </div>
            {review.customer.phone && (
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <span className="ml-2 font-medium">
                  {review.customer.phone}
                </span>
              </div>
            )}

            <div className="md:col-span-2">
              <span className="text-muted-foreground">Contact Time:</span>
              <span className="ml-2 font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {review.customer.contactTimestamp}
              </span>
            </div>
          </div>
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

export function ContactReviewsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterChannel, setFilterChannel] = useState("all");
  const [filterScore, setFilterScore] = useState("all");
  const [filterTime, setFilterTime] = useState<"today" | "yesterday" | "custom">("today");
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const filteredReviews = sampleReviews.filter((review) => {
    const matchesSearch =
      review.customerIssue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.whatWentWell.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.couldImprove.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChannel =
      filterChannel === "all" || review.channel === filterChannel;

    const matchesScore =
      filterScore === "all" ||
      (filterScore === "high" && review.overallScore >= 8) ||
      (filterScore === "medium" &&
        review.overallScore >= 6 &&
        review.overallScore < 8) ||
      (filterScore === "low" && review.overallScore < 6);

    const reviewDate = new Date(review.customer.contactTimestamp);
    const matchesTime =
      filterTime === "today" ? isToday(reviewDate) :
      filterTime === "yesterday" ? isYesterday(reviewDate) :
      filterTime === "custom" && customDate ? isSameDay(reviewDate, customDate) : true;

    return matchesSearch && matchesChannel && matchesScore && matchesTime;
  });

  const getTimeLabel = () => {
    if (filterTime === "today") return "Today";
    if (filterTime === "yesterday") return "Yesterday";
    if (filterTime === "custom" && customDate) {
      return format(customDate, "MMM d, yyyy");
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

        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <Select
            value={filterTime}
            onValueChange={(value: "today" | "yesterday" | "custom") => {
              setFilterTime(value);
              if (value !== "custom") {
                setCustomDate(undefined);
                setIsCalendarOpen(false);
              } else {
                setIsCalendarOpen(true);
              }
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Time Range">
                {filterTime === "custom" && customDate
                  ? format(customDate, "MMM d, yyyy")
                  : filterTime === "today"
                    ? "Today"
                    : filterTime === "yesterday"
                      ? "Yesterday"
                      : "Custom"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <PopoverTrigger asChild>
            <span className="sr-only">Open calendar</span>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarPicker
              mode="single"
              selected={customDate}
              onSelect={(date) => {
                setCustomDate(date);
                setIsCalendarOpen(false);
              }}
              initialFocus
            />
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

        <Select value={filterScore} onValueChange={setFilterScore}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scores</SelectItem>
            <SelectItem value="high">High (8+)</SelectItem>
            <SelectItem value="medium">Medium (6-8)</SelectItem>
            <SelectItem value="low">Low (&lt;6)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <ContactReviewCard key={review.id} review={review} />
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
                  setFilterScore("all");
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
