import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  GraduationCap, 
  Calendar,
  Settings,
  Download,
  Upload,
  FileText,
  Search,
  MoreHorizontal
} from "lucide-react";

export default function AdminDashboard() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
  };

  const mockUsers = [
    {
      id: "1",
      name: "Yonas Tadesse",
      email: "yonas.tadesse@school.edu",
      role: "teacher",
      status: "active",
      lastLogin: "2024-12-27",
    },
    {
      id: "2",
      name: "Marta Alemu",
      email: "marta.alemu@school.edu",
      role: "teacher",
      status: "active",
      lastLogin: "2024-12-27",
    },
    {
      id: "3",
      name: "Dawit Bekele",
      email: "dawit.bekele@school.edu",
      role: "teacher",
      status: "inactive",
      lastLogin: "2024-12-20",
    },
    {
      id: "4",
      name: "Alemayehu Bekele",
      email: "alemayehu.bekele@parent.edu",
      role: "parent",
      status: "active",
      lastLogin: "2024-12-26",
    },
    {
      id: "5",
      name: "Tigist Haile",
      email: "tigist.haile@student.edu",
      role: "student",
      status: "active",
      lastLogin: "2024-12-27",
    },
  ];

  const roleLabels: Record<string, string> = {
    teacher: "Teacher",
    student: "Student",
    parent: "Parent",
    administrator: "Administrator",
    director: "Director",
    "super-admin": "Super Admin",
  };

  const roleColors: Record<string, string> = {
    teacher: "bg-chart-1/10 text-chart-1",
    student: "bg-chart-2/10 text-chart-2",
    parent: "bg-chart-3/10 text-chart-3",
    administrator: "bg-chart-4/10 text-chart-4",
    director: "bg-primary/10 text-primary",
    "super-admin": "bg-destructive/10 text-destructive",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="administrator" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Administrator Dashboard</h1>
              <p className="text-muted-foreground">Manage users, classes, timetables, and system settings.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <StatCard
                title="Total Users"
                value="1,245"
                icon={Users}
                trend={{ value: 12, positive: true }}
              />
              <StatCard
                title="Active Classes"
                value="24"
                icon={GraduationCap}
                iconColor="text-chart-2"
              />
              <StatCard
                title="Sections"
                value="48"
                icon={Calendar}
                iconColor="text-chart-3"
              />
              <StatCard
                title="Active Sessions"
                value="892"
                icon={Users}
                iconColor="text-chart-4"
              />
            </div>

            {/* User Management Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        className="pl-8 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={roleColors[user.role] || "bg-muted text-muted-foreground"}
                          >
                            {roleLabels[user.role] || user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === "active" ? "default" : "secondary"}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Management Tools */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Timetable Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Manage class schedules, periods, and teacher assignments.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Timetables
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Create Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Import or export data, manage backups, and view system logs.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Logs
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Backup
                    </Button>
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


