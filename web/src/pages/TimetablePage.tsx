import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Plus,
  Search,
  Filter,
  Clock,
  GraduationCap,
  Users,
  Edit,
  Trash2,
  Download,
  Upload
} from "lucide-react";
import { useState } from "react";

export default function TimetablePage() {
  const sidebarStyle = { "--sidebar-width": "16rem" };
  const [selectedClass, setSelectedClass] = useState("10-A");
  const [selectedDay, setSelectedDay] = useState("monday");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = [
    { time: "08:00 - 08:45", period: 1 },
    { time: "08:45 - 09:30", period: 2 },
    { time: "09:30 - 10:15", period: 3 },
    { time: "10:15 - 10:30", period: "Break" },
    { time: "10:30 - 11:15", period: 4 },
    { time: "11:15 - 12:00", period: 5 },
    { time: "12:00 - 12:45", period: 6 },
    { time: "12:45 - 13:30", period: "Lunch" },
    { time: "13:30 - 14:15", period: 7 },
    { time: "14:15 - 15:00", period: 8 },
  ];

  const mockTimetable = {
    "monday": [
      { period: 1, subject: "Mathematics", teacher: "Yonas Tadesse", room: "101" },
      { period: 2, subject: "Science", teacher: "Marta Alemu", room: "Lab 1" },
      { period: 3, subject: "English", teacher: "Dawit Bekele", room: "102" },
      { period: 4, subject: "History", teacher: "Tigist Haile", room: "103" },
      { period: 5, subject: "Mathematics", teacher: "Yonas Tadesse", room: "101" },
      { period: 6, subject: "Physical Education", teacher: "Hanna Alemu", room: "Gym" },
      { period: 7, subject: "Science", teacher: "Marta Alemu", room: "Lab 1" },
      { period: 8, subject: "English", teacher: "Dawit Bekele", room: "102" },
    ],
    "tuesday": [
      { period: 1, subject: "Science", teacher: "Marta Alemu", room: "Lab 1" },
      { period: 2, subject: "Mathematics", teacher: "Yonas Tadesse", room: "101" },
      { period: 3, subject: "History", teacher: "Tigist Haile", room: "103" },
      { period: 4, subject: "English", teacher: "Dawit Bekele", room: "102" },
      { period: 5, subject: "Mathematics", teacher: "Yonas Tadesse", room: "101" },
      { period: 6, subject: "Art", teacher: "Sara Bekele", room: "Art Room" },
      { period: 7, subject: "Science", teacher: "Marta Alemu", room: "Lab 1" },
      { period: 8, subject: "History", teacher: "Tigist Haile", room: "103" },
    ],
  };

  const currentDaySchedule = mockTimetable[selectedDay as keyof typeof mockTimetable] || [];

  const subjectColors: Record<string, string> = {
    "Mathematics": "bg-chart-1/10 text-chart-1 border-chart-1/20",
    "Science": "bg-chart-2/10 text-chart-2 border-chart-2/20",
    "English": "bg-chart-3/10 text-chart-3 border-chart-3/20",
    "History": "bg-chart-4/10 text-chart-4 border-chart-4/20",
    "Physical Education": "bg-primary/10 text-primary border-primary/20",
    "Art": "bg-chart-5/10 text-chart-5 border-chart-5/20",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="administrator" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-serif font-bold">Timetable Management</h1>
                <p className="text-muted-foreground">Create and manage class schedules</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Schedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Schedule Entry</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Class</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10-A">Grade 10-A</SelectItem>
                              <SelectItem value="10-B">Grade 10-B</SelectItem>
                              <SelectItem value="11-A">Grade 11-A</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Day</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              {days.map(day => (
                                <SelectItem key={day} value={day.toLowerCase()}>{day}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Period</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                              {periods.filter(p => typeof p.period === 'number').map(p => (
                                <SelectItem key={p.period} value={p.period.toString()}>
                                  Period {p.period}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Subject</Label>
                          <Input placeholder="Subject name" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Teacher</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Yonas Tadesse</SelectItem>
                              <SelectItem value="2">Marta Alemu</SelectItem>
                              <SelectItem value="3">Dawit Bekele</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Room</Label>
                          <Input placeholder="Room number" />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Create Schedule</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10-A">Grade 10-A</SelectItem>
                      <SelectItem value="10-B">Grade 10-B</SelectItem>
                      <SelectItem value="11-A">Grade 11-A</SelectItem>
                      <SelectItem value="11-B">Grade 11-B</SelectItem>
                      <SelectItem value="12-A">Grade 12-A</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(day => (
                        <SelectItem key={day} value={day.toLowerCase()}>{day}</SelectItem>
                      ))}
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

            {/* Timetable View */}
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Day Selector */}
              <Card>
                <CardHeader>
                  <CardTitle>Days</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {days.map((day) => (
                    <Button
                      key={day}
                      variant={selectedDay === day.toLowerCase() ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedDay(day.toLowerCase())}
                    >
                      {day}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card className="lg:col-span-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedClass} - {days.find(d => d.toLowerCase() === selectedDay)}</CardTitle>
                    <Badge variant="secondary">{currentDaySchedule.length} periods</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {periods.map((periodItem, index) => {
                      if (typeof periodItem.period === 'string') {
                        return (
                          <div key={index} className="flex items-center gap-4 py-2">
                            <div className="w-32 text-sm font-medium text-muted-foreground">
                              {periodItem.time}
                            </div>
                            <div className="flex-1 text-center">
                              <Badge variant="outline" className="text-lg px-4 py-2">
                                {periodItem.period}
                              </Badge>
                            </div>
                          </div>
                        );
                      }

                      const schedule = currentDaySchedule.find(s => s.period === periodItem.period);
                      return (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-32 text-sm font-medium">
                            {periodItem.time}
                          </div>
                          {schedule ? (
                            <div className={`flex-1 p-4 rounded-lg border ${subjectColors[schedule.subject] || "bg-muted"}`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-semibold">{schedule.subject}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {schedule.teacher}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <GraduationCap className="h-3 w-3" />
                                      {schedule.room}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 p-4 rounded-lg border border-dashed text-center text-muted-foreground">
                              Free Period
                            </div>
                          )}
                        </div>
                      );
                    })}
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





