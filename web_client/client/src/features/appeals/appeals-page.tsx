import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Calendar, User, FileText, MessageSquare, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/useAuthStore';

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
  const [comment, setComment] = useState('');
  const [newStatus, setNewStatus] = useState<'In Review' | 'Approved' | 'Rejected'>('In Review');
  const [statusResponse, setStatusResponse] = useState('');
  const [newAppealForm, setNewAppealForm] = useState({
    subject: '',
    category: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    description: '',
  });

  const handleViewDetails = (appeal: Appeal) => {
    setSelectedAppeal(appeal);
    setIsDialogOpen(true);
  };

  const handleCreateAppeal = () => {
    if (!newAppealForm.subject.trim() || !newAppealForm.description.trim() || !newAppealForm.category.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newAppeal: Appeal = {
      id: `AP-${new Date().getFullYear()}-${String(appeals.length + 1).padStart(3, '0')}`,
      subject: newAppealForm.subject.trim(),
      status: 'In Review',
      date: 'Just now',
      description: newAppealForm.description.trim(),
      submittedBy: user?.name || 'Unknown',
      category: newAppealForm.category,
      priority: newAppealForm.priority,
    };

    setAppeals([newAppeal, ...appeals]);
    setIsNewAppealDialogOpen(false);
    setNewAppealForm({
      subject: '',
      category: '',
      priority: 'Medium',
      description: '',
    });

    toast({
      title: 'Appeal submitted',
      description: 'Your appeal has been successfully submitted and is now under review.',
    });
  };

  const handleAddComment = () => {
    if (!selectedAppeal) return;
    setIsCommentDialogOpen(true);
  };

  const handleSubmitComment = () => {
    if (!comment.trim() || !selectedAppeal) return;

    // Update the appeal with the comment
    const updatedAppeals = appeals.map((appeal) => {
      if (appeal.id === selectedAppeal.id) {
        return {
          ...appeal,
          response: comment.trim(),
          respondedBy: user?.name || 'Current User',
          responseDate: 'Just now',
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

    const updatedAppeals = appeals.map((appeal) => {
      if (appeal.id === selectedAppeal.id) {
        return {
          ...appeal,
          status: newStatus,
          response: statusResponse.trim() || appeal.response,
          respondedBy: user?.name || 'Current User',
          responseDate: 'Just now',
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
    });
    
    setStatusResponse('');
    setIsStatusDialogOpen(false);
    
    toast({
      title: 'Status updated',
      description: `Appeal status has been updated to ${newStatus}.`,
    });
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
                 <form
                   onSubmit={(e) => {
                     e.preventDefault();
                     handleCreateAppeal();
                   }}
                 >
                   <div className="space-y-4 mt-2">
                     <div className="space-y-2">
                       <Label htmlFor="subject">Subject *</Label>
                       <Input
                         id="subject"
                         value={newAppealForm.subject}
                         onChange={(e) => setNewAppealForm((f) => ({ ...f, subject: e.target.value }))}
                         placeholder="e.g. Grade Correction - Physics"
                         required
                       />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label htmlFor="category">Category *</Label>
                         <Select
                           value={newAppealForm.category}
                           onValueChange={(value) => setNewAppealForm((f) => ({ ...f, category: value }))}
                         >
                           <SelectTrigger id="category">
                             <SelectValue placeholder="Select category" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="Grade Appeal">Grade Appeal</SelectItem>
                             <SelectItem value="Exam Appeal">Exam Appeal</SelectItem>
                             <SelectItem value="Leave Request">Leave Request</SelectItem>
                             <SelectItem value="Other">Other</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="priority">Priority *</Label>
                         <Select
                           value={newAppealForm.priority}
                           onValueChange={(value: 'High' | 'Medium' | 'Low') => setNewAppealForm((f) => ({ ...f, priority: value }))}
                         >
                           <SelectTrigger id="priority">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="High">High</SelectItem>
                             <SelectItem value="Medium">Medium</SelectItem>
                             <SelectItem value="Low">Low</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="description">Description *</Label>
                       <Textarea
                         id="description"
                         value={newAppealForm.description}
                         onChange={(e) => setNewAppealForm((f) => ({ ...f, description: e.target.value }))}
                         placeholder="Please provide a detailed description of your appeal or request..."
                         rows={6}
                         required
                       />
                     </div>
                   </div>
                   <DialogFooter className="mt-6">
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => {
                         setIsNewAppealDialogOpen(false);
                         setNewAppealForm({
                           subject: '',
                           category: '',
                           priority: 'Medium',
                           description: '',
                         });
                       }}
                     >
                       Cancel
                     </Button>
                     <Button type="submit">
                       Submit Appeal
                     </Button>
                   </DialogFooter>
                 </form>
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
                  {selectedAppeal.category && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{selectedAppeal.category}</span>
                    </div>
                  )}
                  {selectedAppeal.priority && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge variant={selectedAppeal.priority === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                        {selectedAppeal.priority}
                      </Badge>
                    </div>
                  )}
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

                {/* Actions */}
                {selectedAppeal.status === 'In Review' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" className="flex-1" onClick={handleAddComment}>
                      Add Comment
                    </Button>
                    <Button className="flex-1" onClick={handleUpdateStatus}>
                      Update Status
                    </Button>
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
                <Textarea
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
