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
import { Textarea } from "@/components/ui/textarea";
import { 
  GraduationCap, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Users,
  TrendingUp,
  Download,
  Upload
} from "lucide-react";
import { useState } from "react";

export default function SchoolsPage() {
  const sidebarStyle = { "--sidebar-width": "16rem" };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSubscription, setSelectedSubscription] = useState("all");

  const [schools, setSchools] = useState([
    {
      id: "1",
      name: "Addis Ababa Secondary School",
      location: "Addis Ababa",
      address: "Bole Road, Addis Ababa",
      phone: "+251 11 123 4567",
      email: "info@aass.edu",
      students: 1245,
      teachers: 48,
      status: "active",
      subscription: "Premium",
      revenue: 125000,
      lastActivity: "2024-12-27",
      joinDate: "2023-01-15",
    },
    {
      id: "2",
      name: "Hawassa High School",
      location: "Hawassa",
      address: "Main Street, Hawassa",
      phone: "+251 46 123 4567",
      email: "info@hawassa.edu",
      students: 890,
      teachers: 35,
      status: "active",
      subscription: "Standard",
      revenue: 89000,
      lastActivity: "2024-12-26",
      joinDate: "2023-03-20",
    },
    {
      id: "3",
      name: "Dire Dawa Academy",
      location: "Dire Dawa",
      address: "Airport Road, Dire Dawa",
      phone: "+251 25 123 4567",
      email: "info@direacademy.edu",
      students: 650,
      teachers: 28,
      status: "active",
      subscription: "Premium",
      revenue: 65000,
      lastActivity: "2024-12-25",
      joinDate: "2023-06-10",
    },
    {
      id: "4",
      name: "Bahir Dar School",
      location: "Bahir Dar",
      address: "Lake Tana Road, Bahir Dar",
      phone: "+251 58 123 4567",
      email: "info@bahirdar.edu",
      students: 720,
      teachers: 32,
      status: "inactive",
      subscription: "Basic",
      revenue: 36000,
      lastActivity: "2024-12-20",
      joinDate: "2023-09-05",
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
      ...newSchool,
      students: 0,
      teachers: 0,
      revenue: 0,
      lastActivity: new Date().toISOString().split("T")[0],
      joinDate: new Date().toISOString().split("T")[0],
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

  const handleToggleStatus = (id: string) => {
    setSchools(schools.map(s => 
      s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s
    ));
  };

  const filteredSchools = schools.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || s.status === selectedStatus;
    const matchesSubscription = selectedSubscription === "all" || s.subscription === selectedSubscription;
    return matchesSearch && matchesStatus && matchesSubscription;
  });

  const stats = {
    total: schools.length,
    active: schools.filter(s => s.status === "active").length,
    inactive: schools.filter(s => s.status === "inactive").length,
    premium: schools.filter(s => s.subscription === "Premium").length,
    totalStudents: schools.reduce((acc, s) => acc + s.students, 0),
    totalRevenue: schools.reduce((acc, s) => acc + s.revenue, 0),
  };

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
                <h1 className="text-3xl font-serif font-bold">Schools Management</h1>
                <p className="text-muted-foreground">Manage all schools, subscriptions, and status</p>
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
                          <Input
                            placeholder="+251 11 123 4567"
                            value={newSchool.phone}
                            onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            placeholder="info@school.edu"
                            value={newSchool.email}
                            onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
                          />
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
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Schools</p>
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
                      <p className="text-sm text-muted-foreground mb-1">Active</p>
                      <p className="text-3xl font-bold">{stats.active}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-chart-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Premium</p>
                      <p className="text-3xl font-bold">{stats.premium}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-chart-1" />
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
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search schools..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
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
                  <Select value={selectedSubscription} onValueChange={setSelectedSubscription}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Plans" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Schools Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Schools</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Contact</TableHead>
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
                    {filteredSchools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {school.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            {school.phone && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {school.phone}
                              </div>
                            )}
                            {school.email && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {school.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {school.students.toLocaleString()}
                          </div>
                        </TableCell>
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
                            className="gap-1 cursor-pointer"
                            onClick={() => handleToggleStatus(school.id)}
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
                          <div className="flex items-center justify-end gap-1">
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





