import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { Input, Select, Textarea } from '../shared/ui/Input';
import { CATEGORIES } from '../shared/constants';
import type { Category, Field, FieldType, NewField, UpdateField } from '../shared/types';

interface FieldFormProps {
  profileId: string;
  field: Field | null;
  onClose: () => void;
  onSave: (field: NewField | UpdateField) => Promise<void>;
}

const FIELD_TYPES: { id: FieldType; label: string }[] = [
  { id: 'text', label: 'Text' },
  { id: 'number', label: 'Number' },
  { id: 'date', label: 'Date' },
  { id: 'multiline', label: 'Multiline' },
  { id: 'file_path', label: 'File Path' }
];

export function FieldForm({ profileId, field, onClose, onSave }: FieldFormProps) {
  const [label, setLabel] = useState(field?.label ?? '');
  const [value, setValue] = useState(field?.value ?? '');
  const [category, setCategory] = useState<Category>(field?.category ?? 'personal');
  const [fieldType, setFieldType] = useState<FieldType>(field?.fieldType ?? 'text');
  const [shortcut, setShortcut] = useState(field?.shortcut ?? '');
  const [icon, setIcon] = useState(field?.icon ?? '📋');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    setSaving(true);
    try {
      const normalizedShortcut = shortcut.trim() ? (shortcut.trim().startsWith('!') ? shortcut.trim() : `!${shortcut.trim()}`) : null;
      if (field) {
        await onSave({
          id: field.id,
          label: label.trim(),
          value,
          category,
          fieldType,
          shortcut: normalizedShortcut,
          icon
        } satisfies UpdateField);
      } else {
        await onSave({
          profileId,
          label: label.trim(),
          value,
          category,
          fieldType,
          shortcut: normalizedShortcut,
          icon
        } satisfies NewField);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-text-primary">{field ? 'Edit Field' : 'Add New Field'}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-text-secondary hover:bg-bg-hover">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
          <div className="flex gap-3">
            <div className="w-16">
              <label className="mb-1 block text-xs text-text-secondary">Icon</label>
              <Input value={icon} onChange={(e) => setIcon(e.target.value)} maxLength={4} className="text-center" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-text-secondary">Label</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. PAN Number" required />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-text-secondary">Value</label>
            {fieldType === 'multiline' ? (
              <Textarea value={value} onChange={(e) => setValue(e.target.value)} />
            ) : (
              <Input
                type={fieldType === 'date' ? 'date' : fieldType === 'number' ? 'number' : 'text'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-text-secondary">Category</label>
              <Select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-secondary">Field Type</label>
              <Select value={fieldType} onChange={(e) => setFieldType(e.target.value as FieldType)}>
                {FIELD_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-text-secondary">Shortcut (optional)</label>
            <Input value={shortcut} onChange={(e) => setShortcut(e.target.value)} placeholder="!pan" />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
