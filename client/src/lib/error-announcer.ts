/**
 * Error announcement utilities for screen readers
 * Ensures all errors are announced with aria-live="assertive"
 */

export const announceError = (message: string) => {
  const announcer = document.getElementById('assertive-announcer');
  if (announcer) {
    announcer.textContent = message;
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
};

export const announceSuccess = (message: string) => {
  const announcer = document.getElementById('polite-announcer');
  if (announcer) {
    announcer.textContent = message;
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
};

export const announceValidationError = (fieldName: string, error: string) => {
  announceError(`${fieldName}: ${error}`);
};
