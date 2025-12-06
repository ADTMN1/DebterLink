import { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuthStore } from '@/store/useAuthStore';
import { Shield } from 'lucide-react';

type AuditLog = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  details?: string;
};

const dummyAuditLogs: AuditLog[] = [
  {
    id: 'AL-2025-001',
    timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
    actor: 'admin@example.com',
    action: 'User Login',
    target: 'System',
    details: 'Successful login from IP: 192.168.1.100',
  },
  {
    id: 'AL-2025-002',
    timestamp: new Date(Date.now() - 7200 * 1000).toISOString(),
    actor: 'director@example.com',
    action: 'View Report',
    target: 'Attendance Report',
    details: 'Accessed attendance report for Grade 3, Section A',
  },
  {
    id: 'AL-2025-003',
    timestamp: new Date(Date.now() - 10800 * 1000).toISOString(),
    actor: 'teacher@example.com',
    action: 'Update Grade',
    target: 'Student: Alice Smith, Subject: Math',
    details: 'Updated Math grade to A for Alice Smith',
  },
  {
    id: 'AL-2025-004',
    timestamp: new Date(Date.now() - 14400 * 1000).toISOString(),
    actor: 'admin@example.com',
    action: 'User Creation',
    target: 'User: New Teacher',
    details: 'Created new teacher account: John Doe',
  },
];

export default function AuditPage() {
  const { user } = useAuthStore();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data after a delay
    const timer = setTimeout(() => {
      setAuditLogs(dummyAuditLogs);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Only show audit logs if user is Admin or Super Admin
  if (!(user?.role === 'admin' || user?.role === 'super_admin')) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
          <Card>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>You do not have permission to view audit logs.</p>
                <p className="text-sm mt-2">Please contact an administrator if you believe this is an error.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
        <Card>
          <CardHeader>
            <CardTitle>System Audit & Security Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading audit logs...</div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No audit logs found.</p>
                <p className="text-sm mt-2">Audit logs track system activities for security and compliance.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead className="w-[150px]">Actor</TableHead>
                    <TableHead className="w-[200px]">Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{formatDate(log.timestamp)}</TableCell>
                      <TableCell>{log.actor}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{log.details || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

