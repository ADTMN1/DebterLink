import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Array<{ id: string; from: string; subject: string; body: string; date: string }>>([
    { id: '1', from: 'Tigist Alemu', subject: 'Homework update', body: 'Please submit lab report by Monday.', date: '2025-12-03' },
    { id: '2', from: 'Director', subject: 'Holiday notice', body: 'School closed next Friday.', date: '2025-11-28' },
  ]);

  const [compose, setCompose] = useState({ to: '', subject: '', body: '' });

  const handleSend = () => {
    // Demo: just add to local list
    const id = Date.now().toString();
    setMessages([{ id, from: 'You', subject: compose.subject, body: compose.body, date: new Date().toISOString() }, ...messages]);
    setCompose({ to: '', subject: '', body: '' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Messages</h2>

        <Card>
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input placeholder="To (teacher/student)" value={compose.to} onChange={(e) => setCompose(s => ({ ...s, to: e.target.value }))} />
              <Input placeholder="Subject" value={compose.subject} onChange={(e) => setCompose(s => ({ ...s, subject: e.target.value }))} />
              <Textarea placeholder="Write your message..." value={compose.body} onChange={(e) => setCompose(s => ({ ...s, body: e.target.value }))} rows={4} />
              <div className="flex justify-end">
                <Button onClick={handleSend}>Send</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {messages.map((m) => (
            <Card key={m.id}>
              <CardHeader>
                <CardTitle>{m.subject}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">From: {m.from} • {new Date(m.date).toLocaleString()}</div>
                <p className="mt-2">{m.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
