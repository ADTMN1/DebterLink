import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StatCard } from "@/components/StatCard";
import { AttendanceWidget } from "@/components/AttendanceWidget";
import { AssignmentCard } from "@/components/AssignmentCard";
import { AIAlert } from "@/components/AIAlert";
import { GradeChart } from "@/components/GradeChart";
import { CalendarWidget } from "@/components/CalendarWidget";
import { Users, ClipboardList, FileText, TrendingUp } from "lucide-react";
import { addDays } from "date-fns";

export default function TeacherDashboard() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
  };

  const mockStudents = [
    { id: "1", name: "Abebe Tadesse", status: null as any },
    { id: "2", name: "Tigist Haile", status: null as any },
    { id: "3", name: "Dawit Bekele", status: null as any },
    { id: "4", name: "Marta Alemu", status: null as any },
  ];

  const mockAssignments = [
    {
      id: "1",
      title: "Algebra Problem Set 5",
      subject: "Mathematics",
      dueDate: addDays(new Date(), 2),
      status: "pending" as const,
    },
    {
      id: "2",
      title: "Essay on Ethiopian History",
      subject: "History",
      dueDate: addDays(new Date(), -1),
      status: "late" as const,
    },
  ];

  const mockGradeData = [
    { month: "Sep", average: 75, classAverage: 72 },
    { month: "Oct", average: 78, classAverage: 74 },
    { month: "Nov", average: 82, classAverage: 76 },
    { month: "Dec", average: 85, classAverage: 78 },
  ];

  const mockEvents = [
    { date: addDays(new Date(), 3), title: "Math Exam", type: "exam" as const },
    { date: addDays(new Date(), 7), title: "Parent Meeting", type: "event" as const },
  ];

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="teacher" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Teacher Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your overview for today.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Students"
                value={156}
                icon={Users}
                trend={{ value: 5, positive: true }}
              />
              <StatCard
                title="Today's Attendance"
                value="94%"
                icon={ClipboardList}
                trend={{ value: 2, positive: true }}
                iconColor="text-chart-2"
              />
              <StatCard
                title="Pending Assignments"
                value={23}
                icon={FileText}
                iconColor="text-chart-4"
              />
              <StatCard
                title="Class Average"
                value="82%"
                icon={TrendingUp}
                trend={{ value: 3, positive: true }}
                iconColor="text-chart-1"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <AIAlert
                student={{ name: "Abebe Tadesse", id: "1" }}
                predictionType="academic-risk"
                confidence={87}
                suggestions={[
                  "Schedule one-on-one tutoring session",
                  "Notify parents about recent performance drop",
                  "Consider additional practice materials",
                ]}
              />
              <AttendanceWidget students={mockStudents} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {mockAssignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
              <CalendarWidget events={mockEvents} />
            </div>

            <GradeChart data={mockGradeData} title="Class Performance Trend" />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
