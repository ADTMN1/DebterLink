import { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  className,
  loading = 'lazy',
  decoding = 'async',
  ...props 
}: OptimizedImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={cn(className)}
      {...props}
    />
  );
};
