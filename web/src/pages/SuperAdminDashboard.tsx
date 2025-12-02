import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GradeChart } from "@/components/GradeChart";
import { 
  GraduationCap, 
  Users, 
  DollarSign,
  Activity,
  TrendingUp,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { useState } from "react";

export default function SuperAdminDashboard() {
  const sidebarStyle = { "--sidebar-width": "16rem" };
  const [schools, setSchools] = useState([
    {
      id: "1",
      name: "Addis Ababa Secondary School",
      location: "Addis Ababa",
      students: 1245,
      teachers: 48,
      status: "active",
      subscription: "Premium",
      revenue: 125000,
      lastActivity: "2024-12-27",
    },
    {
      id: "2",
      name: "Hawassa High School",
      location: "Hawassa",
      students: 890,
      teachers: 35,
      status: "active",
      subscription: "Standard",
      revenue: 89000,
      lastActivity: "2024-12-26",
    },
    {
      id: "3",
      name: "Dire Dawa Academy",
      location: "Dire Dawa",
      students: 650,
      teachers: 28,
      status: "active",
      subscription: "Premium",
      revenue: 65000,
      lastActivity: "2024-12-25",
    },
    {
      id: "4",
      name: "Bahir Dar School",
      location: "Bahir Dar",
      students: 720,
      teachers: 32,
      status: "inactive",
      subscription: "Basic",
      revenue: 36000,
      lastActivity: "2024-12-20",
    },
  ]);

  const [newSchool, setNewSchool] = useState({
    name: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    subscription: "Basic",
    status: "active",
  });

  const handleAddSchool = () => {
    const school = {
      id: (schools.length + 1).toString(),
      name: newSchool.name,
      location: newSchool.location,
      students: 0,
      teachers: 0,
      status: newSchool.status as "active" | "inactive",
      subscription: newSchool.subscription,
      revenue: 0,
      lastActivity: new Date().toISOString().split("T")[0],
    };
    setSchools([...schools, school]);
    setNewSchool({
      name: "",
      location: "",
      address: "",
      phone: "",
      email: "",
      subscription: "Basic",
      status: "active",
    });
  };

  const stats = {
    totalSchools: schools.length,
    totalUsers: schools.reduce((acc, s) => acc + s.students + s.teachers, 0),
    totalRevenue: schools.reduce((acc, s) => acc + s.revenue, 0),
    activeSchools: schools.filter(s => s.status === "active").length,
  };

  const revenueTrend = [
    { month: "Sep", value: 280000 },
    { month: "Oct", value: 295000 },
    { month: "Nov", value: 310000 },
    { month: "Dec", value: 315000 },
  ];

  const userGrowth = [
    { month: "Sep", value: 2500 },
    { month: "Oct", value: 2800 },
    { month: "Nov", value: 3000 },
    { month: "Dec", value: 3500 },
  ];

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="super-admin" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-serif font-bold">Super Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage all schools, users, and system-wide analytics</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add School
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New School</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>School Name *</Label>
                        <Input
                          placeholder="Enter school name"
                          value={newSchool.name}
                          onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location *</Label>
                        <Input
                          placeholder="City or Region"
                          value={newSchool.location}
                          onChange={(e) => setNewSchool({ ...newSchool, location: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea
                        placeholder="Full address"
                        value={newSchool.address}
                        onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="+251 11 123 4567"
                            value={newSchool.phone}
                            onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="info@school.edu"
                            value={newSchool.email}
                            onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Subscription Plan *</Label>
                        <Select
                          value={newSchool.subscription}
                          onValueChange={(value) => setNewSchool({ ...newSchool, subscription: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Status *</Label>
                        <Select
                          value={newSchool.status}
                          onValueChange={(value) => setNewSchool({ ...newSchool, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setNewSchool({
                            name: "",
                            location: "",
                            address: "",
                            phone: "",
                            email: "",
                            subscription: "Basic",
                            status: "active",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleAddSchool}
                        disabled={!newSchool.name || !newSchool.location}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add School
                      </Button>
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
                      <p className="text-sm text-muted-foreground mb-1">Total Schools</p>
                      <p className="text-3xl font-bold">{stats.totalSchools}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stats.activeSchools} active
                      </p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                      <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-chart-2" />
                        <span className="text-xs text-chart-2">+12% this month</span>
                      </div>
                    </div>
                    <Users className="h-8 w-8 text-chart-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold">${(stats.totalRevenue / 1000).toFixed(0)}K</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-chart-1" />
                        <span className="text-xs text-chart-1">+8% growth</span>
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8 text-chart-1" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">System Activity</p>
                      <p className="text-3xl font-bold">98%</p>
                      <p className="text-xs text-muted-foreground mt-1">Uptime</p>
                    </div>
                    <Activity className="h-8 w-8 text-chart-3" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <GradeChart
                    data={revenueTrend.map(d => ({ month: d.month, average: d.value / 1000, classAverage: d.value / 1000 - 10 }))}
                    title="Monthly Revenue (in thousands)"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <GradeChart
                    data={userGrowth.map(d => ({ month: d.month, average: d.value / 100, classAverage: d.value / 100 - 5 }))}
                    title="Total Users (in hundreds)"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Schools List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Schools</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Teachers</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell>{school.location}</TableCell>
                        <TableCell>{school.students.toLocaleString()}</TableCell>
                        <TableCell>{school.teachers}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              school.subscription === "Premium"
                                ? "default"
                                : school.subscription === "Standard"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {school.subscription}
                          </Badge>
                        </TableCell>
                        <TableCell>${school.revenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={school.status === "active" ? "default" : "secondary"}
                            className="gap-1"
                          >
                            {school.status === "active" ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {school.lastActivity}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
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

