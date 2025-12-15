export const a11y = {
  // Keyboard handler for Enter and Space keys
  onKeyboardClick: (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  },

  // Make div interactive with proper ARIA attributes
  makeInteractive: (onClick: () => void) => ({
    role: 'button' as const,
    tabIndex: 0,
    onClick,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
  }),

  // Announce to screen readers using global announcer
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcerId = priority === 'polite' ? 'polite-announcer' : 'assertive-announcer';
    const announcer = document.getElementById(announcerId);
    
    if (announcer) {
      announcer.textContent = message;
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  },
};

// Simple keyboard click handler
export const handleKeyboardClick = (callback: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    callback();
  }
};
