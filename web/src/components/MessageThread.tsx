import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

interface Message {
  id: string;
  sender: {
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface MessageThreadProps {
  messages: Message[];
  recipient: { name: string; avatar?: string; role: string };
  onSendMessage?: (content: string) => void;
}

export function MessageThread({ messages, recipient, onSendMessage }: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage?.(newMessage);
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <Card className="flex flex-col h-[600px]" data-testid="card-message-thread">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={recipient.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {recipient.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{recipient.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{recipient.role}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : ''}`}
            data-testid={`message-${message.id}`}
          >
            {!message.isOwn && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.sender.avatar} />
                <AvatarFallback className="text-xs">
                  {message.sender.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div className={`flex flex-col gap-1 max-w-[70%] ${message.isOwn ? 'items-end' : ''}`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.isOwn
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              <span className="text-xs text-muted-foreground px-2">
                {format(message.timestamp, "HH:mm")}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
      
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            data-testid="button-attach-file"
            onClick={() => console.log("Attach file clicked")}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            data-testid="input-message"
          />
          <Button
            onClick={handleSend}
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
