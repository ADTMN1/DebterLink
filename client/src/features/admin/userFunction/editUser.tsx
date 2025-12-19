import { useEffect } from "react";
import { useSanitizedForm } from "@/hooks/use-sanitized-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editUserSchema, EditUserFormData } from "@/lib/validations";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription, // Added this
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SanitizedInput } from "@/components/ui/sanitized-input";
import { Button } from "@/components/ui/button";

interface EditUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

export function EditUserDialog({ isOpen, onOpenChange, user }: EditUserDialogProps) {
  const form = useSanitizedForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Student",
      status: "Active",
    },
    sanitizationMap: { name: "name", email: "email" },
  });

  // FIX: Optimized dependency array to prevent infinite loops
  useEffect(() => {
    if (isOpen && user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "Student",
        status: user.status || "Active",
      });
    }
    // Only re-run when user changes or dialog opens/closes
    // Removed 'form' from dependencies
  }, [user, isOpen]);

  const onSubmit = form.handleSanitizedSubmit((data) => {
    console.log("Submit logic:", data);
    onOpenChange(false);
    toast.success("User updated");
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          {/* FIX: Added DialogDescription to fix the Aria warning */}
          <DialogDescription>
            Update the profile information for {user?.name || "this user"}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <SanitizedInput sanitizer="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <SanitizedInput sanitizer="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Teacher">Teacher</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
