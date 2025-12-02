import { AttendanceWidget } from "../AttendanceWidget";

export default function AttendanceWidgetExample() {
  const mockStudents = [
    { id: "1", name: "Abebe Tadesse", status: null as any },
    { id: "2", name: "Tigist Haile", status: null as any },
    { id: "3", name: "Dawit Bekele", status: null as any },
    { id: "4", name: "Marta Alemu", status: null as any },
  ];

  return (
    <div className="p-6 max-w-2xl">
      <AttendanceWidget students={mockStudents} />
    </div>
  );
}
