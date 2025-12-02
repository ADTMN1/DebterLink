import { BehaviorLog } from "../BehaviorLog";
import { addDays } from "date-fns";

export default function BehaviorLogExample() {
  const mockEntries = [
    {
      id: "1",
      type: "award" as const,
      title: "Perfect Attendance",
      description: "Achieved perfect attendance for the month",
      date: new Date(),
      points: 50,
    },
    {
      id: "2",
      type: "positive" as const,
      title: "Helped Classmate",
      description: "Assisted peer with difficult math problem",
      date: addDays(new Date(), -2),
      points: 10,
    },
    {
      id: "3",
      type: "negative" as const,
      title: "Late to Class",
      description: "Arrived 10 minutes late without excuse",
      date: addDays(new Date(), -5),
      points: -5,
    },
  ];

  return (
    <div className="p-6 max-w-2xl">
      <BehaviorLog entries={mockEntries} totalPoints={245} />
    </div>
  );
}
