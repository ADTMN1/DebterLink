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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useState } from "react";

export default function UsersPage() {
  const sidebarStyle = { "--sidebar-width": "16rem" };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const mockUsers = [
    {
      id: "1",
      name: "Yonas Tadesse",
      email: "yonas.tadesse@school.edu",
      phone: "+251 911 234 567",
      role: "teacher",
      status: "active",
      lastLogin: "2024-12-27 14:30",
      joinDate: "2023-09-01",
      avatar: "",
      department: "Mathematics",
    },
    {
      id: "2",
      name: "Marta Alemu",
      email: "marta.alemu@school.edu",
      phone: "+251 922 345 678",
      role: "teacher",
      status: "active",
      lastLogin: "2024-12-27 13:15",
      joinDate: "2023-09-01",
      avatar: "",
      department: "Science",
    },
    {
      id: "3",
      name: "Dawit Bekele",
      email: "dawit.bekele@school.edu",
      phone: "+251 933 456 789",
      role: "teacher",
      status: "inactive",
      lastLogin: "2024-12-20 10:00",
      joinDate: "2022-09-01",
      avatar: "",
      department: "English",
    },
    {
      id: "4",
      name: "Alemayehu Bekele",
      email: "alemayehu.bekele@parent.edu",
      phone: "+251 944 567 890",
      role: "parent",
      status: "active",
      lastLogin: "2024-12-26 16:45",
      joinDate: "2024-01-15",
      avatar: "",
      department: null,
    },
    {
      id: "5",
      name: "Tigist Haile",
      email: "tigist.haile@student.edu",
      phone: "+251 955 678 901",
      role: "student",
      status: "active",
      lastLogin: "2024-12-27 08:20",
      joinDate: "2024-09-01",
      avatar: "",
      department: null,
      grade: "10-A",
    },
    {
      id: "6",
      name: "Sara Bekele",
      email: "sara.bekele@student.edu",
      phone: "+251 966 789 012",
      role: "student",
      status: "active",
      lastLogin: "2024-12-27 09:10",
      joinDate: "2024-09-01",
      avatar: "",
      department: null,
      grade: "10-B",
    },
    {
      id: "7",
      name: "Hanna Alemu",
      email: "hanna.alemu@student.edu",
      phone: "+251 977 890 123",
      role: "student",
      status: "active",
      lastLogin: "2024-12-27 07:30",
      joinDate: "2024-09-01",
      avatar: "",
      department: null,
      grade: "11-A",
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

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === "active").length,
    inactive: mockUsers.filter(u => u.status === "inactive").length,
    teachers: mockUsers.filter(u => u.role === "teacher").length,
    students: mockUsers.filter(u => u.role === "student").length,
    parents: mockUsers.filter(u => u.role === "parent").length,
  };

  const filteredUsers = mockUsers.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || u.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || u.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
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
                <h1 className="text-3xl font-serif font-bold">User Management</h1>
                <p className="text-muted-foreground">Manage all users, roles, and permissions</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Users
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name</Label>
                          <Input placeholder="Enter full name" />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input type="email" placeholder="email@example.com" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Phone</Label>
                          <Input placeholder="+251 911 234 567" />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="teacher">Teacher</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="administrator">Administrator</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Password</Label>
                        <Input type="password" placeholder="Enter password" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Create User</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                      <p className="text-3xl font-bold">{stats.total}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Active</p>
                      <p className="text-3xl font-bold">{stats.active}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-chart-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Inactive</p>
                      <p className="text-3xl font-bold">{stats.inactive}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Teachers</p>
                      <p className="text-3xl font-bold">{stats.teachers}</p>
                    </div>
                    <Shield className="h-8 w-8 text-chart-1" />
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
                      placeholder="Search by name or email..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="administrator">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {user.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{user.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge 
                              variant="secondary" 
                              className={roleColors[user.role] || "bg-muted text-muted-foreground"}
                            >
                              {roleLabels[user.role] || user.role}
                            </Badge>
                            {user.department && (
                              <p className="text-xs text-muted-foreground">{user.department}</p>
                            )}
                            {user.grade && (
                              <p className="text-xs text-muted-foreground">{user.grade}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === "active" ? "default" : "secondary"}
                          >
                            {user.status === "active" ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.lastLogin}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.joinDate}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}





