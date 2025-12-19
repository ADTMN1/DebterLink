// import DashboardLayout from "@/layouts/dashboard-layout";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { SanitizedInput } from "@/components/ui/sanitized-input";
// import { useSanitizedForm } from "@/hooks/use-sanitized-form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Search, MoreHorizontal, Filter } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useQuery } from "@tanstack/react-query";
// import { TableSkeleton } from "@/components/ui/loading-states";
// import { EmptyState } from "@/components/ui/error-states";
// import { AdminUser } from "@shared/schema";
// import { useState, useMemo } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { useAuthStore } from "@/store/useAuthStore";
// import {
//   editUserSchema,
//   passwordChangeSchema,
//   EditUserFormData,
//   PasswordChangeFormData,
// } from "@/lib/validations";
// import { AddUserDialog } from "./userFunction/addNewUser";

// export default function UsersPage() {
//   const { user } = useAuthStore();

//   // --- State Hooks ---
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState<any>(null);

//   // Determine permissions
//   const canAddUser = user?.role === "admin" || user?.role === "super_admin";
//   const availableRoles =
//     user?.role === "super_admin"
//       ? ["Student", "Teacher", "Parent", "Director", "Admin"]
//       : ["Student", "Teacher", "Parent", "Director"];

//   // --- Form Definitions ---
//   const editForm = useSanitizedForm<EditUserFormData>({
//     resolver: zodResolver(editUserSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       role: "Student",
//       status: "Active",
//     },
//     sanitizationMap: { name: "name", email: "email" },
//   });

//   const passwordForm = useSanitizedForm<PasswordChangeFormData>({
//     resolver: zodResolver(passwordChangeSchema),
//     defaultValues: {
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     },
//     sanitizationMap: {
//       currentPassword: "text",
//       newPassword: "text",
//       confirmPassword: "text",
//     },
//   });

//   // --- Data Fetching ---
//   const { data: users = [], isLoading } = useQuery<AdminUser[]>({
//     queryKey: ["/api/admin/users"],
//     retry: 3,
//   });

//   // Demo data fallback
//   const demoUsers = [
//     {
//       id: "1",
//       name: "Tigist Alemu",
//       username: "tigist.alemu",
//       email: "tigist@school.com",
//       role: "Teacher",
//       status: "Active",
//     },
//     {
//       id: "2",
//       name: "Abebe Kebede",
//       username: "abebe.kebede",
//       email: "abebe@school.com",
//       role: "Student",
//       status: "Active",
//     },
//     {
//       id: "7",
//       name: "Dawit Mekonnen",
//       username: "dawit.mekonnen",
//       email: "dawit@school.com",
//       role: "Student",
//       status: "Suspended",
//     },
//     {
//       id: "8",
//       name: "Admin User",
//       username: "admin",
//       email: "admin@school.com",
//       role: "Admin",
//       status: "Active",
//     },
//   ];

//   const allUsers = users.length > 0 ? users : demoUsers;

//   // --- Logic ---
//   const displayUsers = useMemo(() => {
//     return allUsers.filter((u) => {
//       const matchesSearch =
//         searchTerm === "" ||
//         u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase()));

//       const matchesRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter.toLowerCase();
//       return matchesSearch && matchesRole;
//     });
//   }, [allUsers, searchTerm, roleFilter]);

//   // --- Handlers ---
//   const handleOpenEdit = (userData: any) => {
//     setEditingUser(userData);
//     editForm.reset({
//       name: userData.name,
//       email: userData.email,
//       role: userData.role,
//       status: userData.status,
//     });
//     setIsEditDialogOpen(true);
//   };

//   const onEditSubmit = editForm.handleSanitizedSubmit(() => {
//     setIsEditDialogOpen(false);
//     toast.success("User information updated successfully");
//   });

//   const handleOpenChangePassword = (userData: any) => {
//     setEditingUser(userData);
//     passwordForm.reset();
//     setIsPasswordDialogOpen(true);
//   };

//   const onPasswordSubmit = passwordForm.handleSanitizedSubmit(() => {
//     setIsPasswordDialogOpen(false);
//     toast.success(`Password updated for ${editingUser?.name}`);
//   });

//   const handleToggleSuspend = (userId: string, currentStatus: string) => {
//     const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
//     toast.success(`User ${newStatus.toLowerCase()} successfully`);
//   };

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div className="flex flex-col md:flex-row justify-between gap-4">
//           <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
//           {canAddUser && (
//             <>
//               <Button onClick={() => setIsDialogOpen(true)}>Add New User</Button>
//               <AddUserDialog
//                 isOpen={isDialogOpen}
//                 onOpenChange={setIsDialogOpen}
//                 availableRoles={availableRoles}
//                 defaultRole={user?.role === "super_admin" ? "Admin" : "Student"}
//               />
//             </>
//           )}
//         </div>

//         {/* Filters */}
//         <div className="flex gap-4 items-center">
//           <div className="relative flex-1 max-w-sm">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <SanitizedInput
//               sanitizer="text"
//               placeholder="Search users..."
//               className="pl-8"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <Select value={roleFilter} onValueChange={setRoleFilter}>
//             <SelectTrigger className="w-37.5">
//               <SelectValue placeholder="Role" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Roles</SelectItem>
//               <SelectItem value="student">Student</SelectItem>
//               <SelectItem value="teacher">Teacher</SelectItem>
//               <SelectItem value="parent">Parent</SelectItem>
//               <SelectItem value="director">Director</SelectItem>
//               <SelectItem value="admin">Admin</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button variant="outline" size="icon">
//             <Filter className="h-4 w-4" />
//           </Button>
//         </div>

//         {/* User Table */}
//         <Card>
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Role</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={5}>
//                       <TableSkeleton rows={5} />
//                     </TableCell>
//                   </TableRow>
//                 ) : displayUsers.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={5}>
//                       <EmptyState title="No users found" />
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   displayUsers.map((u) => (
//                     <TableRow key={u.id}>
//                       <TableCell className="font-medium">{u.name}</TableCell>
//                       <TableCell>{u.email}</TableCell>
//                       <TableCell>
//                         <Badge variant="outline">{u.role}</Badge>
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant={u.status === "Active" ? "default" : "destructive"}>
//                           {u.status}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="icon">
//                               <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuItem onClick={() => handleOpenEdit(u)}>
//                               Edit
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleOpenChangePassword(u)}>
//                               Change Password
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                               className="text-destructive"
//                               onClick={() => handleToggleSuspend(u.id, u.status)}
//                             >
//                               {u.status === "Active" ? "Suspend" : "Activate"}
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         {/* Edit Dialog */}
//         <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Edit User</DialogTitle>
//             </DialogHeader>
//             <Form {...editForm}>
//               <form onSubmit={onEditSubmit} className="space-y-4">
//                 <FormField
//                   control={editForm.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Full Name</FormLabel>
//                       <FormControl>
//                         <SanitizedInput sanitizer="name" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <DialogFooter>
//                   <Button type="submit">Update</Button>
//                 </DialogFooter>
//               </form>
//             </Form>
//           </DialogContent>
//         </Dialog>

//         {/* Password Dialog */}
//         <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Change Password</DialogTitle>
//             </DialogHeader>
//             <Form {...passwordForm}>
//               <form onSubmit={onPasswordSubmit} className="space-y-4">
//                 <FormField
//                   control={passwordForm.control}
//                   name="newPassword"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>New Password</FormLabel>
//                       <FormControl>
//                         <SanitizedInput sanitizer="text" type="password" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <DialogFooter>
//                   <Button type="submit">Change Password</Button>
//                 </DialogFooter>
//               </form>
//             </Form>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </DashboardLayout>
//   );
// }

import DashboardLayout from "@/layouts/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { EmptyState } from "@/components/ui/error-states";
import { AdminUser } from "@shared/schema";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

// Separated Components
import { AddUserDialog } from "./userFunction/addNewUser";
import { EditUserDialog } from "./userFunction/editUser";
import { EditPasswordDialog } from "./userFunction/changePassword";

export default function UsersPage() {
  const { user } = useAuthStore();

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const canAddUser = user?.role === "admin" || user?.role === "super_admin";
  const availableRoles =
    user?.role === "super_admin"
      ? ["Student", "Teacher", "Parent", "Director", "Admin"]
      : ["Student", "Teacher", "Parent", "Director"];

  const { data: users = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    retry: 3,
  });

  const demoUsers = [
    {
      id: "1",
      name: "Tigist Alemu",
      username: "tigist.alemu",
      email: "tigist@school.com",
      role: "Teacher",
      status: "Active",
    },
    {
      id: "2",
      name: "Abebe Kebede",
      username: "abebe.kebede",
      email: "abebe@school.com",
      role: "Student",
      status: "Active",
    },
  ];

  const allUsers = users.length > 0 ? users : demoUsers;

  const displayUsers = useMemo(() => {
    return allUsers.filter((u) => {
      const matchesSearch =
        searchTerm === "" ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [allUsers, searchTerm, roleFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          {canAddUser && <Button onClick={() => setIsAddOpen(true)}>Add New User</Button>}
        </div>

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
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
                      <TableSkeleton rows={5} />
                    </TableCell>
                  </TableRow>
                ) : displayUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <EmptyState title="No users found" />
                    </TableCell>
                  </TableRow>
                ) : (
                  displayUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{u.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.status === "Active" ? "default" : "destructive"}>
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(u);
                                setIsEditOpen(true);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(u);
                                setIsPasswordOpen(true);
                              }}
                            >
                              Password
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

        {/* Modular Dialogs */}
        <AddUserDialog
          isOpen={isAddOpen}
          onOpenChange={setIsAddOpen}
          availableRoles={availableRoles}
          defaultRole={user?.role === "super_admin" ? "Admin" : "Student"}
        />

        <EditUserDialog isOpen={isEditOpen} onOpenChange={setIsEditOpen} user={selectedUser} />

        <EditPasswordDialog
          isOpen={isPasswordOpen}
          onOpenChange={setIsPasswordOpen}
          userName={selectedUser?.name}
        />
      </div>
    </DashboardLayout>
  );
}