import { useLayoutEffect, useRef, type RefObject } from 'react';

/**
 * Lightweight FLIP (First-Last-Invert-Play) reorder animation. When the DOM order of the
 * `[data-field-id]` rows inside `containerRef` changes between renders, this animates each row
 * from its previous position to its new one instead of letting it jump — used to make
 * drag-to-reorder feel like the other rows are sliding out of the way live, not snapping.
 */
export function useFlip(containerRef: RefObject<HTMLElement | null>, orderKey: string) {
  const prevRectsRef = useRef(new Map<string, DOMRect>());

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rows = Array.from(container.querySelectorAll<HTMLElement>('[data-field-id]'));
    const prevRects = prevRectsRef.current;
    const nextRects = new Map<string, DOMRect>();

    for (const row of rows) {
      const id = row.dataset.fieldId;
      if (!id) continue;
      const newRect = row.getBoundingClientRect();
      nextRects.set(id, newRect);

      const prevRect = prevRects.get(id);
      if (!prevRect) continue;
      const deltaY = prevRect.top - newRect.top;
      if (Math.abs(deltaY) < 1) continue;

      row.style.transition = 'none';
      row.style.transform = `translateY(${deltaY}px)`;
      // Force a style flush so the browser registers the starting transform before animating.
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      row.getBoundingClientRect();
      requestAnimationFrame(() => {
        row.style.transition = `transform var(--duration-slow) var(--ease-spring)`;
        row.style.transform = '';
      });
    }

    prevRectsRef.current = nextRects;
  }, [containerRef, orderKey]);
}
