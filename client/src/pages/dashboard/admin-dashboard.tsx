import DashboardLayout from '@/layouts/dashboard-layout';
import { DashboardStatsCard } from '@/components/dashboard/stats-card';
import { Shield, Users, School, Settings, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type School = {
  id: string;
  name: string;
  students: number;
  teachers: number;
  attendance: number;
  status: 'Active' | 'Maintenance';
};

const DEMO_SCHOOLS: School[] = [
  { id: '1', name: 'Bole High School', students: 1200, teachers: 85, attendance: 94, status: 'Active' },
  { id: '2', name: 'Merkato Secondary School', students: 950, teachers: 68, attendance: 91, status: 'Active' },
  { id: '3', name: 'Bahir Dar Academy', students: 800, teachers: 55, attendance: 96, status: 'Active' },
  { id: '4', name: 'Hawassa International School', students: 650, teachers: 45, attendance: 88, status: 'Maintenance' },
];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'super_admin';
  const [selectedSchool, setSelectedSchool] = useState<string>('all');

  const filteredSchools = useMemo(() => 
    selectedSchool === 'all' 
      ? DEMO_SCHOOLS 
      : DEMO_SCHOOLS.filter(s => s.id === selectedSchool),
    [selectedSchool]
  );

  const { totalStudents, totalTeachers, avgAttendance } = useMemo(() => ({
    totalStudents: filteredSchools.reduce((sum, s) => sum + s.students, 0),
    totalTeachers: filteredSchools.reduce((sum, s) => sum + s.teachers, 0),
    avgAttendance: Math.round(filteredSchools.reduce((sum, s) => sum + s.attendance, 0) / filteredSchools.length)
  }), [filteredSchools]);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-section-header">System Administration</h2>
            {isSuperAdmin && (
              <p className="text-sm text-muted-foreground mt-1">Cross-school dashboard and reports</p>
            )}
          </div>
          {isSuperAdmin && (
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select school" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {DEMO_SCHOOLS.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* 4-column quick stats */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <DashboardStatsCard
            title="Total Students"
            value={totalStudents.toLocaleString()}
            icon={Users}
            description={selectedSchool === 'all' ? `Across ${filteredSchools.length} schools` : ''}
          />
          <DashboardStatsCard
            title="Total Teachers"
            value={totalTeachers.toString()}
            icon={BookOpen}
            description={selectedSchool === 'all' ? `Across ${filteredSchools.length} schools` : ''}
          />
          <DashboardStatsCard
            title="Avg Attendance"
            value={`${avgAttendance}%`}
            icon={TrendingUp}
            trend={avgAttendance >= 90 ? 'up' : 'down'}
            trendValue={avgAttendance >= 90 ? 'Good' : 'Needs attention'}
          />
          <DashboardStatsCard
            title="Schools"
            value={selectedSchool === 'all' ? DEMO_SCHOOLS.length.toString() : '1'}
            icon={School}
            description={selectedSchool === 'all' ? `${DEMO_SCHOOLS.filter(s => s.status === 'Active').length} active` : filteredSchools[0]?.status}
          />
        </div>

        {/* Schools Overview Table */}
        {isSuperAdmin && selectedSchool === 'all' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">Schools Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead className="text-center">Teachers</TableHead>
                    <TableHead className="text-center">Attendance</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DEMO_SCHOOLS.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell className="text-center">{school.students.toLocaleString()}</TableCell>
                      <TableCell className="text-center">{school.teachers}</TableCell>
                      <TableCell className="text-center">
                        <span className={school.attendance >= 90 ? 'text-green-600 font-semibold' : 'text-orange-600 font-semibold'}>
                          {school.attendance}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={school.status === 'Active' ? 'default' : 'secondary'}>
                          {school.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* School Details - When single school selected */}
        {selectedSchool !== 'all' && filteredSchools[0] && (
          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">{filteredSchools[0].name} - Detailed Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{filteredSchools[0].students.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Teachers</p>
                  <p className="text-2xl font-bold">{filteredSchools[0].teachers}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold">{filteredSchools[0].attendance}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={filteredSchools[0].status === 'Active' ? 'default' : 'secondary'} className="text-lg">
                    {filteredSchools[0].status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="text-card-title flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage users across all schools</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="text-card-title flex items-center gap-2">
                <School className="h-5 w-5" />
                School Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Register and manage schools</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="text-card-title flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                System Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View audit trails and security logs</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
