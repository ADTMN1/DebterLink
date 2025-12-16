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
import { zodResolver } from "@hookform/resolvers/zod";
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
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return <Navigate to="/login" replace />;
  }

  const form = useForm<RegisterInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "student",
      password: "",
      confirmPassword: "",
    },
  });

  // -----------------------------
  // SUBMIT HANDLER
  // -----------------------------
  async function onSubmit(values: RegisterInput) {
    try {
      setLoading(true);

      // API call (already validated by RHF + Zod)
      await registerApi(values);

      navigate("/login");
    } catch (error: any) {
      // 🌐 ROOT SERVER ERROR
      form.setError("root", {
        type: "server",
        message:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
        <p className="text-muted-foreground text-sm">Join DebterLink today</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* 🌐 ROOT SERVER ERROR */}
          {form.formState.errors.root && (
            <div className="rounded-md border border-red-500/30 bg-red-50 px-4 py-2 text-sm text-red-600">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* FULL NAME */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Abebe Kebede"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* EMAIL */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="email@example.com"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ROLE */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I am a...</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="director">Director</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
<h1>Hi guys you have to listen to me by the way</h1>
          {/* PASSWORDS */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="********"
                        className="pl-9"
                        {...field}
                      />
                    </div>
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
                  <FormLabel>Confirm</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="********"
                        className="pl-9"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••"
                        className="pl-9"
                        {...field}
                      />
                    </div>
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
                  <FormLabel>Confirm</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••"
                        className="pl-9"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* SUBMIT */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <a href="/login" className="text-primary hover:underline">
          Login
        </a>
      </div>
    </AuthLayout>
  );
}
