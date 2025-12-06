import DashboardLayout from '@/layouts/dashboard-layout';
import { DashboardStatsCard } from '@/components/dashboard/stats-card';
import { Shield, Users, School, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-section-header">System Administration</h2>
        </div>

        {/* 4-column quick stats */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <DashboardStatsCard
            title="Total Users"
            value="1,450"
            icon={Users}
          />
          <DashboardStatsCard
            title="Active Sessions"
            value="124"
            icon={Shield}
            trend="up"
            trendValue="+12"
          />
          <DashboardStatsCard
            title="Schools Managed"
            value="1"
            icon={School}
          />
          <DashboardStatsCard
            title="System Health"
            value="100%"
            icon={Settings}
            className="text-orange-600"
          />
        </div>

        {/* User Management Table - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle className="text-card-title">User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              User management table will be displayed here with sortable columns and inline actions.
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="text-card-title">Create New User</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Add students, teachers, or staff members manually.</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="text-card-title">Manage Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Assign permissions and access levels.</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="text-card-title">System Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View audit trails and security logs.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
