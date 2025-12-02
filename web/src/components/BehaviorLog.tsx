import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Award } from "lucide-react";
import { format } from "date-fns";

interface BehaviorEntry {
  id: string;
  type: "positive" | "negative" | "award";
  title: string;
  description: string;
  date: Date;
  points: number;
}

interface BehaviorLogProps {
  entries: BehaviorEntry[];
  totalPoints: number;
}

const typeConfig = {
  positive: { icon: ThumbsUp, color: "text-chart-2", bgColor: "bg-chart-2/10" },
  negative: { icon: ThumbsDown, color: "text-destructive", bgColor: "bg-destructive/10" },
  award: { icon: Award, color: "text-chart-4", bgColor: "bg-chart-4/10" },
};

export function BehaviorLog({ entries, totalPoints }: BehaviorLogProps) {
  return (
    <Card data-testid="card-behavior-log">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Behavior Log</CardTitle>
          <Badge variant="default" className="text-lg px-4 py-1">
            {totalPoints} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry) => {
          const config = typeConfig[entry.type];
          const Icon = config.icon;
          
          return (
            <div
              key={entry.id}
              className={`flex gap-3 rounded-lg border p-4 ${config.bgColor}`}
              data-testid={`behavior-entry-${entry.id}`}
            >
              <div className={`rounded-lg bg-background p-2 h-fit ${config.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{entry.title}</p>
                  <span className={`font-semibold ${config.color}`}>
                    {entry.points > 0 ? "+" : ""}{entry.points}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{entry.description}</p>
                <p className="text-xs text-muted-foreground">
                  {format(entry.date, "MMM dd, yyyy 'at' HH:mm")}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
