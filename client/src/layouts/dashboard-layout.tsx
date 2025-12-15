import { ReactNode, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import { SkipLink } from '@/components/ui/skip-link';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <Sidebar />
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:pl-64" : "md:pl-20"
        )}
      >
        <Navbar />
        <main id="main-content" className="p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
