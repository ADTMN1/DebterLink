import { StatCard } from "../StatCard";
import { Users } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Students"
        value={156}
        icon={Users}
        trend={{ value: 5, positive: true }}
      />
      <StatCard
        title="Attendance Rate"
        value="94%"
        icon={Users}
        trend={{ value: 2, positive: true }}
        iconColor="text-chart-2"
      />
    </div>
  );
}
