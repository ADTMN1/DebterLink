import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SalaryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Payroll & Salary</h2>

        <div className="grid gap-4 md:grid-cols-2">
           <Card>
              <CardHeader>
                 <CardTitle>Current Month Summary</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b pb-2">
                       <span className="text-muted-foreground">Base Salary</span>
                       <span className="font-bold">15,000 ETB</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                       <span className="text-muted-foreground">Allowances</span>
                       <span className="font-bold text-orange-600">+ 2,500 ETB</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                       <span className="text-muted-foreground">Tax & Deductions</span>
                       <span className="font-bold text-red-600">- 3,200 ETB</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                       <span className="text-lg font-bold">Net Pay</span>
                       <span className="text-2xl font-bold text-primary">14,300 ETB</span>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card>
              <CardHeader>
                 <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                 <Table>
                    <TableHeader>
                       <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Net Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       <TableRow>
                          <TableCell>November 2025</TableCell>
                          <TableCell>14,300 ETB</TableCell>
                          <TableCell><span className="text-orange-600 text-xs font-bold bg-orange-100 px-2 py-1 rounded-full">Paid</span></TableCell>
                          <TableCell>
                             <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                          </TableCell>
                       </TableRow>
                       <TableRow>
                          <TableCell>October 2025</TableCell>
                          <TableCell>14,300 ETB</TableCell>
                          <TableCell><span className="text-orange-600 text-xs font-bold bg-orange-100 px-2 py-1 rounded-full">Paid</span></TableCell>
                          <TableCell>
                             <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                          </TableCell>
                       </TableRow>
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
