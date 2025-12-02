import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, UserPlus, Eye, EyeOff, Shield, Users, User, UserCheck, School, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { registerSchema, type RegisterFormData, type UserRole } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const roleConfig: Record<UserRole, { label: string; icon: any; description: string; color: string }> = {
  "super-admin": {
    label: "Super Admin",
    icon: Shield,
    description: "System administrator with full access",
    color: "text-destructive",
  },
  director: {
    label: "Director / Principal",
    icon: School,
    description: "School director or principal",
    color: "text-primary",
  },
  administrator: {
    label: "Administrator",
    icon: Users,
    description: "School administrator",
    color: "text-chart-4",
  },
  teacher: {
    label: "Teacher",
    icon: UserCheck,
    description: "Teaching staff member",
    color: "text-chart-1",
  },
  student: {
    label: "Student",
    icon: User,
    description: "Student enrollment",
    color: "text-chart-2",
  },
  parent: {
    label: "Parent",
    icon: Users,
    description: "Parent or guardian",
    color: "text-chart-3",
  },
};

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "teacher",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      password: "",
      confirmPassword: "",
      terms: false,
      schoolName: "",
      department: "",
      subject: "",
      employeeId: "",
      grade: "",
      section: "",
      studentId: "",
      parentName: "",
      relationship: "",
      childName: "",
      childStudentId: "",
    },
    mode: "onChange",
  });

  const selectedRole = form.watch("role");
  const selectedRoleConfig = roleConfig[selectedRole];

  const { login } = useAuth();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Simulate registration API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store user via AuthContext
      const userData = {
        email: data.email,
        role: data.role,
        name: `${data.firstName} ${data.lastName}`,
        registrationTime: new Date().toISOString(),
      };
      login(userData, true);

      toast({
        title: "Registration Successful",
        description: `Account created! Redirecting to ${roleConfig[data.role].label} dashboard...`,
      });

      // Redirect to appropriate dashboard
      const dashboardMap: Record<UserRole, string> = {
        "super-admin": "/dashboard/super-admin",
        director: "/dashboard/director",
        administrator: "/dashboard/admin",
        teacher: "/dashboard/teacher",
        student: "/dashboard/student",
        parent: "/dashboard/parent",
      };

      setLocation(dashboardMap[data.role]);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = (newRole: string) => {
    form.setValue("role", newRole as UserRole);
    // Reset role-specific fields when role changes
    form.resetField("schoolName");
    form.resetField("department");
    form.resetField("subject");
    form.resetField("employeeId");
    form.resetField("grade");
    form.resetField("section");
    form.resetField("studentId");
    form.resetField("parentName");
    form.resetField("relationship");
    form.resetField("childName");
    form.resetField("childStudentId");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-chart-2/5 p-4">
      {/* Topbar contains ThemeToggle and language controls */}

      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-serif">ደብተርLink</CardTitle>
                <CardDescription>Create your account</CardDescription>
              </div>
            </div>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={selectedRole} onValueChange={handleRoleChange} className="space-y-4">
                <TabsList className="grid w-full grid-cols-6">
                  {Object.entries(roleConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <TabsTrigger key={key} value={key} className="text-xs">
                        <Icon className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">{config.label.split(" ")[0]}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {Object.entries(roleConfig).map(([roleKey, config]) => {
                  const Icon = config.icon;
                  return (
                    <TabsContent key={roleKey} value={roleKey} className="space-y-4">
                      <div className="flex items-center gap-2 pb-4 border-b">
                        <Icon className={`h-5 w-5 ${config.color}`} />
                        <div>
                          <h3 className="font-semibold">{config.label}</h3>
                          <p className="text-sm text-muted-foreground">{config.description}</p>
                        </div>
                      </div>

                      {/* Role field (hidden but required for form) */}
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <input type="hidden" {...field} value={roleKey} />
                        )}
                      />

                      {/* Common Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter first name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone *</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="+251 911 234 567" {...field} />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Include country code (e.g., +251)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Role-Specific Fields */}
                      {(roleKey === "super-admin" || roleKey === "director" || roleKey === "administrator") && (
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="schoolName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>School Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter school name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="employeeId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Employee ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="Employee ID" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {roleKey === "teacher" && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="schoolName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>School Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter school name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="department"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Department *</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="mathematics">Mathematics</SelectItem>
                                      <SelectItem value="science">Science</SelectItem>
                                      <SelectItem value="english">English</SelectItem>
                                      <SelectItem value="history">History</SelectItem>
                                      <SelectItem value="physics">Physics</SelectItem>
                                      <SelectItem value="chemistry">Chemistry</SelectItem>
                                      <SelectItem value="biology">Biology</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="subject"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subject *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Primary subject" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="employeeId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Employee ID</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Employee ID" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </>
                      )}

                      {roleKey === "student" && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="schoolName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>School Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter school name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="studentId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Student ID *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Student ID" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="grade"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Grade *</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select grade" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="9">Grade 9</SelectItem>
                                      <SelectItem value="10">Grade 10</SelectItem>
                                      <SelectItem value="11">Grade 11</SelectItem>
                                      <SelectItem value="12">Grade 12</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="section"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Section</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select section" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="A">Section A</SelectItem>
                                      <SelectItem value="B">Section B</SelectItem>
                                      <SelectItem value="C">Section C</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </>
                      )}

                      {roleKey === "parent" && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="childName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Child's Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter child's full name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="childStudentId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Child's Student ID *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Student ID" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="relationship"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Relationship to Child *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select relationship" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="father">Father</SelectItem>
                                    <SelectItem value="mother">Mother</SelectItem>
                                    <SelectItem value="guardian">Guardian</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {/* Password Fields */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    className="pr-10"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full w-10"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs">
                                Min 8 chars, must include uppercase, lowercase, and number
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    className="pr-10"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full w-10"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  >
                                    {showConfirmPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Terms and Conditions */}
                      <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                className="mt-1 rounded"
                                checked={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm text-muted-foreground cursor-pointer">
                                I agree to the{" "}
                                <a href="#" className="text-primary hover:underline">
                                  Terms and Conditions
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-primary hover:underline">
                                  Privacy Policy
                                </a>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full h-12 text-base"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Create Account
                          </>
                        )}
                      </Button>

                      {/* Login Link */}
                      <div className="text-center text-sm text-muted-foreground pt-2">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                          Login here
                        </Link>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
