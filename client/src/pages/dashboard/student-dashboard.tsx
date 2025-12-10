import DashboardLayout from '@/layouts/dashboard-layout';
import { DashboardStatsCard } from '@/components/dashboard/stats-card';
import { BookOpen, Clock, GraduationCap, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { Link } from 'wouter';

const data = [
  { name: 'Sep', score: 85 },
  { name: 'Oct', score: 88 },
  { name: 'Nov', score: 92 },
  { name: 'Dec', score: 89 },
  { name: 'Jan', score: 94 },
];

export default function StudentDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Welcome Card with Student Photo */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                S
              </div>
              <div>
                <h2 className="text-section-header">Welcome back!</h2>
                <p className="text-sm text-muted-foreground mt-1">Academic Year 2016 E.C.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <DashboardStatsCard
            title="Attendance Rate"
            value="98.5%"
            icon={Clock}
            trend="up"
            trendValue="+2.1%"
            description="from last month"
          />
          <DashboardStatsCard
            title="Assignments"
            value="12"
            icon={BookOpen}
            description="3 Pending"
          />
          <DashboardStatsCard
            title="Class Rank"
            value="5th"
            icon={TrendingUp}
            description="Out of 45 students"
          />
        </div>

        {/* Main Content: 2-column layout: Assignments + Grades */}
        <div className="grid gap-6 md:grid-cols-2">
          <DashboardStatsCard
            title="Attendance Rate"
            value="98.5%"
            icon={Clock}
            trend="up"
            trendValue="+2.1%"
            description="from last month"
          />
          <DashboardStatsCard
            title="Assignments"
            value="12"
            icon={BookOpen}
            description="3 Pending"
          />
        </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'Physics Lab Report', due: 'Due in 2 days', status: 'pending' },
                  { title: 'Math Problem Set', due: 'Due in 5 days', status: 'in-progress' },
                  { title: 'English Essay', due: 'Submitted', status: 'completed' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow duration-300">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.due}</p>
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      item.status === 'completed' ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                      item.status === 'in-progress' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    )}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-card-title">Recent Grades</CardTitle>
                <Link href="/grades">
                  <Button variant="outline" size="sm">
                    <Award className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { subject: 'Mathematics', grade: 'A', score: '95%' },
                  { subject: 'Physics', grade: 'A-', score: '92%' },
                  { subject: 'Amharic', grade: 'B+', score: '88%' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow duration-300">
                    <div>
                      <p className="text-sm font-medium">{item.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.score}</p>
                    </div>
                    <span className="text-lg font-semibold text-primary">{item.grade}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        {/* Behavior Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-card-title">Behavior Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Positive Points</span>
                  <span className="text-lg font-semibold text-orange-600">85</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Negative Points</span>
                  <span className="text-lg font-semibold text-red-600">3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{width: '3%'}}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar with Exam Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-card-title">Upcoming Classes & Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { subject: 'Mathematics', time: '08:30 AM', room: 'Block A - 101', type: 'class' },
                { subject: 'Physics', time: '09:45 AM', room: 'Lab 2', type: 'class' },
                { subject: 'Mid-term Exam', time: '10:00 AM', room: 'Hall A', type: 'exam' },
                { subject: 'English', time: '02:00 PM', room: 'Block B - 204', type: 'class' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors duration-200">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{item.subject}</p>
                    <p className="text-xs text-muted-foreground">{item.room}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.type === 'exam' && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        Exam
                      </span>
                    )}
                    <div className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appeals Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-card-title">Recent Appeals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { subject: 'Physics Quiz Grade', status: 'Pending', date: '2 days ago' },
                { subject: 'Math Assignment', status: 'Resolved', date: '1 week ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors duration-200">
                  <div>
                    <p className="text-sm font-medium">{item.subject}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    item.status === 'Resolved' ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
