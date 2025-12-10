import DashboardLayout from '@/layouts/dashboard-layout';
import { DashboardStatsCard } from '@/components/dashboard/stats-card';
import { Users, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';
import { useAuthStore } from '@/store/useAuthStore';

type Class = {
  id: string;
  name: string;
  grade: string;
  section: string;
  currentStudents: number;
  capacity: number;
};

// Mock demo classes for teachers
const DEMO_CLASSES: Class[] = [
  { id: '1', name: 'Grade 11A', grade: '11', section: 'A', currentStudents: 38, capacity: 40 },
  { id: '2', name: 'Grade 11B', grade: '11', section: 'B', currentStudents: 35, capacity: 40 },
  { id: '3', name: 'Grade 10A', grade: '10', section: 'A', currentStudents: 42, capacity: 45 },
];

export default function TeacherDashboard() {
  const { user } = useAuthStore();
  const classes = DEMO_CLASSES;
  const isLoading = false;

  const totalStudents = classes.reduce((sum, cls) => sum + cls.currentStudents, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-section-header">Teacher Dashboard</h2>
        </div>

        {/* Today's Schedule Card - Prominent */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-card-title">My Assigned Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading classes...</div>
            ) : classes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No classes assigned yet.</div>
            ) : (
              <div className="space-y-4">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow duration-300">
                    <div>
                      <p className="font-medium text-sm">{cls.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{cls.currentStudents}/{cls.capacity} students</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3-column key metrics */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <DashboardStatsCard
            title="Total Students"
            value={totalStudents.toString()}
            icon={Users}
            description={`Across ${classes.length} ${classes.length === 1 ? 'class' : 'classes'}`}
          />
          <DashboardStatsCard
            title="Assignments"
            value="8"
            icon={FileText}
            description="Active assignments"
          />
          <DashboardStatsCard
            title="Attendance Today"
            value="92%"
            icon={CheckCircle2}
            trend="down"
            trendValue="-1.5%"
          />
          <DashboardStatsCard
            title="Pending Reviews"
            value="24"
            icon={AlertCircle}
            description="Assignments to grade"
            className="border-l-4 border-l-amber-500"
          />
        </div>

        {/* Class-wise Attendance Widgets */}
        {classes.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {classes.slice(0, 3).map((cls) => (
              <Card key={cls.id}>
                <CardHeader>
                  <CardTitle className="text-card-title">{cls.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold tabular-nums mb-2">--</div>
                  <p className="text-xs text-muted-foreground">{cls.currentStudents} students</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Recent Student Submissions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-card-title">Recent Student Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { student: 'Dawit Mekonnen', task: 'Physics Lab Report', time: '10 mins ago' },
                { student: 'Sara Tadesse', task: 'Mechanics Quiz', time: '25 mins ago' },
                { student: 'Robel Haile', task: 'Physics Lab Report', time: '1 hour ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {item.student.charAt(0)}
                     </div>
                     <div>
                        <p className="text-sm font-medium">{item.student}</p>
                        <p className="text-xs text-muted-foreground">{item.task}</p>
                     </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
