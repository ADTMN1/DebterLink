import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, Paperclip, Mic } from 'lucide-react';
import { useState } from 'react';

export default function MessagingPage() {
  const [activeChat, setActiveChat] = useState(1);
  
  const contacts = [
    { id: 1, name: 'Dr. Yohannes (Director)', role: 'Director', lastMsg: 'Please come to my office.', time: '10:30 AM', unread: 1 },
    { id: 2, name: 'Tigist Alemu', role: 'Teacher', lastMsg: 'The assignment is due tomorrow.', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'Parent Committee', role: 'Group', lastMsg: 'Meeting postponed.', time: '2 days ago', unread: 0 },
  ];

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex gap-6">
        {/* Sidebar List */}
        <Card className="w-1/3 flex flex-col">
          <CardHeader className="px-4 py-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-8 bg-muted/50" />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {contacts.map((contact) => (
                <div 
                  key={contact.id}
                  onClick={() => setActiveChat(contact.id)}
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
                <Button variant="ghost" size="icon">
                   <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Input placeholder="Type your message..." className="flex-1" />
                <Button variant="ghost" size="icon">
                   <Mic className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button size="icon">
                   <Send className="h-5 w-5" />
                </Button>
             </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
