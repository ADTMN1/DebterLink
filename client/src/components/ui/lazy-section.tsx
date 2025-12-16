import { ReactNode } from 'react';
import { useLazyRender } from '@/hooks/use-lazy-render';
import { Skeleton } from '@/components/ui/skeleton';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  rootMargin?: string;
}

export const LazySection = ({ 
  children, 
  fallback = <Skeleton className="h-[200px] w-full rounded-lg" />,
  className,
  rootMargin = '100px'
}: LazySectionProps) => {
  const { ref, isVisible } = useLazyRender({ rootMargin });

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
};
