import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { format } from "date-fns";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  status: "pending" | "submitted" | "graded" | "late";
  grade?: number;
  maxGrade?: number;
}

interface AssignmentCardProps {
  assignment: Assignment;
  onSubmit?: () => void;
  onDownload?: () => void;
}

const statusConfig = {
  pending: { icon: Clock, label: "Pending", variant: "secondary" as const, color: "text-chart-4" },
  submitted: { icon: CheckCircle2, label: "Submitted", variant: "secondary" as const, color: "text-chart-2" },
  graded: { icon: CheckCircle2, label: "Graded", variant: "default" as const, color: "text-primary" },
  late: { icon: AlertCircle, label: "Late", variant: "destructive" as const, color: "text-destructive" },
};

export function AssignmentCard({ assignment, onSubmit, onDownload }: AssignmentCardProps) {
  const config = statusConfig[assignment.status];
  const Icon = config.icon;
  
  const isOverdue = assignment.status === "pending" && assignment.dueDate < new Date();

  return (
    <Card className="hover-elevate transition-all" data-testid={`card-assignment-${assignment.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">{assignment.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{assignment.subject}</p>
          </div>
          <Badge variant={config.variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Due Date</span>
          <span className={`font-medium ${isOverdue ? 'text-destructive' : ''}`}>
            {format(assignment.dueDate, "MMM dd, yyyy")}
          </span>
        </div>
        
        {assignment.status === "graded" && assignment.grade !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Grade</span>
            <span className="font-semibold text-lg text-primary">
              {assignment.grade}/{assignment.maxGrade}
            </span>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              onDownload?.();
              console.log("Download assignment:", assignment.id);
            }}
            data-testid={`button-download-${assignment.id}`}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          {assignment.status === "pending" && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => {
                onSubmit?.();
                console.log("Submit assignment:", assignment.id);
              }}
              data-testid={`button-submit-${assignment.id}`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Submit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
