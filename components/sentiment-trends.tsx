"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  Smile,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Users,
} from "lucide-react";

// Sample data for sentiment trends over the last 50 interactions
const sentimentOverTime = [
  { date: "Mon", positive: 68, neutral: 22, negative: 10, total: 8 },
  { date: "Tue", positive: 72, neutral: 18, negative: 10, total: 12 },
  { date: "Wed", positive: 65, neutral: 25, negative: 10, total: 10 },
  { date: "Thu", positive: 70, neutral: 20, negative: 10, total: 9 },
  { date: "Fri", positive: 75, neutral: 15, negative: 10, total: 11 },
  { date: "Sat", positive: 78, neutral: 17, negative: 5, total: 6 },
  { date: "Sun", positive: 80, neutral: 15, negative: 5, total: 4 },
];

const currentWeekSentiment = [
  { name: "Positive", value: 65, count: 33, color: "#22c55e" },
  { name: "Neutral", value: 20, count: 10, color: "#64748b" },
  { name: "Negative", value: 15, count: 7, color: "#ef4444" },
];

const lastWeekSentiment = [
  { name: "Positive", value: 58, count: 29, color: "#22c55e" },
  { name: "Neutral", value: 25, count: 12, color: "#64748b" },
  { name: "Negative", value: 17, count: 9, color: "#ef4444" },
];

const sentimentByCategory = [
  {
    category: "Billing & Refunds",
    positive: 45,
    neutral: 30,
    negative: 25,
    total: 12,
  },
  {
    category: "Technical Support",
    positive: 60,
    neutral: 25,
    negative: 15,
    total: 18,
  },
  {
    category: "Account Management",
    positive: 75,
    neutral: 20,
    negative: 5,
    total: 8,
  },
  {
    category: "Product Inquiries",
    positive: 80,
    neutral: 15,
    negative: 5,
    total: 12,
  },
];

const sentimentInsights = [
  {
    type: "positive",
    title: "Positive Sentiment Up 12%",
    description: "Great improvement in customer satisfaction this week",
    icon: TrendingUp,
    color: "text-chart-4",
  },
  {
    type: "insight",
    title: "Billing Issues Drive 60% of Negative Sentiment",
    description: "Most negative feedback occurs in refund-related chats",
    icon: AlertTriangle,
    color: "text-chart-5",
  },
  {
    type: "achievement",
    title: "Technical Support Satisfaction Improved",
    description: "Your empathy improvements are showing results",
    icon: CheckCircle,
    color: "text-chart-4",
  },
];

function SentimentChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={sentimentOverTime}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          className="text-xs"
        />
        <YAxis axisLine={false} tickLine={false} className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Line
          type="monotone"
          dataKey="positive"
          stroke="#22c55e"
          strokeWidth={3}
          dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
          name="Positive %"
        />
        <Line
          type="monotone"
          dataKey="neutral"
          stroke="#64748b"
          strokeWidth={2}
          dot={{ fill: "#64748b", strokeWidth: 2, r: 3 }}
          name="Neutral %"
        />
        <Line
          type="monotone"
          dataKey="negative"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
          name="Negative %"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function SentimentPieChart({
  data,
  title,
}: {
  data: typeof currentWeekSentiment;
  title: string;
}) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-center">{title}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [`${value}%`, name]}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.value}%</span>
              <span className="text-muted-foreground">({item.count})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategorySentimentChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={sentimentByCategory}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis
          dataKey="category"
          axisLine={false}
          tickLine={false}
          className="text-xs"
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          className="text-xs"
          domain={[0, 100]}
        />
        <Tooltip
          formatter={(value: number, name: string) => [`${value}%`, name]}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Line
          type="monotone"
          dataKey="positive"
          stroke="#22c55e"
          strokeWidth={3}
          dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
          name="Positive %"
        />
        <Line
          type="monotone"
          dataKey="neutral"
          stroke="#64748b"
          strokeWidth={2}
          dot={{ fill: "#64748b", strokeWidth: 2, r: 3 }}
          name="Neutral %"
        />
        <Line
          type="monotone"
          dataKey="negative"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
          name="Negative %"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SentimentTrendsScreen() {
  const overallSentiment = 65; // Current positive sentiment percentage
  const previousSentiment = 58; // Previous week positive sentiment
  const sentimentChange = overallSentiment - previousSentiment;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Sentiment Trends
          </h2>
          <p className="text-muted-foreground">
            Customer sentiment analysis from your last 50 interactions
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          50 Interactions Analyzed
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Sentiment
            </CardTitle>
            <Smile className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {overallSentiment}%
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-chart-4" />+
              {sentimentChange}% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Positive Interactions
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">33</div>
            <p className="text-xs text-muted-foreground">
              Out of 50 total interactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Improvement Areas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">2</div>
            <p className="text-xs text-muted-foreground">
              Categories needing attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">+12%</div>
            <p className="text-xs text-muted-foreground">
              Positive sentiment increase
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Sentiment Trends Over Time
          </CardTitle>
          <CardDescription>
            Daily sentiment percentages for the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SentimentChart />
        </CardContent>
      </Card>

      {/* Current vs Previous Week Comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <SentimentPieChart
              data={currentWeekSentiment}
              title="Current Week Distribution"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Last Week</CardTitle>
          </CardHeader>
          <CardContent>
            <SentimentPieChart
              data={lastWeekSentiment}
              title="Previous Week Distribution"
            />
          </CardContent>
        </Card>
      </div>

      {/* Sentiment by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Sentiment by Interaction Category
          </CardTitle>
          <CardDescription>
            How customers feel across different types of support requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategorySentimentChart />
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Key Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sentimentInsights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-card border rounded-lg"
                >
                  <div className={`flex-shrink-0 ${insight.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Detailed Category Analysis</CardTitle>
          <CardDescription>Performance breakdown by interaction type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sentimentByCategory.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">{category.category}</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    {category.total} interactions
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-chart-4">Positive</span>
                    <span className="font-medium">{category.positive}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Neutral</span>
                    <span className="font-medium">{category.neutral}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-destructive">Negative</span>
                    <span className="font-medium">{category.negative}%</span>
                  </div>
                </div>
                <Progress value={category.positive} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
