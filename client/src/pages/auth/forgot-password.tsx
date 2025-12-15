import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SanitizedInput } from '@/components/ui/sanitized-input';
import { useSanitizedForm } from '@/hooks/use-sanitized-form';
import { Link } from 'wouter';
import AuthLayout from '@/layouts/auth-layout';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/validations';

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isLoading = false;

  const form = useSanitizedForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    sanitizationMap: { email: 'email' },
  });

  const onSubmit = form.handleSanitizedSubmit(async (values: ForgotPasswordFormData) => {
    // Mock API call
    console.log(values);
    setIsSubmitted(true);
  });

  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Reset Password</h2>
        <p className="text-muted-foreground text-sm">
          Enter your email to receive reset instructions
        </p>
      </div>

      {!isSubmitted ? (
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <SanitizedInput sanitizer="email" placeholder="email@example.com" className="pl-9" autoComplete="email" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="text-center space-y-4">
          <div className="bg-orange-50 text-orange-800 p-4 rounded-lg text-sm">
            If an account exists for <strong>{form.getValues().email}</strong>, you will receive an email with instructions to reset your password.
          </div>
          <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
            Try another email
          </Button>
        </div>
      )}
      
      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="text-muted-foreground hover:text-primary flex items-center justify-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}
