import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Only directors can access this page
  if (user?.role !== 'director') {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Class Management</h2>
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              You don't have permission to access this page. Only directors can manage classes.
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([
    { id: '1', name: 'Grade 11A', grade: '11', section: 'A', capacity: 40, currentStudents: 38, teacherName: 'Tigist Alemu', subject: 'Physics', academicYear: '2024-2025', status: 'Active' },
    { id: '2', name: 'Grade 11B', grade: '11', section: 'B', capacity: 40, currentStudents: 35, teacherName: 'Meron Bekele', subject: 'Mathematics', academicYear: '2024-2025', status: 'Active' },
    { id: '3', name: 'Grade 10A', grade: '10', section: 'A', capacity: 45, currentStudents: 42, academicYear: '2024-2025', status: 'Active' },
  ]);
  const [form, setForm] = useState({
    name: '',
    grade: '',
    section: '',
    capacity: '',
    academicYear: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString(),
    status: 'Active' as 'Active' | 'Inactive',
  });
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const teachers = DEMO_TEACHERS;
  const isLoading = false;



  const handleCreateClass = () => {
    if (!form.name.trim() || !form.grade.trim() || !form.section.trim() || !form.capacity.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newClass: Class = {
      id: Date.now().toString(),
      name: form.name.trim(),
      grade: form.grade.trim(),
      section: form.section.trim(),
      capacity: parseInt(form.capacity) || 0,
      currentStudents: 0,
      academicYear: form.academicYear,
      status: form.status,
    };

    setClasses([...classes, newClass]);
    setIsCreateDialogOpen(false);
    setForm({
      name: '',
      grade: '',
      section: '',
      capacity: '',
      academicYear: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString(),
      status: 'Active',
    });
    toast({
      title: 'Class created',
      description: 'Class has been successfully created.',
    });
  };

  const handleAssignTeacher = (classId: string) => {
    if (!selectedTeacherId || !selectedSubject.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please select a teacher and enter a subject.',
        variant: 'destructive',
      });
      return;
    }
    const teacher = teachers.find((t) => t.id === selectedTeacherId);
    if (!teacher) return;

    setClasses(classes.map(cls => 
      cls.id === classId
        ? { ...cls, teacherId: selectedTeacherId, teacherName: teacher.name, subject: selectedSubject.trim() }
        : cls
    ));
    setIsAssignDialogOpen(null);
    setSelectedTeacherId('');
    setSelectedSubject('');
    toast({
      title: 'Teacher assigned',
      description: `${teacher.name} has been assigned to teach ${selectedSubject}.`,
    });
  };

  const handleDeleteClass = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setClasses(classes.filter(cls => cls.id !== id));
      toast({
        title: 'Class deleted',
        description: 'Class has been successfully deleted.',
      });
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
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateClass();
                }}
              >
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade *</Label>
                      <Input
                        id="grade"
                        value={form.grade}
                        onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
                        placeholder="e.g. 11, 10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section">Section *</Label>
                      <Input
                        id="section"
                        value={form.section}
                        onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
                        placeholder="e.g. A, B"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Class Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Grade 11A"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity *</Label>
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        value={form.capacity}
                        onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                        placeholder="50"
                        required
                      />
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
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={form.status}
                      onValueChange={(value: 'Active' | 'Inactive') => setForm((f) => ({ ...f, status: value }))}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Class
                  </Button>
                </DialogFooter>
              </form>
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
              <div className="text-center py-8 text-muted-foreground">No classes found.</div>
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
                              </DialogHeader>
                              <div className="space-y-4 mt-2">
                                <div className="space-y-2">
                                  <Label htmlFor="teacher">Select Teacher *</Label>
                                  <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
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
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    placeholder="e.g. Physics, Mathematics"
                                    required
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setIsAssignDialogOpen(null);
                                    setSelectedTeacherId('');
                                    setSelectedSubject('');
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  onClick={() => handleAssignTeacher(cls.id)}
                                >
                                  Assign Teacher
                                </Button>
                              </DialogFooter>
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

