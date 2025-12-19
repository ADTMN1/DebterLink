import { useSanitizedForm } from "@/hooks/use-sanitized-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordChangeSchema, PasswordChangeFormData } from "@/lib/validations";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { SanitizedInput } from "@/components/ui/sanitized-input";
import { Button } from "@/components/ui/button";

interface EditPasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
}

export function EditPasswordDialog({ isOpen, onOpenChange, userName }: EditPasswordDialogProps) {
  const form = useSanitizedForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    sanitizationMap: {
      currentPassword: "text",
      newPassword: "text",
      confirmPassword: "text",
    },
  });

  const onSubmit = form.handleSanitizedSubmit((data) => {
    // API logic would go here
    onOpenChange(false);
    form.reset();
    toast.success(`Password updated for ${userName}`);
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Your Old Password</FormLabel>
                  <FormControl>
                    <SanitizedInput sanitizer="text" type="currentPassword" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <SanitizedInput sanitizer="text" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Your Password</FormLabel>
                  <FormControl>
                    <SanitizedInput sanitizer="text" type="confirmPassword" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Change Password</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
