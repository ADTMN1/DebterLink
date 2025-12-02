import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageThread } from "@/components/MessageThread";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip, 
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Clock
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export default function MessagingPage() {
  const sidebarStyle = { "--sidebar-width": "16rem" };
  const [selectedConversation, setSelectedConversation] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");

  const conversations = [
    {
      id: "1",
      name: "Alemayehu Bekele",
      role: "Parent",
      avatar: "",
      lastMessage: "Thank you for the update on Abebe's progress",
      timestamp: new Date(),
      unread: 2,
      isOnline: true,
    },
    {
      id: "2",
      name: "Tigist Haile",
      role: "Parent",
      avatar: "",
      lastMessage: "When is the next parent meeting?",
      timestamp: new Date(Date.now() - 3600000),
      unread: 0,
      isOnline: false,
    },
    {
      id: "3",
      name: "Marta Alemu",
      role: "Parent",
      avatar: "",
      lastMessage: "I have a question about the assignment",
      timestamp: new Date(Date.now() - 7200000),
      unread: 1,
      isOnline: true,
    },
    {
      id: "4",
      name: "Yonas Tadesse",
      role: "Teacher",
      avatar: "",
      lastMessage: "Can we discuss the upcoming exam?",
      timestamp: new Date(Date.now() - 86400000),
      unread: 0,
      isOnline: false,
    },
  ];

  const mockMessages = [
    {
      id: "1",
      sender: { name: "Alemayehu Bekele", avatar: "", role: "Parent" },
      content: "Hello, I wanted to check on Abebe's attendance this week.",
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
    },
    {
      id: "2",
      sender: { name: "You", avatar: "", role: "Teacher" },
      content: "Hello! Abebe has been present all week. He's doing great!",
      timestamp: new Date(Date.now() - 3300000),
      isOwn: true,
    },
    {
      id: "3",
      sender: { name: "Alemayehu Bekele", avatar: "", role: "Parent" },
      content: "That's wonderful to hear. Thank you for the update on Abebe's progress.",
      timestamp: new Date(),
      isOwn: false,
    },
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="teacher" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-hidden">
            <div className="flex h-full">
              {/* Conversations List */}
              <div className="w-80 border-r flex flex-col">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-serif font-bold">Messages</h2>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    {conversations
                      .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() => setSelectedConversation(conversation.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedConversation === conversation.id
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar>
                                <AvatarFallback>
                                  {conversation.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {conversation.isOnline && (
                                <div className="absolute bottom-0 right-0 h-3 w-3 bg-chart-2 rounded-full border-2 border-background" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium text-sm truncate">{conversation.name}</p>
                                {conversation.unread > 0 && (
                                  <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                                    {conversation.unread}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate mb-1">
                                {conversation.lastMessage}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(conversation.timestamp, "HH:mm")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Message Thread */}
              <div className="flex-1 flex flex-col">
                {selectedConv && (
                  <>
                    <div className="p-4 border-b flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {selectedConv.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedConv.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedConv.role} {selectedConv.isOnline && "• Online"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <MessageThread
                        messages={mockMessages}
                        recipient={{
                          name: selectedConv.name,
                          avatar: selectedConv.avatar,
                          role: selectedConv.role,
                        }}
                        onSendMessage={(content) => {
                          console.log("Sending:", content);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}





