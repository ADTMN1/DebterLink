import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SanitizedInput } from '@/components/ui/sanitized-input';
import { Save, Plus, Download } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

type Class = {
  id: string;
  name: string;
  grade: string;
  section: string;
};

type StudentGrade = {
  id: number;
  name: string;
  quiz: number;
  test: number;
  mid: number;
  final: number;
};

// Mock demo classes for teachers
const DEMO_CLASSES: Class[] = [
  { id: '1', name: 'Grade 11A', grade: '11', section: 'A' },
  { id: '2', name: 'Grade 11B', grade: '11', section: 'B' },
  { id: '3', name: 'Grade 10A', grade: '10', section: 'A' },
];

export default function GradebookPage() {
  const { user } = useAuthStore();

  // Only teachers can access this page
  if (user?.role !== 'teacher') {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Gradebook</h2>
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              You don&apos;t have permission to access this page. Only teachers can manage gradebooks.
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const assignedClasses = DEMO_CLASSES;
  const loadingClasses = false;

  // Mock students - in real app, this would come from API
  const [students, setStudents] = useState<StudentGrade[]>([
    { id: 1, name: 'Abebe Kebede', quiz: 18, test: 15, mid: 25, final: 0 },
    { id: 2, name: 'Sara Tadesse', quiz: 19, test: 17, mid: 28, final: 0 },
    { id: 3, name: 'Yared Haile', quiz: 15, test: 14, mid: 22, final: 0 },
    { id: 4, name: 'Lydia Mengistu', quiz: 20, test: 18, mid: 30, final: 0 },
    { id: 5, name: 'Dawit Alemu', quiz: 16, test: 16, mid: 24, final: 0 },
  ]);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [editingStudents, setEditingStudents] = useState<Set<number>>(new Set());
  const [isEditing, setIsEditing] = useState(false);

  const selectedClass = assignedClasses.find(c => c.id === selectedClassId);

  const updateGrade = (studentId: number, field: 'quiz' | 'test' | 'mid' | 'final', value: string) => {
    const numValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, [field]: numValue }
          : student
      )
    );
  };

  const calculateTotal = (student: StudentGrade): number => {
    // Quiz (20%), Test (20%), Mid (30%), Final (30%)
    const quizWeight = (student.quiz / 100) * 20;
    const testWeight = (student.test / 100) * 20;
    const midWeight = (student.mid / 100) * 30;
    const finalWeight = (student.final / 100) * 30;
    return Math.round((quizWeight + testWeight + midWeight + finalWeight) * 100) / 100;
  };

  const getGradeLetter = (total: number): string => {
    if (total >= 90) return 'A';
    if (total >= 80) return 'B';
    if (total >= 70) return 'C';
    if (total >= 60) return 'D';
    return 'F';
  };

  const toggleEdit = (studentId: number) => {
    setEditingStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const handleSaveStudent = (studentId: number) => {
    setEditingStudents(prev => {
      const newSet = new Set(prev);
      newSet.delete(studentId);
      return newSet;
    });
    const student = students.find(s => s.id === studentId);
    toast.success(`Grades saved for ${student?.name}`);
  };

  const handleAddResult = () => {
    if (!selectedClassId || !selectedSubject) {
      toast.error('Please select class and subject');
      return;
    }
    setIsEditing(true);
    toast.success('Result entry enabled. Enter grades for students.');
  };

  const handleSave = () => {
    if (!selectedClassId || !selectedSubject) {
      toast.error('Please select class and subject');
      return;
    }
    const incomplete = students.some(s => s.quiz === 0 || s.test === 0 || s.mid === 0 || s.final === 0);
    if (incomplete) {
      toast.error('Please enter all grades for all students');
      return;
    }
    setIsEditing(false);
    toast.success(`Grades saved for ${selectedClass?.name} - ${selectedSubject}`);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setStudents([
      { id: 1, name: 'Abebe Kebede', quiz: 18, test: 15, mid: 25, final: 0 },
      { id: 2, name: 'Sara Tadesse', quiz: 19, test: 17, mid: 28, final: 0 },
      { id: 3, name: 'Yared Haile', quiz: 15, test: 14, mid: 22, final: 0 },
      { id: 4, name: 'Lydia Mengistu', quiz: 20, test: 18, mid: 30, final: 0 },
      { id: 5, name: 'Dawit Alemu', quiz: 16, test: 16, mid: 24, final: 0 },
    ]);
  };

  const handleExport = () => {
    if (!selectedClassId || !selectedSubject) {
      toast.error('Please select class and subject');
      return;
    }

    const csvContent = [
      ['Student Name', 'Quiz (20%)', 'Test (20%)', 'Mid Exam (30%)', 'Final Exam (30%)', 'Total (100%)'],
      ...students.map(student => [
        student.name,
        student.quiz,
        student.test,
        student.mid,
        student.final,
        calculateTotal(student).toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedClass?.name}_${selectedSubject}_Grades.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Grades exported successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Gradebook</h2>
          <div className="flex gap-2">
            <Select value={selectedClassId} onValueChange={setSelectedClassId} disabled={isEditing || loadingClasses}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={loadingClasses ? "Loading..." : "Select Class"} />
              </SelectTrigger>
              <SelectContent>
                {assignedClasses.length === 0 ? (
                  <SelectItem value="none" disabled>No classes assigned</SelectItem>
                ) : (
                  assignedClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={isEditing}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Math">Mathematics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="History">History</SelectItem>
              </SelectContent>
            </Select>
            {!isEditing ? (
              <Button onClick={handleAddResult}>
                <Plus className="mr-2 h-4 w-4" /> Add Result
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Save Results
                </Button>
              </>
            )}
          </div>
        </div>

        {selectedClassId && selectedSubject && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedClass?.name} - {selectedSubject} {isEditing && <span className="text-sm text-muted-foreground">(Editing Mode)</span>}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Student Name</TableHead>
                  <TableHead className="text-center">Quiz (20%)</TableHead>
                  <TableHead className="text-center">Test (20%)</TableHead>
                  <TableHead className="text-center">Mid Exam (30%)</TableHead>
                  <TableHead className="text-center">Final Exam (30%)</TableHead>
                  <TableHead className="text-center font-bold">Total (100%)</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const total = calculateTotal(student);
                  const grade = getGradeLetter(total);
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        {(isEditing || editingStudents.has(student.id)) ? (
                          <SanitizedInput
                            sanitizer="text"
                            className="w-20 text-center"
                            type="number"
                            min="0"
                            max="100"
                            value={student.quiz.toString()}
                            onChange={(e) => updateGrade(student.id, 'quiz', e.target.value)}
                          />
                        ) : (
                          <div className="text-center">{student.quiz}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {(isEditing || editingStudents.has(student.id)) ? (
                          <SanitizedInput
                            sanitizer="text"
                            className="w-20 text-center"
                            type="number"
                            min="0"
                            max="100"
                            value={student.test.toString()}
                            onChange={(e) => updateGrade(student.id, 'test', e.target.value)}
                          />
                        ) : (
                          <div className="text-center">{student.test}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {(isEditing || editingStudents.has(student.id)) ? (
                          <SanitizedInput
                            sanitizer="text"
                            className="w-20 text-center"
                            type="number"
                            min="0"
                            max="100"
                            value={student.mid.toString()}
                            onChange={(e) => updateGrade(student.id, 'mid', e.target.value)}
                          />
                        ) : (
                          <div className="text-center">{student.mid}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {(isEditing || editingStudents.has(student.id)) ? (
                          <SanitizedInput
                            sanitizer="text"
                            className="w-20 text-center"
                            type="number"
                            min="0"
                            max="100"
                            value={student.final.toString()}
                            onChange={(e) => updateGrade(student.id, 'final', e.target.value)}
                          />
                        ) : (
                          <div className="text-center">{student.final}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold text-lg">
                        {total.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-center">
                        {!isEditing && (
                          editingStudents.has(student.id) ? (
                            <Button size="sm" onClick={() => handleSaveStudent(student.id)}>
                              <Save className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => toggleEdit(student.id)}>
                              Edit
                            </Button>
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Grading Scale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <p className="font-semibold">Quiz: 20%</p>
                <p className="text-muted-foreground text-xs">Out of 100 points</p>
              </div>
              <div>
                <p className="font-semibold">Test: 20%</p>
                <p className="text-muted-foreground text-xs">Out of 100 points</p>
              </div>
              <div>
                <p className="font-semibold">Mid Exam: 30%</p>
                <p className="text-muted-foreground text-xs">Out of 100 points</p>
              </div>
              <div>
                <p className="font-semibold">Final Exam: 30%</p>
                <p className="text-muted-foreground text-xs">Out of 100 points</p>
              </div>
              <div>
                <p className="font-semibold">Total: 100%</p>
                <p className="text-muted-foreground text-xs">A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: &lt;60</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
