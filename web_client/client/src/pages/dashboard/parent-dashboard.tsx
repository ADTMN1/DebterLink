import DashboardLayout from '@/layouts/dashboard-layout';
import { DashboardStatsCard } from '@/components/dashboard/stats-card';
import { Users, DollarSign, AlertTriangle, Activity, MessageSquare, BookOpen, Clock, GraduationCap, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';

export default function ParentDashboard() {
  const { t } = useTranslation();
  const [selectedChild, setSelectedChild] = useState('Yared Mekonnen');

  const children = [
    { name: 'Yared Mekonnen', grade: 'Grade 11', attendance: '96%' },
    { name: 'Sara Tadesse', grade: 'Grade 9', attendance: '98%' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-section-header">Parent Dashboard</h2>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {selectedChild} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {children.map((child, index) => (
                  <DropdownMenuItem key={index} onClick={() => setSelectedChild(child.name)}>
                    {child.name} - {child.grade}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/messaging">
              <Button>Contact Teacher</Button>
            </Link>
          </div>
        </div>

        {/* Child Overview Stats */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <DashboardStatsCard
            title="Attendance Rate"
            value="96%"
            icon={Clock}
            trend="up"
            trendValue="+2.1%"
            description="This month"
          />
          <DashboardStatsCard
            title="Average Grade"
            value="A-"
            icon={GraduationCap}
            trend="up"
            trendValue="+0.3"
            description="Current semester"
          />
          <DashboardStatsCard
            title="Behavior Score"
            value="95/100"
            icon={Activity}
            trend="up"
            trendValue="+5"
            description="Positive points"
          />
          <DashboardStatsCard
            title="Unread Messages"
            value="2"
            icon={MessageSquare}
            description="From teachers"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Child's Grades */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-card-title">Recent Grades</CardTitle>
                <Link href="/grades">
                  <Button variant="outline" size="sm">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { subject: 'Mathematics', grade: 'A-', score: '92%', date: '2 weeks ago' },
                  { subject: 'Physics', grade: 'B+', score: '87%', date: '1 week ago' },
                  { subject: 'English', grade: 'A', score: '95%', date: '3 days ago' },
                  { subject: 'Amharic', grade: 'B', score: '83%', date: '1 week ago' },
                ].map((grade, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow duration-300">
                    <div>
                      <p className="text-sm font-medium">{grade.subject}</p>
                      <p className="text-xs text-muted-foreground">{grade.score} • {grade.date}</p>
                    </div>
                    <span className="text-lg font-semibold text-primary">{grade.grade}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Communication Hub */}
          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">Communication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/messaging">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Class Teacher
                </Button>
              </Link>
              <Link href="/messaging">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Director
                </Button>
              </Link>
              <Link href="/messaging">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View School Announcements
                </Button>
              </Link>
              <Link href="/messaging">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Parent-Teacher Meeting Requests
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Behavior Analytics & Attendance */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-card-title">Behavior Analytics</CardTitle>
                <Link href="/behavior">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Positive Points</span>
                      <span className="text-lg font-semibold text-orange-600">95</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{width: '95%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Negative Points</span>
                      <span className="text-lg font-semibold text-red-600">2</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{width: '2%'}}></div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Recent Records</h4>
                  <div className="space-y-2">
                    {[
                      { date: 'Dec 5', type: 'positive', description: 'Completed homework on time', points: '+5' },
                      { date: 'Dec 4', type: 'positive', description: 'Participated in class discussion', points: '+3' },
                      { date: 'Dec 3', type: 'positive', description: 'Helped classmate with assignment', points: '+2' },
                      { date: 'Dec 2', type: 'negative', description: 'Late to class', points: '-1' },
                      { date: 'Dec 1', type: 'positive', description: 'Excellent presentation', points: '+5' },
                    ].map((record, i) => (
                      <div key={i} className="flex items-start justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              record.type === 'positive' 
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {record.type === 'positive' ? 'Positive' : 'Negative'}
                            </span>
                            <span className="text-xs text-muted-foreground">{record.date}</span>
                          </div>
                          <p className="text-sm mt-1">{record.description}</p>
                        </div>
                        <span className={`text-sm font-semibold ml-2 ${
                          record.type === 'positive' ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {record.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">96%</div>
                  <p className="text-sm text-muted-foreground">Overall attendance rate</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>This month</span>
                    <span className="font-medium">22/23 days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>This week</span>
                    <span className="font-medium">5/5 days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Absences this month</span>
                    <span className="font-medium text-red-600">1 day</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Recent Attendance</h4>
                  <div className="space-y-1">
                    {[
                      { date: 'Dec 2', status: 'Present' },
                      { date: 'Dec 1', status: 'Present' },
                      { date: 'Nov 30', status: 'Present' },
                      { date: 'Nov 29', status: 'Absent' },
                      { date: 'Nov 28', status: 'Present' },
                    ].map((record, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{record.date}</span>
                        <span className={record.status === 'Present' ? 'text-orange-600' : 'text-red-600'}>
                          {record.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* School Announcements & Upcoming Events */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">School Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <h4 className="font-semibold text-primary mb-2">Parent-Teacher Meeting</h4>
                  <p className="text-sm">Scheduled for next Saturday, 2:00 PM at the Main Hall. Please confirm attendance.</p>
                  <p className="text-xs text-muted-foreground mt-2">Posted 2 days ago</p>
                </div>
                <div className="bg-accent/50 p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">Holiday Notice</h4>
                  <p className="text-sm">School will be closed on Friday for Adwa Victory Day celebrations.</p>
                  <p className="text-xs text-muted-foreground mt-2">Posted 1 week ago</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">Important: Grade Reports</h4>
                  <p className="text-sm text-amber-700">Mid-term grade reports are now available. Please review and contact teachers if needed.</p>
                  <p className="text-xs text-muted-foreground mt-2">Posted 3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-card-title">Upcoming Events & Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'Parent-Teacher Conference', date: 'Dec 14, 2024', time: '2:00 PM', type: 'meeting' },
                  { title: 'School Sports Day', date: 'Dec 20, 2024', time: '9:00 AM', type: 'event' },
                  { title: 'Winter Break Begins', date: 'Dec 25, 2024', time: 'All day', type: 'holiday' },
                  { title: 'Science Fair', date: 'Jan 10, 2025', time: '10:00 AM', type: 'event' },
                ].map((event, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors duration-200">
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date} • {event.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.type === 'meeting' ? 'bg-blue-100 text-blue-700' :
                      event.type === 'event' ? 'bg-orange-100 text-orange-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
