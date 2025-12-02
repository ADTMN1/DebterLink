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
import { Check, X, Clock, Search, Filter, Download, Upload, Calendar, TrendingUp, Users, AlertCircle } from "lucide-react";
import { useState } from "react";
import { format, addDays, subDays, startOfWeek, endOfWeek } from "date-fns";
import { GradeChart } from "@/components/GradeChart";
import { Progress } from "@/components/ui/progress";

export default function AttendancePage() {
  const sidebarStyle = { "--sidebar-width": "16rem" };
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const mockStudents = [
    { id: "1", name: "Abebe Tadesse", rollNumber: "001", status: "present" as const, time: "08:15" },
    { id: "2", name: "Tigist Haile", rollNumber: "002", status: "late" as const, time: "08:45" },
    { id: "3", name: "Dawit Bekele", rollNumber: "003", status: "present" as const, time: "08:10" },
    { id: "4", name: "Marta Alemu", rollNumber: "004", status: "absent" as const, time: null },
    { id: "5", name: "Yonas Tadesse", rollNumber: "005", status: "present" as const, time: "08:20" },
    { id: "6", name: "Sara Bekele", rollNumber: "006", status: "present" as const, time: "08:12" },
    { id: "7", name: "Hanna Alemu", rollNumber: "007", status: "late" as const, time: "08:50" },
    { id: "8", name: "Daniel Mengistu", rollNumber: "008", status: "present" as const, time: "08:18" },
  ];

  const weeklyData = [
    { day: "Mon", present: 42, absent: 3, late: 2 },
    { day: "Tue", present: 44, absent: 1, late: 2 },
    { day: "Wed", present: 43, absent: 2, late: 2 },
    { day: "Thu", present: 45, absent: 0, late: 2 },
    { day: "Fri", present: 44, absent: 1, late: 2 },
  ];

  const monthlyTrend = [
    { month: "Sep", value: 88 },
    { month: "Oct", value: 91 },
    { month: "Nov", value: 93 },
    { month: "Dec", value: 94 },
  ];

  const stats = {
    present: mockStudents.filter(s => s.status === "present").length,
    absent: mockStudents.filter(s => s.status === "absent").length,
    late: mockStudents.filter(s => s.status === "late").length,
    total: mockStudents.length,
    percentage: Math.round((mockStudents.filter(s => s.status === "present").length / mockStudents.length) * 100),
  };

  const filteredStudents = mockStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber.includes(searchQuery)
  );

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
                <h1 className="text-3xl font-serif font-bold">Attendance Management</h1>
                <p className="text-muted-foreground">Track and manage student attendance in real-time</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Mark Today
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Present</p>
                      <p className="text-3xl font-bold">{stats.present}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stats.percentage}% of class</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-chart-2/20 flex items-center justify-center">
                      <Check className="h-6 w-6 text-chart-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Absent</p>
                      <p className="text-3xl font-bold">{stats.absent}</p>
                      <p className="text-xs text-muted-foreground mt-1">Need attention</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center">
                      <X className="h-6 w-6 text-destructive" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Late</p>
                      <p className="text-3xl font-bold">{stats.late}</p>
                      <p className="text-xs text-muted-foreground mt-1">Arrived late</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-chart-4/20 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-chart-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                      <p className="text-3xl font-bold">{stats.total}</p>
                      <p className="text-xs text-muted-foreground mt-1">Class size</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or roll number..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="10a">Grade 10-A</SelectItem>
                      <SelectItem value="10b">Grade 10-B</SelectItem>
                      <SelectItem value="11a">Grade 11-A</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={format(selectedDate, "yyyy-MM-dd")}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-48"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Attendance Table */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Student Attendance - {format(selectedDate, "MMMM dd, yyyy")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Roll No.</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.rollNumber}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                student.status === "present"
                                  ? "default"
                                  : student.status === "late"
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="gap-1"
                            >
                              {student.status === "present" && <Check className="h-3 w-3" />}
                              {student.status === "late" && <Clock className="h-3 w-3" />}
                              {student.status === "absent" && <X className="h-3 w-3" />}
                              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {student.time || "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0"
                                onClick={() => console.log("Mark present:", student.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0"
                                onClick={() => console.log("Mark late:", student.id)}
                              >
                                <Clock className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0"
                                onClick={() => console.log("Mark absent:", student.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Weekly Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {weeklyData.map((day, index) => {
                    const total = day.present + day.absent + day.late;
                    const percentage = Math.round((day.present / total) * 100);
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{day.day}</span>
                          <span className="text-muted-foreground">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>✓ {day.present}</span>
                          <span>✗ {day.absent}</span>
                          <span>⏰ {day.late}</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Monthly Attendance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <GradeChart
                    data={monthlyTrend.map(d => ({ month: d.month, average: d.value, classAverage: d.value - 2 }))}
                    title="Attendance Percentage"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Attendance Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Marta Alemu - Absent Today</p>
                      <p className="text-xs text-muted-foreground">Parent notification sent</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-chart-4/20 bg-chart-4/5">
                    <Clock className="h-5 w-5 text-chart-4" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">2 Students Late This Week</p>
                      <p className="text-xs text-muted-foreground">Tigist Haile, Hanna Alemu</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-chart-2/20 bg-chart-2/5">
                    <TrendingUp className="h-5 w-5 text-chart-2" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Attendance Improved 3%</p>
                      <p className="text-xs text-muted-foreground">Compared to last week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}





