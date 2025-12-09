import DashboardLayout from '@/layouts/dashboard-layout';
import { DashboardStatsCard } from '@/components/dashboard/stats-card';
import { Users, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';

export default function TeacherDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-section-header">Teacher Dashboard</h2>
          
        </div>

        {/* Today's Schedule Card - Prominent */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-card-title">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { class: 'Grade 11A - Physics', time: '08:30 - 09:30', status: 'Completed' },
                { class: 'Grade 11B - Physics', time: '09:45 - 10:45', status: 'In Progress' },
                { class: 'Grade 12A - Mechanics', time: '11:00 - 12:00', status: 'Upcoming' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow duration-300">
                  <div>
                    <p className="font-medium text-sm">{item.class}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    item.status === 'Completed' ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                    item.status === 'In Progress' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  )}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 3-column key metrics */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <DashboardStatsCard
            title="Total Students"
            value="156"
            icon={Users}
            description="Across 4 classes"
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
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">Grade 11A</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tabular-nums mb-2">92%</div>
              <p className="text-xs text-muted-foreground">38/41 present</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">Grade 11B</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tabular-nums mb-2">95%</div>
              <p className="text-xs text-muted-foreground">40/42 present</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">Grade 12A</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tabular-nums mb-2">88%</div>
              <p className="text-xs text-muted-foreground">37/42 present</p>
            </CardContent>
          </Card>
        </div>

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
