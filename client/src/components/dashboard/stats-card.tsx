import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function DashboardStatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
}: DashboardStatsCardProps) {
  return (
    <Card className={cn("overflow-hidden p-6", className)}>
      <div className="flex flex-row items-center justify-between space-y-0">
        <div className="flex-1 space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="text-3xl font-semibold tabular-nums">
            {value}
          </div>
          {(description || trend) && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {trend && (
                <span className={cn(
                  "font-medium",
                  trend === 'up' ? "text-orange-600 dark:text-orange-400" : trend === 'down' ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"
                )}>
                  {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
                </span>
              )}
              {description}
            </p>
          )}
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </Card>
  );
}
