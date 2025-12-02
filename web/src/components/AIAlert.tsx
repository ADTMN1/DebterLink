import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingDown, AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface AIAlertProps {
  student: {
    name: string;
    id: string;
  };
  predictionType: "academic-risk" | "attendance-drop" | "behavior-concern";
  confidence: number;
  suggestions: string[];
  onDismiss?: () => void;
  onTakeAction?: () => void;
}

const predictionConfig = {
  "academic-risk": {
    icon: TrendingDown,
    label: "Academic Risk Detected",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  "attendance-drop": {
    icon: AlertTriangle,
    label: "Attendance Pattern Alert",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  "behavior-concern": {
    icon: AlertTriangle,
    label: "Behavior Alert",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
};

export function AIAlert({ student, predictionType, confidence, suggestions, onDismiss, onTakeAction }: AIAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  const config = predictionConfig[predictionType];
  const Icon = config.icon;

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
    console.log("Alert dismissed for student:", student.id);
  };

  return (
    <Card className={`border-l-4 ${config.bgColor}`} data-testid={`alert-ai-${student.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`rounded-lg bg-background p-2 ${config.color}`}>
              <Brain className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">{config.label}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Student: <span className="font-medium text-foreground">{student.name}</span>
              </p>
              <Badge variant="secondary" className="mt-2">
                {confidence}% confidence
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            data-testid={`button-dismiss-${student.id}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">AI Recommendations:</p>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button
          className="w-full"
          onClick={() => {
            onTakeAction?.();
            console.log("Taking action for student:", student.id);
          }}
          data-testid={`button-take-action-${student.id}`}
        >
          Take Action
        </Button>
      </CardContent>
    </Card>
  );
}
