import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CloudUpload, CloudDownload, ShieldCheck, Database } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type BackupItem = {
  id: number;
  createdAt: string;
  size: string;
  createdBy: string;
  type: string;
};

const initialBackups: BackupItem[] = [
  { id: 1, createdAt: '2025-12-03 08:30', size: '1.2 GB', createdBy: 'superadmin@debterlink.com', type: 'Full' },
  { id: 2, createdAt: '2025-12-02 08:30', size: '320 MB', createdBy: 'system', type: 'Incremental' },
  { id: 3, createdAt: '2025-12-01 08:30', size: '310 MB', createdBy: 'system', type: 'Incremental' },
];

export default function BackupPage() {
  const [backups, setBackups] = useState<BackupItem[]>(initialBackups);
  const { toast } = useToast();

  const handleCreateBackup = () => {
    const now = new Date();
    const createdAt = now.toISOString().replace('T', ' ').slice(0, 16);
    const nextId = (backups[0]?.id ?? 0) + 1;

    const newBackup: BackupItem = {
      id: nextId,
      createdAt,
      size: '350 MB',
      createdBy: 'superadmin@debterlink.com',
      type: 'Incremental',
    };

    setBackups((prev) => [newBackup, ...prev]);
    toast({
      title: 'Backup created',
      description: `New backup created at ${createdAt}.`,
    });
  };

  const handleRestoreLatest = () => {
    const latest = backups[0];
    if (!latest) return;

    toast({
      title: 'Restore started',
      description: `Restoring backup from ${latest.createdAt} (${latest.type}).`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Backup & Restore</h2>
            <p className="text-muted-foreground">
              Manage secure backups of all DebterLink school data.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="flex items-center gap-2" onClick={handleCreateBackup}>
              <CloudUpload className="h-4 w-4" />
              Create Backup
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleRestoreLatest}>
              <CloudDownload className="h-4 w-4" />
              Restore Backup
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Database className="h-4 w-4 text-primary" />
                Total Storage Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.5 GB</div>
              <p className="text-xs text-muted-foreground mt-1">Across all schools</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Last Successful Backup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today, 08:30</div>
              <p className="text-xs text-muted-foreground mt-1">Status: Healthy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CloudUpload className="h-4 w-4 text-primary" />
                Automatic Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Daily</div>
              <p className="text-xs text-muted-foreground mt-1">At 08:30 East Africa Time</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Backups</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Created At</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell>{backup.createdAt}</TableCell>
                    <TableCell>{backup.type}</TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>{backup.createdBy}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                      <Button variant="ghost" size="sm">
                        Restore
                      </Button>
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


