import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import DashboardLayout from '@/layouts/dashboard-layout';
import { useAuthStore } from '@/store/useAuthStore';

// Mock assigned classes for teacher
const teacherAssignedClasses = [
  { grade: '11', section: 'A' },
  { grade: '11', section: 'B' },
  { grade: '12', section: 'A' },
];

// Mock saved attendance records
const savedAttendanceRecords: Record<string, Record<number, string>> = {
  '2025-12-05-11-A': { 1: 'Present', 2: 'Absent', 3: 'Present', 4: 'Late' },
  '2025-12-04-11-A': { 1: 'Present', 2: 'Present', 3: 'Absent', 4: 'Present' },
};

// Mock student database
const allStudents = [
  { id: 1, studentName: 'Dawit Mekonnen', rollNo: '001', grade: '11', section: 'A' },
  { id: 2, studentName: 'Sara Tadesse', rollNo: '002', grade: '11', section: 'A' },
  { id: 3, studentName: 'Robel Haile', rollNo: '003', grade: '11', section: 'B' },
  { id: 4, studentName: 'Meron Bekele', rollNo: '004', grade: '12', section: 'A' },
  { id: 5, studentName: 'Yonas Tadesse', rollNo: '005', grade: '9', section: 'B' },
];

// Mock parent's children (linked to parent account)
const parentChildren = [
  { id: 2, studentName: 'Sara Tadesse', rollNo: '002', grade: '11', section: 'A' },
  { id: 5, studentName: 'Yonas Tadesse', rollNo: '005', grade: '9', section: 'B' },
];

// Mock logged-in student data
const currentStudent = {
  id: 1,
  studentName: 'Dawit Mekonnen',
  rollNo: '001',
  grade: '11',
  section: 'A'
};

// Mock student attendance history
const studentAttendanceHistory = [
  { date: '2025-12-05', status: 'Present' },
  { date: '2025-12-04', status: 'Present' },
  { date: '2025-12-03', status: 'Late' },
  { date: '2025-12-02', status: 'Absent' },
  { date: '2025-12-01', status: 'Present' },
];

export const AttendancePage = () => {
  const { user } = useAuthStore();
  const isTeacher = user?.role === 'teacher';
  const isParent = user?.role === 'parent';
  const isStudent = user?.role === 'student';
  const isDirector = user?.role === 'director';
  
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<number, string>>({});
  


  const handleLoadStudentAttendance = () => {
    setAttendanceList(studentAttendanceHistory);
  };

  const handleLoadParentAttendance = () => {
    const childrenWithAttendance = parentChildren.map(child => {
      const recordKey = `${date}-${child.grade}-${child.section}`;
      const savedRecords = savedAttendanceRecords[recordKey];
      return {
        ...child,
        status: savedRecords?.[child.id] || 'Not Recorded'
      };
    });
    setAttendanceList(childrenWithAttendance);
    const records: Record<number, string> = {};
    childrenWithAttendance.forEach(child => {
      records[child.id] = child.status;
    });
    setAttendanceRecords(records);
  };

  const handleLoadAttendance = (gradeParam?: string, sectionParam?: string) => {
    const targetGrade = gradeParam || grade;
    const targetSection = sectionParam || section;
    
    if (isTeacher) {
      const isAssigned = teacherAssignedClasses.some(
        cls => cls.grade === targetGrade && cls.section === targetSection
      );
      if (!isAssigned) {
        alert('You can only record attendance for your assigned classes');
        return;
      }
    }
    
    console.log('Loading attendance for:', { grade: targetGrade, section: targetSection, date });
    
    const dummyAttendance = [
      { id: 1, studentName: 'Dawit Mekonnen', rollNo: '001' },
      { id: 2, studentName: 'Sara Tadesse', rollNo: '002' },
      { id: 3, studentName: 'Robel Haile', rollNo: '003' },
      { id: 4, studentName: 'Meron Bekele', rollNo: '004' },
    ];
    setAttendanceList(dummyAttendance);
    
    // Load previously saved attendance or default to Present
    const recordKey = `${date}-${targetGrade}-${targetSection}`;
    const savedRecords = savedAttendanceRecords[recordKey];
    
    const initialRecords: Record<number, string> = {};
    dummyAttendance.forEach(student => {
      initialRecords[student.id] = savedRecords?.[student.id] || 'Present';
    });
    setAttendanceRecords(initialRecords);
    
    if (savedRecords) {
      toast.info('Loaded previously recorded attendance');
    }
  };

  const toggleStatus = (studentId: number) => {
    const statuses = ['Present', 'Absent', 'Late'];
    const currentStatus = attendanceRecords[studentId] || 'Present';
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    setAttendanceRecords(prev => ({ ...prev, [studentId]: nextStatus }));
  };

  const handleSaveAttendance = () => {
    const recordKey = `${date}-${grade}-${section}`;
    savedAttendanceRecords[recordKey] = { ...attendanceRecords };
    console.log('Saving attendance:', { grade, section, date, records: attendanceRecords });
    toast.success('Attendance saved successfully!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-section-header text-foreground">Attendance Overview</h2>
        </div>

        {!isParent && !isStudent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-card-title">Filter Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="space-y-2">
                <Label>Grade</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {isTeacher ? (
                      [...new Set(teacherAssignedClasses.map(c => c.grade))].map(g => (
                        <SelectItem key={g} value={g}>Grade {g}</SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="1">Grade 1</SelectItem>
                        <SelectItem value="2">Grade 2</SelectItem>
                        <SelectItem value="3">Grade 3</SelectItem>
                        <SelectItem value="11">Grade 11</SelectItem>
                        <SelectItem value="12">Grade 12</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Section</Label>
                <Select value={section} onValueChange={setSection}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {isTeacher ? (
                      teacherAssignedClasses
                        .filter(c => c.grade === grade)
                        .map(c => (
                          <SelectItem key={c.section} value={c.section}>Section {c.section}</SelectItem>
                        ))
                    ) : (
                      <>
                        <SelectItem value="A">Section A</SelectItem>
                        <SelectItem value="B">Section B</SelectItem>
                        <SelectItem value="C">Section C</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-40"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={handleLoadAttendance}>
                  {isDirector ? 'View Attendance' : 'View & Take Attendance'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {isStudent && (
          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">My Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Student Name</p>
                    <p className="font-medium">{currentStudent.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Grade & Section</p>
                    <p className="font-medium">Grade {currentStudent.grade}{currentStudent.section}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Roll No</p>
                    <p className="font-medium">{currentStudent.rollNo}</p>
                  </div>
                </div>
                <Button onClick={handleLoadStudentAttendance}>
                  View My Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isParent && (
          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">My Children's Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                <Button onClick={handleLoadParentAttendance}>
                  View Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-card-title">
              {isStudent ? 'My Attendance Records' : isParent ? 'Children Attendance' : 'Attendance List'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceList.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isStudent ? (
                        <>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead>Roll No</TableHead>
                          <TableHead>Student Name</TableHead>
                          {isParent && <TableHead>Grade & Section</TableHead>}
                          <TableHead>Status</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isStudent ? (
                      attendanceList.map((record: any, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{record.date}</TableCell>
                          <TableCell>
                            <Badge
                              className={`cursor-default ${
                                record.status === 'Present'
                                  ? 'bg-green-500'
                                  : record.status === 'Absent'
                                  ? 'bg-red-500'
                                  : 'bg-yellow-500'
                              }`}
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      attendanceList.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.rollNo}</TableCell>
                          <TableCell>{student.studentName}</TableCell>
                          {isParent && <TableCell>Grade {student.grade}{student.section}</TableCell>}
                          <TableCell>
                            <Badge
                              onClick={() => isTeacher && toggleStatus(student.id)}
                              className={`${isTeacher ? 'cursor-pointer' : 'cursor-default'} ${
                                attendanceRecords[student.id] === 'Present'
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : attendanceRecords[student.id] === 'Absent'
                                  ? 'bg-red-500 hover:bg-red-600'
                                  : attendanceRecords[student.id] === 'Not Recorded'
                                  ? 'bg-gray-500'
                                  : 'bg-yellow-500 hover:bg-yellow-600'
                              }`}
                            >
                              {attendanceRecords[student.id] || 'Present'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {isTeacher && (
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleSaveAttendance} size="lg">
                      Save Attendance
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No attendance data loaded yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};


