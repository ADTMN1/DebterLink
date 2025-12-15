import { useEffect, useRef, useState } from 'react';

interface UseLazyRenderOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useLazyRender(options: UseLazyRenderOptions = {}) {
  const { triggerOnce = true, rootMargin = '100px', ...observerOptions } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { rootMargin, ...observerOptions }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, triggerOnce, observerOptions]);

  return { ref, isVisible };
}
