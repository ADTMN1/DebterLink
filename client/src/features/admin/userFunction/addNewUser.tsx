import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Props {
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  availableRoles: string[];
  currentUserRole: string; // to check super_admin
}

const addUserSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z
    .string()
    .min(8, "Password must be at least 8  characters"),
  role: z.string(),
  status: z.enum(["Active", "Suspended"]),
});

type AddUserForm = z.infer<typeof addUserSchema>;

export default function AddUserDialog({
  setIsAddOpen,
  isAddOpen,
  availableRoles,
  currentUserRole,
}: Props) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddUserForm>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      password_confirmation:"",
      role: "Student",
      status: "Active",
    },
  });

  const onSubmit = (data: AddUserForm) => {
    // Demo API call
    setTimeout(() => {
      console.log("User Created:", data);
      toast({ title: "User Created", description: `Created ${data.name}` });
      reset();
      setIsAddOpen(false);
    }, 500);
  };

  return (
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mt-2">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g. John Doe"
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register("username")}
                placeholder="e.g. johndoe"
              />
              {errors.username && (
                <p className="text-xs text-destructive">
                  {errors.username.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                User will login with this username
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="e.g. john@school.com"
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Minimum 6 characters"
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum 6 characters required
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Confirm Your Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                {...register("password_confirmation")}
                placeholder="Minimum 6 characters"
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum 6 characters required
              </p>
            </div>

            {/* Role & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  {...register("role")}
                  className="border rounded-md px-3 py-2 text-sm bg-background w-full"
                >
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  {currentUserRole === "super_admin"
                    ? "You can assign Admin role"
                    : "Only Super Admin can assign Admin role"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  {...register("status")}
                  className="border rounded-md px-3 py-2 text-sm bg-background w-full"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAddOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
