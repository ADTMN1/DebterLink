import { ReactNode } from 'react';
import { Logo } from '@/components/ui/logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background Elements for that 'Ethiopian Modern' feel */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
         <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
         <div className="absolute bottom-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center text-center">
          <Logo className="text-3xl mb-2" />
          <p className="text-muted-foreground">
            Smart Education Management System
          </p>
        </div>
        
        <div className="bg-card border shadow-xl rounded-2xl p-6 md:p-8">
          {children}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} DebterLink. All rights reserved.
        </p>
      </div>
    </div>
  );
}
