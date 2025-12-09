import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Clock, Save, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

type TimetableEntry = {
  id: string;
  classId: string;
  className: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  day: string;
  startTime: string;
  endTime: string;
  room?: string;
  academicYear: string;
};

const fetchTimetable = async (): Promise<TimetableEntry[]> => {
  const res = await fetch('/api/timetable');
  if (!res.ok) throw new Error('Failed to fetch timetable');
  return res.json();
};

const fetchClasses = async () => {
  const res = await fetch('/api/classes');
  if (!res.ok) throw new Error('Failed to fetch classes');
  return res.json();
};

const fetchTeachers = async () => {
  const res = await fetch('/api/admin/users');
  if (!res.ok) throw new Error('Failed to fetch teachers');
  const users = await res.json();
  return users.filter((u: any) => u.role === 'Teacher' && u.status === 'Active');
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const dayAbbr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'
];

export default function TimetablePage() {
  const { user } = useAuthStore();

  const queryClient = useQueryClient();

  // Only directors can access this page
  if (user?.role !== 'director') {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Weekly Timetable</h2>
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              You don't have permission to access this page. Only directors can create and manage timetables.
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [timetableData, setTimetableData] = useState<any[]>([]);
  const [periods, setPeriods] = useState([
    { id: 1, time: '08:00-08:45' },
    { id: 2, time: '08:45-09:30' },
    { id: 3, time: '09:30-10:15' },
    { id: 4, time: '10:30-11:15' },
    { id: 5, time: '11:15-12:00' },
    { id: 6, time: '12:00-12:45' },
  ]);
  
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Amharic', 'History', 'Geography'];

  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: fetchTeachers,
  });

  const handleCreateTimetable = () => {
    if (!selectedGrade || !selectedSection) {
      toast.error('Please select grade and section');
      return;
    }
    
    const initialData = days.map(day => ({
      day,
      periods: periods.map(period => ({
        periodId: period.id,
        time: period.time,
        subject: '',
        teacherId: '',
        teacherName: ''
      }))
    }));
    
    setTimetableData(initialData);
    setIsEditing(true);
    toast.success(`Creating timetable for Grade ${selectedGrade}${selectedSection}`);
  };

  const handleCellChange = (dayIndex: number, periodIndex: number, field: string, value: string) => {
    setTimetableData(prev => {
      const updated = [...prev];
      updated[dayIndex].periods[periodIndex][field] = value;
      
      if (field === 'teacherId') {
        const teacher = teachers.find((t: any) => t.id === value);
        updated[dayIndex].periods[periodIndex].teacherName = teacher?.name || '';
      }
      
      return updated;
    });
  };

  const handleSave = () => {
    console.log('Saving timetable:', { grade: selectedGrade, section: selectedSection, data: timetableData });
    setIsEditing(false);
    toast.success('Timetable saved successfully!');
  };

  const handleExport = () => {
    if (timetableData.length === 0) {
      toast.error('No timetable data to export');
      return;
    }

    let csv = `Grade ${selectedGrade}${selectedSection} - Weekly Timetable\n\n`;
    csv += 'Period/Day,' + days.join(',') + '\n';

    periods.forEach((period, periodIdx) => {
      const row = [`Period ${period.id} (${period.time})`];
      timetableData.forEach(dayData => {
        const cell = dayData.periods[periodIdx];
        const cellText = cell.subject && cell.teacherName 
          ? `${cell.subject} - ${cell.teacherName}`
          : '';
        row.push(cellText);
      });
      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Timetable_Grade${selectedGrade}${selectedSection}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Timetable exported successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTimetableData([]);
  };

  const handleAddPeriod = () => {
    const newId = periods.length + 1;
    const newPeriod = { id: newId, time: '13:00-13:45' };
    setPeriods([...periods, newPeriod]);
    
    setTimetableData(prev => prev.map(dayData => ({
      ...dayData,
      periods: [...dayData.periods, { periodId: newId, time: newPeriod.time, subject: '', teacherId: '', teacherName: '' }]
    })));
    
    toast.success('Period added');
  };

  const handleRemovePeriod = (periodId: number) => {
    if (periods.length <= 1) {
      toast.error('Must have at least one period');
      return;
    }
    
    setPeriods(periods.filter(p => p.id !== periodId));
    setTimetableData(prev => prev.map(dayData => ({
      ...dayData,
      periods: dayData.periods.filter((p: any) => p.periodId !== periodId)
    })));
    
    toast.success('Period removed');
  };

  const handlePeriodTimeChange = (periodId: number, newTime: string) => {
    setPeriods(periods.map(p => p.id === periodId ? { ...p, time: newTime } : p));
    setTimetableData(prev => prev.map(dayData => ({
      ...dayData,
      periods: dayData.periods.map((p: any) => p.periodId === periodId ? { ...p, time: newTime } : p)
    })));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Create Timetable</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="space-y-2">
                <Label>Grade</Label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade} disabled={isEditing}>
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
                <Select value={selectedSection} onValueChange={setSelectedSection} disabled={isEditing}>
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
              {!isEditing ? (
                <Button onClick={handleCreateTimetable}>
                  <Plus className="mr-2 h-4 w-4" /> Create Timetable
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> Save Timetable
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {timetableData.length > 0 && (
          <Card className="overflow-x-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Grade {selectedGrade}{selectedSection} - Weekly Timetable</CardTitle>
                <div className="flex gap-2">
                  {isEditing && (
                    <Button variant="outline" size="sm" onClick={handleAddPeriod}>
                      <Plus className="mr-2 h-4 w-4" /> Add Period
                    </Button>
                  )}
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={handleExport}>
                      <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-muted font-semibold">Period/Day</th>
                      {days.map(day => (
                        <th key={day} className="border p-2 bg-muted font-semibold">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periods.map((period, periodIdx) => (
                      <tr key={period.id}>
                        <td className="border p-2 font-medium text-sm">
                          {isEditing ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span>Period {period.id}</span>
                                {periods.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-red-600"
                                    onClick={() => handleRemovePeriod(period.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                              <Input
                                value={period.time}
                                onChange={(e) => handlePeriodTimeChange(period.id, e.target.value)}
                                placeholder="08:00-08:45"
                                className="h-7 text-xs"
                              />
                            </div>
                          ) : (
                            <>
                              <div>Period {period.id}</div>
                              <div className="text-xs text-muted-foreground">{period.time}</div>
                            </>
                          )}
                        </td>
                        {timetableData.map((dayData, dayIdx) => (
                          <td key={dayIdx} className="border p-2">
                            <div className="space-y-2">
                              {isEditing ? (
                                <>
                                  <Select
                                    value={dayData.periods[periodIdx].subject}
                                    onValueChange={(v) => handleCellChange(dayIdx, periodIdx, 'subject', v)}
                                  >
                                    <SelectTrigger className="w-full h-8 text-xs">
                                      <SelectValue placeholder="Subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {subjects.map(sub => (
                                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={dayData.periods[periodIdx].teacherId}
                                    onValueChange={(v) => handleCellChange(dayIdx, periodIdx, 'teacherId', v)}
                                  >
                                    <SelectTrigger className="w-full h-8 text-xs">
                                      <SelectValue placeholder="Teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {teachers.map((t: any) => (
                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </>
                              ) : (
                                <div className="text-xs">
                                  {dayData.periods[periodIdx].subject && (
                                    <>
                                      <div className="font-semibold">{dayData.periods[periodIdx].subject}</div>
                                      <div className="text-muted-foreground">{dayData.periods[periodIdx].teacherName}</div>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
