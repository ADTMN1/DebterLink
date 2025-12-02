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
import { GraduationCap, Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { forgotPasswordSchema, resetPasswordSchema, type ForgotPasswordFormData, type ResetPasswordFormData } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation();
  const [emailSent, setEmailSent] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const { toast } = useToast();

  // Check if we're in reset mode (from email link)
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (token && email && !resetMode) {
    setResetMode(true);
  }

  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    try {
      // Simulate API call to send reset email
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setEmailSent(true);
      toast({
        title: "Reset Link Sent",
        description: `If an account exists with ${data.email}, you will receive password reset instructions.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onResetPasswordSubmit = async (data: ResetPasswordFormData) => {
    try {
      // Simulate API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. Redirecting to login...",
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        setLocation("/login");
      }, 2000);
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Failed to reset password. Please try again or request a new link.",
        variant: "destructive",
      });
    }
  };

  if (resetMode) {
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
              <CardTitle className="text-2xl font-serif">Reset Password</CardTitle>
              <CardDescription className="text-base mt-2">
                Enter your new password
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Form {...resetPasswordForm}>
              <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-6">
                {/* Email Display */}
                {email && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">Resetting password for:</p>
                    <p className="text-sm font-medium">{email}</p>
                  </div>
                )}

                {/* New Password */}
                <FormField
                  control={resetPasswordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Min 8 chars, must include uppercase, lowercase, and number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={resetPasswordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reset Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={resetPasswordForm.formState.isSubmitting}
                >
                  {resetPasswordForm.formState.isSubmitting ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Reset Password
                    </>
                  )}
                </Button>

                {/* Back to Login */}
                <div className="text-center text-sm text-muted-foreground pt-2">
                  Remember your password?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Login here
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-chart-2/5 p-4">
        {/* Topbar contains ThemeToggle and language controls */}

        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mx-auto">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-serif">Check Your Email</CardTitle>
              <CardDescription className="text-base mt-2">
                We've sent password reset instructions to your email
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-md">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Email Sent</p>
                  <p className="text-sm text-muted-foreground">
                    If an account exists with{" "}
                    <span className="font-medium">{forgotPasswordForm.getValues("email")}</span>,
                    you will receive password reset instructions shortly.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Didn't receive the email?</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Check your spam or junk folder</li>
                    <li>Make sure you entered the correct email address</li>
                    <li>Wait a few minutes and try again</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setEmailSent(false);
                  forgotPasswordForm.reset();
                }}
              >
                Try Another Email
              </Button>
              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <CardDescription className="text-base mt-2">Forgot Password</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-6">
              <div className="text-center text-sm text-muted-foreground mb-4">
                Enter your email address and we'll send you instructions to reset your password.
              </div>

              {/* Email Input */}
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={forgotPasswordForm.formState.isSubmitting}
              >
                {forgotPasswordForm.formState.isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>

              {/* Back to Login */}
              <div className="text-center text-sm text-muted-foreground pt-4">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Login here
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

