import { useEffect } from 'react';

export const useAnimatedFavicon = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const iconOn = '/favicon.svg';
    const iconOff = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';

    let isVisible = true;
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    const interval = setInterval(() => {
      link.href = isVisible ? iconOn : iconOff;
      isVisible = !isVisible;
    }, 500); // 500ms = blink on/off

    return () => clearInterval(interval);
  }, [enabled]);
};
