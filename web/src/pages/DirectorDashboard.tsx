import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StatCard } from "@/components/StatCard";
import { AppealCard } from "@/components/AppealCard";
import { GradeChart } from "@/components/GradeChart";
import { CalendarWidget } from "@/components/CalendarWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  ClipboardList, 
  TrendingUp, 
  AlertCircle,
  GraduationCap,
  Award,
  BarChart3
} from "lucide-react";
import { addDays } from "date-fns";

export default function DirectorDashboard() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
  };

  const mockAppeals = [
    {
      id: "1",
      title: "Grade Appeal - Mathematics",
      submittedBy: "Parent: Alemayehu Bekele",
      submittedDate: addDays(new Date(), -2),
      status: "open" as const,
      priority: "high" as const,
      commentsCount: 3,
    },
    {
      id: "2",
      title: "Attendance Dispute",
      submittedBy: "Parent: Tigist Haile",
      submittedDate: addDays(new Date(), -5),
      status: "in-review" as const,
      priority: "medium" as const,
      commentsCount: 5,
    },
    {
      id: "3",
      title: "Behavior Incident Review",
      submittedBy: "Teacher: Yonas Tadesse",
      submittedDate: addDays(new Date(), -1),
      status: "open" as const,
      priority: "high" as const,
      commentsCount: 2,
    },
  ];

  const mockTeacherPerformance = [
    {
      id: "1",
      name: "Yonas Tadesse",
      subject: "Mathematics",
      students: 45,
      avgGrade: 85,
      attendance: 94,
      satisfaction: 4.8,
    },
    {
      id: "2",
      name: "Marta Alemu",
      subject: "Science",
      students: 42,
      avgGrade: 82,
      attendance: 91,
      satisfaction: 4.6,
    },
    {
      id: "3",
      name: "Dawit Bekele",
      subject: "English",
      students: 48,
      avgGrade: 88,
      attendance: 96,
      satisfaction: 4.9,
    },
    {
      id: "4",
      name: "Tigist Haile",
      subject: "History",
      students: 40,
      avgGrade: 79,
      attendance: 89,
      satisfaction: 4.4,
    },
  ];

  const mockAttendanceTrend = [
    { month: "Sep", value: 88 },
    { month: "Oct", value: 91 },
    { month: "Nov", value: 93 },
    { month: "Dec", value: 94 },
  ];

  const mockGradeDistribution = [
    { month: "Sep", average: 78, classAverage: 75 },
    { month: "Oct", average: 81, classAverage: 77 },
    { month: "Nov", average: 84, classAverage: 79 },
    { month: "Dec", average: 86, classAverage: 81 },
  ];

  const mockEvents = [
    { date: addDays(new Date(), 3), title: "Parent-Teacher Meeting", type: "event" as const },
    { date: addDays(new Date(), 7), title: "End of Semester Exams", type: "exam" as const },
    { date: addDays(new Date(), 10), title: "School Assembly", type: "event" as const },
  ];

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="director" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6 space-y-6">
            {/* School Overview Hero Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-chart-2/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-serif font-bold">Addis Ababa Secondary School</h1>
                    <p className="text-muted-foreground">School Director Dashboard</p>
                    <div className="flex items-center gap-4 mt-4">
                      <Badge variant="secondary" className="gap-2">
                        <GraduationCap className="h-4 w-4" />
                        1,245 Students
                      </Badge>
                      <Badge variant="secondary" className="gap-2">
                        <Users className="h-4 w-4" />
                        48 Teachers
                      </Badge>
                      <Badge variant="secondary" className="gap-2">
                        <Award className="h-4 w-4" />
                        24 Classes
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-3">
              <StatCard
                title="Overall Attendance"
                value="94%"
                icon={ClipboardList}
                trend={{ value: 3, positive: true }}
                iconColor="text-chart-2"
              />
              <StatCard
                title="Average Grades"
                value="86%"
                icon={TrendingUp}
                trend={{ value: 2, positive: true }}
                iconColor="text-chart-1"
              />
              <StatCard
                title="Behavior Score"
                value="4.7/5"
                icon={Award}
                trend={{ value: 0.2, positive: true }}
                iconColor="text-chart-3"
              />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              <GradeChart 
                data={mockAttendanceTrend.map(d => ({ month: d.month, average: d.value, classAverage: d.value - 2 }))} 
                title="Attendance Trends" 
              />
              <GradeChart 
                data={mockGradeDistribution} 
                title="Grade Distribution" 
              />
            </div>

            {/* Appeals and Calendar Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Recent Appeals & Complaints
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockAppeals.map((appeal) => (
                    <AppealCard key={appeal.id} appeal={appeal} />
                  ))}
                </CardContent>
              </Card>
              <CalendarWidget events={mockEvents} />
            </div>

            {/* Teacher Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Teacher Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Avg Grade</TableHead>
                      <TableHead>Attendance %</TableHead>
                      <TableHead>Satisfaction</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTeacherPerformance.map((teacher) => {
                      const performanceScore = (teacher.avgGrade * 0.4 + teacher.attendance * 0.3 + teacher.satisfaction * 20 * 0.3);
                      return (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell>{teacher.subject}</TableCell>
                          <TableCell>{teacher.students}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{teacher.avgGrade}%</span>
                              <Progress value={teacher.avgGrade} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{teacher.attendance}%</span>
                              <Progress value={teacher.attendance} className="w-16 h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{teacher.satisfaction}/5.0</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={performanceScore >= 85 ? "default" : performanceScore >= 75 ? "secondary" : "outline"}
                            >
                              {performanceScore.toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}


