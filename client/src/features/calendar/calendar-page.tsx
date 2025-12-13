import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCalendarStore } from '@/store/useCalendarStore';
import { useUIStore } from '@/store/useUIStore';
import { toast } from 'sonner';
import { gregorianToEthiopian, formatEthiopianDate } from '@/lib/ethiopianCalendar';

export default function CalendarPage() {
  const { user } = useAuthStore();
  const { events, addEvent, updateEvent, deleteEvent, postEvent, unpostEvent, getPostedEvents } = useCalendarStore();
  
  const isDirector = user?.role === 'director';
  const displayEvents = isDirector ? events : getPostedEvents();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    type: 'event' as 'holiday' | 'exam' | 'event' | 'meeting' | 'other',
    classFilter: 'all' as string,
  });
  const [filterClass, setFilterClass] = useState('all');
  const { calendarType } = useUIStore();

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setForm({ title: '', description: '', date: '', endDate: '', type: 'event', classFilter: 'all' });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (event: any) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      endDate: event.endDate || '',
      type: event.type,
      classFilter: event.classFilter || 'all',
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.date) {
      toast.error('Please fill in title and date');
      return;
    }

    if (editingEvent) {
      updateEvent(editingEvent.id, form);
      toast.success('Event updated');
    } else {
      addEvent({ ...form, isPosted: false });
      toast.success('Event created as draft');
    }

    setIsDialogOpen(false);
    setEditingEvent(null);
  };

  const handlePost = (id: string) => {
    postEvent(id);
    toast.success('Event posted! Everyone can now see it.');
  };

  const handleUnpost = (id: string) => {
    unpostEvent(id);
    toast.info('Event unpublished');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
      toast.success('Event deleted');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'holiday': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'exam': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'meeting': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'event': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Academic Calendar</h2>
          {isDirector && (
            <Button onClick={handleOpenCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          )}
        </div>

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
              <div className="flex items-center justify-between">
                <CardTitle>{isDirector ? 'All Events' : 'Upcoming Events'}</CardTitle>
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="Grade 9A">Grade 9A</SelectItem>
                    <SelectItem value="Grade 10A">Grade 10A</SelectItem>
                    <SelectItem value="Grade 11A">Grade 11A</SelectItem>
                    <SelectItem value="Grade 12A">Grade 12A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No events yet</p>
                ) : (
                  displayEvents
                    .filter(event => filterClass === 'all' || event.classFilter === filterClass || event.classFilter === 'all')
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((event) => (
                      <div key={event.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              <CalendarIcon className="inline h-3 w-3 mr-1" />
                              {calendarType === 'gregorian' 
                                ? new Date(event.date).toLocaleDateString()
                                : formatEthiopianDate(gregorianToEthiopian(new Date(event.date)))}
                              {event.endDate && (calendarType === 'gregorian'
                                ? ` - ${new Date(event.endDate).toLocaleDateString()}`
                                : ` - ${formatEthiopianDate(gregorianToEthiopian(new Date(event.endDate)))}`)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {calendarType === 'gregorian'
                                ? `Ethiopian: ${formatEthiopianDate(gregorianToEthiopian(new Date(event.date)))}`
                                : `Gregorian: ${new Date(event.date).toLocaleDateString()}`}
                            </p>
                          </div>
                          <Badge className={getTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                        </div>
                        {isDirector && (
                          <div className="flex gap-2 pt-2 border-t">
                            <Button size="sm" variant="outline" onClick={() => handleOpenEdit(event)}>
                              <Edit className="h-3 w-3 mr-1" /> Edit
                            </Button>
                            {event.isPosted ? (
                              <Button size="sm" variant="outline" onClick={() => handleUnpost(event.id)}>
                                <EyeOff className="h-3 w-3 mr-1" /> Unpost
                              </Button>
                            ) : (
                              <Button size="sm" onClick={() => handlePost(event.id)}>
                                <Eye className="h-3 w-3 mr-1" /> Post
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(event.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Mid-term Exams"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Event details..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date (Optional)</Label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select value={form.classFilter} onValueChange={(v) => setForm({ ...form, classFilter: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="Grade 9A">Grade 9A</SelectItem>
                      <SelectItem value="Grade 10A">Grade 10A</SelectItem>
                      <SelectItem value="Grade 11A">Grade 11A</SelectItem>
                      <SelectItem value="Grade 12A">Grade 12A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingEvent ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
