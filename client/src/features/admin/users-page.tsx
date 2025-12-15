import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VirtualList } from '@/components/ui/virtual-list';
import { SanitizedInput } from '@/components/ui/sanitized-input';
import { useSanitizedForm, sanitizationMaps } from '@/hooks/use-sanitized-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Search, MoreHorizontal, UserPlus, Filter, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { TableSkeleton } from '@/components/ui/loading-states';
import { ErrorState, EmptyState } from '@/components/ui/error-states';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { AdminUser } from '@shared/schema';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { createUserSchema, editUserSchema, passwordChangeSchema, CreateUserFormData, EditUserFormData, PasswordChangeFormData } from '@/lib/validations';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const canAddUser = user?.role === 'admin' || user?.role === 'super_admin';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
<<<<<<< HEAD
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [newPassword, setNewPassword] = useState('');
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'Student' as 'Student' | 'Teacher' | 'Parent' | 'Director' | 'Admin' | 'Super Admin',
    status: 'Active' as 'Active' | 'Suspended',
  });
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'Student' as 'Student' | 'Teacher' | 'Parent' | 'Director' | 'Admin' | 'Super Admin',
    status: 'Active' as 'Active' | 'Suspended',
=======
  const [editingUser, setEditingUser] = useState<any>(null);
  // Create user form
  const createForm = useSanitizedForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      role: user?.role === 'super_admin' ? 'Admin' : 'Student',
      status: 'Active',
    },
    sanitizationMap: sanitizationMaps.user,
  });

  // Edit user form
  const editForm = useSanitizedForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'Student',
      status: 'Active',
    },
    sanitizationMap: { name: 'name', email: 'email' },
  });

  // Password change form
  const passwordForm = useSanitizedForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    sanitizationMap: {
      currentPassword: 'text',
      newPassword: 'text',
      confirmPassword: 'text'
    },
>>>>>>> 945d7c3 (Error solved)
  });

  // Determine which roles can be assigned
  const availableRoles = user?.role === 'super_admin' 
    ? ['Student', 'Teacher', 'Parent', 'Director', 'Admin'] 
    : ['Student', 'Teacher', 'Parent', 'Director'];

  const { data: users = [], isLoading, error, refetch } = useQuery<AdminUser[]>({
    queryKey: ['/api/admin/users'],
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  
  const { handleError } = useErrorHandler();

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

  const allUsers = users.length > 0 ? users : demoUsers;
  
  // Filter users based on search term and role
  const displayUsers = allUsers.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || 
      user.role.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesSearch && matchesRole;
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserFormData) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userData = {
        id: Date.now().toString(),
        name: data.name,
        username: data.username,
        email: data.email,
        role: data.role,
        status: data.status,
        createdAt: new Date().toISOString(),
      };
      
      console.log('Demo: User created:', userData);
      return userData;
    },
    onSuccess: async (data) => {
      setIsDialogOpen(false);
<<<<<<< HEAD
      setForm({ name: '', username: '', email: '', password: '', role: 'Student', status: 'Active' });
      toast({
        title: 'User created (Demo)',
        description: `Successfully registered ${data.name} with username: ${data.username}`,
      });
=======
      createForm.reset();
      toast.success(`Successfully created user: ${data.name}`);
>>>>>>> 945d7c3 (Error solved)
    },
    onError: (error: Error) => {
      handleError(error, 'user creation');
    },
  });

  const onCreateSubmit = createForm.handleSanitizedSubmit((data: CreateUserFormData) => {
    createUserMutation.mutate(data);
  });

<<<<<<< HEAD
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
=======
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
    editForm.reset({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
>>>>>>> 945d7c3 (Error solved)
    });
    setIsEditDialogOpen(true);
  };

<<<<<<< HEAD
  const handleChangePassword = (user: any) => {
    setSelectedUser(user);
    setNewPassword('');
    setIsPasswordDialogOpen(true);
  };

  const handleToggleStatus = (user: any) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    toast({
      title: `User ${newStatus}`,
      description: `${user.name} has been ${newStatus.toLowerCase()}.`,
    });
    console.log(`Demo: User ${user.name} status changed to ${newStatus}`);
  };

  const handleSaveEdit = () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'User Updated',
      description: `${editForm.name} has been updated successfully.`,
    });
    console.log('Demo: User updated:', { ...selectedUser, ...editForm });
    setIsEditDialogOpen(false);
  };

  const handleSavePassword = () => {
    if (newPassword.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Password Changed',
      description: `Password for ${selectedUser?.name} has been updated.`,
    });
    console.log('Demo: Password changed for user:', selectedUser?.name);
    setIsPasswordDialogOpen(false);
  };
=======
  const onEditSubmit = editForm.handleSanitizedSubmit((data: EditUserFormData) => {
    setLocalUsers(prev => prev.map(u => 
      u.id === editingUser.id ? { ...u, ...data } : u
    ));
    setIsEditDialogOpen(false);
    toast.success('User information updated successfully');
  });

  const handleOpenChangePassword = (userData: any) => {
    setEditingUser(userData);
    passwordForm.reset();
    setIsPasswordDialogOpen(true);
  };

  const onPasswordSubmit = passwordForm.handleSanitizedSubmit((data: PasswordChangeFormData) => {
    setIsPasswordDialogOpen(false);
    toast.success(`Password updated for ${editingUser.name}`);
  });
>>>>>>> 945d7c3 (Error solved)

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
              <Form {...createForm}>
                <form onSubmit={onCreateSubmit} className="space-y-4 mt-2">
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <SanitizedInput sanitizer="name" placeholder="e.g. John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <SanitizedInput sanitizer="username" placeholder="e.g. johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <SanitizedInput sanitizer="email" type="email" placeholder="e.g. john@school.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <SanitizedInput sanitizer="text" type="password" placeholder="Minimum 8 characters" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
<<<<<<< HEAD
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
                    type="submit"
                    disabled={createUserMutation.isPending}
                  >
                    {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                  </Button>
                </DialogFooter>
              </form>
=======
                    <FormField
                      control={createForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableRoles.map((role) => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createUserMutation.isPending}>
                      {createUserMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create User'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
>>>>>>> 945d7c3 (Error solved)
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
<<<<<<< HEAD
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="e.g. john@school.com"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <select
                    id="edit-role"
                    className="border rounded-md px-3 py-2 text-sm bg-background w-full"
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        role: e.target.value as typeof editForm.role,
                      }))
                    }
                  >
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    className="border rounded-md px-3 py-2 text-sm bg-background w-full"
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        status: e.target.value as typeof editForm.status,
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
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </DialogFooter>
=======
            <Form {...editForm}>
              <form onSubmit={onEditSubmit} className="space-y-4 mt-2">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <SanitizedInput sanitizer="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <SanitizedInput sanitizer="email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Update User</Button>
                </DialogFooter>
              </form>
            </Form>
>>>>>>> 945d7c3 (Error solved)
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
<<<<<<< HEAD
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>User</Label>
                <Input value={selectedUser?.name || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">Minimum 6 characters required</p>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSavePassword}>
                Change Password
              </Button>
            </DialogFooter>
=======
            <Form {...passwordForm}>
              <form onSubmit={onPasswordSubmit} className="space-y-4 mt-2">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <SanitizedInput sanitizer="text" type="password" placeholder="Enter current password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <SanitizedInput sanitizer="text" type="password" placeholder="Minimum 8 characters" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <SanitizedInput sanitizer="text" type="password" placeholder="Re-enter password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Change Password</Button>
                </DialogFooter>
              </form>
            </Form>
>>>>>>> 945d7c3 (Error solved)
          </DialogContent>
        </Dialog>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
<<<<<<< HEAD
            <Input 
              placeholder="Search users..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
=======
            <SanitizedInput sanitizer="text" placeholder="Search users..." className="pl-8" />
>>>>>>> 945d7c3 (Error solved)
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
<<<<<<< HEAD
          <Button variant="outline" size="icon" onClick={() => { setSearchTerm(''); setRoleFilter('all'); }}>
=======
          <Button variant="outline" size="icon" aria-label="Filter users">
>>>>>>> 945d7c3 (Error solved)
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
                        action={canAddUser ? (
                          <Button onClick={() => setIsDialogOpen(true)}>
                            <UserPlus className="mr-2 h-4 w-4" /> Add First User
                          </Button>
                        ) : undefined}
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
                              <Badge variant="outline" className="capitalize">{user.role}</Badge>
                            </div>
                            <div className="flex-1">
                              <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                                {user.status}
                              </Badge>
                            </div>
                            <div className="flex-1 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" aria-label="User actions menu">
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
                          <Button variant="ghost" size="icon" aria-label="User actions menu">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangePassword(user)}>Change Password</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleToggleStatus(user)}>
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
