import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SanitizedInput } from '@/components/ui/sanitized-input';
import { useSanitizedForm } from '@/hooks/use-sanitized-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createSubjectSchema, CreateSubjectFormData } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';

type SubjectAssignment = {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  classId?: string;
  className?: string;
  academicYear: string;
};

// Demo data
const DEMO_TEACHERS = [
  { id: '1', name: 'Tigist Alemu', role: 'Teacher', status: 'Active' },
  { id: '2', name: 'Meron Bekele', role: 'Teacher', status: 'Active' },
  { id: '3', name: 'Dawit Mekonnen', role: 'Teacher', status: 'Active' },
];

const DEMO_CLASSES = [
  { id: '1', name: 'Grade 11A', grade: '11', section: 'A' },
  { id: '2', name: 'Grade 11B', grade: '11', section: 'B' },
  { id: '3', name: 'Grade 10A', grade: '10', section: 'A' },
];

export default function SubjectsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();

  // Only directors can access this page
  if (user?.role !== 'director') {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Subject Assignments</h2>
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              You don&apos;t have permission to access this page. Only directors can assign subjects to teachers.
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [assignments, setAssignments] = useState<SubjectAssignment[]>([]);
  const form = useSanitizedForm<CreateSubjectFormData>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      name: '',
      code: '',
      grade: '',
      creditHours: 1,
      description: '',
      status: 'Active',
    },
    sanitizationMap: {
      name: 'text',
      code: 'code',
      grade: 'grade',
      description: 'description',
    },
  });

  const teachers = DEMO_TEACHERS;
  const classes = DEMO_CLASSES;
  const isLoading = false;

  const handleAssignSubject = () => {
    if (!form.teacherId || !form.subject.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please select a teacher and enter a subject.',
        variant: 'destructive',
      });
      return;
    }

    const teacher = teachers.find((t) => t.id === form.teacherId);
    if (!teacher) return;
    
    const selectedClass = form.classId ? classes.find((c) => c.id === form.classId) : null;
    
    const newAssignment: SubjectAssignment = {
      id: Date.now().toString(),
      teacherId: form.teacherId,
      teacherName: teacher.name,
      subject: form.subject.trim(),
      classId: form.classId || undefined,
      className: selectedClass?.name,
      academicYear: form.academicYear,
    };

    setAssignments([...assignments, newAssignment]);
    setIsDialogOpen(false);
    setForm({
      teacherId: '',
      subject: '',
      classId: '',
      academicYear: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString(),
    });
    toast({
      title: 'Subject assigned',
      description: 'Subject has been successfully assigned to teacher.',
    });
  };

  const handleDeleteAssignment = (id: string) => {
    if (confirm('Are you sure you want to remove this assignment?')) {
      setAssignments(assignments.filter(a => a.id !== id));
      toast({
        title: 'Assignment deleted',
        description: 'Subject assignment has been successfully deleted.',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Subject Assignments</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Assign Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Subject to Teacher</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSanitizedSubmit((data) => {
                  const newAssignment: SubjectAssignment = {
                    id: Date.now().toString(),
                    teacherId: 'teacher-1',
                    teacherName: 'Sample Teacher',
                    subject: data.name,
                    academicYear: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString(),
                  };
                  setAssignments([...assignments, newAssignment]);
                  setIsDialogOpen(false);
                  form.reset();
                  toast.success('Subject has been successfully created.');
                })} className="space-y-4 mt-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject Name</FormLabel>
                        <FormControl>
                          <SanitizedInput sanitizer="text" placeholder="e.g. Physics, Mathematics" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject Code</FormLabel>
                        <FormControl>
                          <SanitizedInput sanitizer="code" placeholder="e.g. PHY101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="9">Grade 9</SelectItem>
                              <SelectItem value="10">Grade 10</SelectItem>
                              <SelectItem value="11">Grade 11</SelectItem>
                              <SelectItem value="12">Grade 12</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="creditHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credit Hours</FormLabel>
                          <FormControl>
                            <SanitizedInput sanitizer="text" type="number" min="1" max="10" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <SanitizedInput sanitizer="description" placeholder="Brief description of the subject" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Create Subject
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subject Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading assignments...</div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No subject assignments found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.teacherName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{assignment.subject}</Badge>
                      </TableCell>
                      <TableCell>{assignment.className || 'All Classes'}</TableCell>
                      <TableCell>{assignment.academicYear}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

