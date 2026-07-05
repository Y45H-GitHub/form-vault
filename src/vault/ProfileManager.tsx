import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../shared/cn';
import { Button } from '../shared/ui/Button';
import { Input } from '../shared/ui/Input';
import type { Profile } from '../shared/types';

interface ProfileManagerProps {
  profiles: Profile[];
  activeProfileId: string | null;
  onSelect: (profileId: string) => void;
  onAdd: (name: string) => Promise<void>;
  onDelete: (profileId: string) => Promise<void>;
}

export function ProfileManager({ profiles, activeProfileId, onSelect, onAdd, onDelete }: ProfileManagerProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await onAdd(name.trim());
    setName('');
    setAdding(false);
  }

  return (
    <div className="flex h-full w-56 shrink-0 flex-col border-r border-border bg-bg-secondary">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Profiles</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={cn(
              'group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm',
              profile.id === activeProfileId ? 'bg-accent/15 text-accent' : 'text-text-primary hover:bg-bg-hover'
            )}
          >
            <button onClick={() => onSelect(profile.id)} className="flex flex-1 items-center gap-2 text-left">
              <span>{profile.icon}</span>
              <span className="truncate">{profile.name}</span>
            </button>
            {!profile.isDefault && (
              <button
                onClick={() => void onDelete(profile.id)}
                className="hidden rounded p-1 text-text-muted hover:bg-red-500/10 hover:text-red-400 group-hover:block"
                title="Delete profile"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-border p-2">
        {adding ? (
          <form onSubmit={handleAdd} className="flex flex-col gap-2">
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Profile name"
              onBlur={() => !name && setAdding(false)}
            />
            <div className="flex gap-1.5">
              <Button type="submit" size="sm" className="flex-1">
                Add
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setAdding(true)}>
            <Plus size={14} /> New Profile
          </Button>
        )}
      </div>
    </div>
  );
}
