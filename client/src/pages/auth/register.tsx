// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useLocation, Link, Redirect } from "wouter";
// import AuthLayout from "@/layouts/auth-layout";
// import { Loader2, User, Mail, Lock } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useAuthStore } from "@/store/useAuthStore";
// import { useState } from 'react';
// import {  useNavigate, Navigate } from "react-router-dom";
// import { registerApi } from '@/api/authApi';

// const formSchema = z.object({
//   fullName: z.string().min(2, "Name is required"),
//   email: z.string().email("Email is required."),
//   role: z.enum(['student', 'parent', 'teacher', 'director']),
//   password: z.string().min(8),
//   confirmPassword: z.string().min(8),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

// export type RegisterInput = z.infer<typeof formSchema>
// export default function RegisterPage() {
//             const [, setLocation] = useLocation();
//             const { user } = useAuthStore();
//           const [loading, isLoading] = useState<boolean>(false)

//           const navigate = useNavigate()

//                   if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
//                     return <Redirect to="/login" />;
//                   }

//                   const form = useForm<z.infer<typeof formSchema>>({
//                     resolver: zodResolver(formSchema),
//                     defaultValues: {
//                       fullName: '',
//                       email: '',
//                       role: 'student',
//                       password: '',
//                       confirmPassword: '',
//                     },
//                   });

//             async function onSubmit(values: z.infer<typeof formSchema>) {
//                       // Mock registration
//                       try {
//                         isLoading(true)
//                         const validatedData = formSchema.parse(values); 
//                         console.log("validated data which is gonig to sent to ba",validatedData)
//                         const data = await registerApi(validatedData);
//                         navigate('/login')
//                         isLoading(false)
//                       } catch (error) {
//                         console.error(error);
//                       } finally {
//                         isLoading(false)
//                       }
//             }

//             return (
//               <AuthLayout>
//                 <div className="mb-6">
//                   <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
//                   <p className="text-muted-foreground text-sm">Join DebterLink today</p>
//                 </div>

//                 <Form {...form}>
//                   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                     <FormField
//                       control={form.control}
//                       name="fullName"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Full Name</FormLabel>
//                           <FormControl>
//                             <div className="relative">
//                               <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
//                               <Input
//                                 placeholder="Abebe Kebede"
//                                 className="pl-9"
//                                 {...field}
//                               />
//                             </div>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="email"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Email</FormLabel>
//                           <FormControl>
//                             <div className="relative">
//                               <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
//                               <Input
//                                 placeholder="email@example.com"
//                                 className="pl-9"
//                                 {...field}
//                               />
//                             </div>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="role"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>I am a...</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             defaultValue={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select role" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               <SelectItem value="student">Student</SelectItem>
//                               <SelectItem value="parent">Parent</SelectItem>
//                               <SelectItem value="teacher">Teacher</SelectItem>
//                               <SelectItem value="director">Director</SelectItem>
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <div className="grid gap-4 md:grid-cols-2">
//                       <FormField
//                         control={form.control}
//                         name="password"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Password</FormLabel>
//                             <FormControl>
//                               <div className="relative">
//                                 <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
//                                 <Input
//                                   type="password"
//                                   placeholder="••••••"
//                                   className="pl-9"
//                                   {...field}
//                                 />
//                               </div>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="confirmPassword"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Confirm</FormLabel>
//                             <FormControl>
//                               <div className="relative">
//                                 <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
//                                 <Input
//                                   type="password"
//                                   placeholder="••••••"
//                                   className="pl-9"
//                                   {...field}
//                                 />
//                               </div>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     <Button type="submit" className="w-full" disabled={loading}>
//                       {isLoading ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Creating account...
//                         </>
//                       ) : (
//                         "Register"
//                       )}
//                     </Button>
//                   </form>
//                 </Form>

//                 <div className="mt-6 text-center text-sm">
//                   <span className="text-muted-foreground">Already have an account? </span>
//                   <Link href="/login" className="text-primary hover:underline">
//                     Login
//                   </Link>
//                 </div>
//               </AuthLayout>
//             );
// }
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layouts/auth-layout";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2, User, Mail, Lock } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/useAuthStore";
import { registerApi } from "@/api/authApi";
import { registerSchoolAndAdminSchema, schoolAndAdminSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSanitizedForm } from "@/hooks";

// -----------------------------
// ZOD SCHEMA
// -----------------------------
const formSchema = z
  .object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Email is required"),
    role: z.enum(["student", "parent", "teacher", "director"]),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof formSchema>;

// -----------------------------
// COMPONENT
// -----------------------------
export default function RegisterPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // 🔐 Route protection
  if (!user || user.role_id !== 1) {  // Only super admin (role_id: 1)
    return <Navigate to="/login" replace />;
  }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
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
      confirmed_password: "",
    },
  });

  const submitHandler = async (data: schoolAndAdminSchema) => {
    setLoading(true);
    try {
      await registerApi(data);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Register School & Admin</h2>
        <p className="text-muted-foreground text-sm">Create a new school and admin account</p>
      </div>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        {/* School Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">School Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="school_name">School Name</Label>
              <Input {...register("school_name")} placeholder="Bole High School" />
              {errors.school_name && <p className="text-red-500 text-xs">{errors.school_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">School Code</Label>
              <Input {...register("code")} placeholder="BH-001" />
              {errors.code && <p className="text-red-500 text-xs">{errors.code.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="school_email">School Email</Label>
              <Input {...register("school_email")} type="email" placeholder="school@example.com" />
              {errors.school_email && <p className="text-red-500 text-xs">{errors.school_email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="school_phone">School Phone</Label>
              <Input {...register("school_phone")} placeholder="+251911234567" />
              {errors.school_phone && <p className="text-red-500 text-xs">{errors.school_phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="academic_year">Academic Year</Label>
              <Input {...register("academic_year")} placeholder="2024/2025" />
              {errors.academic_year && <p className="text-red-500 text-xs">{errors.academic_year.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value: "Active" | "Suspend" | "In_Maintainance") => setValue("status", value)} defaultValue="Active">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspend">Suspend</SelectItem>
                  <SelectItem value="In_Maintainance">In Maintenance</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input {...register("address")} placeholder="Bole, Addis Ababa" />
            {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input {...register("website")} placeholder="https://school-website.com" />
            {errors.website && <p className="text-red-500 text-xs">{errors.website.message}</p>}
          </div>
        </div>

        {/* Admin Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Admin Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Admin Full Name</Label>
              <Input {...register("fullName")} placeholder="Abebe Kebede" />
              {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_email">Admin Email</Label>
              <Input {...register("admin_email")} type="email" placeholder="admin@example.com" />
              {errors.admin_email && <p className="text-red-500 text-xs">{errors.admin_email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input {...register("password")} type="password" placeholder="Enter password" />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmed_password">Confirm Password</Label>
              <Input {...register("confirmed_password")} type="password" placeholder="Confirm password" />
              {errors.confirmed_password && <p className="text-red-500 text-xs">{errors.confirmed_password.message}</p>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={isSubmitting || loading}
          className="w-full"
        >
          {isSubmitting || loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating school and admin...
            </>
          ) : (
            "Register School & Admin"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
};
            
