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
import { useAuthForm, useAsyncValidation, asyncValidators } from '@/hooks';
import { useLocation, Link, Redirect } from 'wouter';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/layouts/auth-layout';
import { Loader2, User, Mail, Lock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/useAuthStore';
import { registerSchema, RegisterFormData } from '@/lib/validations';

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const isLoading = false; // Mock state

  // Only admin and super_admin can access registration
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return <Redirect to="/login" />;
  }

  const { form, handleSubmit } = useAuthForm('register');
  const { validateAsync, asyncErrors, validating } = useAsyncValidation();

  const onSubmit = handleSubmit(async (values) => {
    // Mock registration
    console.log(values);
    setLocation('/login');
  });

  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
        <p className="text-muted-foreground text-sm">
          Join DebterLink today
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <SanitizedInput sanitizer="name" placeholder="Abebe Kebede" className="pl-9" autoComplete="name" {...field} />
                  </div>
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <SanitizedInput 
                      sanitizer="email" 
                      placeholder="email@example.com" 
                      className="pl-9" 
                      autoComplete="email"
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        validateAsync('email', e.target.value, asyncValidators.checkEmailAvailable);
                      }}
                    />
                  </div>
                </FormControl>
                {validating.email && <div className="text-sm text-muted-foreground">Checking availability...</div>}
                {asyncErrors.email && <div className="text-sm text-destructive">{asyncErrors.email}</div>}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <SanitizedInput 
                      sanitizer="username" 
                      placeholder="Enter username" 
                      className="pl-9" 
                      autoComplete="username"
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        validateAsync('username', e.target.value, asyncValidators.checkUsernameAvailable);
                      }}
                    />
                  </div>
                </FormControl>
                {validating.username && <div className="text-sm text-muted-foreground">Checking availability...</div>}
                {asyncErrors.username && <div className="text-sm text-destructive">{asyncErrors.username}</div>}
                <FormMessage />
              </FormItem>
            )}
          />

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
                      <SanitizedInput sanitizer="text" type="password" placeholder="••••••" className="pl-9" autoComplete="new-password" {...field} />
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
                      <SanitizedInput sanitizer="text" type="password" placeholder="••••••" className="pl-9" autoComplete="new-password" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Register'
            )}
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </div>
    </AuthLayout>
  );
}
