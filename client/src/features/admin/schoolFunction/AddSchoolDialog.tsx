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
// import { School as SchoolType } from "@shared/schema"; // Remove non-existent import
import { useSanitizedForm } from "@/hooks";
import {registerSchoolAndAdminSchema, schoolAndAdminSchema} from '../../../lib/validations'
import { zodResolver } from "@hookform/resolvers/zod";
import { P } from "node_modules/framer-motion/dist/types.d-DagZKalS";
import { registerApi } from "@/api/authApi";
import { Toast } from "@/components/ui/toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useAuthStore } from "@/store/useAuthStore";
interface AddSchoolProps {
  // onAdd: (school: Omit<SchoolType, "id">) => void; // Remove unused interface
}

export function AddSchoolDialog() { 
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const { user, isAuthenticated, token } = useAuthStore(); 
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useSanitizedForm<schoolAndAdminSchema>({
    resolver: zodResolver(registerSchoolAndAdminSchema),
    defaultValues: {
      school_name: "",
      code: "",
      school_email: "",
      school_phone: "",
      address: "",
      academic_year: "",
      status: "Active",
      website: "",
      fullName: "",
      admin_email: "",
      password: "",
      confirmed_password:"",
      admin_phone: "",
      role: "Admin",
    },
  })

  
  console.log("Current Errors:", errors);
const onsubmit = async (data: schoolAndAdminSchema) => {
  setIsSubmitting(true);
  
  try {
    const response = await registerApi(data);

    if (response.data.success) {
      console.log("Registration Successful:", response.data.message);
      reset();
      setOpen(false);
      alert("School and admin registered successfully!");
    } else {
      console.error("Server Logic Error:", response.data);
      alert(response.data?.error?.message || 'Registration failed');
      setError(response.data?.error?.message || 'Registration failed');
    }
  } catch (err: any) {
    console.error("Critical Connection Error:", err);
    
    let errorMessage = 'Registration failed';
    
    if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err?.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err?.message) {
      errorMessage = err.message;
    }
    
    if (errorMessage.includes('Conflict') || errorMessage.includes('already exists')) {
      errorMessage = 'This email is already registered. Please use a different email.';
    } else if (errorMessage.includes('Validation failed')) {
      errorMessage = 'Please check all required fields and try again.';
    } else if (errorMessage.includes('Network') || errorMessage.includes('timeout')) {
      errorMessage = 'Network connection issue. Please check your connection and try again.';
    } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      errorMessage = 'Session expired. Please login again and retry.';
    } else if (errorMessage.includes('409')) {
      errorMessage = 'Registration conflict. The email may already be registered.';
    }
    
    alert(errorMessage);
    setError(errorMessage);
  }
};

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   onAdd({
  //     name: form.name.trim(),
  //     region: form.region.trim(),
  //     students: Number(form.students) || 0,
  //     status: form.status,
  //   });
  //   setForm({ name: "", region: "", students: "", status: "Active" });
  //   setOpen(false);
  // };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Register School
        </Button>
      </DialogTrigger>
      {/* Increased max-width for better grid appearance */}
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onsubmit)}>
          <DialogHeader className="mb-4">
            <DialogTitle>Register New School</DialogTitle>
          </DialogHeader>

          {/* School Details Section - 2 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="school_name">School Name</Label>
              <Input {...register("school_name")} placeholder="e.g. Bole High School" />
              {errors.school_name && (
                <p className="text-red-500 text-xs">{errors.school_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>School Code</Label>
              <Input {...register("code")} placeholder="e.g. AD-01" />
              {errors.code && <p className="text-red-500 text-xs">{errors.code.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>School Phone Number</Label>
              <Input {...register("school_phone")} placeholder="+251..." />

              {errors.school_phone && (
                <p className=" text-red-500 text-xs ">{errors?.school_phone?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>School Email</Label>
              <Input {...register("school_email")} type="email" placeholder="school@example.com" />
              {errors.school_email && (
                <p className=" text-red-500 text-xs">{errors.school_email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Website Address</Label>
              <Input {...register("website")} placeholder="https://..." />
              {errors.website && <p className="text-red-500 text-xs">{errors.website.message}</p>}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>School Address</Label>
              <Input {...register("address")} placeholder="Street, District..." />
              {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Input type="text" {...register("academic_year")} />
              {errors.academic_year && (
                <p className="text-red-500 text-xs">{errors.academic_year.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <select
                {...register("status")}
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
              >
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
          </div>

          <hr className="my-6" />

          <DialogHeader className="mb-4">
            <DialogTitle>Register New Admin For School</DialogTitle>
          </DialogHeader>

          {/* Admin Details Section - 2 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2 space-y-2">
              <Label>Full Name</Label>

              <Input placeholder="Enter admin full name" {...register("fullName")} />
              {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Admin Email</Label>
              <Input {...register("admin_email")} type="email" placeholder="admin@school.com" />
              {errors.admin_email && (
                <p className="text-red-500 text-xs">{errors.admin_email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Admin Phone Number</Label>
              <Input {...register("admin_phone")} placeholder="09..." />
              {errors.admin_phone && (
                <p className="text-red-500 text-xs">{errors.admin_phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input {...register("password")} type="password"  />
              {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input {...register("confirmed_password")} type="password"  />
              {errors.confirmed_password && (
                <p className="text-red-500 text-xs">{errors.confirmed_password.message}</p>
              )}
            </div>

            {/* <div className="space-y-2">
              <Label>Admin Status</Label>
              <select className="w-full border rounded-md px-3 py-2 text-sm bg-background">
                {
                }
                <option value="Active">Active</option>
                <option value="Maintenance">Inactive</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div> */}
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      Registering...
    </>
  ) : (
    'Save School'
  )}
</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
