import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GradeChart } from "@/components/GradeChart";
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  DollarSign,
  Activity,
  Download,
  Calendar,
  Target,
  Award
} from "lucide-react";
import { useState } from "react";

export default function AnalyticsPage() {
  const sidebarStyle = { "--sidebar-width": "16rem" };
  const [timeRange, setTimeRange] = useState("6months");

  const revenueData = [
    { month: "Jul", value: 250000 },
    { month: "Aug", value: 265000 },
    { month: "Sep", value: 280000 },
    { month: "Oct", value: 295000 },
    { month: "Nov", value: 310000 },
    { month: "Dec", value: 315000 },
  ];

  const userGrowthData = [
    { month: "Jul", value: 2000 },
    { month: "Aug", value: 2200 },
    { month: "Sep", value: 2500 },
    { month: "Oct", value: 2800 },
    { month: "Nov", value: 3000 },
    { month: "Dec", value: 3500 },
  ];

  const schoolPerformance = [
    { name: "Addis Ababa Secondary", students: 1245, teachers: 48, revenue: 125000, growth: 12 },
    { name: "Hawassa High School", students: 890, teachers: 35, revenue: 89000, growth: 8 },
    { name: "Dire Dawa Academy", students: 650, teachers: 28, revenue: 65000, growth: 15 },
    { name: "Bahir Dar School", students: 720, teachers: 32, revenue: 36000, growth: -5 },
  ];

  const subscriptionStats = {
    premium: { count: 2, revenue: 190000, percentage: 50 },
    standard: { count: 1, revenue: 89000, percentage: 25 },
    basic: { count: 1, revenue: 36000, percentage: 25 },
  };

  const engagementMetrics = {
    dailyActiveUsers: 2850,
    weeklyActiveUsers: 3200,
    monthlyActiveUsers: 3500,
    retentionRate: 87,
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="super-admin" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-serif font-bold">Analytics & Insights</h1>
                <p className="text-muted-foreground">Comprehensive system-wide analytics and performance metrics</p>
              </div>
              <div className="flex gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold">$315K</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-chart-2" />
                        <span className="text-xs text-chart-2">+12.5% vs last month</span>
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                      <p className="text-3xl font-bold">3.5K</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-chart-2" />
                        <span className="text-xs text-chart-2">+16.7% growth</span>
                      </div>
                    </div>
                    <Users className="h-8 w-8 text-chart-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Active Schools</p>
                      <p className="text-3xl font-bold">4</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-chart-1" />
                        <span className="text-xs text-chart-1">3 active, 1 inactive</span>
                      </div>
                    </div>
                    <GraduationCap className="h-8 w-8 text-chart-1" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Retention Rate</p>
                      <p className="text-3xl font-bold">87%</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-chart-3" />
                        <span className="text-xs text-chart-3">+2% improvement</span>
                      </div>
                    </div>
                    <Target className="h-8 w-8 text-chart-3" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <GradeChart
                    data={revenueData.map(d => ({ month: d.month, average: d.value / 1000, classAverage: d.value / 1000 - 10 }))}
                    title="Monthly Revenue (in thousands)"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <GradeChart
                    data={userGrowthData.map(d => ({ month: d.month, average: d.value / 100, classAverage: d.value / 100 - 5 }))}
                    title="Total Users (in hundreds)"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Subscription Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="p-4 rounded-lg border bg-primary/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Premium</span>
                      <Badge variant="default">{subscriptionStats.premium.count} schools</Badge>
                    </div>
                    <p className="text-2xl font-bold">${(subscriptionStats.premium.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-muted-foreground mt-1">{subscriptionStats.premium.percentage}% of total</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-chart-2/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Standard</span>
                      <Badge variant="secondary">{subscriptionStats.standard.count} schools</Badge>
                    </div>
                    <p className="text-2xl font-bold">${(subscriptionStats.standard.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-muted-foreground mt-1">{subscriptionStats.standard.percentage}% of total</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-muted">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Basic</span>
                      <Badge variant="outline">{subscriptionStats.basic.count} schools</Badge>
                    </div>
                    <p className="text-2xl font-bold">${(subscriptionStats.basic.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-muted-foreground mt-1">{subscriptionStats.basic.percentage}% of total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* School Performance */}
            <Card>
              <CardHeader>
                <CardTitle>School Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schoolPerformance.map((school, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold">{school.name}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {school.students} students
                            </span>
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {school.teachers} teachers
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              ${school.revenue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {school.growth > 0 ? (
                            <div className="flex items-center gap-1 text-chart-2">
                              <TrendingUp className="h-4 w-4" />
                              <span className="font-medium">+{school.growth}%</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-destructive">
                              <TrendingDown className="h-4 w-4" />
                              <span className="font-medium">{school.growth}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Daily Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{engagementMetrics.dailyActiveUsers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Average per day</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Weekly Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{engagementMetrics.weeklyActiveUsers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Monthly Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{engagementMetrics.monthlyActiveUsers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Retention Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{engagementMetrics.retentionRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">User retention</p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}





