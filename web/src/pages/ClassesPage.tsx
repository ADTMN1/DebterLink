import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Plus,
  Search,
  Filter,
  Users,
  BookOpen,
  Calendar,
  Edit,
  Trash2,
  MoreHorizontal,
  UserPlus
} from "lucide-react";
import { useState } from "react";

export default function ClassesPage() {
  const sidebarStyle = { "--sidebar-width": "16rem" };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");

  const mockClasses = [
    {
      id: "1",
      name: "Grade 10-A",
      grade: "10",
      section: "A",
      teacher: "Yonas Tadesse",
      students: 45,
      capacity: 50,
      subjects: ["Mathematics", "Science", "English", "History"],
      room: "Room 101",
      schedule: "Mon-Fri 8:00 AM - 3:00 PM",
    },
    {
      id: "2",
      name: "Grade 10-B",
      grade: "10",
      section: "B",
      teacher: "Marta Alemu",
      students: 42,
      capacity: 50,
      subjects: ["Mathematics", "Science", "English", "History"],
      room: "Room 102",
      schedule: "Mon-Fri 8:00 AM - 3:00 PM",
    },
    {
      id: "3",
      name: "Grade 11-A",
      grade: "11",
      section: "A",
      teacher: "Dawit Bekele",
      students: 38,
      capacity: 50,
      subjects: ["Mathematics", "Physics", "Chemistry", "English"],
      room: "Room 201",
      schedule: "Mon-Fri 8:00 AM - 3:00 PM",
    },
    {
      id: "4",
      name: "Grade 11-B",
      grade: "11",
      section: "B",
      teacher: "Tigist Haile",
      students: 40,
      capacity: 50,
      subjects: ["Mathematics", "Physics", "Chemistry", "English"],
      room: "Room 202",
      schedule: "Mon-Fri 8:00 AM - 3:00 PM",
    },
    {
      id: "5",
      name: "Grade 12-A",
      grade: "12",
      section: "A",
      teacher: "Yonas Tadesse",
      students: 35,
      capacity: 50,
      subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
      room: "Room 301",
      schedule: "Mon-Fri 8:00 AM - 3:00 PM",
    },
  ];

  const stats = {
    total: mockClasses.length,
    totalStudents: mockClasses.reduce((acc, c) => acc + c.students, 0),
    totalCapacity: mockClasses.reduce((acc, c) => acc + c.capacity, 0),
    averageClassSize: Math.round(mockClasses.reduce((acc, c) => acc + c.students, 0) / mockClasses.length),
  };

  const filteredClasses = mockClasses.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === "all" || c.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

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
                <h1 className="text-3xl font-serif font-bold">Class Management</h1>
                <p className="text-muted-foreground">Manage classes, sections, and student assignments</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Class
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Class</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Grade</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9">Grade 9</SelectItem>
                            <SelectItem value="10">Grade 10</SelectItem>
                            <SelectItem value="11">Grade 11</SelectItem>
                            <SelectItem value="12">Grade 12</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Section</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Section A</SelectItem>
                            <SelectItem value="B">Section B</SelectItem>
                            <SelectItem value="C">Section C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Class Teacher</Label>
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
                      <Label>Room Number</Label>
                      <Input placeholder="e.g., Room 101" />
                    </div>
                    <div>
                      <Label>Capacity</Label>
                      <Input type="number" placeholder="Maximum students" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Create Class</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Classes</p>
                      <p className="text-3xl font-bold">{stats.total}</p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                      <p className="text-3xl font-bold">{stats.totalStudents}</p>
                    </div>
                    <Users className="h-8 w-8 text-chart-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Avg Class Size</p>
                      <p className="text-3xl font-bold">{stats.averageClassSize}</p>
                    </div>
                    <Users className="h-8 w-8 text-chart-1" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Capacity</p>
                      <p className="text-3xl font-bold">{stats.totalCapacity}</p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-chart-3" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search classes..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Grades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      <SelectItem value="9">Grade 9</SelectItem>
                      <SelectItem value="10">Grade 10</SelectItem>
                      <SelectItem value="11">Grade 11</SelectItem>
                      <SelectItem value="12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Classes Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((classItem) => {
                const occupancyRate = (classItem.students / classItem.capacity) * 100;
                return (
                  <Card key={classItem.id} className="hover-elevate transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{classItem.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{classItem.room}</p>
                        </div>
                        <Badge variant="secondary">{classItem.grade}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Class Teacher</span>
                          <span className="font-medium">{classItem.teacher}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Students</span>
                          <span className="font-medium">
                            {classItem.students}/{classItem.capacity}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Occupancy</span>
                            <span className="font-medium">{occupancyRate.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                occupancyRate >= 90
                                  ? "bg-destructive"
                                  : occupancyRate >= 70
                                  ? "bg-chart-4"
                                  : "bg-chart-2"
                              }`}
                              style={{ width: `${occupancyRate}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Subjects</p>
                        <div className="flex flex-wrap gap-1">
                          {classItem.subjects.slice(0, 3).map((subject, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                          {classItem.subjects.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{classItem.subjects.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{classItem.schedule}</span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Users className="h-4 w-4 mr-2" />
                          View Students
                        </Button>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}





