import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Minus } from "lucide-react";
import { useState } from "react";

interface Student {
  id: string;
  name: string;
  status: "present" | "absent" | "late" | null;
}

interface AttendanceWidgetProps {
  className?: string;
  students: Student[];
  onSubmit?: (attendance: Record<string, "present" | "absent" | "late">) => void;
}

export function AttendanceWidget({ className, students: initialStudents, onSubmit }: AttendanceWidgetProps) {
  const [students, setStudents] = useState(initialStudents);

  const markAttendance = (studentId: string, status: "present" | "absent" | "late") => {
    setStudents(prev =>
      prev.map(s => s.id === studentId ? { ...s, status } : s)
    );
  };

  const handleSubmit = () => {
    const attendance = students.reduce((acc, student) => {
      if (student.status) {
        acc[student.id] = student.status;
      }
      return acc;
    }, {} as Record<string, "present" | "absent" | "late">);
    
    onSubmit?.(attendance);
    console.log("Attendance submitted:", attendance);
  };

  const stats = {
    present: students.filter(s => s.status === "present").length,
    absent: students.filter(s => s.status === "absent").length,
    late: students.filter(s => s.status === "late").length,
  };

  return (
    <Card className={className} data-testid="card-attendance">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Mark Attendance</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary" className="gap-1">
              <Check className="h-3 w-3" /> {stats.present}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <X className="h-3 w-3" /> {stats.absent}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Minus className="h-3 w-3" /> {stats.late}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between rounded-lg border p-3"
            data-testid={`attendance-row-${student.id}`}
          >
            <span className="font-medium">{student.name}</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={student.status === "present" ? "default" : "outline"}
                onClick={() => markAttendance(student.id, "present")}
                data-testid={`button-present-${student.id}`}
                className="h-8 px-3"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={student.status === "late" ? "default" : "outline"}
                onClick={() => markAttendance(student.id, "late")}
                data-testid={`button-late-${student.id}`}
                className="h-8 px-3"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={student.status === "absent" ? "destructive" : "outline"}
                onClick={() => markAttendance(student.id, "absent")}
                data-testid={`button-absent-${student.id}`}
                className="h-8 px-3"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button 
          className="w-full mt-4" 
          onClick={handleSubmit}
          data-testid="button-submit-attendance"
        >
          Submit Attendance
        </Button>
      </CardContent>
    </Card>
  );
}
