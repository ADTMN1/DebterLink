import { AssignmentCard } from "../AssignmentCard";
import { addDays } from "date-fns";

export default function AssignmentCardExample() {
  const mockAssignments = [
    {
      id: "1",
      title: "Algebra Problem Set 5",
      subject: "Mathematics",
      dueDate: addDays(new Date(), 2),
      status: "pending" as const,
    },
    {
      id: "2",
      title: "Essay on Ethiopian History",
      subject: "History",
      dueDate: addDays(new Date(), -1),
      status: "graded" as const,
      grade: 88,
      maxGrade: 100,
    },
  ];

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2 max-w-4xl">
      {mockAssignments.map((assignment) => (
        <AssignmentCard key={assignment.id} assignment={assignment} />
      ))}
    </div>
  );
}
