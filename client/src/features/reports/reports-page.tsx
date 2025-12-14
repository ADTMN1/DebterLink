import { useState } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Users, BookOpen, CheckCircle2 } from 'lucide-react';

const dataByPeriod = {
  week: {
    kpis: [
      { label: 'Daily Attendance', value: '96%', change: '+2% vs last week' },
      { label: 'Classes Held', value: '142', change: '+5 this week' },
      { label: 'Assignments Due', value: '28', change: '12 completed' },
      { label: 'Teacher Presence', value: '98%', change: '+1% this week' },
    ],
    attendance: [
      { grade: 'Grade 9', rate: '94%' },
      { grade: 'Grade 10', rate: '96%' },
      { grade: 'Grade 11', rate: '97%' },
      { grade: 'Grade 12', rate: '98%' },
    ],
    schools: [
      { name: 'Bole High School', region: 'Addis Ababa', attendance: '99%', grade: 'A' },
      { name: 'Adama Model School', region: 'Oromia', attendance: '97%', grade: 'A-' },
      { name: 'Bahir Dar Academy', region: 'Amhara', attendance: '96%', grade: 'B+' },
    ]
  },
  month: {
    kpis: [
      { label: 'Monthly Attendance', value: '94%', change: '+1.5% vs last month' },
      { label: 'Total Classes', value: '580', change: '+45 this month' },
      { label: 'Exams Conducted', value: '12', change: '8 graded' },
      { label: 'Parent Meetings', value: '24', change: '+6 this month' },
    ],
    attendance: [
      { grade: 'Grade 9', rate: '92%' },
      { grade: 'Grade 10', rate: '93%' },
      { grade: 'Grade 11', rate: '95%' },
      { grade: 'Grade 12', rate: '96%' },
    ],
    schools: [
      { name: 'Bole High School', region: 'Addis Ababa', attendance: '97%', grade: 'A-' },
      { name: 'Adama Model School', region: 'Oromia', attendance: '95%', grade: 'B+' },
      { name: 'Bahir Dar Academy', region: 'Amhara', attendance: '94%', grade: 'B+' },
    ]
  },
  term: {
    kpis: [
      { label: 'Active Schools', value: '24', change: '+2 this term' },
      { label: 'Total Students', value: '15,420', change: '+320 this term' },
      { label: 'Attendance Rate', value: '93%', change: '+0.8% this term' },
      { label: 'Average Grade', value: 'B+', change: '+0.3 this term' },
    ],
    attendance: [
      { grade: 'Grade 9', rate: '91%' },
      { grade: 'Grade 10', rate: '92%' },
      { grade: 'Grade 11', rate: '94%' },
      { grade: 'Grade 12', rate: '95%' },
    ],
    schools: [
      { name: 'Bole High School', region: 'Addis Ababa', attendance: '96%', grade: 'A-' },
      { name: 'Adama Model School', region: 'Oromia', attendance: '94%', grade: 'B+' },
      { name: 'Bahir Dar Academy', region: 'Amhara', attendance: '93%', grade: 'B' },
    ]
  },
  year: {
    kpis: [
      { label: 'Schools Network', value: '28', change: '+8 this year' },
      { label: 'Total Enrollment', value: '18,750', change: '+2,100 this year' },
      { label: 'Graduation Rate', value: '89%', change: '+3% this year' },
      { label: 'Teacher Retention', value: '92%', change: '+5% this year' },
    ],
    attendance: [
      { grade: 'Grade 9', rate: '88%' },
      { grade: 'Grade 10', rate: '90%' },
      { grade: 'Grade 11', rate: '92%' },
      { grade: 'Grade 12', rate: '94%' },
    ],
    schools: [
      { name: 'Bole High School', region: 'Addis Ababa', attendance: '94%', grade: 'A-' },
      { name: 'Adama Model School', region: 'Oromia', attendance: '92%', grade: 'B+' },
      { name: 'Bahir Dar Academy', region: 'Amhara', attendance: '90%', grade: 'B' },
    ]
  }
};

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<keyof typeof dataByPeriod>('term');
  const currentData = dataByPeriod[selectedPeriod];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics & Reports</h2>
            <p className="text-muted-foreground">
              High-level overview of school performance - {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} view
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={(value: keyof typeof dataByPeriod) => setSelectedPeriod(value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="term">This Term</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {currentData.kpis.map((item) => (
            <Card key={item.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-emerald-600 mt-1">{item.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Attendance by Grade ({selectedPeriod})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grade</TableHead>
                    <TableHead>Average Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.attendance.map((row) => (
                    <TableRow key={row.grade}>
                      <TableCell>{row.grade}</TableCell>
                      <TableCell>{row.rate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Top Performing Schools ({selectedPeriod})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Avg Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.schools.map((school) => (
                    <TableRow key={school.name}>
                      <TableCell>{school.name}</TableCell>
                      <TableCell>{school.region}</TableCell>
                      <TableCell>{school.attendance}</TableCell>
                      <TableCell>{school.grade}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Use this dashboard to quickly understand which schools need support and which are
              leading in attendance and academic performance.
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Future versions can plug into real-time data from the DebterLink database.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}







