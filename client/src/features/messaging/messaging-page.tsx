import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SanitizedInput } from '@/components/ui/sanitized-input';
import { SanitizedTextarea } from '@/components/ui/sanitized-input';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, Paperclip, Mic, Plus, X, Square } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useToast } from '@/hooks/use-toast';

export default function MessagingPage() {
  const { toast } = useToast();
  const [activeChat, setActiveChat] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [newMessageForm, setNewMessageForm] = useState({ recipient: '', message: '', recipientType: 'individual' as 'individual' | 'class' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  
  const contacts = [
    { id: 1, name: 'Dr. Yohannes (Director)', role: 'Director', class: 'all', lastMsg: 'Please come to my office.', time: '10:30 AM', unread: 1 },
    { id: 2, name: 'Tigist Alemu', role: 'Teacher', class: 'all', lastMsg: 'The assignment is due tomorrow.', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'Parent Committee', role: 'Group', class: 'all', lastMsg: 'Meeting postponed.', time: '2 days ago', unread: 0 },
    { id: 4, name: 'Grade 11A Class', role: 'Class', class: 'Grade 11A', lastMsg: 'Homework reminder', time: '3 hours ago', unread: 0 },
    { id: 5, name: 'Grade 12A Class', role: 'Class', class: 'Grade 12A', lastMsg: 'Exam schedule', time: '1 day ago', unread: 0 },
  ];

  const filteredContacts = useMemo(() => 
    contacts.filter((contact) => {
      const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.lastMsg.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = classFilter === 'all' || contact.class === classFilter || contact.class === 'all';
      return matchesSearch && matchesClass;
    }),
    [searchQuery, classFilter]
  );

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Maximum file size is 10MB', variant: 'destructive' });
        return;
      }
      setSelectedFile(file);
    }
  }, [toast]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      toast({ title: 'Recording', description: 'Voice note recording started' });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not access microphone', variant: 'destructive' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      toast({ title: 'Stopped', description: 'Voice note recording stopped' });
    }
  };

  const handleSendNewMessage = useCallback(() => {
    if (!newMessageForm.recipient.trim() || !newMessageForm.message.trim()) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    const fileInfo = selectedFile ? ` with attachment: ${selectedFile.name}` : '';
    const voiceInfo = audioBlob ? ' with voice note' : '';
    const recipientText = newMessageForm.recipientType === 'class' ? `${newMessageForm.recipient} (Class)` : newMessageForm.recipient;
    toast({ title: 'Message sent', description: `Message sent to ${recipientText}${fileInfo}${voiceInfo}` });
    setIsNewMessageOpen(false);
    setNewMessageForm({ recipient: '', message: '', recipientType: 'individual' });
    setSelectedFile(null);
    setAudioBlob(null);
  }, [newMessageForm, selectedFile, audioBlob, toast]);

  const handleSendChatMessage = useCallback(() => {
    if (!chatMessage.trim() && !selectedFile && !audioBlob) {
      toast({ title: 'Error', description: 'Please enter a message or attach a file', variant: 'destructive' });
      return;
    }
    const fileInfo = selectedFile ? ` with ${selectedFile.name}` : '';
    const voiceInfo = audioBlob ? ' with voice note' : '';
    toast({ title: 'Message sent', description: `Message sent${fileInfo}${voiceInfo}` });
    setChatMessage('');
    setSelectedFile(null);
    setAudioBlob(null);
  }, [chatMessage, selectedFile, audioBlob, toast]);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
          <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label>Recipient Type</Label>
                  <Select value={newMessageForm.recipientType} onValueChange={(v: 'individual' | 'class') => setNewMessageForm(f => ({ ...f, recipientType: v, recipient: '' }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="class">Class/Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient">To</Label>
                  {newMessageForm.recipientType === 'individual' ? (
                    <SanitizedInput
                      sanitizer="text"
                      id="recipient"
                      value={newMessageForm.recipient}
                      onChange={(e) => setNewMessageForm(f => ({ ...f, recipient: e.target.value }))}
                      placeholder="Enter recipient name..."
                    />
                  ) : (
                    <Select value={newMessageForm.recipient} onValueChange={(v) => setNewMessageForm(f => ({ ...f, recipient: v }))}>
                      <SelectTrigger id="recipient">
                        <SelectValue placeholder="Select class..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grade 9A">Grade 9A</SelectItem>
                        <SelectItem value="Grade 10A">Grade 10A</SelectItem>
                        <SelectItem value="Grade 11A">Grade 11A</SelectItem>
                        <SelectItem value="Grade 12A">Grade 12A</SelectItem>
                        <SelectItem value="All Teachers">All Teachers</SelectItem>
                        <SelectItem value="All Parents">All Parents</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <SanitizedTextarea
                    sanitizer="description"
                    id="message"
                    value={newMessageForm.message}
                    onChange={(e) => setNewMessageForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Type your message..."
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Attachment (Optional)</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                  {selectedFile && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <Paperclip className="h-4 w-4" />
                      <span className="text-sm flex-1">{selectedFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Voice Note (Optional)</Label>
                  <div className="flex items-center gap-2">
                    {!isRecording ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={startRecording}
                        disabled={!!audioBlob}
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={stopRecording}
                      >
                        <Square className="h-4 w-4 mr-2" />
                        Stop Recording
                      </Button>
                    )}
                    {audioBlob && (
                      <div className="flex items-center gap-2 flex-1">
                        <audio controls src={URL.createObjectURL(audioBlob)} className="flex-1">
                          <track kind="captions" srcLang="en" label="English" />
                        </audio>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAudioBlob(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewMessageOpen(false)}>Cancel</Button>
                <Button onClick={handleSendNewMessage}>Send Message</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      <div className="h-[calc(100vh-12rem)] flex gap-6">
        {/* Sidebar List */}
        <Card className="w-1/3 flex flex-col">
          <CardHeader className="px-4 py-3 border-b space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <SanitizedInput 
                sanitizer="text"
                placeholder="Search messages..." 
                className="pl-8 bg-muted/50" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contacts</SelectItem>
                <SelectItem value="Grade 11A">Grade 11A</SelectItem>
                <SelectItem value="Grade 12A">Grade 12A</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {filteredContacts.map((contact) => (
                <div 
                  key={contact.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveChat(contact.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveChat(contact.id);
                    }
                  }}
                  className={`flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-accent/50 ${activeChat === contact.id ? 'bg-accent' : ''}`}
                >
                  <Avatar>
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-semibold truncate">{contact.name}</span>
                      <span className="text-xs text-muted-foreground">{contact.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{contact.lastMsg}</p>
                  </div>
                  {contact.unread > 0 && (
                    <span className="h-2 w-2 rounded-full bg-primary mt-2"></span>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
             <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>D</AvatarFallback>
                </Avatar>
                <div>
                   <h3 className="font-semibold">Dr. Yohannes (Director)</h3>
                   <span className="text-xs text-orange-500 flex items-center gap-1">● Online</span>
                </div>
             </div>
          </div>
          
          <ScrollArea className="flex-1 p-4">
             <div className="space-y-4">
                <div className="flex justify-start">
                   <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                      <p className="text-sm">Hello, I wanted to discuss the upcoming science fair.</p>
                      <span className="text-[10px] text-muted-foreground mt-1 block">10:00 AM</span>
                   </div>
                </div>
                <div className="flex justify-end">
                   <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none max-w-[80%]">
                      <p className="text-sm">Yes, sure. When would be a good time?</p>
                      <span className="text-[10px] text-primary-foreground/70 mt-1 block">10:05 AM</span>
                   </div>
                </div>
                <div className="flex justify-start">
                   <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                      <p className="text-sm">Please come to my office around 2 PM.</p>
                      <span className="text-[10px] text-muted-foreground mt-1 block">10:30 AM</span>
                   </div>
                </div>
             </div>
          </ScrollArea>

          <div className="p-4 border-t">
             <div className="flex items-center gap-2">
                <Input
                  type="file"
                  id="chat-file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => document.getElementById('chat-file')?.click()}
                  aria-label="Attach file"
                >
                   <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
                <SanitizedInput 
                  sanitizer="description"
                  placeholder="Type your message..." 
                  className="flex-1" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChatMessage();
                    }
                  }}
                />
                {!isRecording ? (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={startRecording}
                    aria-label="Start voice recording"
                  >
                     <Mic className="h-5 w-5 text-muted-foreground" />
                  </Button>
                ) : (
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={stopRecording}
                    aria-label="Stop voice recording"
                  >
                     <Square className="h-5 w-5" />
                  </Button>
                )}
                <Button size="icon" onClick={handleSendChatMessage} aria-label="Send message">
                   <Send className="h-5 w-5" />
                </Button>
             </div>
             {selectedFile && (
               <div className="flex items-center gap-2 p-2 mt-2 bg-muted rounded-md">
                 <Paperclip className="h-4 w-4" />
                 <span className="text-sm flex-1">{selectedFile.name}</span>
                 <Button
                   type="button"
                   variant="ghost"
                   size="sm"
                   onClick={() => setSelectedFile(null)}
                 >
                   <X className="h-4 w-4" />
                 </Button>
               </div>
             )}
             {audioBlob && (
               <div className="flex items-center gap-2 p-2 mt-2 bg-muted rounded-md">
                 <audio controls src={URL.createObjectURL(audioBlob)} className="flex-1">
                   <track kind="captions" srcLang="en" label="English" />
                 </audio>
                 <Button
                   type="button"
                   variant="ghost"
                   size="sm"
                   onClick={() => setAudioBlob(null)}
                 >
                   <X className="h-4 w-4" />
                 </Button>
               </div>
             )}
          </div>
        </Card>
      </div>
      </div>
    </DashboardLayout>
  );
}
