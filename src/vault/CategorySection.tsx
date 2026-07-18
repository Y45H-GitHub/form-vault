import { memo, useMemo, useRef } from 'react';
import { CATEGORY_COLORS } from '../shared/constants';
import { FieldRow } from './FieldRow';
import { useDragToReorder } from './useDragToReorder';
import { useFlip } from './useFlip';
import type { Category, Field } from '../shared/types';

interface CategorySectionProps {
  category: Category;
  label: string;
  fields: Field[];
  highlightedFieldId: string | null;
  onReorder: (orderedIds: string[]) => void;
  onCopy: (fieldId: string) => Promise<void>;
  onEdit: (field: Field) => void;
  onDelete: (fieldId: string) => void;
}

export const CategorySection = memo(function CategorySection({
  category,
  label,
  fields,
  highlightedFieldId,
  onReorder,
  onCopy,
  onEdit,
  onDelete
}: CategorySectionProps) {
  const { displayFields, draggedId, onDragStart, onDragOver, onDrop, onDragEnd, moveField } = useDragToReorder(fields, onReorder);

  const containerRef = useRef<HTMLDivElement>(null);
  const orderKey = useMemo(() => displayFields.map((f) => f.id).join('|'), [displayFields]);
  useFlip(containerRef, orderKey);

  return (
    <section className="mb-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[category] }} />
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ink-muted">{label}</h3>
        <span className="text-caption text-ink-muted">{fields.length}</span>
      </div>

      <div ref={containerRef} className="overflow-hidden rounded-card border border-stroke bg-card shadow-elevation-1">
        {displayFields.map((field, i) => (
          <div key={field.id} className={i < displayFields.length - 1 ? 'border-b border-stroke-subtle' : undefined}>
            <FieldRow
              field={field}
              highlighted={highlightedFieldId === field.id}
              isDragging={draggedId === field.id}
              onDragStart={() => onDragStart(field.id)}
              onDragOver={(e) => onDragOver(e, field.id)}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              onMoveUp={() => moveField(field.id, 'up')}
              onMoveDown={() => moveField(field.id, 'down')}
              onCopy={() => onCopy(field.id)}
              onEdit={() => onEdit(field)}
              onDelete={() => onDelete(field.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
});
