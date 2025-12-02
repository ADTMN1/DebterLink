import { GradeChart } from "../GradeChart";

export default function GradeChartExample() {
  const mockGradeData = [
    { month: "Sep", average: 75, classAverage: 72 },
    { month: "Oct", average: 78, classAverage: 74 },
    { month: "Nov", average: 82, classAverage: 76 },
    { month: "Dec", average: 85, classAverage: 78 },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <GradeChart data={mockGradeData} title="Student Performance Trend" />
    </div>
  );
}
