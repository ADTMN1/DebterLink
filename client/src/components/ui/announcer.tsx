/**
 * ARIA live region announcer for screen readers.
 * Announces dynamic content changes to assistive technologies.
 * @module components/ui/announcer
 */

import * as React from "react";

/**
 * Announcer component with polite and assertive live regions.
 * Add to root layout to enable screen reader announcements.
 * @component
 * @example
 * <Announcer />
 */
export const Announcer = () => {
  return (
    <>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="polite-announcer"
      />
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        id="assertive-announcer"
      />
    </>
  );
};

/**
 * Announce message to screen readers.
 * @param message - Message to announce
 * @param priority - 'polite' (default) or 'assertive'
 * @example
 * announce('Form submitted successfully', 'polite');
 * announce('Error: Please fix validation errors', 'assertive');
 */
export const announce = (
  message: string,
  priority: "polite" | "assertive" = "polite"
) => {
  const announcerId = priority === "polite" ? "polite-announcer" : "assertive-announcer";
  const announcer = document.getElementById(announcerId);
  
  if (announcer) {
    announcer.textContent = message;
    setTimeout(() => {
      announcer.textContent = "";
    }, 1000);
  }
};
