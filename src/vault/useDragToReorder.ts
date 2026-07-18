import { useState } from 'react';
import type { Field } from '../shared/types';

/**
 * HTML5 drag-and-drop within a single category list — no third-party drag library (REQ-8).
 * As the user drags over other rows, `displayFields` progressively reflects the live preview
 * order so the other rows visually move out of the way (paired with useFlip for the animation);
 * the real reorder is only persisted via `onReorder` on drop.
 */
export function useDragToReorder(fields: Field[], onReorder: (orderedIds: string[]) => void) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [previewOrder, setPreviewOrder] = useState<Field[] | null>(null);

  const displayFields = previewOrder ?? fields;

  function onDragStart(id: string) {
    setDraggedId(id);
    setPreviewOrder(fields);
  }

  function onDragOver(e: React.DragEvent, overId: string) {
    e.preventDefault();
    if (!draggedId || draggedId === overId) return;
    setPreviewOrder((current) => {
      const list = current ?? fields;
      const fromIndex = list.findIndex((f) => f.id === draggedId);
      const toIndex = list.findIndex((f) => f.id === overId);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return list;
      const next = [...list];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    if (previewOrder) {
      const changed = previewOrder.some((f, i) => f.id !== fields[i]?.id);
      if (changed) onReorder(previewOrder.map((f) => f.id));
    }
    setDraggedId(null);
    setPreviewOrder(null);
  }

  function onDragEnd() {
    setDraggedId(null);
    setPreviewOrder(null);
  }

  function moveField(fieldId: string, direction: 'up' | 'down') {
    const index = fields.findIndex((f) => f.id === fieldId);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (index === -1 || targetIndex < 0 || targetIndex >= fields.length) return;
    const reordered = [...fields];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    onReorder(reordered.map((f) => f.id));
  }

  return { displayFields, draggedId, onDragStart, onDragOver, onDrop, onDragEnd, moveField };
}
