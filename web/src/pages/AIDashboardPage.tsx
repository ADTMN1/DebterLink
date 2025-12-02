import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAlert } from "@/components/AIAlert";
import { GradeChart } from "@/components/GradeChart";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingDown,
  AlertTriangle,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  BarChart3
} from "lucide-react";
import { useState } from "react";

export default function AIDashboardPage() {
  const sidebarStyle = { "--sidebar-width": "16rem" };

  const mockPredictions = [
    {
      id: "1",
      student: { name: "Marta Alemu", id: "4" },
      predictionType: "academic-risk" as const,
      confidence: 87,
      suggestions: [
        "Schedule one-on-one tutoring session",
        "Notify parents about recent performance drop",
        "Consider additional practice materials",
      ],
      riskScore: 87,
      trend: "decreasing",
    },
    {
      id: "2",
      student: { name: "Dawit Bekele", id: "3" },
      predictionType: "attendance-risk" as const,
      confidence: 72,
      suggestions: [
        "Monitor attendance patterns",
        "Send reminder notifications",
        "Schedule parent meeting",
      ],
      riskScore: 72,
      trend: "stable",
    },
    {
      id: "3",
      student: { name: "Hanna Alemu", id: "7" },
      predictionType: "behavior-risk" as const,
      confidence: 65,
      suggestions: [
        "Review behavior logs",
        "Consider counseling support",
        "Implement positive reinforcement",
      ],
      riskScore: 65,
      trend: "increasing",
    },
  ];

  const aiInsights = [
    {
      type: "academic",
      title: "Class Performance Trend",
      description: "Overall class average has improved by 3.5% this month",
      impact: "positive",
      studentsAffected: 12,
    },
    {
      type: "attendance",
      title: "Attendance Pattern Detected",
      description: "Mondays show 8% lower attendance rate",
      impact: "negative",
      studentsAffected: 5,
    },
    {
      type: "behavior",
      title: "Positive Behavior Increase",
      description: "Positive behavior incidents up 15% this week",
      impact: "positive",
      studentsAffected: 18,
    },
  ];

  const performanceMetrics = {
    accuracy: 89,
    predictionsMade: 156,
    interventionsSuggested: 42,
    successRate: 78,
  };

  const trendData = [
    { month: "Sep", average: 75, classAverage: 72 },
    { month: "Oct", average: 78, classAverage: 74 },
    { month: "Nov", average: 82, classAverage: 76 },
    { month: "Dec", average: 85, classAverage: 78 },
  ];

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="teacher" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-serif font-bold">AI Dashboard</h1>
                <p className="text-muted-foreground">AI-powered insights and predictions for student success</p>
              </div>
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Run Analysis
              </Button>
            </div>

            {/* AI Metrics */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">AI Accuracy</p>
                      <p className="text-3xl font-bold">{performanceMetrics.accuracy}%</p>
                      <p className="text-xs text-muted-foreground mt-1">Prediction accuracy</p>
                    </div>
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Predictions</p>
                      <p className="text-3xl font-bold">{performanceMetrics.predictionsMade}</p>
                      <p className="text-xs text-muted-foreground mt-1">Total predictions</p>
                    </div>
                    <Brain className="h-8 w-8 text-chart-1" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Interventions</p>
                      <p className="text-3xl font-bold">{performanceMetrics.interventionsSuggested}</p>
                      <p className="text-xs text-muted-foreground mt-1">Suggested actions</p>
                    </div>
                    <Lightbulb className="h-8 w-8 text-chart-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                      <p className="text-3xl font-bold">{performanceMetrics.successRate}%</p>
                      <p className="text-xs text-muted-foreground mt-1">Intervention success</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-chart-3" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  AI Risk Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockPredictions.map((prediction) => (
                  <div key={prediction.id} className="space-y-3">
                    <AIAlert
                      student={prediction.student}
                      predictionType={prediction.predictionType}
                      confidence={prediction.confidence}
                      suggestions={prediction.suggestions}
                    />
                    <div className="ml-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Risk Score</span>
                        <span className="font-medium">{prediction.riskScore}%</span>
                      </div>
                      <Progress value={prediction.riskScore} className="h-2" />
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Trend:</span>
                        <Badge variant={prediction.trend === "decreasing" ? "destructive" : "secondary"}>
                          {prediction.trend === "decreasing" && <TrendingDown className="h-3 w-3 mr-1" />}
                          {prediction.trend === "increasing" && <TrendingUp className="h-3 w-3 mr-1" />}
                          {prediction.trend.charAt(0).toUpperCase() + prediction.trend.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    AI Insights
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        insight.impact === "positive"
                          ? "border-chart-2/20 bg-chart-2/5"
                          : "border-destructive/20 bg-destructive/5"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{insight.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {insight.description}
                          </p>
                        </div>
                        {insight.impact === "positive" ? (
                          <TrendingUp className="h-5 w-5 text-chart-2" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {insight.studentsAffected} students affected
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <GradeChart data={trendData} title="Predicted vs Actual Performance" />
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Prediction Confidence</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Based on historical data and current performance trends
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="p-4 rounded-lg border bg-chart-2/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-chart-2" />
                      <p className="font-medium text-sm">Group Tutoring</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommend group study sessions for 5 students showing similar learning patterns
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-chart-1/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-chart-1" />
                      <p className="font-medium text-sm">Early Intervention</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Schedule early intervention for 3 at-risk students before next assessment
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <p className="font-medium text-sm">Parent Engagement</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Increase parent communication for students with declining attendance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}





