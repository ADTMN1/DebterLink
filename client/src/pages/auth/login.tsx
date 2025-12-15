import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { FormProgress } from '@/components/ui/validation-feedback';
import { useAuthForm, useFormPersistence } from '@/hooks';
import { useLocation, Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Loader2, User, Lock } from 'lucide-react';
import AuthLayout from '@/layouts/auth-layout';
import { useToast } from '@/hooks/use-toast';


export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { toast } = useToast();

  const { form, handleSubmit, realtime } = useAuthForm('login');
  
  // Auto-save username (exclude password for security)
  useFormPersistence(form, 'login-form', {
    exclude: ['password'],
    debounceMs: 1000,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login(values.username, values.password);
      setLocation('/dashboard');
    } catch (error) {
      toast({ title: 'Error', description: error instanceof Error ? error.message : 'Login failed', variant: 'destructive' });
    }
  });

  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{t('common.welcome')}</h2>
        <p className="text-muted-foreground text-sm">
          Sign in to your DebterLink account
        </p>
        <FormProgress progress={realtime.formProgress} className="mt-4" />
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="student@debterlink.com" 
                      className="pl-9 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                      autoComplete="email"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-9 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                      autoComplete="current-password"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90" 
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.loading')}
              </>
            ) : (
              t('common.login')
            )}
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-center text-sm">
        <Link href="/forgot-password" className="text-muted-foreground hover:text-primary">
          Forgot password?
        </Link>
      </div>
      
      <div className="mt-6 text-center text-xs text-muted-foreground">
        <p>Note: Only administrators can create new user accounts</p>
      </div>
    </AuthLayout>
  );
}
