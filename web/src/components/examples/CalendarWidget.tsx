import { CalendarWidget } from "../CalendarWidget";
import { addDays } from "date-fns";

export default function CalendarWidgetExample() {
  const mockEvents = [
    { date: addDays(new Date(), 3), title: "Math Exam", type: "exam" as const },
    { date: addDays(new Date(), 7), title: "Parent Meeting", type: "event" as const },
    { date: addDays(new Date(), 10), title: "National Holiday", type: "holiday" as const },
  ];

  return (
    <div className="p-6 max-w-md">
      <CalendarWidget events={mockEvents} />
    </div>
  );
}
