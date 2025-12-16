import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, Filter, UserPlus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AdminUser } from "@shared/schema";

interface Props {
  setSelectedUser: (user: any) => void;
  setIsEditOpen: (open: boolean) => void;
  setIsPasswordOpen: (open: boolean) => void;
  setIsAddOpen: (open: boolean) => void;
}

export default function UserList({
  setSelectedUser,
  setIsEditOpen,
  setIsPasswordOpen,
  setIsAddOpen,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Fetch users (demo API)
  const { data: users = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
  });

  const demoUsers: AdminUser[] = [
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
  ];

  const allUsers = users.length ? users : demoUsers;

  const displayUsers = allUsers.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => setIsAddOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

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
          {displayUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{user.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.status === "Active" ? "default" : "destructive"}
                >
                  {user.status}
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
                        setSelectedUser(user);
                        setIsEditOpen(true);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedUser(user);
                        setIsPasswordOpen(true);
                      }}
                    >
                      Change Password
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
