import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import { useState } from "react";

interface CalendarEvent {
  date: Date;
  title: string;
  type: "exam" | "holiday" | "event";
}

interface CalendarWidgetProps {
  events?: CalendarEvent[];
  calendarType?: "gregorian" | "ethiopian";
}

const eventColors = {
  exam: "bg-destructive",
  holiday: "bg-chart-2",
  event: "bg-primary",
};

export function CalendarWidget({ events = [], calendarType = "gregorian" }: CalendarWidgetProps) {
  const [currentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const hasEvent = (day: Date) => {
    return events.find(event => isSameDay(event.date, day));
  };

  return (
    <Card data-testid="card-calendar">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {format(currentDate, "MMMM yyyy")}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {calendarType === "gregorian" ? "Gregorian" : "Ethiopian"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const event = hasEvent(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={index}
                className={`
                  relative aspect-square flex items-center justify-center rounded-md text-sm
                  ${isSameMonth(day, currentDate) ? "text-foreground" : "text-muted-foreground"}
                  ${isToday ? "bg-primary text-primary-foreground font-semibold" : "hover-elevate"}
                `}
                data-testid={`calendar-day-${format(day, "yyyy-MM-dd")}`}
              >
                {format(day, "d")}
                {event && (
                  <div className={`absolute bottom-1 w-1 h-1 rounded-full ${eventColors[event.type]}`} />
                )}
              </div>
            );
          })}
        </div>
        {events.length > 0 && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <p className="text-sm font-medium">Upcoming Events</p>
            {events.slice(0, 3).map((event, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${eventColors[event.type]}`} />
                <span className="text-muted-foreground">{format(event.date, "MMM dd")}</span>
                <span className="flex-1">{event.title}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
