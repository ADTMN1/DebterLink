import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { School as SchoolType } from '@shared/schema';
import { School, Plus, MoreHorizontal, Activity } from 'lucide-react';
import { useState } from 'react';

export default function SchoolsPage() {
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    region: '',
    students: '',
    status: 'Active' as 'Active' | 'Maintenance',
  });

  const { data: schools = [] } = useQuery<SchoolType[]>({
    queryKey: ['/api/schools'],
  });

  const createSchoolMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/schools', {
        name: form.name,
        region: form.region,
        students: Number(form.students) || 0,
        status: form.status,
      });
    },
    onSuccess: async () => {
      setIsDialogOpen(false);
      setForm({ name: '', region: '', students: '', status: 'Active' });
      await queryClient.invalidateQueries({ queryKey: ['/api/schools'] });
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">School Management</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Register School
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register New School</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Bole High School"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region / City</Label>
                  <Input
                    id="region"
                    value={form.region}
                    onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                    placeholder="e.g. Addis Ababa"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="students">Number of Students</Label>
                    <Input
                      id="students"
                      type="number"
                      min={0}
                      value={form.students}
                      onChange={(e) => setForm((f) => ({ ...f, students: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="border rounded-md px-3 py-2 text-sm bg-background"
                      value={form.status}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          status: e.target.value as 'Active' | 'Maintenance',
                        }))
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button
                  onClick={() => createSchoolMutation.mutate()}
                  disabled={
                    !form.name.trim() ||
                    !form.region.trim() ||
                    createSchoolMutation.isPending
                  }
                >
                  {createSchoolMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
           <Card>
              <CardHeader className="pb-2">
                 <CardTitle className="text-lg font-medium">Total Schools</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-3xl font-bold">24</div>
                 <p className="text-xs text-muted-foreground">+2 this month</p>
              </CardContent>
           </Card>
           <Card>
              <CardHeader className="pb-2">
                 <CardTitle className="text-lg font-medium">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-3xl font-bold">15,420</div>
              </CardContent>
           </Card>
           <Card>
              <CardHeader className="pb-2">
                 <CardTitle className="text-lg font-medium">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="flex items-center gap-2 text-orange-600 font-bold text-lg">
                    <Activity className="h-5 w-5" /> Operational
                 </div>
              </CardContent>
           </Card>
        </div>

        <Card>
          <CardHeader>
             <CardTitle>Registered Schools</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded text-primary">
                         <School className="h-4 w-4" />
                      </div>
                      {school.name}
                    </TableCell>
                    <TableCell>{school.region}</TableCell>
                    <TableCell>{school.students}</TableCell>
                    <TableCell>
                      <Badge variant={school.status === 'Active' ? 'default' : 'secondary'}>
                        {school.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                         <MoreHorizontal className="h-4 w-4" />
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
