import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, Download, Edit, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTimetableStore } from '@/store/useTimetableStore';
import { a11y } from '@/lib/a11y';

const DEMO_TEACHERS = [
  { id: '1', name: 'Tigist Alemu' },
  { id: '2', name: 'Meron Bekele' },
  { id: '3', name: 'Dawit Mekonnen' },
  { id: '4', name: 'Sara Tadesse' },
  { id: '5', name: 'Yared Haile' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Amharic', 'History', 'Geography'];

export default function TimetablePage() {
  const { user } = useAuthStore();
  const { timetables, addTimetable, updateTimetable, deleteTimetable, postTimetable, unpostTimetable, getTimetableByGradeSection } = useTimetableStore();

  const isDirector = user?.role === 'director';
  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';

  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [periods, setPeriods] = useState([
    { id: 1, time: '08:00-08:45' },
    { id: 2, time: '08:45-09:30' },
    { id: 3, time: '09:30-10:15' },
    { id: 4, time: '10:30-11:15' },
    { id: 5, time: '11:15-12:00' },
    { id: 6, time: '12:00-12:45' },
  ]);
  const [editingPeriodId, setEditingPeriodId] = useState<number | null>(null);

  const handlePeriodTimeChange = useCallback((periodId: number, newTime: string) => {
    setPeriods(prev => prev.map(p => p.id === periodId ? { ...p, time: newTime } : p));
  }, []);
  const [timetableData, setTimetableData] = useState<any[]>([]);

  // Load timetable for students/teachers
  useEffect(() => {
    if ((isStudent || isTeacher) && selectedGrade && selectedSection) {
      const posted = getTimetableByGradeSection(selectedGrade, selectedSection);
      if (posted) {
        setPeriods(posted.periods);
        setTimetableData(posted.schedule);
      } else {
        setTimetableData([]);
      }
    }
  }, [isStudent, isTeacher, selectedGrade, selectedSection, getTimetableByGradeSection]);

  // Get list of posted timetables for students/teachers
  const postedTimetables = (isStudent || isTeacher) ? timetables.filter(t => t.isPosted) : [];

  const handleCreateNew = useCallback(() => {
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
    setEditingId(null);
    toast.success(`Creating timetable for Grade ${selectedGrade}${selectedSection}`);
  }, [selectedGrade, selectedSection, periods]);

  const handleEdit = useCallback((timetable: typeof timetables[0]) => {
    setSelectedGrade(timetable.grade);
    setSelectedSection(timetable.section);
    setPeriods(timetable.periods);
    setTimetableData(timetable.schedule);
    setIsEditing(true);
    setEditingId(timetable.id);
    toast.info('Editing timetable');
  }, []);

  const handleSave = () => {
    if (editingId) {
      updateTimetable(editingId, {
        periods,
        schedule: timetableData,
      });
      toast.success('Timetable updated');
    } else {
      addTimetable({
        grade: selectedGrade,
        section: selectedSection,
        academicYear: new Date().getFullYear().toString(),
        periods,
        schedule: timetableData,
        isPosted: false,
      });
      toast.success('Timetable saved as draft');
    }
    setIsEditing(false);
    setEditingId(null);
  };

  const handlePost = (id: string) => {
    postTimetable(id);
    toast.success('Timetable posted! Students and teachers can now view it.');
  };

  const handleUnpost = (id: string) => {
    unpostTimetable(id);
    toast.info('Timetable unpublished');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this timetable?')) {
      deleteTimetable(id);
      toast.success('Timetable deleted');
    }
  };

  const handleCellChange = useCallback((dayIndex: number, periodIndex: number, field: string, value: string) => {
    setTimetableData(prev => {
      const updated = [...prev];
      updated[dayIndex].periods[periodIndex][field] = value;

      if (field === 'teacherId') {
        const teacher = DEMO_TEACHERS.find(t => t.id === value);
        updated[dayIndex].periods[periodIndex].teacherName = teacher?.name || '';
      }

      return updated;
    });
  }, []);

  const handleExport = () => {
    if (timetableData.length === 0) {
      toast.error('No timetable data to export');
      return;
    }

    let csv = `Grade ${selectedGrade}${selectedSection} - Weekly Timetable\\n\\n`;
    csv += 'Period/Day,' + days.join(',') + '\\n';

    periods.forEach((period, periodIdx) => {
      const row = [`Period ${period.id} (${period.time})`];
      timetableData.forEach(dayData => {
        const cell = dayData.periods[periodIdx];
        const cellText = cell.subject && cell.teacherName
          ? `${cell.subject} - ${cell.teacherName}`
          : '';
        row.push(cellText);
      });
      csv += row.join(',') + '\\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Timetable_Grade${selectedGrade}${selectedSection}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Timetable exported');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">{isDirector ? 'Manage Timetables' : 'My Timetable'}</h2>

        {(isStudent || isTeacher) && (
          <Card>
            <CardHeader>
              <CardTitle>Select Your Class</CardTitle>
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
              </div>
              {postedTimetables.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Available timetables:</p>
                  <div className="flex gap-2 mt-2">
                    {postedTimetables.map(tt => (
                      <Button
                        key={tt.id}
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedGrade(tt.grade);
                          setSelectedSection(tt.section);
                        }}
                      >
                        Grade {tt.grade}{tt.section}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {isDirector && !isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>All Timetables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timetables.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No timetables created yet</p>
                ) : (
                  timetables.map(tt => (
                    <div key={tt.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <p className="font-semibold">Grade {tt.grade}{tt.section}</p>
                        <p className="text-sm text-muted-foreground">
                          {tt.isPosted ? '✓ Posted' : 'Draft'} • Updated {new Date(tt.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(tt)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        {tt.isPosted ? (
                          <Button size="sm" variant="outline" onClick={() => handleUnpost(tt.id)}>
                            <EyeOff className="h-4 w-4 mr-1" /> Unpost
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => handlePost(tt.id)}>
                            <Eye className="h-4 w-4 mr-1" /> Post
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(tt.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {isDirector && !isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Timetable</CardTitle>
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
                <Button onClick={handleCreateNew}>
                  <Plus className="mr-2 h-4 w-4" /> Create
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {timetableData.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Grade {selectedGrade}{selectedSection} - Weekly Timetable</CardTitle>
                <div className="flex gap-2">
                  {isEditing && (
                    <>
                      <Button variant="outline" onClick={() => { setIsEditing(false); setTimetableData([]); }}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" /> Save
                      </Button>
                    </>
                  )}
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={handleExport}>
                      <Download className="mr-2 h-4 w-4" /> Export
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
                          <div>Period {period.id}</div>
                          {isEditing && isDirector ? (
                            editingPeriodId === period.id ? (
                              <Input
                                value={period.time}
                                onChange={(e) => handlePeriodTimeChange(period.id, e.target.value)}
                                onBlur={() => setEditingPeriodId(null)}
                                className="text-xs h-6 w-24"
                              />
                            ) : (
                              <div
                                {...a11y.makeInteractive(() => setEditingPeriodId(period.id))}
                                className="text-xs text-muted-foreground cursor-pointer hover:text-primary"
                              >
                                {period.time}
                              </div>
                            )
                          ) : (
                            <div className="text-xs text-muted-foreground">{period.time}</div>
                          )}
                        </td>
                        {timetableData.map((dayData, dayIdx) => (
                          <td key={dayIdx} className="border p-2">
                            {isEditing ? (
                              <div className="space-y-2">
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
                                    {DEMO_TEACHERS.map(t => (
                                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
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

        {(isStudent || isTeacher) && timetableData.length === 0 && selectedGrade && selectedSection && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No timetable has been posted for Grade {selectedGrade}{selectedSection} yet.
            </CardContent>
          </Card>
        )}

        {(isStudent || isTeacher) && !selectedGrade && !selectedSection && postedTimetables.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No timetables have been posted yet. Please check back later.
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
