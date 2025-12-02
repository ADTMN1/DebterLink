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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, LogIn, Eye, EyeOff, Shield, Users, User, UserCheck, School } from "lucide-react";
import { Link } from "wouter";
import { loginSchema, type LoginFormData, type UserRole } from "@/lib/validations";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const roleConfig: Record<UserRole, { label: string; icon: any; description: string; dashboard: string }> = {
  "super-admin": {
    label: "Super Admin",
    icon: Shield,
    description: "Manage all schools and system settings",
    dashboard: "/dashboard/super-admin",
  },
  director: {
    label: "Director / Principal",
    icon: School,
    description: "Manage school operations and staff",
    dashboard: "/dashboard/director",
  },
  administrator: {
    label: "Administrator",
    icon: Users,
    description: "Manage users, classes, and timetables",
    dashboard: "/dashboard/admin",
  },
  teacher: {
    label: "Teacher",
    icon: UserCheck,
    description: "Manage classes, assignments, and grades",
    dashboard: "/dashboard/teacher",
  },
  student: {
    label: "Student",
    icon: User,
    description: "View assignments, grades, and resources",
    dashboard: "/dashboard/student",
  },
  parent: {
    label: "Parent",
    icon: Users,
    description: "Monitor child's progress and communicate",
    dashboard: "/dashboard/parent",
  },
};

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "teacher",
      rememberMe: false,
    },
  });

  const selectedRole = form.watch("role") as UserRole;
  const selectedRoleConfig = roleConfig[selectedRole];
  const RoleIcon = selectedRoleConfig.icon;

  const { login } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Simulate login API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store user session via AuthContext
      const userData = {
        email: data.email,
        role: data.role,
        name: roleConfig[data.role].label,
        loginTime: new Date().toISOString(),
      };
      login(userData, data.rememberMe);

      toast({
        title: "Login Successful",
        description: `Welcome back! Redirecting to ${roleConfig[data.role].label} dashboard...`,
      });

      // Redirect to appropriate dashboard
      const dashboard = roleConfig[data.role].dashboard;
      setLocation(dashboard);
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-chart-2/5 p-4">
      {/* Topbar contains ThemeToggle and language controls */}

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-serif">ደብተርLink</CardTitle>
            <CardDescription className="text-base mt-2">Smart Education Hub</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Selection */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Login As</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <div className="flex items-center gap-2">
                            <RoleIcon className="h-4 w-4" />
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(roleConfig).map(([key, config]) => {
                          const Icon = config.icon;
                          return (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span>{config.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground px-1">
                      {selectedRoleConfig.description}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Input */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Input */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-12 pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-12 w-12"
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-muted-foreground cursor-pointer">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <Link href="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </>
                )}
              </Button>

              {/* Demo Credentials */}
              <div className="pt-4 border-t">
                <p className="text-xs text-center text-muted-foreground mb-2">
                  Demo: Use any email and password to login
                </p>
                <div className="text-xs text-center space-y-1">
                  <p className="text-muted-foreground">
                    Selected Role: <span className="font-semibold">{selectedRoleConfig.label}</span>
                  </p>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center text-sm text-muted-foreground pt-4">
                Don't have an account?{" "}
                <a href="/register" className="text-primary hover:underline font-medium">
                  Sign up here
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
