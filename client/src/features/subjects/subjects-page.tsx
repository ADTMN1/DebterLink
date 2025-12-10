import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
              You don't have permission to access this page. Only directors can assign subjects to teachers.
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [assignments, setAssignments] = useState<SubjectAssignment[]>([]);
  const [form, setForm] = useState({
    teacherId: '',
    subject: '',
    classId: '',
    academicYear: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString(),
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAssignSubject();
                }}
              >
                <div className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="teacher">Teacher *</Label>
                    <Select value={form.teacherId} onValueChange={(value) => setForm((f) => ({ ...f, teacherId: value }))}>
                      <SelectTrigger id="teacher">
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher: any) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      placeholder="e.g. Physics, Mathematics, English"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Class (Optional)</Label>
                    <Select value={form.classId || 'all'} onValueChange={(value) => setForm((f) => ({ ...f, classId: value === 'all' ? '' : value }))}>
                      <SelectTrigger id="class">
                        <SelectValue placeholder="Select a class (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {classes.map((cls: any) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year *</Label>
                    <Input
                      id="academicYear"
                      value={form.academicYear}
                      onChange={(e) => setForm((f) => ({ ...f, academicYear: e.target.value }))}
                      placeholder="2024-2025"
                      required
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Assign Subject
                  </Button>
                </DialogFooter>
              </form>
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

