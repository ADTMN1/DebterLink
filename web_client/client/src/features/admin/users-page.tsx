import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, MoreHorizontal, UserPlus, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { AdminUser } from '@shared/schema';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/useAuthStore';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const canAddUser = user?.role === 'admin' || user?.role === 'super_admin';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'Student' as 'Student' | 'Teacher' | 'Parent' | 'Director' | 'Admin' | 'Super Admin',
    status: 'Active' as 'Active' | 'Suspended',
  });

  // Determine which roles can be assigned
  const availableRoles = user?.role === 'super_admin' 
    ? ['Student', 'Teacher', 'Parent', 'Director', 'Admin'] 
    : ['Student', 'Teacher', 'Parent', 'Director'];

  const { data: users = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ['/api/admin/users'],
  });

  // Demo data if no users from API
  const demoUsers = [
    { id: '1', name: 'Tigist Alemu', username: 'tigist.alemu', email: 'tigist@school.com', role: 'Teacher', status: 'Active', createdAt: new Date().toISOString() },
    { id: '2', name: 'Abebe Kebede', username: 'abebe.kebede', email: 'abebe@school.com', role: 'Student', status: 'Active', createdAt: new Date().toISOString() },
    { id: '3', name: 'Sara Tadesse', username: 'sara.tadesse', email: 'sara@school.com', role: 'Student', status: 'Active', createdAt: new Date().toISOString() },
    { id: '4', name: 'Kebede Tesfaye', username: 'kebede.tesfaye', email: 'kebede@school.com', role: 'Parent', status: 'Active', createdAt: new Date().toISOString() },
    { id: '5', name: 'Dr. Yohannes Haile', username: 'yohannes.haile', email: 'yohannes@school.com', role: 'Director', status: 'Active', createdAt: new Date().toISOString() },
    { id: '6', name: 'Meron Bekele', username: 'meron.bekele', email: 'meron@school.com', role: 'Teacher', status: 'Active', createdAt: new Date().toISOString() },
    { id: '7', name: 'Dawit Mekonnen', username: 'dawit.mekonnen', email: 'dawit@school.com', role: 'Student', status: 'Suspended', createdAt: new Date().toISOString() },
    { id: '8', name: 'Admin User', username: 'admin', email: 'admin@school.com', role: 'Admin', status: 'Active', createdAt: new Date().toISOString() },
  ];

  const displayUsers = users.length > 0 ? users : demoUsers;

  const createUserMutation = useMutation({
    mutationFn: async () => {
      try {
        const userData = {
          name: form.name.trim(),
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
          role: form.role,
          status: form.status,
        };
        
        console.log('Creating user with data:', userData);
        console.log('API URL:', '/api/admin/users');
        
        const response = await apiRequest('POST', '/api/admin/users', userData);
        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('User created successfully:', result);
        return result;
      } catch (error) {
        console.error('Mutation error caught:', error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      const userName = form.name.trim();
      const username = form.username.trim();
      setIsDialogOpen(false);
      setForm({ name: '', username: '', email: '', password: '', role: 'Student', status: 'Active' });
      await queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'User created',
        description: `Successfully registered ${userName} with username: ${username}`,
      });
    },
    onError: (error: Error) => {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleCreateUser = () => {
    console.log('handleCreateUser called', form);
    
    if (!form.name.trim() || !form.username.trim() || !form.email.trim() || !form.password.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    if (form.password.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }
    
    console.log('Calling mutation...');
    createUserMutation.mutate();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          {canAddUser && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" /> Add New User
                </Button>
              </DialogTrigger>
              <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Form submitted');
                  handleCreateUser();
                }}
              >
                <div className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={form.username}
                      onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                      placeholder="e.g. johndoe"
                      required
                    />
                    <p className="text-xs text-muted-foreground">User will login with this username</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="e.g. john@school.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">Minimum 6 characters required</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <select
                        id="role"
                        className="border rounded-md px-3 py-2 text-sm bg-background"
                        value={form.role}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            role: e.target.value as typeof form.role,
                          }))
                        }
                      >
                        {availableRoles.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground">
                        {user?.role === 'super_admin' 
                          ? 'You can assign Admin role' 
                          : 'Only Super Admin can assign Admin role'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        className="border rounded-md px-3 py-2 text-sm bg-background"
                        value={form.status}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            status: e.target.value as typeof form.status,
                          }))
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setForm({ name: '', username: '', email: '', password: '', role: 'Student', status: 'Active' });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Button clicked, form state:', form);
                      console.log('Form validation:', {
                        name: form.name.trim(),
                        username: form.username.trim(),
                        email: form.email.trim(),
                        password: form.password.trim(),
                        passwordLength: form.password.length,
                        isValid: form.name.trim() && form.username.trim() && form.email.trim() && form.password.trim() && form.password.length >= 6
                      });
                      handleCreateUser();
                    }}
                    disabled={createUserMutation.isPending || !form.name.trim() || !form.username.trim() || !form.email.trim() || !form.password.trim() || form.password.length < 6}
                  >
                    {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                  </Button>
                </DialogFooter>
              </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-8" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
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
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : displayUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  displayUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Change Password</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            {user.status === 'Active' ? 'Suspend' : 'Activate'}
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
