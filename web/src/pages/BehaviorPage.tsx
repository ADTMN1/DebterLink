import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BehaviorLog } from "@/components/BehaviorLog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Award, 
  AlertTriangle, 
  Plus,
  TrendingUp,
  Users,
  Search,
  Filter,
  Download
} from "lucide-react";
import { useState } from "react";
import { addDays } from "date-fns";
import { Progress } from "@/components/ui/progress";

export default function BehaviorPage() {
  const sidebarStyle = { "--sidebar-width": "16rem" };
  const [selectedFilter, setSelectedFilter] = useState("all");

  const mockBehaviorEntries = [
    {
      id: "1",
      type: "award" as const,
      title: "Perfect Attendance",
      description: "Achieved perfect attendance for the month",
      date: new Date(),
      points: 50,
      student: "Abebe Tadesse",
    },
    {
      id: "2",
      type: "positive" as const,
      title: "Helped Classmate",
      description: "Assisted peer with difficult math problem",
      date: addDays(new Date(), -2),
      points: 10,
      student: "Tigist Haile",
    },
    {
      id: "3",
      type: "negative" as const,
      title: "Late to Class",
      description: "Arrived 15 minutes late without excuse",
      date: addDays(new Date(), -3),
      points: -5,
      student: "Dawit Bekele",
    },
    {
      id: "4",
      type: "positive" as const,
      title: "Excellent Participation",
      description: "Active participation in class discussions",
      date: addDays(new Date(), -5),
      points: 15,
      student: "Marta Alemu",
    },
  ];

  const studentBehavior = [
    { id: "1", name: "Abebe Tadesse", points: 245, rank: 1, positive: 12, negative: 2 },
    { id: "2", name: "Tigist Haile", points: 220, rank: 2, positive: 10, negative: 1 },
    { id: "3", name: "Dawit Bekele", points: 180, rank: 5, positive: 8, negative: 5 },
    { id: "4", name: "Marta Alemu", points: 195, rank: 4, positive: 9, negative: 3 },
    { id: "5", name: "Yonas Tadesse", points: 210, rank: 3, positive: 11, negative: 2 },
  ];

  const stats = {
    totalPoints: 1050,
    averagePoints: 210,
    positiveEntries: 42,
    negativeEntries: 8,
    topPerformer: "Abebe Tadesse",
  };

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
                <h1 className="text-3xl font-serif font-bold">Behavior Management</h1>
                <p className="text-muted-foreground">Track student behavior, awards, and conduct</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Log Behavior
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Behavior Entry</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Student</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent>
                          {studentBehavior.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="positive">Positive</SelectItem>
                          <SelectItem value="negative">Negative</SelectItem>
                          <SelectItem value="award">Award</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <Input placeholder="Behavior title" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea placeholder="Describe the behavior..." rows={4} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Points</label>
                      <Input type="number" placeholder="Points (positive or negative)" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Log Entry</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Points</p>
                      <p className="text-3xl font-bold">{stats.totalPoints}</p>
                    </div>
                    <Award className="h-8 w-8 text-chart-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Avg Points</p>
                      <p className="text-3xl font-bold">{stats.averagePoints}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-chart-1" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Positive</p>
                      <p className="text-3xl font-bold">{stats.positiveEntries}</p>
                    </div>
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Negative</p>
                      <p className="text-3xl font-bold">{stats.negativeEntries}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Student Rankings */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Student Behavior Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Positive</TableHead>
                        <TableHead>Negative</TableHead>
                        <TableHead>Progress</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentBehavior.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Badge variant={student.rank <= 3 ? "default" : "secondary"}>
                              #{student.rank}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>
                            <Badge variant={student.points >= 200 ? "default" : "secondary"}>
                              {student.points}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-chart-2">{student.positive}</TableCell>
                          <TableCell className="text-destructive">{student.negative}</TableCell>
                          <TableCell>
                            <Progress value={(student.points / 300) * 100} className="w-20 h-2" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Recent Entries */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Behavior Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockBehaviorEntries.slice(0, 4).map((entry) => (
                      <div key={entry.id} className="p-3 rounded-lg border">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{entry.student}</p>
                            <p className="text-xs text-muted-foreground">{entry.title}</p>
                          </div>
                          <Badge
                            variant={
                              entry.type === "award"
                                ? "default"
                                : entry.type === "positive"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {entry.points > 0 ? "+" : ""}{entry.points}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{entry.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Behavior Log Component */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Behavior Log</CardTitle>
              </CardHeader>
              <CardContent>
                <BehaviorLog
                  entries={mockBehaviorEntries.map(e => ({
                    id: e.id,
                    type: e.type,
                    title: e.title,
                    description: e.description,
                    date: e.date,
                    points: e.points,
                  }))}
                  totalPoints={stats.totalPoints}
                />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}





