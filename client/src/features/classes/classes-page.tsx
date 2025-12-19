import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SanitizedInput } from '@/components/ui/sanitized-input';
import { useSanitizedForm, sanitizationMaps } from '@/hooks/use-sanitized-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, UserPlus, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { createClassSchema, assignTeacherSchema, CreateClassFormData, AssignTeacherFormData } from '@/lib/validations';

type Class = {
  id: string;
  name: string;
  grade: string;
  section: string;
  capacity: number;
  currentStudents: number;
  teacherId?: string;
  teacherName?: string;
  subject?: string;
  academicYear: string;
  status: 'Active' | 'Inactive';
};

// Demo data
const DEMO_TEACHERS = [
  { id: '1', name: 'Tigist Alemu', role: 'Teacher', status: 'Active' },
  { id: '2', name: 'Meron Bekele', role: 'Teacher', status: 'Active' },
  { id: '3', name: 'Dawit Mekonnen', role: 'Teacher', status: 'Active' },
];

export default function ClassesPage() {
  const { user } = useAuthStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([
    { id: '1', name: 'Grade 11A', grade: '11', section: 'A', capacity: 40, currentStudents: 38, teacherName: 'Tigist Alemu', subject: 'Physics', academicYear: '2024-2025', status: 'Active' },
    { id: '2', name: 'Grade 11B', grade: '11', section: 'B', capacity: 40, currentStudents: 35, teacherName: 'Meron Bekele', subject: 'Mathematics', academicYear: '2024-2025', status: 'Active' },
    { id: '3', name: 'Grade 10A', grade: '10', section: 'A', capacity: 45, currentStudents: 42, academicYear: '2024-2025', status: 'Active' },
  ]);

  // Only directors can access this page
  if (user?.role !== 'director') {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Class Management</h2>
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              You don&apos;t have permission to access this page. Only directors can manage classes.
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  // Create class form
  const createForm = useSanitizedForm<CreateClassFormData>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      name: '',
      grade: '',
      section: '',
      capacity: 40,
      academicYear: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString(),
      status: 'Active',
    },
    sanitizationMap: sanitizationMaps.class,
  });

  // Assign teacher form
  const assignForm = useSanitizedForm<AssignTeacherFormData>({
    resolver: zodResolver(assignTeacherSchema),
    defaultValues: {
      teacherId: '',
      subject: '',
    },
    sanitizationMap: { subject: 'text' },
  });

  const teachers = DEMO_TEACHERS;
  const isLoading = false;

  const handleDeleteClass = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setClasses(classes.filter(cls => cls.id !== id));
      toast.success('Class deleted successfully');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Class Management</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
                <p className="text-sm text-muted-foreground">Fill in the details to create a new class</p>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSanitizedSubmit((data) => {
                  const newClass: Class = {
                    id: `${Date.now()}`,
                    name: data.name,
                    grade: data.grade,
                    section: data.section,
                    capacity: data.capacity,
                    currentStudents: 0,
                    academicYear: data.academicYear,
                    status: data.status,
                  };
                  setClasses([...classes, newClass]);
                  setIsCreateDialogOpen(false);
                  createForm.reset();
                  toast.success('Class created successfully');
                })} className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade</FormLabel>
                          <FormControl>
                            <SanitizedInput sanitizer="grade" placeholder="e.g. 11, 10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="section"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section</FormLabel>
                          <FormControl>
                            <SanitizedInput sanitizer="section" placeholder="e.g. A, B" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Name</FormLabel>
                        <FormControl>
                          <SanitizedInput sanitizer="text" placeholder="e.g. Grade 11A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity</FormLabel>
                          <FormControl>
                            <SanitizedInput sanitizer="text" type="number" min="1" placeholder="50" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="academicYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Academic Year</FormLabel>
                          <FormControl>
                            <SanitizedInput sanitizer="text" placeholder="2024-2025" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={createForm.control}
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
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createForm.formState.isSubmitting}>
                      {createForm.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Create Class
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading classes...</div>
            ) : classes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No classes found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>{cls.grade}</TableCell>
                      <TableCell>{cls.section}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {cls.currentStudents}/{cls.capacity}
                        </div>
                      </TableCell>
                      <TableCell>
                        {cls.teacherName ? (
                          <span>{cls.teacherName}</span>
                        ) : (
                          <span className="text-muted-foreground">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {cls.subject ? (
                          <Badge variant="outline">{cls.subject}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{cls.academicYear}</TableCell>
                      <TableCell>
                        <Badge variant={cls.status === 'Active' ? 'default' : 'secondary'}>
                          {cls.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog open={isAssignDialogOpen === cls.id} onOpenChange={(open) => setIsAssignDialogOpen(open ? cls.id : null)}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <UserPlus className="h-4 w-4 mr-1" />
                                Assign Teacher
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Assign Teacher to {cls.name}</DialogTitle>
                                <p className="text-sm text-muted-foreground">Select a teacher and subject for this class</p>
                              </DialogHeader>
                              <Form {...assignForm}>
                                <form onSubmit={assignForm.handleSanitizedSubmit((data) => {
                                  const teacher = teachers.find((t) => t.id === data.teacherId);
                                  if (!teacher) return;
                                  setClasses(classes.map(c => 
                                    c.id === cls.id
                                      ? { ...c, teacherId: data.teacherId, teacherName: teacher.name, subject: data.subject }
                                      : c
                                  ));
                                  setIsAssignDialogOpen(null);
                                  assignForm.reset();
                                  toast.success(`${teacher.name} assigned to teach ${data.subject}`);
                                })} className="space-y-4 mt-2">
                                  <FormField
                                    control={assignForm.control}
                                    name="teacherId"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Select Teacher</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select a teacher" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            {teachers.map((teacher) => (
                                              <SelectItem key={teacher.id} value={teacher.id}>
                                                {teacher.name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={assignForm.control}
                                    name="subject"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl>
                                          <SanitizedInput sanitizer="text" placeholder="e.g. Physics, Mathematics" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(null)}>Cancel</Button>
                                    <Button type="submit" disabled={assignForm.formState.isSubmitting}>
                                      {assignForm.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                      Assign Teacher
                                    </Button>
                                  </DialogFooter>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClass(cls.id, cls.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

