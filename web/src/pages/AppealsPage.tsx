import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppealCard } from "@/components/AppealCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertCircle, 
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  MessageSquare,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { addDays } from "date-fns";
import { Progress } from "@/components/ui/progress";

export default function AppealsPage() {
  const sidebarStyle = { "--sidebar-width": "16rem" };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const mockAppeals = [
    {
      id: "1",
      title: "Grade Appeal - Mathematics",
      submittedBy: "Parent: Alemayehu Bekele",
      submittedDate: addDays(new Date(), -2),
      status: "open" as const,
      priority: "high" as const,
      commentsCount: 3,
      description: "I believe my child's grade was calculated incorrectly. The exam score should be 92, not 85.",
      student: "Abebe Tadesse",
      subject: "Mathematics",
    },
    {
      id: "2",
      title: "Attendance Dispute",
      submittedBy: "Parent: Tigist Haile",
      submittedDate: addDays(new Date(), -5),
      status: "in-review" as const,
      priority: "medium" as const,
      commentsCount: 5,
      description: "My child was marked absent on Monday but was actually present. We have proof.",
      student: "Tigist Haile",
      subject: "General",
    },
    {
      id: "3",
      title: "Behavior Incident Review",
      submittedBy: "Teacher: Yonas Tadesse",
      submittedDate: addDays(new Date(), -1),
      status: "open" as const,
      priority: "high" as const,
      commentsCount: 2,
      description: "Requesting review of behavior incident report for student Dawit Bekele.",
      student: "Dawit Bekele",
      subject: "Behavior",
    },
    {
      id: "4",
      title: "Assignment Deadline Extension",
      submittedBy: "Student: Marta Alemu",
      submittedDate: addDays(new Date(), -3),
      status: "completed" as const,
      priority: "low" as const,
      commentsCount: 8,
      description: "Requesting extension for History essay due to family emergency.",
      student: "Marta Alemu",
      subject: "History",
    },
  ];

  const stats = {
    total: mockAppeals.length,
    open: mockAppeals.filter(a => a.status === "open").length,
    inReview: mockAppeals.filter(a => a.status === "in-review").length,
    completed: mockAppeals.filter(a => a.status === "completed").length,
    avgResolutionTime: "3.2 days",
  };

  const filteredAppeals = mockAppeals.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.student.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || a.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="director" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-serif font-bold">Appeals & Complaints</h1>
                <p className="text-muted-foreground">Manage and resolve student and parent appeals</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Appeal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Submit New Appeal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <Input placeholder="Appeal title" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Student</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select student" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Abebe Tadesse</SelectItem>
                            <SelectItem value="2">Tigist Haile</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Priority</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea placeholder="Describe your appeal..." rows={6} />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Submit Appeal</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Open</p>
                      <p className="text-3xl font-bold">{stats.open}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">In Review</p>
                      <p className="text-3xl font-bold">{stats.inReview}</p>
                    </div>
                    <Clock className="h-8 w-8 text-chart-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Completed</p>
                      <p className="text-3xl font-bold">{stats.completed}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-chart-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Avg Resolution</p>
                      <p className="text-3xl font-bold">{stats.avgResolutionTime}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
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
                      placeholder="Search appeals..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-review">In Review</SelectItem>
                      <SelectItem value="escalated">Escalated</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Appeals List */}
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Appeals ({stats.total})</TabsTrigger>
                <TabsTrigger value="open">Open ({stats.open})</TabsTrigger>
                <TabsTrigger value="in-review">In Review ({stats.inReview})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredAppeals.map((appeal) => (
                    <AppealCard key={appeal.id} appeal={appeal} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="open">
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredAppeals
                    .filter(a => a.status === "open")
                    .map((appeal) => (
                      <AppealCard key={appeal.id} appeal={appeal} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="in-review">
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredAppeals
                    .filter(a => a.status === "in-review")
                    .map((appeal) => (
                      <AppealCard key={appeal.id} appeal={appeal} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="completed">
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredAppeals
                    .filter(a => a.status === "completed")
                    .map((appeal) => (
                      <AppealCard key={appeal.id} appeal={appeal} />
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





