import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { School as SchoolType } from "@shared/schema";

interface EditSchoolProps {
  school: SchoolType | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updatedData: Omit<SchoolType, "id">) => void;
}

export function EditSchoolDialog({ school, isOpen, onClose, onUpdate }: EditSchoolProps) {
  const [form, setForm] = useState({ name: "", region: "", students: "", status: "Active" });

  useEffect(() => {
    if (school) {
      setForm({
        name: school.name,
        region: school.region,
        students: school.students.toString(),
        status: school.status as "Active" | "Maintenance",
      });
    }
  }, [school]);

  const handleUpdate = () => {
    if (school) {
      onUpdate(school.id, {
        name: form.name.trim(),
        region: form.region.trim(),
        students: Number(form.students) || 0,
        status: form.status as any,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit School</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>School Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Region</Label>
            <Input
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Students</Label>
              <Input
                type="number"
                value={form.students}
                onChange={(e) => setForm({ ...form, students: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              >
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
