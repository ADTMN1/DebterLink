import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AssignmentCard } from "@/components/AssignmentCard";
import { GradeChart } from "@/components/GradeChart";
import { CalendarWidget } from "@/components/CalendarWidget";
import { BehaviorLog } from "@/components/BehaviorLog";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Trophy } from "lucide-react";
import { addDays } from "date-fns";
import studentAvatar from "@assets/generated_images/ethiopian_teacher_with_technology.png";

export default function StudentDashboard() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
  };

  const mockAssignments = [
    {
      id: "1",
      title: "Math Homework Chapter 5",
      subject: "Mathematics",
      dueDate: addDays(new Date(), 2),
      status: "pending" as const,
    },
    {
      id: "2",
      title: "Science Lab Report",
      subject: "Science",
      dueDate: addDays(new Date(), 5),
      status: "submitted" as const,
    },
    {
      id: "3",
      title: "English Essay",
      subject: "English",
      dueDate: addDays(new Date(), -2),
      status: "graded" as const,
      grade: 88,
      maxGrade: 100,
    },
  ];

  const mockGradeData = [
    { month: "Sep", average: 78, classAverage: 75 },
    { month: "Oct", average: 82, classAverage: 76 },
    { month: "Nov", average: 85, classAverage: 78 },
    { month: "Dec", average: 88, classAverage: 80 },
  ];

  const mockBehaviorEntries = [
    {
      id: "1",
      type: "award" as const,
      title: "Perfect Attendance",
      description: "Achieved perfect attendance for the month",
      date: new Date(),
      points: 50,
    },
    {
      id: "2",
      type: "positive" as const,
      title: "Helped Classmate",
      description: "Assisted peer with difficult math problem",
      date: addDays(new Date(), -2),
      points: 10,
    },
  ];

  const mockEvents = [
    { date: addDays(new Date(), 3), title: "Math Exam", type: "exam" as const },
    { date: addDays(new Date(), 5), title: "Science Fair", type: "event" as const },
  ];

  const subjects = [
    { name: "Mathematics", grade: 88, color: "bg-chart-1" },
    { name: "Science", grade: 85, color: "bg-chart-2" },
    { name: "English", grade: 92, color: "bg-chart-3" },
    { name: "History", grade: 78, color: "bg-chart-4" },
  ];

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="student" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6 space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-chart-2/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage src={studentAvatar} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      DM
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <h1 className="text-3xl font-serif font-bold">Dawit Mengistu</h1>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">Grade 10-A</Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Trophy className="h-3 w-3" />
                        245 Points
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">Keep up the great work! You're doing amazing this semester.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card data-testid="card-subjects">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Subject Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subjects.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{subject.name}</span>
                        <span className="text-muted-foreground">{subject.grade}%</span>
                      </div>
                      <Progress value={subject.grade} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <CalendarWidget events={mockEvents} />
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">My Assignments</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockAssignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <GradeChart data={mockGradeData} title="My Performance Trend" />
              <BehaviorLog entries={mockBehaviorEntries} totalPoints={245} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
