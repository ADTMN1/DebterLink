import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { School as SchoolType } from "@shared/schema";

interface AddSchoolProps {
  onAdd: (school: Omit<SchoolType, "id">) => void;
}

export function AddSchoolDialog({ onAdd }: AddSchoolProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    region: "",
    students: "",
    status: "Active" as "Active" | "Maintenance",
  });

  const handleSubmit = () => {
    onAdd({
      name: form.name.trim(),
      region: form.region.trim(),
      students: Number(form.students) || 0,
      status: form.status,
    });
    setForm({ name: "", region: "", students: "", status: "Active" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Register School
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register New School</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>School Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Bole High School"
            />
          </div>
          <div className="space-y-2">
            <Label>Region / City</Label>
            <Input
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              placeholder="e.g. Addis Ababa"
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save School</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
