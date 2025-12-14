import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { Check, X, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function AttendancePage() {
  const { user } = useAuthStore();
  const isTeacher = user?.role === 'teacher';

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const defaultClassId = 'grade-11A-physics';

  // Mock Data
  const [students, setStudents] = useState([
    { id: 1, name: 'Abebe Kebede', status: 'present' },
    { id: 2, name: 'Sara Tadesse', status: 'present' },
    { id: 3, name: 'Yared Haile', status: 'absent' },
    { id: 4, name: 'Lydia Mengistu', status: 'late' },
    { id: 5, name: 'Dawit Alemu', status: 'present' },
  ]);

  const updateStatus = (id: number, status: 'present' | 'absent' | 'late') => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );
  };

  const saveAttendanceMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/attendance', {
        classId: defaultClassId,
        className: 'Grade 11A - Physics',
        date: today,
        records: students.map((s) => ({
          studentId: s.id,
          name: s.name,
          status: s.status,
        })),
      });
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
            <p className="text-muted-foreground">
              {isTeacher ? 'Mark attendance for your class' : 'View your attendance record'}
            </p>
          </div>
          
          {isTeacher && (
            <div className="flex items-center gap-2">
              <Select defaultValue="11A">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="11A">Grade 11A</SelectItem>
                  <SelectItem value="11B">Grade 11B</SelectItem>
                  <SelectItem value="12A">Grade 12A</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => saveAttendanceMutation.mutate()}
                disabled={saveAttendanceMutation.isPending}
              >
                {saveAttendanceMutation.isPending ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          )}
        </div>

        {isTeacher ? (
          <Card>
            <CardHeader>
              <CardTitle>Grade 11A - Physics (Today)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {student.name}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${student.status === 'present' ? 'bg-orange-100 text-orange-800' :
                            student.status === 'absent' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                          {student.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant={student.status === 'present' ? 'default' : 'outline'}
                          className={student.status === 'present' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                          onClick={() => updateStatus(student.id, 'present')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant={student.status === 'absent' ? 'destructive' : 'outline'}
                          onClick={() => updateStatus(student.id, 'absent')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant={student.status === 'late' ? 'secondary' : 'outline'}
                          className={student.status === 'late' ? 'bg-yellow-500 text-white hover:bg-yellow-600' : ''}
                          onClick={() => updateStatus(student.id, 'late')}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>My Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                 <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900">
                    <p className="text-sm text-muted-foreground">Present Days</p>
                    <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">42</p>
                 </div>
                 <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900">
                    <p className="text-sm text-muted-foreground">Absent Days</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">1</p>
                 </div>
                 <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900">
                    <p className="text-sm text-muted-foreground">Late Days</p>
                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">3</p>
                 </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Dec 01, 2025</TableCell>
                    <TableCell>Monday</TableCell>
                    <TableCell><span className="text-orange-600 font-medium">Present</span></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Nov 29, 2025</TableCell>
                    <TableCell>Friday</TableCell>
                    <TableCell><span className="text-orange-600 font-medium">Present</span></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Nov 28, 2025</TableCell>
                    <TableCell>Thursday</TableCell>
                    <TableCell><span className="text-yellow-600 font-medium">Late</span></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
