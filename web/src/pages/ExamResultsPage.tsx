import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GradeChart } from "@/components/GradeChart";
import { 
  BarChart3, 
  Download, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Award,
  AlertCircle,
  Search,
  Filter,
  Printer
} from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function ExamResultsPage() {
  const sidebarStyle = { "--sidebar-width": "16rem" };
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedExam, setSelectedExam] = useState("midterm");

  const mockResults = [
    { id: "1", name: "Abebe Tadesse", math: 92, science: 88, english: 85, history: 90, average: 88.75, rank: 1 },
    { id: "2", name: "Tigist Haile", math: 85, science: 90, english: 88, history: 82, average: 86.25, rank: 2 },
    { id: "3", name: "Dawit Bekele", math: 88, science: 85, english: 92, history: 85, average: 87.5, rank: 3 },
    { id: "4", name: "Marta Alemu", math: 78, science: 82, english: 80, history: 75, average: 78.75, rank: 15 },
    { id: "5", name: "Yonas Tadesse", math: 90, science: 88, english: 85, history: 88, average: 87.75, rank: 4 },
    { id: "6", name: "Sara Bekele", math: 82, science: 85, english: 88, history: 80, average: 83.75, rank: 8 },
  ];

  const subjectStats = {
    math: { average: 85.8, highest: 92, lowest: 78, passRate: 95 },
    science: { average: 86.3, highest: 90, lowest: 82, passRate: 98 },
    english: { average: 86.3, highest: 92, lowest: 80, passRate: 100 },
    history: { average: 83.3, highest: 90, lowest: 75, passRate: 92 },
  };

  const overallStats = {
    totalStudents: 45,
    averageScore: 85.2,
    passRate: 96,
    topPerformer: "Abebe Tadesse",
    improvement: 3.5,
  };

  const gradeDistribution = [
    { range: "90-100", count: 12, percentage: 27 },
    { range: "80-89", count: 20, percentage: 44 },
    { range: "70-79", count: 10, percentage: 22 },
    { range: "60-69", count: 2, percentage: 4 },
    { range: "Below 60", count: 1, percentage: 2 },
  ];

  const trendData = [
    { month: "Sep", average: 78, classAverage: 75 },
    { month: "Oct", average: 81, classAverage: 77 },
    { month: "Nov", average: 84, classAverage: 79 },
    { month: "Dec", average: 85, classAverage: 81 },
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
                <h1 className="text-3xl font-serif font-bold">Exam Results & Grades</h1>
                <p className="text-muted-foreground">Comprehensive grade analytics and performance tracking</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>

            {/* Overall Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Class Average</p>
                      <p className="text-3xl font-bold">{overallStats.averageScore}%</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-chart-2" />
                        <span className="text-xs text-chart-2">+{overallStats.improvement}%</span>
                      </div>
                    </div>
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Pass Rate</p>
                      <p className="text-3xl font-bold">{overallStats.passRate}%</p>
                      <p className="text-xs text-muted-foreground mt-1">43 of {overallStats.totalStudents} passed</p>
                    </div>
                    <Award className="h-8 w-8 text-chart-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Top Performer</p>
                      <p className="text-lg font-bold">{overallStats.topPerformer}</p>
                      <p className="text-xs text-muted-foreground mt-1">Rank #1</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-chart-1" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                      <p className="text-3xl font-bold">{overallStats.totalStudents}</p>
                      <p className="text-xs text-muted-foreground mt-1">All classes</p>
                    </div>
                    <FileText className="h-8 w-8 text-chart-4" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Select value={selectedExam} onValueChange={setSelectedExam}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="midterm">Midterm Exam</SelectItem>
                      <SelectItem value="final">Final Exam</SelectItem>
                      <SelectItem value="quiz1">Quiz 1</SelectItem>
                      <SelectItem value="quiz2">Quiz 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex-1" />
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Results Table */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Student Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Math</TableHead>
                        <TableHead>Science</TableHead>
                        <TableHead>English</TableHead>
                        <TableHead>History</TableHead>
                        <TableHead className="font-bold">Average</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockResults.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Badge variant={student.rank <= 3 ? "default" : "secondary"}>
                              #{student.rank}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.math}</TableCell>
                          <TableCell>{student.science}</TableCell>
                          <TableCell>{student.english}</TableCell>
                          <TableCell>{student.history}</TableCell>
                          <TableCell className="font-bold text-primary">{student.average.toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Subject Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(subjectStats).map(([subject, stats]) => (
                    <div key={subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{subject}</span>
                        <span className="text-sm text-muted-foreground">{stats.average}%</span>
                      </div>
                      <Progress value={stats.average} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>High: {stats.highest}%</span>
                        <span>Low: {stats.lowest}%</span>
                        <span>Pass: {stats.passRate}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <GradeChart data={trendData} title="Monthly Average" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {gradeDistribution.map((grade, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{grade.range}</span>
                        <span className="text-muted-foreground">{grade.count} students ({grade.percentage}%)</span>
                      </div>
                      <Progress value={grade.percentage} className="h-3" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Performance Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Marta Alemu - Below Average</p>
                    <p className="text-xs text-muted-foreground">Average: 78.75% (Class avg: 85.2%)</p>
                  </div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-chart-2/20 bg-chart-2/5">
                  <TrendingUp className="h-5 w-5 text-chart-2" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Class Performance Improved</p>
                    <p className="text-xs text-muted-foreground">Average increased by 3.5% compared to last exam</p>
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





