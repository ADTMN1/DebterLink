import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssignmentCard } from "@/components/AssignmentCard";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Upload, 
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Users,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { format, addDays } from "date-fns";
import { Progress } from "@/components/ui/progress";

export default function AssignmentsPage() {
  const sidebarStyle = { "--sidebar-width": "16rem" };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const mockAssignments = [
    {
      id: "1",
      title: "Algebra Problem Set 5",
      subject: "Mathematics",
      dueDate: addDays(new Date(), 2),
      status: "pending" as const,
      submissions: 32,
      totalStudents: 45,
      description: "Complete problems 1-20 from Chapter 5. Show all work.",
    },
    {
      id: "2",
      title: "Essay on Ethiopian History",
      subject: "History",
      dueDate: addDays(new Date(), -1),
      status: "late" as const,
      submissions: 28,
      totalStudents: 45,
      description: "Write a 1000-word essay on the Battle of Adwa.",
    },
    {
      id: "3",
      title: "Science Lab Report",
      subject: "Science",
      dueDate: addDays(new Date(), 5),
      status: "submitted" as const,
      submissions: 45,
      totalStudents: 45,
      description: "Complete lab report for the photosynthesis experiment.",
    },
    {
      id: "4",
      title: "English Creative Writing",
      subject: "English",
      dueDate: addDays(new Date(), 7),
      status: "pending" as const,
      submissions: 15,
      totalStudents: 45,
      description: "Write a short story (500 words) about a day in your life.",
    },
    {
      id: "5",
      title: "Physics Calculations",
      subject: "Physics",
      dueDate: addDays(new Date(), -3),
      status: "graded" as const,
      grade: 88,
      maxGrade: 100,
      submissions: 42,
      totalStudents: 45,
      description: "Solve problems on Newton's laws of motion.",
    },
  ];

  const stats = {
    total: mockAssignments.length,
    pending: mockAssignments.filter(a => a.status === "pending").length,
    submitted: mockAssignments.filter(a => a.status === "submitted" || a.status === "graded").length,
    late: mockAssignments.filter(a => a.status === "late").length,
    avgSubmissionRate: Math.round(
      mockAssignments.reduce((acc, a) => acc + (a.submissions / a.totalStudents), 0) / mockAssignments.length * 100
    ),
  };

  const filteredAssignments = mockAssignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || a.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

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
                <h1 className="text-3xl font-serif font-bold">Assignments</h1>
                <p className="text-muted-foreground">Create, manage, and grade student assignments</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Assignment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Assignment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <Input placeholder="Assignment title" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Subject</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="math">Mathematics</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="history">History</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Due Date</label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea placeholder="Assignment instructions..." rows={4} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Attach Files</label>
                      <Button variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Create Assignment</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Assignments</p>
                      <p className="text-3xl font-bold">{stats.total}</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Pending</p>
                      <p className="text-3xl font-bold">{stats.pending}</p>
                    </div>
                    <Clock className="h-8 w-8 text-chart-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                      <p className="text-3xl font-bold">{stats.submitted}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-chart-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Submission Rate</p>
                      <p className="text-3xl font-bold">{stats.avgSubmissionRate}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-chart-1" />
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
                      placeholder="Search assignments..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="graded">Graded</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Assignments Grid */}
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Assignments</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="submitted">Submitted</TabsTrigger>
                <TabsTrigger value="graded">Graded</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAssignments.map((assignment) => (
                    <Card key={assignment.id} className="hover-elevate transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <CardTitle className="text-lg">{assignment.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                          </div>
                          <Badge
                            variant={
                              assignment.status === "graded"
                                ? "default"
                                : assignment.status === "late"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Due Date</span>
                          <span className={`font-medium ${
                            assignment.dueDate < new Date() ? 'text-destructive' : ''
                          }`}>
                            {format(assignment.dueDate, "MMM dd, yyyy")}
                          </span>
                        </div>

                        {assignment.status === "graded" && assignment.grade !== undefined && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Grade</span>
                            <span className="font-semibold text-lg text-primary">
                              {assignment.grade}/{assignment.maxGrade}
                            </span>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Submissions</span>
                            <span className="font-medium">
                              {assignment.submissions}/{assignment.totalStudents}
                            </span>
                          </div>
                          <Progress 
                            value={(assignment.submissions / assignment.totalStudents) * 100} 
                            className="h-2"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Users className="h-4 w-4 mr-2" />
                            View Submissions
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pending">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAssignments
                    .filter(a => a.status === "pending")
                    .map((assignment) => (
                      <AssignmentCard key={assignment.id} assignment={assignment} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="submitted">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAssignments
                    .filter(a => a.status === "submitted" || a.status === "graded")
                    .map((assignment) => (
                      <AssignmentCard key={assignment.id} assignment={assignment} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="graded">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAssignments
                    .filter(a => a.status === "graded")
                    .map((assignment) => (
                      <AssignmentCard key={assignment.id} assignment={assignment} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}





