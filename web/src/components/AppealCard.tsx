import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface Appeal {
  id: string;
  title: string;
  submittedBy: string;
  submittedDate: Date;
  status: "open" | "in-review" | "escalated" | "completed";
  priority: "low" | "medium" | "high";
  commentsCount: number;
}

interface AppealCardProps {
  appeal: Appeal;
  onView?: () => void;
}

const statusConfig = {
  open: { icon: AlertCircle, label: "Open", variant: "secondary" as const },
  "in-review": { icon: Clock, label: "In Review", variant: "default" as const },
  escalated: { icon: AlertCircle, label: "Escalated", variant: "destructive" as const },
  completed: { icon: CheckCircle2, label: "Completed", variant: "secondary" as const },
};

const priorityColors = {
  low: "bg-chart-2/10 text-chart-2",
  medium: "bg-chart-4/10 text-chart-4",
  high: "bg-destructive/10 text-destructive",
};

export function AppealCard({ appeal, onView }: AppealCardProps) {
  const config = statusConfig[appeal.status];
  const Icon = config.icon;

  return (
    <Card className="hover-elevate transition-all" data-testid={`card-appeal-${appeal.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{appeal.title}</CardTitle>
              <Badge
                variant="secondary"
                className={`text-xs ${priorityColors[appeal.priority]}`}
              >
                {appeal.priority.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Submitted by {appeal.submittedBy}
            </p>
          </div>
          <Badge variant={config.variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {format(appeal.submittedDate, "MMM dd, yyyy")}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            {appeal.commentsCount} comments
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            onView?.();
            console.log("View appeal:", appeal.id);
          }}
          data-testid={`button-view-appeal-${appeal.id}`}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
