import type { KeyboardEvent } from 'react';

/**
 * Ensure keyboard navigation wraps inside a modal. Native <dialog> supplies
 * inert background behavior, but browser-specific Tab edge behavior still
 * needs explicit protection for reliable keyboard interaction.
 */
export function keepDialogFocus(event: KeyboardEvent<HTMLDialogElement>): void {
  if (event.key !== 'Tab') return;

  const dialog = event.currentTarget;
  const buttonsAndInputs = dialog.querySelectorAll<HTMLElement>(
    'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
  );
  const focusable = Array.from(buttonsAndInputs).filter((element) => element.getClientRects().length > 0);
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const focused = dialog.ownerDocument.activeElement;

  if (event.shiftKey && focused === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && focused === last) {
    event.preventDefault();
    first.focus();
  } else if (!dialog.contains(focused)) {
    event.preventDefault();
    first.focus();
  }
}
