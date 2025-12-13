import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { School as SchoolType } from '@shared/schema';
import { School, Plus, MoreHorizontal, Activity, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SchoolsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    region: '',
    students: '',
    status: 'Active' as 'Active' | 'Maintenance',
  });

  // Demo schools data
  const [schools, setSchools] = useState<SchoolType[]>([
    { id: '1', name: 'Bole High School', region: 'Addis Ababa', students: 1200, status: 'Active' },
    { id: '2', name: 'Merkato Secondary School', region: 'Addis Ababa', students: 950, status: 'Active' },
    { id: '3', name: 'Bahir Dar Academy', region: 'Amhara', students: 800, status: 'Active' },
    { id: '4', name: 'Hawassa International School', region: 'SNNPR', students: 650, status: 'Maintenance' },
  ]);

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setEditingSchoolId(null);
    setForm({ name: '', region: '', students: '', status: 'Active' });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (school: SchoolType) => {
    setIsEditMode(true);
    setEditingSchoolId(school.id);
    setForm({
      name: school.name,
      region: school.region,
      students: school.students.toString(),
      status: school.status,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.region.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (isEditMode && editingSchoolId) {
      // Update existing school
      setSchools(schools.map(school => 
        school.id === editingSchoolId
          ? {
              ...school,
              name: form.name.trim(),
              region: form.region.trim(),
              students: Number(form.students) || 0,
              status: form.status,
            }
          : school
      ));
      toast({
        title: 'School updated',
        description: `${form.name} has been successfully updated.`,
      });
    } else {
      // Create new school
      const newSchool: SchoolType = {
        id: Date.now().toString(),
        name: form.name.trim(),
        region: form.region.trim(),
        students: Number(form.students) || 0,
        status: form.status,
      };
      setSchools([...schools, newSchool]);
      toast({
        title: 'School created',
        description: `${form.name} has been successfully registered.`,
      });
    }

    setIsDialogOpen(false);
    setForm({ name: '', region: '', students: '', status: 'Active' });
    setIsEditMode(false);
    setEditingSchoolId(null);
  };

  const handleDelete = (school: SchoolType) => {
    if (confirm(`Are you sure you want to delete ${school.name}? This action cannot be undone.`)) {
      setSchools(schools.filter(s => s.id !== school.id));
      toast({
        title: 'School deleted',
        description: `${school.name} has been successfully deleted.`,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">School Management</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <Plus className="mr-2 h-4 w-4" /> Register School
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditMode ? 'Edit School' : 'Register New School'}</DialogTitle>
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
                    <Select value={form.status} onValueChange={(value: 'Active' | 'Maintenance') => setForm((f) => ({ ...f, status: value }))}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setForm({ name: '', region: '', students: '', status: 'Active' });
                    setIsEditMode(false);
                    setEditingSchoolId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {isEditMode ? 'Update' : 'Save'}
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(school)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(school)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
