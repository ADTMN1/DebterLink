import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/badge';
import { Plus, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { SanitizedInput } from '@/components/ui/sanitized-input';
import { SanitizedTextarea } from '@/components/ui/sanitized-input';
import { useSanitizedForm } from '@/hooks/use-sanitized-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { behaviorRecordSchema, BehaviorRecordFormData } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

type BehaviorRecord = {
  id: string;
  studentName: string;
  type: 'positive' | 'negative';
  description: string;
  recordedBy: string;
  date: string;
};

const fetchBehaviorRecords = async (): Promise<BehaviorRecord[]> => {
  const res = await fetch('/api/behavior');
  if (!res.ok) throw new Error('Failed to fetch behavior records');
  return res.json();
};

const createBehaviorRecord = async (data: {
  studentName: string;
  type: 'positive' | 'negative';
  description: string;
  recordedBy: string;
  date: string;
}): Promise<BehaviorRecord> => {
  const res = await fetch('/api/behavior', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create behavior record');
  }
  return res.json();
};

// Mock all students behavior data for director
const allStudentsBehavior = [
  { 
    studentName: 'Dawit Mekonnen', 
    grade: '11A',
    rollNo: '001',
    records: [
      { id: '1', date: '2025-12-05', type: 'positive' as const, description: 'Excellent class participation', recordedBy: 'T. Alemu' },
      { id: '2', date: '2025-12-04', type: 'positive' as const, description: 'Helped organize event', recordedBy: 'T. Alemu' },
      { id: '3', date: '2025-12-03', type: 'positive' as const, description: 'Outstanding project work', recordedBy: 'T. Alemu' },
    ]
  },
  { 
    studentName: 'Sara Tadesse', 
    grade: '11A',
    rollNo: '002',
    records: [
      { id: '4', date: '2025-12-05', type: 'positive' as const, description: 'Completed homework on time', recordedBy: 'T. Alemu' },
      { id: '5', date: '2025-12-04', type: 'positive' as const, description: 'Participated in class discussion', recordedBy: 'T. Alemu' },
      { id: '6', date: '2025-12-02', type: 'negative' as const, description: 'Late to class', recordedBy: 'T. Alemu' },
    ]
  },
  { 
    studentName: 'Robel Haile', 
    grade: '11B',
    rollNo: '003',
    records: [
      { id: '7', date: '2025-12-05', type: 'positive' as const, description: 'Excellent presentation', recordedBy: 'W. Bekele' },
      { id: '8', date: '2025-12-03', type: 'negative' as const, description: 'Disrupted class', recordedBy: 'W. Bekele' },
    ]
  },
  { 
    studentName: 'Meron Bekele', 
    grade: '12A',
    rollNo: '004',
    records: [
      { id: '9', date: '2025-12-05', type: 'positive' as const, description: 'Leadership in group work', recordedBy: 'A. Tesfaye' },
      { id: '10', date: '2025-12-04', type: 'positive' as const, description: 'Mentored junior students', recordedBy: 'A. Tesfaye' },
    ]
  },
];

// Mock parent's children behavior data
const parentChildrenBehavior = [
  { 
    childName: 'Sara Tadesse', 
    grade: '11A',
    records: [
      { id: '1', date: '2025-12-05', type: 'positive' as const, description: 'Completed homework on time', recordedBy: 'T. Alemu' },
      { id: '2', date: '2025-12-04', type: 'positive' as const, description: 'Participated in class discussion', recordedBy: 'T. Alemu' },
      { id: '3', date: '2025-12-03', type: 'positive' as const, description: 'Helped classmate', recordedBy: 'T. Alemu' },
      { id: '4', date: '2025-12-02', type: 'negative' as const, description: 'Late to class', recordedBy: 'T. Alemu' },
    ]
  },
  { 
    childName: 'Yonas Tadesse', 
    grade: '9B',
    records: [
      { id: '5', date: '2025-12-05', type: 'positive' as const, description: 'Excellent presentation', recordedBy: 'W. Bekele' },
      { id: '6', date: '2025-12-03', type: 'positive' as const, description: 'Helped organize classroom', recordedBy: 'W. Bekele' },
    ]
  },
];

export default function BehaviorPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isTeacher = user?.role === 'teacher';
  const isDirector = user?.role === 'director';
  const isParent = user?.role === 'parent';
  
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [viewGrade, setViewGrade] = useState('');
  const [viewSection, setViewSection] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const behaviorForm = useSanitizedForm<BehaviorRecordFormData>({
    resolver: zodResolver(behaviorRecordSchema),
    defaultValues: {
      studentId: '',
      type: 'positive',
      category: '',
      description: '',
      severity: 'low',
      actionTaken: '',
    },
    sanitizationMap: {
      description: 'description',
      actionTaken: 'description',
    },
  });

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['behavior-records'],
    queryFn: fetchBehaviorRecords,
  });

  const createMutation = useMutation({
    mutationFn: createBehaviorRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['behavior-records'] });
      setIsDialogOpen(false);
      setForm({ studentName: '', type: '', description: '' });
      toast({
        title: 'Record saved',
        description: 'Behavior record has been successfully saved.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save behavior record',
        variant: 'destructive',
      });
    },
  });

  const handleSaveRecord = behaviorForm.handleSanitizedSubmit((data: BehaviorRecordFormData) => {
    createMutation.mutate({
      studentName: 'Sample Student',
      type: data.type,
      description: data.description,
      recordedBy: user?.name || 'Unknown',
      date: new Date().toISOString().split('T')[0],
    });
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  // Calculate stats from records
  const positiveCount = records.filter(r => r.type === 'positive').length;
  const negativeCount = records.filter(r => r.type === 'negative').length;
  const conductGrade = positiveCount >= 10 && negativeCount === 0 ? 'A' : 
                      positiveCount >= 5 && negativeCount <= 2 ? 'B' : 
                      positiveCount >= 3 && negativeCount <= 5 ? 'C' : 'D';

  // Director view - show all students' behavior
  if (isDirector) {
    const generateDemoData = (grade: string, section: string) => {
      const studentNames = ['Abebe Bekele', 'Almaz Tesfaye', 'Biruk Haile', 'Chaltu Tadesse', 'Dawit Mekonnen', 'Eden Yohannes', 'Fikir Alemayehu', 'Gelila Assefa'];
      const descriptions = ['Excellent class participation', 'Completed homework on time', 'Helped classmate', 'Outstanding project work', 'Late to class', 'Disrupted class'];
      const teachers = ['T. Alemu', 'W. Bekele', 'A. Tesfaye'];
      
      return studentNames.map((name, idx) => {
        const numRecords = Math.floor(Math.random() * 3) + 2;
        const records = [];
        for (let i = 0; i < numRecords; i++) {
          const isPositive = Math.random() > 0.2;
          const date = new Date();
          date.setDate(date.getDate() - i);
          records.push({
            id: `${grade}${section}-${idx}-${i}`,
            date: date.toISOString().split('T')[0],
            type: isPositive ? 'positive' as const : 'negative' as const,
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            recordedBy: teachers[Math.floor(Math.random() * teachers.length)]
          });
        }
        return { studentName: name, grade: `${grade}${section}`, rollNo: String(idx + 1).padStart(3, '0'), records };
      });
    };

    const handleViewBehavior = () => {
      if (!selectedGrade || !selectedSection) {
        toast({ title: 'Selection Required', description: 'Please select both grade and section', variant: 'destructive' });
        return;
      }
      setViewGrade(selectedGrade);
      setViewSection(selectedSection);
      toast({ title: 'Loading', description: `Viewing behavior for Grade ${selectedGrade}${selectedSection}` });
    };

    const filteredStudents = viewGrade && viewSection ? generateDemoData(viewGrade, viewSection) : [];

    const totalPositive = filteredStudents.reduce((sum, student) => 
      sum + student.records.filter(r => r.type === 'positive').length, 0
    );
    const totalNegative = filteredStudents.reduce((sum, student) => 
      sum + student.records.filter(r => r.type === 'negative').length, 0
    );

    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">All Students Behavior Analytics</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select Class to View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9">Grade 9</SelectItem>
                      <SelectItem value="10">Grade 10</SelectItem>
                      <SelectItem value="11">Grade 11</SelectItem>
                      <SelectItem value="12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Section</Label>
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Section A</SelectItem>
                      <SelectItem value="B">Section B</SelectItem>
                      <SelectItem value="C">Section C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleViewBehavior}>
                  View Behavior Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-orange-50 border-orange-200 dark:bg-orange-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-orange-700 dark:text-orange-400 flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5" /> Total Positive Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-800 dark:text-orange-300">{totalPositive}</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200 dark:bg-red-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-red-700 dark:text-red-400 flex items-center gap-2">
                  <ThumbsDown className="h-5 w-5" /> Total Negative Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-800 dark:text-red-300">{totalNegative}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{filteredStudents.length}</p>
              </CardContent>
            </Card>
          </div>

          {!viewGrade || !viewSection ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Please select grade and section, then click "View Behavior" to see analytics.
              </CardContent>
            </Card>
          ) : (
            filteredStudents.map((student, idx) => {
            const positiveCount = student.records.filter(r => r.type === 'positive').length;
            const negativeCount = student.records.filter(r => r.type === 'negative').length;
            const conductGrade = positiveCount >= 10 && negativeCount === 0 ? 'A' : 
                                positiveCount >= 5 && negativeCount <= 2 ? 'B' : 
                                positiveCount >= 3 && negativeCount <= 5 ? 'C' : 'D';

            return (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{student.studentName}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Grade {student.grade} • Roll No: {student.rollNo}</p>
                    </div>
                    <Badge className="text-lg px-4 py-2">{conductGrade}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Positive</span>
                        <span className="text-xl font-bold text-orange-800 dark:text-orange-300">{positiveCount}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <span className="text-sm font-medium text-red-700 dark:text-red-400">Negative</span>
                        <span className="text-xl font-bold text-red-800 dark:text-red-300">{negativeCount}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Recent Records</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Recorded By</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {student.records.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>{new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</TableCell>
                              <TableCell>
                                <Badge className={record.type === 'positive' ? 'bg-orange-500' : 'bg-red-500'}>
                                  {record.type === 'positive' ? 'Positive' : 'Negative'}
                                </Badge>
                              </TableCell>
                              <TableCell>{record.description}</TableCell>
                              <TableCell>{record.recordedBy}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
          )}
        </div>
      </DashboardLayout>
    );
  }

  // Parent view - show all children's behavior
  if (isParent) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">My Children's Behavior</h2>
          </div>

          {parentChildrenBehavior.map((child, idx) => {
            const positiveCount = child.records.filter(r => r.type === 'positive').length;
            const negativeCount = child.records.filter(r => r.type === 'negative').length;
            const conductGrade = positiveCount >= 10 && negativeCount === 0 ? 'A' : 
                                positiveCount >= 5 && negativeCount <= 2 ? 'B' : 
                                positiveCount >= 3 && negativeCount <= 5 ? 'C' : 'D';

            return (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{child.childName}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Grade {child.grade}</p>
                    </div>
                    <Badge className="text-lg px-4 py-2">{conductGrade}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="bg-orange-50 border-orange-200 dark:bg-orange-900/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-orange-700 dark:text-orange-400 flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4" /> Positive Points
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-orange-800 dark:text-orange-300">{positiveCount}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-red-50 border-red-200 dark:bg-red-900/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                            <ThumbsDown className="h-4 w-4" /> Negative Points
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-red-800 dark:text-red-300">{negativeCount}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Recent Records</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Recorded By</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {child.records.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>{new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</TableCell>
                              <TableCell>
                                <Badge className={record.type === 'positive' ? 'bg-orange-500' : 'bg-red-500'}>
                                  {record.type === 'positive' ? 'Positive' : 'Negative'}
                                </Badge>
                              </TableCell>
                              <TableCell>{record.description}</TableCell>
                              <TableCell>{record.recordedBy}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DashboardLayout>
    );
  }

  // Teacher/Student view
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Behavior Analytics</h2>
          {(isTeacher || isDirector) && (
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                   <Button>
                      <Plus className="mr-2 h-4 w-4" /> Record Incident
                   </Button>
                </DialogTrigger>
                <DialogContent>
                   <DialogHeader>
                      <DialogTitle>Record Student Behavior</DialogTitle>
                   </DialogHeader>
                   <Form {...behaviorForm}>
                     <form onSubmit={handleSaveRecord} className="space-y-4 py-4">
                        <FormField
                          control={behaviorForm.control}
                          name="studentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Student</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select student" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="student1">Abebe Kebede</SelectItem>
                                  <SelectItem value="student2">Sara Tadesse</SelectItem>
                                  <SelectItem value="student3">Dawit Mekonnen</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={behaviorForm.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="positive">Positive</SelectItem>
                                    <SelectItem value="negative">Negative</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={behaviorForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="academic">Academic</SelectItem>
                                    <SelectItem value="social">Social</SelectItem>
                                    <SelectItem value="disciplinary">Disciplinary</SelectItem>
                                    <SelectItem value="participation">Participation</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={behaviorForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <SanitizedTextarea sanitizer="description" placeholder="Describe the incident..." rows={4} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                           <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                           <Button type="submit" disabled={behaviorForm.formState.isSubmitting || createMutation.isPending}>
                             {(behaviorForm.formState.isSubmitting || createMutation.isPending) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                             Save Record
                           </Button>
                        </DialogFooter>
                     </form>
                   </Form>
                </DialogContent>
             </Dialog>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-orange-700 dark:text-orange-400 flex items-center gap-2">
                 <ThumbsUp className="h-5 w-5" /> Positive Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-800 dark:text-orange-300">{positiveCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-red-700 dark:text-red-400 flex items-center gap-2">
                 <ThumbsDown className="h-5 w-5" /> Negative Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-800 dark:text-red-300">{negativeCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Conduct Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{conductGrade}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading records...</div>
            ) : records.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No behavior records yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Recorded By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                       <TableCell>{formatDate(record.date)}</TableCell>
                       <TableCell className="font-medium">{record.studentName}</TableCell>
                       <TableCell>
                         <Badge className={record.type === 'positive' ? 'bg-orange-500' : 'bg-red-500'}>
                           {record.type === 'positive' ? 'Positive' : 'Negative'}
                         </Badge>
                       </TableCell>
                       <TableCell>{record.description}</TableCell>
                       <TableCell>{record.recordedBy}</TableCell>
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
