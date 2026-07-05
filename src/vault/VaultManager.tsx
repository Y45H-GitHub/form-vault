import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { ipc } from '../shared/ipc-client';
import { useTheme } from '../shared/useTheme';
import { CATEGORIES } from '../shared/constants';
import { isSensitiveField, maskValue } from '../shared/mask';
import { Button } from '../shared/ui/Button';
import { ProfileManager } from './ProfileManager';
import { FieldForm } from './FieldForm';
import { FileVault } from './FileVault';
import type { Field, FileRef, NewField, Profile, UpdateField } from '../shared/types';

export function VaultManager() {
  useTheme();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [files, setFiles] = useState<FileRef[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

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

  const fieldsByCategory = useMemo(() => {
    const map = new Map<string, Field[]>();
    for (const field of fields) {
      const list = map.get(field.category) ?? [];
      list.push(field);
      map.set(field.category, list);
    }
    return map;
  }, [fields]);

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
    <div className="flex h-screen w-screen bg-bg-primary text-text-primary">
      <ProfileManager
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelect={setActiveProfileId}
        onAdd={handleAddProfile}
        onDelete={handleDeleteProfile}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">{activeProfile ? `${activeProfile.icon} ${activeProfile.name}` : 'Vault'}</h1>
            <p className="text-sm text-text-muted">Manage your saved fields and files</p>
          </div>
          <Button
            onClick={() => {
              setEditingField(null);
              setFormOpen(true);
            }}
            disabled={!activeProfileId}
          >
            <Plus size={16} /> Add Field
          </Button>
        </div>

        {CATEGORIES.map((cat) => {
          const list = fieldsByCategory.get(cat.id);
          if (!list || list.length === 0) return null;
          return (
            <section key={cat.id} className="mb-6">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">{cat.label}</h3>
              <div className="overflow-hidden rounded-lg border border-border">
                {list.map((field, i) => {
                  const sensitive = isSensitiveField(field.shortcut);
                  const shown = revealed.has(field.id) || !sensitive;
                  const displayValue = field.value ? (shown ? field.value : maskValue(field.value)) : '—';
                  return (
                    <div
                      key={field.id}
                      className={rowClass(i, list.length)}
                    >
                      <span className="text-lg">{field.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">{field.label}</span>
                          {field.shortcut && (
                            <span className="rounded bg-bg-hover px-1.5 py-0.5 text-[10px] text-text-muted">
                              {field.shortcut}
                            </span>
                          )}
                        </div>
                        <button
                          className="truncate text-sm text-text-secondary hover:text-text-primary disabled:cursor-default"
                          onClick={() => sensitive && toggleReveal(field.id)}
                          disabled={!sensitive}
                        >
                          {displayValue}
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setEditingField(field);
                          setFormOpen(true);
                        }}
                        className="rounded-md p-1.5 text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => void handleDeleteField(field.id)}
                        className="rounded-md p-1.5 text-text-secondary hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {activeProfileId && <FileVault profileId={activeProfileId} files={files} onChanged={() => loadProfileData(activeProfileId)} />}
      </div>

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

function rowClass(index: number, total: number): string {
  const base = 'flex items-center gap-3 px-3 py-2.5 bg-bg-card';
  const border = index < total - 1 ? ' border-b border-border' : '';
  return base + border;
}
