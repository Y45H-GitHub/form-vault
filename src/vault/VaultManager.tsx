import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/20/solid';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { ipc } from '../shared/ipc-client';
import { CATEGORIES, CATEGORY_COLORS } from '../shared/constants';
import { isSensitiveField, maskValue } from '../shared/mask';
import { cn } from '../shared/cn';
import { Button } from '../shared/ui/Button';
import { Input } from '../shared/ui/Input';
import { Kbd } from '../shared/ui/Kbd';
import { EmptyState } from '../shared/ui/EmptyState';
import { ProfileManager } from './ProfileManager';
import { FieldForm } from './FieldForm';
import { FileVault } from './FileVault';
import type { Field, FileRef, NewField, Profile, UpdateField } from '../shared/types';

export function VaultManager() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [files, setFiles] = useState<FileRef[]>([]);
  const [filter, setFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadProfiles = useCallback(async () => {
    const fetched = await ipc.getProfiles();
    setProfiles(fetched);
    setActiveProfileId((current) => current ?? fetched[0]?.id ?? null);
  }, []);

  const loadProfileData = useCallback(async (profileId: string) => {
    const [fetchedFields, fetchedFiles] = await Promise.all([ipc.getAllFields(profileId), ipc.getFiles(profileId)]);
    setFields(fetchedFields);
    setFiles(fetchedFiles);
  }, []);

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  useEffect(() => {
    if (activeProfileId) void loadProfileData(activeProfileId);
  }, [activeProfileId, loadProfileData]);

  useEffect(() => {
    const off = ipc.onVaultDataUpdated(() => {
      void loadProfiles();
      if (activeProfileId) void loadProfileData(activeProfileId);
    });
    return off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfileId]);

  const filteredFields = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return fields;
    return fields.filter(
      (f) =>
        f.label.toLowerCase().includes(q) ||
        f.value.toLowerCase().includes(q) ||
        (f.shortcut ?? '').toLowerCase().includes(q)
    );
  }, [fields, filter]);

  const fieldsByCategory = useMemo(() => {
    const map = new Map<string, Field[]>();
    for (const field of filteredFields) {
      const list = map.get(field.category) ?? [];
      list.push(field);
      map.set(field.category, list);
    }
    return map;
  }, [filteredFields]);

  async function handleAddProfile(name: string) {
    const created = await ipc.addProfile({ name });
    setActiveProfileId(created.id);
  }

  async function handleDeleteProfile(profileId: string) {
    if (!confirm('Delete this profile and all its fields? This cannot be undone.')) return;
    await ipc.deleteProfile(profileId);
    if (activeProfileId === profileId) setActiveProfileId(null);
  }

  async function handleSaveField(field: NewField | UpdateField) {
    if ('id' in field) {
      await ipc.updateField(field);
    } else {
      await ipc.addField(field);
    }
  }

  async function handleDeleteField(fieldId: string) {
    if (!confirm('Delete this field? This cannot be undone.')) return;
    await ipc.deleteField(fieldId);
  }

  async function handleCopyField(fieldId: string) {
    await ipc.copyField(fieldId, false);
    setCopiedId(fieldId);
    setTimeout(() => setCopiedId((id) => (id === fieldId ? null : id)), 1200);
  }

  function toggleReveal(fieldId: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(fieldId)) next.delete(fieldId);
      else next.add(fieldId);
      return next;
    });
  }

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  return (
    <div className="flex h-screen w-screen bg-canvas text-ink">
      <ProfileManager
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelect={setActiveProfileId}
        onAdd={handleAddProfile}
        onDelete={handleDeleteProfile}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-stroke-subtle bg-canvas px-6 py-3.5">
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-display text-ink">
              {activeProfile ? activeProfile.name : 'Vault'}
            </h1>
            <p className="text-label text-ink-muted">
              {fields.length} {fields.length === 1 ? 'field' : 'fields'} · {files.length}{' '}
              {files.length === 1 ? 'file' : 'files'}
            </p>
          </div>
          <div className="relative w-52">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter fields…"
              className="pl-8"
              aria-label="Filter fields"
            />
          </div>
          <Button
            onClick={() => {
              setEditingField(null);
              setFormOpen(true);
            }}
            disabled={!activeProfileId}
          >
            <PlusIcon className="h-4 w-4" /> Add field
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {filteredFields.length === 0 ? (
            <div className="rounded-card border border-dashed border-stroke">
              {fields.length === 0 ? (
                <EmptyState
                  icon={ArchiveBoxIcon}
                  title="No fields in this profile"
                  description="Add your first field — a name, PAN, bank account — and paste it anywhere with one shortcut."
                  action={
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingField(null);
                        setFormOpen(true);
                      }}
                    >
                      <PlusIcon className="h-3.5 w-3.5" /> Add field
                    </Button>
                  }
                />
              ) : (
                <EmptyState icon={MagnifyingGlassIcon} title="No matches" description="Try a different filter." />
              )}
            </div>
          ) : (
            CATEGORIES.map((cat) => {
              const list = fieldsByCategory.get(cat.id);
              if (!list || list.length === 0) return null;
              return (
                <section key={cat.id} className="mb-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat.id] }} />
                    <h3 className="text-caption font-semibold uppercase tracking-wide text-ink-muted">{cat.label}</h3>
                    <span className="text-caption text-ink-muted">{list.length}</span>
                  </div>

                  <div className="overflow-hidden rounded-card border border-stroke bg-card shadow-elevation-1">
                    {list.map((field, i) => {
                      const sensitive = isSensitiveField(field.shortcut);
                      const shown = revealed.has(field.id) || !sensitive;
                      const hasValue = field.value.length > 0;
                      const displayValue = hasValue ? (shown ? field.value : maskValue(field.value)) : '—';
                      return (
                        <div
                          key={field.id}
                          className={cn(
                            'group flex items-center gap-3 px-3 py-2 transition-colors hover:bg-hover',
                            i < list.length - 1 && 'border-b border-stroke-subtle'
                          )}
                        >
                          <span
                            aria-hidden
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-hover text-[15px] leading-none"
                          >
                            {field.icon}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate text-body font-medium text-ink">{field.label}</span>
                              {field.shortcut && <Kbd>{field.shortcut}</Kbd>}
                            </div>
                            <span
                              className={cn(
                                'block truncate text-label',
                                hasValue ? 'font-mono text-ink-secondary' : 'italic text-ink-muted'
                              )}
                            >
                              {displayValue}
                            </span>
                          </div>

                          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                            {sensitive && hasValue && (
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={shown ? 'Hide value' : 'Reveal value'}
                                title={shown ? 'Hide value' : 'Reveal value'}
                                onClick={() => toggleReveal(field.id)}
                              >
                                {shown ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                              </Button>
                            )}
                            {hasValue && (
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Copy value"
                                title="Copy value"
                                onClick={() => void handleCopyField(field.id)}
                              >
                                {copiedId === field.id ? (
                                  <CheckIcon className="h-4 w-4 text-success" />
                                ) : (
                                  <DocumentDuplicateIcon className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Edit field"
                              title="Edit field"
                              onClick={() => {
                                setEditingField(field);
                                setFormOpen(true);
                              }}
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="danger"
                              size="icon"
                              aria-label="Delete field"
                              title="Delete field"
                              onClick={() => void handleDeleteField(field.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })
          )}

          {activeProfileId && (
            <FileVault profileId={activeProfileId} files={files} onChanged={() => loadProfileData(activeProfileId)} />
          )}
        </div>
      </main>

      {formOpen && activeProfileId && (
        <FieldForm
          profileId={activeProfileId}
          field={editingField}
          onClose={() => setFormOpen(false)}
          onSave={handleSaveField}
        />
      )}
    </div>
  );
}
