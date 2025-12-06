import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/layouts/dashboard-layout';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export const ResultsPage = () => {
  const { user } = useAuthStore();
  const isTeacher = user?.role === 'teacher';
  const isDirector = user?.role === 'director';
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('');
  const [exam, setExam] = useState('');
  const [resultsList, setResultsList] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableResults, setEditableResults] = useState<any[]>([]);

  const handleAddResult = () => {
    if (!grade || !section || !subject || !exam) {
      toast.error('Please select grade, section, subject, and exam type');
      return;
    }
    
    const dummyStudents = [
      { id: 1, studentName: 'Dawit Mekonnen', rollNo: '001', score: '', grade: '' },
      { id: 2, studentName: 'Sara Tadesse', rollNo: '002', score: '', grade: '' },
      { id: 3, studentName: 'Robel Haile', rollNo: '003', score: '', grade: '' },
      { id: 4, studentName: 'Meron Bekele', rollNo: '004', score: '', grade: '' },
    ];
    
    setEditableResults(dummyStudents);
    setIsEditing(true);
    toast.success('Result entry table loaded. Enter scores for students.');
  };

  const handleScoreChange = (id: number, score: string) => {
    const numScore = parseFloat(score);
    let letterGrade = '';
    
    if (numScore >= 90) letterGrade = 'A';
    else if (numScore >= 80) letterGrade = 'B';
    else if (numScore >= 70) letterGrade = 'C';
    else if (numScore >= 60) letterGrade = 'D';
    else if (numScore >= 0) letterGrade = 'F';
    
    setEditableResults(prev => prev.map(student => 
      student.id === id ? { ...student, score, grade: letterGrade } : student
    ));
  };

  const handleSaveResults = () => {
    const incomplete = editableResults.some(s => !s.score);
    if (incomplete) {
      toast.error('Please enter scores for all students');
      return;
    }
    
    console.log('Saving results:', { grade, section, subject, exam, results: editableResults });
    setResultsList(editableResults);
    setIsEditing(false);
    toast.success('Results saved successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditableResults([]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-section-header">Exam Results Overview</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-card-title">{isTeacher ? 'Add Results' : 'Filter Results'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="space-y-2">
                <Label>Grade</Label>
                <Select value={grade} onValueChange={setGrade} disabled={isEditing}>
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
                <Select value={section} onValueChange={setSection} disabled={isEditing}>
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

              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={subject} onValueChange={setSubject} disabled={isEditing}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Exam Type</Label>
                <Select value={exam} onValueChange={setExam} disabled={isEditing}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="midterm">Midterm</SelectItem>
                    <SelectItem value="final">Final Exam</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                {isTeacher ? (
                  <Button onClick={handleAddResult} disabled={isEditing}>
                    Add Result
                  </Button>
                ) : isDirector ? (
                  <Button onClick={() => {
                    if (!grade || !section || !subject || !exam) {
                      toast.error('Please select all filters');
                      return;
                    }
                    const demoResults = [
                      { id: 1, studentName: 'Dawit Mekonnen', rollNo: '001', score: '92', grade: 'A' },
                      { id: 2, studentName: 'Sara Tadesse', rollNo: '002', score: '88', grade: 'B' },
                      { id: 3, studentName: 'Robel Haile', rollNo: '003', score: '75', grade: 'C' },
                      { id: 4, studentName: 'Meron Bekele', rollNo: '004', score: '95', grade: 'A' },
                    ];
                    setResultsList(demoResults);
                    toast.success('Results loaded');
                  }}>
                    View Results
                  </Button>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">Enter Results - Grade {grade}{section} - {subject}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Score (0-100)</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editableResults.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.rollNo}</TableCell>
                      <TableCell>{student.studentName}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={student.score}
                          onChange={(e) => handleScoreChange(student.id, e.target.value)}
                          className="w-24"
                          placeholder="0-100"
                        />
                      </TableCell>
                      <TableCell className="font-semibold">{student.grade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex gap-4 mt-6 justify-end">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSaveResults}>
                  Save Results
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!isEditing && resultsList.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">Saved Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultsList.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.rollNo}</TableCell>
                      <TableCell>{record.studentName}</TableCell>
                      <TableCell>{record.score}</TableCell>
                      <TableCell className="font-semibold">{record.grade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};


