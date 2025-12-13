import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard-layout';

export const BehaviorAnalyticsPage = () => {
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [behaviorIncidents, setBehaviorIncidents] = useState<any[]>([]);

  const handleLoadBehaviorData = () => {
    if (!grade || !section) {
      return;
    }
    // Simulate fetching behavior data based on selected filters
    console.log('Loading behavior data for:', { grade, section, startDate, endDate });

    // Dummy data for demonstration
    const dummyIncidents = [
      { studentName: 'Alice Smith', incidentType: 'Disruption', date: '2025-11-28', remarks: 'Talking during class' },
      { studentName: 'Bob Johnson', incidentType: 'Tardy', date: '2025-11-29', remarks: 'Arrived 15 mins late' },
      { studentName: 'Charlie Brown', incidentType: 'Aggression', date: '2025-11-30', remarks: 'Pushed another student' },
      { studentName: 'Diana Prince', incidentType: 'Disruption', date: '2025-12-01', remarks: 'Using phone in class' },
    ];
    setBehaviorIncidents(dummyIncidents);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-section-header">Behavior Analytics Overview</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-card-title">Filter Behavior Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="space-y-2">
                <Label>Grade</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Grade 1</SelectItem>
                    <SelectItem value="2">Grade 2</SelectItem>
                    <SelectItem value="3">Grade 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Section</Label>
                <Select value={section} onValueChange={setSection}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Section A</SelectItem>
                    <SelectItem value="B">Section B</SelectItem>
                    <SelectItem value="C">Section C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={handleLoadBehaviorData} disabled={!grade || !section}>
                  View Behavior
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-card-title">Behavior Incidents Report</CardTitle>
          </CardHeader>
          <CardContent>
            {behaviorIncidents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Incident Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {behaviorIncidents.map((incident, index) => (
                    <TableRow key={index}>
                      <TableCell>{incident.studentName}</TableCell>
                      <TableCell>{incident.incidentType}</TableCell>
                      <TableCell>{incident.date}</TableCell>
                      <TableCell>{incident.remarks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">No behavior data loaded yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};


