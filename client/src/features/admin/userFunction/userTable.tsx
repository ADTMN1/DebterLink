import { useState } from "react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VirtualList } from "@/components/ui/virtual-list";
import { SanitizedInput } from "@/components/ui/sanitized-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { TableSkeleton } from "@/components/ui/loading-states";
import { ErrorState, EmptyState } from "@/components/ui/error-states";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { AdminUser } from "@shared/schema";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { AddUserDialog } from "./components/AddUserDialog";
import { EditUserDialog } from "./components/EditUserDialog";
import { ChangePasswordDialog } from "./components/ChangePasswordDialog";

export default function UsersPage() {
  const { user } = useAuthStore();
  const { handleError } = useErrorHandler();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [localUsers, setLocalUsers] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Derived values
  const canAddUser = user?.role === "admin" || user?.role === "super_admin";
  const availableRoles =
    user?.role === "super_admin"
      ? ["Student", "Teacher", "Parent", "Director", "Admin"]
      : ["Student", "Teacher", "Parent", "Director"];
  const defaultRole = user?.role === "super_admin" ? "Admin" : "Student";

  // Data fetching
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Demo data
  const demoUsers = [
    {
      id: "1",
      name: "Tigist Alemu",
      username: "tigist.alemu",
      email: "tigist@school.com",
      role: "Teacher",
      status: "Active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Abebe Kebede",
      username: "abebe.kebede",
      email: "abebe@school.com",
      role: "Student",
      status: "Active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Sara Tadesse",
      username: "sara.tadesse",
      email: "sara@school.com",
      role: "Student",
      status: "Active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Kebede Tesfaye",
      username: "kebede.tesfaye",
      email: "kebede@school.com",
      role: "Parent",
      status: "Active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Dr. Yohannes Haile",
      username: "yohannes.haile",
      email: "yohannes@school.com",
      role: "Director",
      status: "Active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "6",
      name: "Meron Bekele",
      username: "meron.bekele",
      email: "meron@school.com",
      role: "Teacher",
      status: "Active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "7",
      name: "Dawit Mekonnen",
      username: "dawit.mekonnen",
      email: "dawit@school.com",
      role: "Student",
      status: "Suspended",
      createdAt: new Date().toISOString(),
    },
    {
      id: "8",
      name: "Admin User",
      username: "admin",
      email: "admin@school.com",
      role: "Admin",
      status: "Active",
      createdAt: new Date().toISOString(),
    },
  ];

  const allUsers = users.length > 0 ? users : demoUsers;

  // Filter users
  const displayUsers = allUsers.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole =
      roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  // Action handlers
  const handleOpenEdit = (userData: any) => {
    setEditingUser(userData);
    setIsEditDialogOpen(true);
  };

  const handleOpenChangePassword = (userData: any) => {
    setEditingUser(userData);
    setIsPasswordDialogOpen(true);
  };

  const handleToggleSuspend = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    setLocalUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    toast({
      title: "Status Updated",
      description: `User ${newStatus === "Suspended" ? "suspended" : "activated"} successfully`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>

          {canAddUser && (
            <AddUserDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              availableRoles={availableRoles}
              defaultRole={defaultRole}
            />
          )}
        </div>

        {/* Edit User Dialog */}
        <EditUserDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          editingUser={editingUser}
          availableRoles={availableRoles}
        />

        {/* Change Password Dialog */}
        <ChangePasswordDialog
          isOpen={isPasswordDialogOpen}
          onOpenChange={setIsPasswordDialogOpen}
          editingUser={editingUser}
        />

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <SanitizedInput
              sanitizer="text"
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="director">Director</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" aria-label="Filter users">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* User Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <TableSkeleton rows={5} cols={5} />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <ErrorState
                        title="Failed to load users"
                        message="Unable to fetch user data. Please try again."
                        onRetry={() => refetch()}
                        type="server"
                      />
                    </TableCell>
                  </TableRow>
                ) : displayUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <EmptyState
                        title="No users found"
                        message="No users have been created yet."
                        action={
                          canAddUser ? (
                            <Button onClick={() => setIsDialogOpen(true)}>Add First User</Button>
                          ) : undefined
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : displayUsers.length > 50 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <VirtualList
                        items={displayUsers}
                        height={600}
                        itemSize={60}
                        renderItem={(user) => (
                          <div className="flex items-center border-b h-[60px] px-4">
                            <div className="flex-1 font-medium">{user.name}</div>
                            <div className="flex-1">{user.email}</div>
                            <div className="flex-1">
                              <Badge variant="outline" className="capitalize">
                                {user.role}
                              </Badge>
                            </div>
                            <div className="flex-1">
                              <Badge variant={user.status === "Active" ? "default" : "destructive"}>
                                {user.status}
                              </Badge>
                            </div>
                            <div className="flex-1 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="User actions menu"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleOpenEdit(user)}>
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleOpenChangePassword(user)}>
                                    Change Password
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleToggleSuspend(user.id, user.status)}
                                  >
                                    {user.status === "Active" ? "Suspend" : "Activate"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  displayUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "Active" ? "default" : "destructive"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="User actions menu">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEdit(user)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenChangePassword(user)}>
                              Change Password
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleToggleSuspend(user.id, user.status)}
                            >
                              {user.status === "Active" ? "Suspend" : "Activate"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
