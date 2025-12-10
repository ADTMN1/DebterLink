import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, FileText, ClipboardCheck, Award } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

const mockGrades = {
  semester1: {
    Mathematics: {
      assignments: [{ name: 'Assignment 1', score: 95, max: 100, date: '2024-09-15' }, { name: 'Assignment 2', score: 88, max: 100, date: '2024-10-01' }],
      quizzes: [{ name: 'Quiz 1', score: 92, max: 100, date: '2024-09-20' }, { name: 'Quiz 2', score: 85, max: 100, date: '2024-10-10' }],
      midterm: { score: 90, max: 100, date: '2024-10-25' },
      final: { score: 93, max: 100, date: '2024-12-15' },
      average: 91.5
    },
    Physics: {
      assignments: [{ name: 'Lab Report 1', score: 88, max: 100, date: '2024-09-18' }],
      quizzes: [{ name: 'Quiz 1', score: 90, max: 100, date: '2024-09-25' }],
      midterm: { score: 87, max: 100, date: '2024-10-28' },
      final: { score: 89, max: 100, date: '2024-12-18' },
      average: 88.5
    },
    Amharic: {
      assignments: [{ name: 'Essay 1', score: 85, max: 100, date: '2024-09-22' }],
      quizzes: [{ name: 'Quiz 1', score: 88, max: 100, date: '2024-10-05' }],
      midterm: { score: 86, max: 100, date: '2024-10-30' },
      final: { score: 87, max: 100, date: '2024-12-20' },
      average: 86.5
    }
  },
  semester2: {
    Mathematics: {
      assignments: [{ name: 'Assignment 1', score: 92, max: 100, date: '2025-01-15' }],
      quizzes: [{ name: 'Quiz 1', score: 94, max: 100, date: '2025-01-25' }],
      midterm: { score: 91, max: 100, date: '2025-02-20' },
      final: null,
      average: 92.3
    },
    Physics: {
      assignments: [{ name: 'Lab Report 1', score: 90, max: 100, date: '2025-01-18' }],
      quizzes: [{ name: 'Quiz 1', score: 88, max: 100, date: '2025-01-28' }],
      midterm: { score: 89, max: 100, date: '2025-02-22' },
      final: null,
      average: 89.0
    }
  }
};

const getGradeColor = (percentage: number) => {
  if (percentage >= 90) return 'text-green-600 dark:text-green-400';
  if (percentage >= 80) return 'text-blue-600 dark:text-blue-400';
  if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const getGradeLetter = (percentage: number) => {
  if (percentage >= 90) return 'A';
  if (percentage >= 85) return 'A-';
  if (percentage >= 80) return 'B+';
  if (percentage >= 75) return 'B';
  if (percentage >= 70) return 'B-';
  if (percentage >= 65) return 'C+';
  if (percentage >= 60) return 'C';
  return 'F';
};

export default function StudentGrades() {
  const { user } = useAuthStore();
  const isParent = user?.role === 'parent';
  
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedSemester, setSelectedSemester] = useState('semester1');
  const [selectedChild, setSelectedChild] = useState('child1');

  // Mock children data for parents
  const children = [
    { id: 'child1', name: 'Yared Mekonnen', grade: 'Grade 11' },
    { id: 'child2', name: 'Sara Tadesse', grade: 'Grade 9' },
  ];

  const currentData = mockGrades[selectedSemester as keyof typeof mockGrades];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Grades & Results</h1>
          <div className="flex gap-2">
            {isParent && (
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name} - {child.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024 E.C.</SelectItem>
                <SelectItem value="2023">2023 E.C.</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semester1">Semester 1</SelectItem>
                <SelectItem value="semester2">Semester 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assignments</p>
                  <p className="text-2xl font-bold">
                    {Object.values(currentData).reduce((acc, subject) => acc + subject.assignments.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <ClipboardCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quizzes</p>
                  <p className="text-2xl font-bold">
                    {Object.values(currentData).reduce((acc, subject) => acc + subject.quizzes.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold">
                    {(Object.values(currentData).reduce((acc, subject) => acc + subject.average, 0) / Object.keys(currentData).length).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Grade</p>
                  <p className="text-2xl font-bold">
                    {getGradeLetter(Object.values(currentData).reduce((acc, subject) => acc + subject.average, 0) / Object.keys(currentData).length)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {Object.entries(currentData).map(([subject, data]) => (
          <Card key={subject}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{subject}</CardTitle>
                <Badge variant="outline" className="text-lg">
                  {data.average.toFixed(1)}% - {getGradeLetter(data.average)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="assignments">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="assignments">Assignments</TabsTrigger>
                  <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                  <TabsTrigger value="midterm">Mid-term</TabsTrigger>
                  <TabsTrigger value="final">Final</TabsTrigger>
                </TabsList>

                <TabsContent value="assignments" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.assignments.map((assignment, idx) => {
                        const percentage = (assignment.score / assignment.max) * 100;
                        return (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{assignment.name}</TableCell>
                            <TableCell>{assignment.date}</TableCell>
                            <TableCell>{assignment.score}/{assignment.max}</TableCell>
                            <TableCell>
                              <span className={getGradeColor(percentage)}>
                                {percentage.toFixed(1)}% ({getGradeLetter(percentage)})
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="quizzes" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quiz</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.quizzes.map((quiz, idx) => {
                        const percentage = (quiz.score / quiz.max) * 100;
                        return (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{quiz.name}</TableCell>
                            <TableCell>{quiz.date}</TableCell>
                            <TableCell>{quiz.score}/{quiz.max}</TableCell>
                            <TableCell>
                              <span className={getGradeColor(percentage)}>
                                {percentage.toFixed(1)}% ({getGradeLetter(percentage)})
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="midterm" className="mt-4">
                  {data.midterm ? (
                    <div className="p-6 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Mid-term Exam</p>
                          <p className="text-lg font-medium mt-1">{data.midterm.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold">{data.midterm.score}/{data.midterm.max}</p>
                          <p className={`text-xl font-semibold ${getGradeColor((data.midterm.score / data.midterm.max) * 100)}`}>
                            {((data.midterm.score / data.midterm.max) * 100).toFixed(1)}% ({getGradeLetter((data.midterm.score / data.midterm.max) * 100)})
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No mid-term exam yet</p>
                  )}
                </TabsContent>

                <TabsContent value="final" className="mt-4">
                  {data.final ? (
                    <div className="p-6 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Final Exam</p>
                          <p className="text-lg font-medium mt-1">{data.final.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold">{data.final.score}/{data.final.max}</p>
                          <p className={`text-xl font-semibold ${getGradeColor((data.final.score / data.final.max) * 100)}`}>
                            {((data.final.score / data.final.max) * 100).toFixed(1)}% ({getGradeLetter((data.final.score / data.final.max) * 100)})
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">Final exam not yet taken</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
