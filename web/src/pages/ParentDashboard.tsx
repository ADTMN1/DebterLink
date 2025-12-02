import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GradeChart } from "@/components/GradeChart";
import { BehaviorLog } from "@/components/BehaviorLog";
import { MessageThread } from "@/components/MessageThread";
import { Progress } from "@/components/ui/progress";
import { Calendar, GraduationCap, TrendingUp } from "lucide-react";
import { addDays } from "date-fns";
import { useState } from "react";

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState("1");

  const sidebarStyle = {
    "--sidebar-width": "16rem",
  };

  const mockGradeData = [
    { month: "Sep", average: 78, classAverage: 75 },
    { month: "Oct", average: 82, classAverage: 76 },
    { month: "Nov", average: 85, classAverage: 78 },
    { month: "Dec", average: 88, classAverage: 80 },
  ];

  const mockBehaviorEntries = [
    {
      id: "1",
      type: "positive" as const,
      title: "Excellent Participation",
      description: "Actively participated in class discussion",
      date: new Date(),
      points: 15,
    },
    {
      id: "2",
      type: "award" as const,
      title: "Perfect Attendance",
      description: "No absences this month",
      date: addDays(new Date(), -3),
      points: 50,
    },
  ];

  const mockMessages = [
    {
      id: "1",
      sender: { name: "Mrs. Almaz", avatar: "", role: "Mathematics Teacher" },
      content: "Hello! I wanted to discuss Dawit's recent progress in class.",
      timestamp: new Date(),
      isOwn: false,
    },
    {
      id: "2",
      sender: { name: "You", avatar: "", role: "Parent" },
      content: "Thank you for reaching out. I'd love to hear about his progress!",
      timestamp: addDays(new Date(), 0.5),
      isOwn: true,
    },
  ];

  const attendanceData = [
    { day: "Mon", present: true },
    { day: "Tue", present: true },
    { day: "Wed", present: false },
    { day: "Thu", present: true },
    { day: "Fri", present: true },
  ];

  const attendanceRate = (attendanceData.filter(d => d.present).length / attendanceData.length) * 100;

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="parent" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-serif font-bold mb-2">Parent Dashboard</h1>
                <p className="text-muted-foreground">Monitor your child's academic journey</p>
              </div>
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger className="w-48" data-testid="select-child">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Dawit Mengistu</SelectItem>
                  <SelectItem value="2">Marta Mengistu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="bg-gradient-to-br from-primary/10 to-chart-2/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 border-4 border-background">
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      DM
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-2">Dawit Mengistu</h2>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Grade Level</p>
                        <p className="text-lg font-semibold">10-A</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Overall Average</p>
                        <p className="text-lg font-semibold">85%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Attendance Rate</p>
                        <p className="text-lg font-semibold">{attendanceRate.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card data-testid="card-attendance-overview">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5" />
                    This Week's Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {attendanceData.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{day.day}</span>
                      <div className={`w-3 h-3 rounded-full ${day.present ? 'bg-chart-2' : 'bg-destructive'}`} />
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Attendance Rate</p>
                    <Progress value={attendanceRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-recent-grades">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <GraduationCap className="h-5 w-5" />
                    Recent Grades
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { subject: "Mathematics", grade: 88, color: "bg-chart-1" },
                    { subject: "Science", grade: 85, color: "bg-chart-2" },
                    { subject: "English", grade: 92, color: "bg-chart-3" },
                    { subject: "History", grade: 78, color: "bg-chart-4" },
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.subject}</span>
                        <span className="text-muted-foreground">{item.grade}%</span>
                      </div>
                      <Progress value={item.grade} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card data-testid="card-behavior-summary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5" />
                    Behavior Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Points</span>
                    <span className="text-2xl font-bold text-primary">245</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Positive Actions</span>
                      <span className="font-medium text-chart-2">12</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Awards Received</span>
                      <span className="font-medium text-chart-4">3</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Incidents</span>
                      <span className="font-medium">0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <GradeChart data={mockGradeData} title="Performance Trend" />
              <BehaviorLog entries={mockBehaviorEntries} totalPoints={245} />
            </div>

            <MessageThread
              messages={mockMessages}
              recipient={{ name: "Mrs. Almaz", avatar: "", role: "Mathematics Teacher" }}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
