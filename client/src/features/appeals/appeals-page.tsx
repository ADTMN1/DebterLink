import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { SanitizedInput } from '@/components/ui/sanitized-input';
import { SanitizedTextarea } from '@/components/ui/sanitized-input';
import { useSanitizedForm } from '@/hooks/use-sanitized-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { appealSubmissionSchema, AppealSubmissionFormData } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Calendar, User, FileText, MessageSquare, Clock, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Role } from '@/types';

type TimelineEvent = {
  date: string;
  action: string;
  by: string;
  details?: string;
};

type Appeal = {
  id: string;
  subject: string;
  status: 'In Review' | 'Approved' | 'Rejected';
  date: string;
  description?: string;
  submittedBy?: string;
  category?: string;
  priority?: string;
  response?: string;
  respondedBy?: string;
  responseDate?: string;
  timeline?: TimelineEvent[];
};

const initialAppeals: Appeal[] = [
  {
    id: 'AP-2024-001',
    subject: 'Grade Correction - Physics',
    status: 'In Review',
    date: '2 days ago',
    description: 'I believe there was an error in the calculation of my Physics midterm exam grade. I scored 85/100 but my grade shows as B+ instead of A-. I have reviewed my exam paper and found that question 5 was marked incorrectly.',
    submittedBy: 'Abebe Kebede',
    category: 'Grade Appeal',
    priority: 'High',
    timeline: [
      { date: '2 days ago', action: 'Appeal Submitted', by: 'Abebe Kebede' },
      { date: '1 day ago', action: 'Under Review', by: 'Dr. Yohannes', details: 'Case assigned to academic committee' },
    ],
  },
  {
    id: 'AP-2024-002',
    subject: 'Leave Request',
    status: 'Approved',
    date: '1 week ago',
    description: 'Requesting leave for personal family matter on December 15-17, 2024. I will ensure all my classes are covered by a substitute teacher.',
    submittedBy: 'Tigist Alemu',
    category: 'Leave Request',
    priority: 'Medium',
    response: 'Your leave request has been approved. Please coordinate with the administration office for substitute arrangements.',
    respondedBy: 'Dr. Yohannes',
    responseDate: '6 days ago',
    timeline: [
      { date: '1 week ago', action: 'Request Submitted', by: 'Tigist Alemu' },
      { date: '6 days ago', action: 'Approved', by: 'Dr. Yohannes', details: 'Leave approved for Dec 15-17' },
    ],
  },
  {
    id: 'AP-2024-003',
    subject: 'Exam Re-schedule',
    status: 'Rejected',
    date: '2 weeks ago',
    description: 'I was unable to attend the Mathematics final exam due to a medical emergency. I have attached a medical certificate from the hospital. I request a reschedule of the exam.',
    submittedBy: 'Sara Tadesse',
    category: 'Exam Appeal',
    priority: 'High',
    response: 'Your request for exam reschedule has been reviewed. Unfortunately, we cannot accommodate rescheduling as the exam period has ended. You may apply for a make-up exam in the next semester.',
    respondedBy: 'Dr. Yohannes',
    responseDate: '1 week ago',
    timeline: [
      { date: '2 weeks ago', action: 'Appeal Submitted', by: 'Sara Tadesse' },
      { date: '10 days ago', action: 'Documents Verified', by: 'Admin Office', details: 'Medical certificate validated' },
      { date: '1 week ago', action: 'Rejected', by: 'Dr. Yohannes', details: 'Exam period ended' },
    ],
  },
];

export default function AppealsPage() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const shouldShowNewAppealButton = user?.role && !['director', 'teacher'].includes(user.role as Role);
  const [appeals, setAppeals] = useState<Appeal[]>(initialAppeals);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewAppealDialogOpen, setIsNewAppealDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [newStatus, setNewStatus] = useState<'In Review' | 'Approved' | 'Rejected'>('In Review');
  const [statusResponse, setStatusResponse] = useState('');
  const newAppealForm = useSanitizedForm<AppealSubmissionFormData>({
    resolver: zodResolver(appealSubmissionSchema),
    defaultValues: {
      type: 'other',
      subject: '',
      description: '',
      evidence: '',
      requestedAction: '',
    },
    sanitizationMap: {
      subject: 'text',
      description: 'description',
      evidence: 'description',
      requestedAction: 'description',
    },
  });

  const [editForm, setEditForm] = useState({ subject: '', description: '' });

  const handleViewDetails = (appeal: Appeal) => {
    setSelectedAppeal(appeal);
    setIsDialogOpen(true);
  };

  const handleCreateAppeal = newAppealForm.handleSanitizedSubmit((data: AppealSubmissionFormData) => {
    const newAppeal: Appeal = {
      id: `AP-${new Date().getFullYear()}-${String(appeals.length + 1).padStart(3, '0')}`,
      subject: data.subject,
      status: 'In Review',
      date: 'Just now',
      description: data.description,
      submittedBy: user?.name || 'Unknown',
      category: data.type,
      priority: 'Medium',
      timeline: [
        { date: 'Just now', action: 'Appeal Submitted', by: user?.name || 'Unknown' },
      ],
    };

    setAppeals([newAppeal, ...appeals]);
    setIsNewAppealDialogOpen(false);
    newAppealForm.reset();

    toast.success('Your appeal has been successfully submitted and is now under review.');
  });

  const handleAddComment = () => {
    if (!selectedAppeal) return;
    setIsCommentDialogOpen(true);
  };

  const handleSubmitComment = () => {
    if (!comment.trim() || !selectedAppeal) return;

    const newTimeline = [
      ...(selectedAppeal.timeline || []),
      { date: 'Just now', action: 'Comment Added', by: user?.name || 'Current User', details: comment.trim() },
    ];

    // Update the appeal with the comment
    const updatedAppeals = appeals.map((appeal) => {
      if (appeal.id === selectedAppeal.id) {
        return {
          ...appeal,
          response: comment.trim(),
          respondedBy: user?.name || 'Current User',
          responseDate: 'Just now',
          timeline: newTimeline,
        };
      }
      return appeal;
    });

    setAppeals(updatedAppeals);
    setSelectedAppeal({
      ...selectedAppeal,
      response: comment.trim(),
      respondedBy: user?.name || 'Current User',
      responseDate: 'Just now',
      timeline: newTimeline,
    });
    
    setComment('');
    setIsCommentDialogOpen(false);
    
    toast({
      title: 'Comment added',
      description: 'Your comment has been added to the appeal.',
    });
  };

  const handleUpdateStatus = () => {
    if (!selectedAppeal) return;
    setNewStatus(selectedAppeal.status);
    setStatusResponse(selectedAppeal.response || '');
    setIsStatusDialogOpen(true);
  };

  const handleSubmitStatusUpdate = () => {
    if (!selectedAppeal) return;

    const newTimeline = [
      ...(selectedAppeal.timeline || []),
      { date: 'Just now', action: `Status Changed to ${newStatus}`, by: user?.name || 'Current User', details: statusResponse.trim() },
    ];

    const updatedAppeals = appeals.map((appeal) => {
      if (appeal.id === selectedAppeal.id) {
        return {
          ...appeal,
          status: newStatus,
          response: statusResponse.trim() || appeal.response,
          respondedBy: user?.name || 'Current User',
          responseDate: 'Just now',
          timeline: newTimeline,
        };
      }
      return appeal;
    });

    setAppeals(updatedAppeals);
    setSelectedAppeal({
      ...selectedAppeal,
      status: newStatus,
      response: statusResponse.trim() || selectedAppeal.response,
      respondedBy: user?.name || 'Current User',
      responseDate: 'Just now',
      timeline: newTimeline,
    });
    
    setStatusResponse('');
    setIsStatusDialogOpen(false);
    
    toast({
      title: 'Status updated',
      description: `Appeal status has been updated to ${newStatus}.`,
    });
  };

  const handleEditAppeal = () => {
    if (!selectedAppeal) return;
    setEditForm({
      subject: selectedAppeal.subject,
      description: selectedAppeal.description || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmitEdit = () => {
    if (!selectedAppeal || !editForm.subject.trim() || !editForm.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in title and description.',
        variant: 'destructive',
      });
      return;
    }

    const updatedAppeals = appeals.map((appeal) => {
      if (appeal.id === selectedAppeal.id) {
        return {
          ...appeal,
          subject: editForm.subject.trim(),
          description: editForm.description.trim(),
        };
      }
      return appeal;
    });

    setAppeals(updatedAppeals);
    setSelectedAppeal({
      ...selectedAppeal,
      subject: editForm.subject.trim(),
      description: editForm.description.trim(),
    });
    
    setIsEditDialogOpen(false);
    
    toast({
      title: 'Appeal updated',
      description: 'Your appeal has been successfully updated.',
    });
  };

  const handleDeleteAppeal = () => {
    if (!selectedAppeal) return;
    
    if (confirm('Are you sure you want to delete this appeal? This action cannot be undone.')) {
      const updatedAppeals = appeals.filter((appeal) => appeal.id !== selectedAppeal.id);
      setAppeals(updatedAppeals);
      setIsDialogOpen(false);
      setSelectedAppeal(null);
      
      toast({
        title: 'Appeal deleted',
        description: 'Your appeal has been successfully deleted.',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
           <h2 className="text-3xl font-bold tracking-tight">Appeals & Requests</h2>
           {shouldShowNewAppealButton && (
             <Dialog open={isNewAppealDialogOpen} onOpenChange={setIsNewAppealDialogOpen}>
               <DialogTrigger asChild>
                 <Button>New Appeal</Button>
               </DialogTrigger>
               <DialogContent className="max-w-2xl">
                 <DialogHeader>
                   <DialogTitle>Create New Appeal</DialogTitle>
                 </DialogHeader>
                 <Form {...newAppealForm}>
                   <form onSubmit={handleCreateAppeal} className="space-y-4 mt-2">
                     <FormField
                       control={newAppealForm.control}
                       name="type"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Appeal Type</FormLabel>
                           <Select onValueChange={field.onChange} value={field.value}>
                             <FormControl>
                               <SelectTrigger>
                                 <SelectValue />
                               </SelectTrigger>
                             </FormControl>
                             <SelectContent>
                               <SelectItem value="grade">Grade Appeal</SelectItem>
                               <SelectItem value="disciplinary">Disciplinary Appeal</SelectItem>
                               <SelectItem value="attendance">Attendance Appeal</SelectItem>
                               <SelectItem value="other">Other</SelectItem>
                             </SelectContent>
                           </Select>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                     <FormField
                       control={newAppealForm.control}
                       name="subject"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Subject</FormLabel>
                           <FormControl>
                             <SanitizedInput sanitizer="text" placeholder="e.g. Grade Correction - Physics" {...field} />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                     <FormField
                       control={newAppealForm.control}
                       name="description"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Description</FormLabel>
                           <FormControl>
                             <SanitizedTextarea sanitizer="description" placeholder="Provide detailed description..." rows={6} {...field} />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                     <FormField
                       control={newAppealForm.control}
                       name="requestedAction"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Requested Action</FormLabel>
                           <FormControl>
                             <SanitizedTextarea sanitizer="description" placeholder="What action do you want taken?" rows={3} {...field} />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                     <DialogFooter className="mt-6">
                       <Button type="button" variant="outline" onClick={() => setIsNewAppealDialogOpen(false)}>Cancel</Button>
                       <Button type="submit" disabled={newAppealForm.formState.isSubmitting}>
                         {newAppealForm.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                         Submit Appeal
                       </Button>
                     </DialogFooter>
                   </form>
                 </Form>
               </DialogContent>
             </Dialog>
           )}
        </div>

        <div className="space-y-4">
           {appeals.map((appeal) => (
              <Card key={appeal.id}>
                 <CardContent className="p-6 flex items-center justify-between">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-muted-foreground">{appeal.id}</span>
                          <Badge variant={appeal.status === 'Approved' ? 'default' : appeal.status === 'Rejected' ? 'destructive' : 'secondary'}>
                             {appeal.status}
                          </Badge>
                       </div>
                       <h3 className="font-semibold text-lg">{appeal.subject}</h3>
                       <p className="text-sm text-muted-foreground">Submitted {appeal.date}</p>
                    </div>
                    <Button variant="outline" onClick={() => handleViewDetails(appeal)}>
                      View Details
                    </Button>
                 </CardContent>
              </Card>
           ))}
        </div>

        {/* Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Appeal Details
              </DialogTitle>
            </DialogHeader>
            {selectedAppeal && (
              <div className="space-y-6 mt-4">
                {/* Header Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm text-muted-foreground">{selectedAppeal.id}</span>
                      <Badge variant={selectedAppeal.status === 'Approved' ? 'default' : selectedAppeal.status === 'Rejected' ? 'destructive' : 'secondary'}>
                        {selectedAppeal.status}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold">{selectedAppeal.subject}</h3>
                  </div>
                </div>

                {/* Appeal Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Submitted by:</span>
                    <span className="font-medium">{selectedAppeal.submittedBy || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{selectedAppeal.date}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Description
                  </h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                    {selectedAppeal.description || 'No description provided.'}
                  </p>
                </div>

                {/* Response Section */}
                {selectedAppeal.response && (
                  <div className="space-y-2 border-t pt-4">
                    <h4 className="font-semibold">Response</h4>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">{selectedAppeal.response}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                        <span>Responded by: <span className="font-medium">{selectedAppeal.respondedBy || 'N/A'}</span></span>
                        {selectedAppeal.responseDate && (
                          <span>Date: <span className="font-medium">{selectedAppeal.responseDate}</span></span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline Section */}
                {selectedAppeal.timeline && selectedAppeal.timeline.length > 0 && (
                  <div className="space-y-3 border-t pt-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Case Timeline
                    </h4>
                    <div className="space-y-3">
                      {selectedAppeal.timeline.map((event, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            {index < selectedAppeal.timeline!.length - 1 && (
                              <div className="w-px h-full bg-border mt-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{event.action}</span>
                              <span className="text-xs text-muted-foreground">{event.date}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">By {event.by}</p>
                            {event.details && (
                              <p className="text-xs text-muted-foreground mt-1">{event.details}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedAppeal.status === 'In Review' && (
                  <div className="flex gap-2 pt-4 border-t">
                    {user?.role === 'student' || user?.role === 'parent' ? (
                      // Student/Parent actions: Edit and Delete
                      <>
                        <Button variant="outline" className="flex-1" onClick={handleEditAppeal}>
                          Edit Appeal
                        </Button>
                        <Button variant="destructive" className="flex-1" onClick={handleDeleteAppeal}>
                          Delete Appeal
                        </Button>
                      </>
                    ) : (
                      // Teacher/Director actions: Add Comment and Update Status
                      <>
                        <Button variant="outline" className="flex-1" onClick={handleAddComment}>
                          Add Comment
                        </Button>
                        <Button className="flex-1" onClick={handleUpdateStatus}>
                          Update Status
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Comment Dialog */}
        <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Comment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <SanitizedTextarea
                  sanitizer="description"
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter your comment or response..."
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCommentDialogOpen(false);
                  setComment('');
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmitComment}
                disabled={!comment.trim()}
              >
                Add Comment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Appeal Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Appeal</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitEdit();
              }}
            >
              <div className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-subject">Title *</Label>
                  <Input
                    id="edit-subject"
                    value={editForm.subject}
                    onChange={(e) => setEditForm((f) => ({ ...f, subject: e.target.value }))}
                    placeholder="e.g. Grade Correction - Physics"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description *</Label>
                  <Textarea
                    id="edit-description"
                    value={editForm.description}
                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Please provide a detailed description..."
                    rows={8}
                    required
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Update Status Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Appeal Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="status">New Status</Label>
                <Select value={newStatus} onValueChange={(value: 'In Review' | 'Approved' | 'Rejected') => setNewStatus(value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="response">Response Message (Optional)</Label>
                <Textarea
                  id="response"
                  value={statusResponse}
                  onChange={(e) => setStatusResponse(e.target.value)}
                  placeholder="Enter a response message for the appeal..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  This message will be visible to the person who submitted the appeal.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsStatusDialogOpen(false);
                  setStatusResponse('');
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmitStatusUpdate}
              >
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
