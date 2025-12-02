import { AppealCard } from "../AppealCard";
import { addDays } from "date-fns";

export default function AppealCardExample() {
  const mockAppeals = [
    {
      id: "1",
      title: "Grade Review Request - Mathematics",
      submittedBy: "Parent: Almaz Tekle",
      submittedDate: new Date(),
      status: "open" as const,
      priority: "high" as const,
      commentsCount: 3,
    },
    {
      id: "2",
      title: "Absence Excuse Documentation",
      submittedBy: "Parent: Bekele Mekonnen",
      submittedDate: addDays(new Date(), -2),
      status: "in-review" as const,
      priority: "medium" as const,
      commentsCount: 5,
    },
  ];

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2 max-w-4xl">
      {mockAppeals.map((appeal) => (
        <AppealCard key={appeal.id} appeal={appeal} />
      ))}
    </div>
  );
}
