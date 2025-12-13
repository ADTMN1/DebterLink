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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: (user?.role === 'super_admin' ? 'Admin' : 'Student') as 'Student' | 'Teacher' | 'Parent' | 'Director' | 'Admin' | 'Super Admin',
    status: 'Active' as 'Active' | 'Suspended',
  });
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });

  // Determine which roles can be assigned
  const availableRoles = user?.role === 'super_admin' 
    ? ['Admin', 'Director'] 
    : user?.role === 'director'
    ? ['Student', 'Teacher', 'Parent']
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

  const [localUsers, setLocalUsers] = useState(demoUsers);
  const displayUsers = users.length > 0 ? users : localUsers;

  const createUserMutation = useMutation({
    mutationFn: async () => {
      // Demo: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userData = {
        id: Date.now().toString(),
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        role: form.role,
        status: form.status,
        createdAt: new Date().toISOString(),
      };
      
      console.log('Demo: User created:', userData);
      return userData;
    },
    onSuccess: async (data) => {
      setIsDialogOpen(false);
      setForm({ name: '', username: '', email: '', password: '', role: user?.role === 'super_admin' ? 'Admin' : 'Student', status: 'Active' });
      toast({
        title: 'User created (Demo)',
        description: `Successfully registered ${data.name} with username: ${data.username}`,
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
    
    createUserMutation.mutate();
  };

  const handleToggleSuspend = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setLocalUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    ));
    toast({
      title: 'Status Updated',
      description: `User ${newStatus === 'Suspended' ? 'suspended' : 'activated'} successfully`,
    });
  };

  const handleOpenEdit = (userData: any) => {
    setEditingUser(userData);
    setForm({
      name: userData.name,
      username: userData.username,
      email: userData.email,
      password: '',
      role: userData.role,
      status: userData.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    setLocalUsers(prev => prev.map(u => 
      u.id === editingUser.id ? { ...u, name: form.name, email: form.email, role: form.role, status: form.status } : u
    ));
    setIsEditDialogOpen(false);
    toast({ title: 'User Updated', description: 'User information updated successfully' });
  };

  const handleOpenChangePassword = (userData: any) => {
    setEditingUser(userData);
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    setIsPasswordDialogOpen(true);
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword.length < 6) {
      toast({ title: 'Validation Error', description: 'Password must be at least 6 characters.', variant: 'destructive' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: 'Validation Error', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }
    setIsPasswordDialogOpen(false);
    toast({ title: 'Password Changed', description: `Password updated for ${editingUser.name}` });
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
                      <Select value={form.role} onValueChange={(value: typeof form.role) => setForm((f) => ({ ...f, role: value }))}>
                        <SelectTrigger id="role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRoles.map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {user?.role === 'super_admin' 
                          ? 'Super Admin can only add Admin and Director' 
                          : user?.role === 'director'
                          ? 'Director can only assign Student, Teacher, and Parent roles'
                          : 'Admin can assign up to Director role'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={form.status} onValueChange={(value: typeof form.status) => setForm((f) => ({ ...f, status: value }))}>
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setForm({ name: '', username: '', email: '', password: '', role: user?.role === 'super_admin' ? 'Admin' : 'Student', status: 'Active' });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createUserMutation.isPending}
                  >
                    {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                  </Button>
                </DialogFooter>
              </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={form.role} onValueChange={(v: any) => setForm(f => ({ ...f, role: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {availableRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v: any) => setForm(f => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateUser}>Update User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))} placeholder="Minimum 6 characters" />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))} placeholder="Re-enter password" />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleChangePassword}>Change Password</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                          <DropdownMenuItem onClick={() => handleOpenEdit(user)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenChangePassword(user)}>Change Password</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleToggleSuspend(user.id, user.status)}
                          >
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
