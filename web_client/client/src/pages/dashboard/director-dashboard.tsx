import DashboardLayout from '@/layouts/dashboard-layout';
import { DashboardStatsCard } from '@/components/dashboard/stats-card';
import { Users, DollarSign, AlertTriangle, Activity, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Link } from 'wouter';

const attendanceData = [
  { name: 'Mon', present: 450, absent: 20 },
  { name: 'Tue', present: 445, absent: 25 },
  { name: 'Wed', present: 460, absent: 10 },
  { name: 'Thu', present: 455, absent: 15 },
  { name: 'Fri', present: 440, absent: 30 },
];

export default function DirectorDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-section-header">Director Overview</h2>
          <Link href="/dashboard/results">
            <Button>
              <FileText className="mr-2 h-4 w-4" /> Exam Results
            </Button>
          </Link>
        </div>

        {/* 4-column metric grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <DashboardStatsCard
            title="Total Students"
            value="1,250"
            icon={Users}
            trend="up"
            trendValue="+5%"
          />
          <DashboardStatsCard
            title="Total Staff"
            value="85"
            icon={Users}
          />
          <DashboardStatsCard
            title="Avg Attendance"
            value="94.2%"
            icon={Activity}
            trend="up"
            trendValue="+0.5%"
          />
          <DashboardStatsCard
            title="Pending Appeals"
            value="7"
            icon={AlertTriangle}
            className="border-l-4 border-l-red-500"
          />
        </div>

        {/* Charts Row: 2-column layout */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))', 
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      cursor={{fill: 'transparent'}}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="present" name="Present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" name="Absent" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p className="text-sm">Chart placeholder</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Appeals/Complaints Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-card-title">Recent Appeals & Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New Teacher Hired', detail: 'Abebe Kebede (Math)', time: '2 hours ago' },
                { action: 'Exam Schedule Published', detail: 'Mid-term exams', time: '5 hours ago' },
                { action: 'System Alert', detail: 'Server maintenance scheduled', time: '1 day ago' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col space-y-1 border-b pb-4 last:border-0 last:pb-0">
                  <span className="font-medium text-sm">{item.action}</span>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.detail}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
