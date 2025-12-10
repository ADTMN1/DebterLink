import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Calendar as CalendarIcon, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  class: string;
  points: number;
  status: 'active' | 'submitted' | 'graded';
  submittedCount?: number;
  totalStudents?: number;
};

export default function AssignmentsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const isTeacher = user?.role === 'teacher' || user?.role === 'director';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    class: '',
    points: '',
    attachment: null as File | null,
  });
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Physics Lab Report 1',
      description: 'Submit your lab findings from the mechanics experiment. Include all charts.',
      dueDate: '2025-12-11',
      class: 'Grade 11A',
      points: 100,
      status: 'active',
      submittedCount: 32,
      totalStudents: 45,
    },
    {
      id: '2',
      title: 'Physics Lab Report 2',
      description: 'Submit your lab findings from the mechanics experiment. Include all charts.',
      dueDate: '2025-12-12',
      class: 'Grade 11B',
      points: 100,
      status: 'active',
      submittedCount: 28,
      totalStudents: 42,
    },
    {
      id: '3',
      title: 'Physics Lab Report 3',
      description: 'Submit your lab findings from the mechanics experiment. Include all charts.',
      dueDate: '2025-12-13',
      class: 'Grade 12A',
      points: 100,
      status: 'active',
      submittedCount: 15,
      totalStudents: 38,
    },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, attachment: file }));
    }
  };

  // Student submission state
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [teachers, setTeachers] = useState<Array<{ id: string; name: string }>>([]);
  const [submitForm, setSubmitForm] = useState({ attachment: null as File | null, subject: '', teacherId: '' });

  useEffect(() => {
    // fetch teachers for the select dropdown
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((data) => {
        const t = Array.isArray(data) ? data.filter((u) => u.role === 'Teacher') : [];
        setTeachers(t.map((u: any) => ({ id: u.id, name: u.name })));
      })
      .catch(() => setTeachers([]));
  }, []);

  const openSubmit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmitForm({ attachment: null, subject: assignment.title || assignment.class, teacherId: '' });
    setIsSubmitOpen(true);
  };

  const handleSubmitFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSubmitForm((f) => ({ ...f, attachment: file }));
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // strip prefix like data:...;base64,
        const idx = result.indexOf('base64,');
        resolve(idx >= 0 ? result.slice(idx + 7) : result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    const student = user;
    if (!student) {
      toast({ title: 'Not signed in', description: 'Please sign in to submit.', variant: 'destructive' });
      return;
    }

    let fileContentBase64: string | undefined = undefined;
    let fileName: string | undefined = undefined;
    if (submitForm.attachment) {
      try {
        fileContentBase64 = await fileToBase64(submitForm.attachment);
        fileName = submitForm.attachment.name;
      } catch (err) {
        toast({ title: 'File error', description: 'Failed to read file.', variant: 'destructive' });
        return;
      }
    }

    const teacherName = submitForm.teacherId ? teachers.find(t => t.id === submitForm.teacherId)?.name : undefined;

    const payload = {
      assignmentId: selectedAssignment.id,
      assignmentTitle: selectedAssignment.title,
      studentId: student.id || 'unknown',
      studentName: student.name || student.username || 'Student',
      subject: submitForm.subject || selectedAssignment.title || selectedAssignment.class,
      teacherId: submitForm.teacherId || undefined,
      teacherName: teacherName || undefined,
      fileName,
      fileContentBase64,
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/assignment-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setIsSubmitOpen(false);
      toast({ title: 'Submitted', description: 'Your assignment was submitted.' });
    } catch (err) {
      toast({ title: 'Submission failed', description: 'Could not submit assignment.', variant: 'destructive' });
    }
  };

  const handleCreateAssignment = () => {
    if (!form.title.trim() || !form.description.trim() || !form.dueDate || !form.class || !form.points) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate,
      class: form.class,
      points: parseInt(form.points) || 100,
      status: 'active',
      submittedCount: 0,
      totalStudents: 45,
    };

    setAssignments([newAssignment, ...assignments]);
    setIsDialogOpen(false);
    setForm({
      title: '',
      description: '',
      dueDate: '',
      class: '',
      points: '',
      attachment: null,
    });

    toast({
      title: 'Assignment created',
      description: `Successfully created "${newAssignment.title}" for ${newAssignment.class}`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntilDue = (dateString: string) => {
    const today = new Date();
    const due = new Date(dateString);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
          {isTeacher && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" /> Upload New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Assignment</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateAssignment();
                  }}
                >
                  <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Assignment Title</Label>
                      <Input
                        id="title"
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="e.g. Physics Lab Report"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Provide detailed instructions for the assignment..."
                        rows={4}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="class">Class / Grade</Label>
                        <Select value={form.class} onValueChange={(value) => setForm((f) => ({ ...f, class: value }))}>
                          <SelectTrigger id="class">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Grade 11A">Grade 11A</SelectItem>
                            <SelectItem value="Grade 11B">Grade 11B</SelectItem>
                            <SelectItem value="Grade 12A">Grade 12A</SelectItem>
                            <SelectItem value="Grade 12B">Grade 12B</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="points">Total Points</Label>
                        <Input
                          id="points"
                          type="number"
                          min="1"
                          value={form.points}
                          onChange={(e) => setForm((f) => ({ ...f, points: e.target.value }))}
                          placeholder="100"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={form.dueDate}
                        onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attachment">Attachment (Optional)</Label>
                      <Input
                        id="attachment"
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt"
                      />
                      {form.attachment && (
                        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{form.attachment.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setForm((f) => ({ ...f, attachment: null }))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setForm({ title: '', description: '', dueDate: '', class: '', points: '', attachment: null });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!form.title.trim() || !form.description.trim() || !form.dueDate || !form.class || !form.points}
                    >
                      Create Assignment
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
          {!isTeacher && (
            <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Submit Assignment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitAssignment}>
                  <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <Label>Assignment</Label>
                      <Input value={selectedAssignment?.title || ''} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" value={submitForm.subject} onChange={(e) => setSubmitForm(s => ({ ...s, subject: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teacher">Teacher (optional)</Label>
                      <Select value={submitForm.teacherId || undefined} onValueChange={(value) => setSubmitForm(s => ({ ...s, teacherId: value }))}>
                        <SelectTrigger id="teacher">
                          <SelectValue placeholder={teachers.length ? 'Select teacher (optional)' : 'No teachers available'} />
                        </SelectTrigger>
                        <SelectContent>
                          {teachers.map((t) => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="submissionFile">Attachment</Label>
                      <Input id="submissionFile" type="file" onChange={handleSubmitFileChange} accept=".pdf,.doc,.docx,.txt" />
                      {submitForm.attachment && (
                        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{submitForm.attachment.name}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => setSubmitForm(s => ({ ...s, attachment: null }))}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsSubmitOpen(false)}>Cancel</Button>
                    <Button type="submit">Submit</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           {assignments.map((assignment) => {
             const daysUntilDue = getDaysUntilDue(assignment.dueDate);
             const dueStatus = daysUntilDue < 0 ? 'overdue' : daysUntilDue === 0 ? 'today' : daysUntilDue === 1 ? 'tomorrow' : 'upcoming';
             
             return (
               <Card key={assignment.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                 <CardHeader className="pb-3">
                   <div className="flex justify-between items-start">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                         <FileText className="h-5 w-5" />
                      </div>
                      <Badge 
                        variant={
                          dueStatus === 'overdue' ? 'destructive' : 
                          dueStatus === 'today' ? 'destructive' : 
                          dueStatus === 'tomorrow' ? 'destructive' : 
                          'secondary'
                        }
                        className="text-xs"
                      >
                        {dueStatus === 'overdue' ? 'Overdue' : 
                         dueStatus === 'today' ? 'Due Today' : 
                         dueStatus === 'tomorrow' ? 'Due Tomorrow' : 
                         `Due in ${daysUntilDue} days`}
                      </Badge>
                   </div>
                   <CardTitle className="mt-3 text-lg">{assignment.title}</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                     {assignment.description}
                   </p>
                   <div className="space-y-2">
                     <div className="flex items-center text-xs text-muted-foreground gap-2">
                       <CalendarIcon className="h-3 w-3" />
                       <span>{formatDate(assignment.dueDate)}</span>
                     </div>
                    {isTeacher && (
                       <div className="flex items-center justify-between text-xs">
                         <span className="text-muted-foreground">Class: {assignment.class}</span>
                         <span className="font-medium">{assignment.points} points</span>
                       </div>
                     )}
                    {!isTeacher && (
                      <div className="mt-4 flex items-center justify-between">
                        <Button size="sm" onClick={() => openSubmit(assignment)}>
                          Submit Assignment
                        </Button>
                        <span className="text-xs text-muted-foreground">{assignment.class} • {assignment.points} pts</span>
                      </div>
                    )}
                     {isTeacher && assignment.submittedCount !== undefined && (
                       <div className="text-xs text-muted-foreground">
                         {assignment.submittedCount} / {assignment.totalStudents} submitted
                       </div>
                     )}
                   </div>
                 </CardContent>
               </Card>
             );
           })}
        </div>
      </div>
    </DashboardLayout>
  );
}
