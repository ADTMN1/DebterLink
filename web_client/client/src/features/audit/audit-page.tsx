import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, User, Clock } from 'lucide-react';

const mockAuditEvents = [
  {
    id: 1,
    time: '2025-12-03 10:15',
    user: 'admin@debterlink.com',
    action: 'USER_LOGIN',
    description: 'Admin logged in from Addis Ababa, Ethiopia',
    severity: 'low' as const,
  },
  {
    id: 2,
    time: '2025-12-03 09:55',
    user: 'director@ababa-school.et',
    action: 'GRADE_EXPORT',
    description: 'Exported grade report for Grade 11A',
    severity: 'medium' as const,
  },
  {
    id: 3,
    time: '2025-12-02 16:20',
    user: 'superadmin@debterlink.com',
    action: 'ROLE_CHANGE',
    description: 'Updated user role from teacher to director',
    severity: 'high' as const,
  },
];

export default function AuditPage() {
  const severityColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'bg-emerald-100 text-emerald-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'high':
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
            <p className="text-muted-foreground">
              System audit and security events across all schools.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4 text-primary" />
                Active Admins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-1">With system-level access</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                Events (Last 24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground mt-1">Login, export & role changes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                Open Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">2</div>
              <p className="text-xs text-muted-foreground mt-1">Review suspicious activities</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Recent Audit Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAuditEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.time}</TableCell>
                    <TableCell>{event.user}</TableCell>
                    <TableCell>{event.action}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>
                      <Badge className={severityColor(event.severity)}>{event.severity}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}







