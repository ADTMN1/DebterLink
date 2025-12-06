import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Academic Calendar</h2>

        <div className="grid gap-6 md:grid-cols-2">
           <Card>
              <CardHeader>
                 <CardTitle>Calendar View</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                 <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                 />
              </CardContent>
           </Card>
           
           <Card>
              <CardHeader>
                 <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    {[
                       { title: 'Mid-term Exams Start', date: 'Dec 15, 2025', type: 'Exam' },
                       { title: 'Parent Teacher Conference', date: 'Dec 20, 2025', type: 'Meeting' },
                       { title: 'Christmas Break', date: 'Jan 07, 2026', type: 'Holiday' }
                    ].map((event, i) => (
                       <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                             <p className="font-semibold">{event.title}</p>
                             <p className="text-sm text-muted-foreground">{event.date}</p>
                          </div>
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
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
