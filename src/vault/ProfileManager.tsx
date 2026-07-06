import { useState } from 'react';
import { PlusIcon, TrashIcon, Cog6ToothIcon } from '@heroicons/react/20/solid';
import { cn } from '../shared/cn';
import { ipc } from '../shared/ipc-client';
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
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-stroke-subtle bg-surface">
      <div className="flex items-center gap-2 px-4 pb-3 pt-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-control bg-accent text-caption font-bold text-accent-ink">
          FV
        </div>
        <span className="font-display text-heading text-ink">FormVault</span>
      </div>

      <div className="px-4 pb-1 pt-2 text-caption font-semibold uppercase tracking-wide text-ink-muted">
        Profiles
      </div>

      <nav className="flex-1 overflow-y-auto px-2">
        {profiles.map((profile) => {
          const isActive = profile.id === activeProfileId;
          return (
            <div
              key={profile.id}
              className={cn(
                'group relative flex items-center gap-2 rounded-control text-body transition-colors',
                isActive ? 'bg-active text-ink' : 'text-ink-secondary hover:bg-hover hover:text-ink'
              )}
            >
              {isActive && <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-accent" />}
              <button onClick={() => onSelect(profile.id)} className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-1.5 text-left">
                <span aria-hidden>{profile.icon}</span>
                <span className="truncate font-medium">{profile.name}</span>
              </button>
              {!profile.isDefault && (
                <button
                  onClick={() => void onDelete(profile.id)}
                  aria-label={`Delete profile ${profile.name}`}
                  className="mr-1.5 hidden rounded p-1 text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger group-hover:block"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}

        {adding ? (
          <form onSubmit={handleAdd} className="mt-1 flex flex-col gap-1.5 px-1 py-1">
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Profile name"
              onKeyDown={(e) => e.key === 'Escape' && setAdding(false)}
            />
            <div className="flex gap-1.5">
              <Button type="submit" size="sm" className="flex-1">
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="mt-1 flex w-full items-center gap-2 rounded-control px-2.5 py-1.5 text-body text-ink-muted transition-colors hover:bg-hover hover:text-ink"
          >
            <PlusIcon className="h-4 w-4" /> New profile
          </button>
        )}
      </nav>

      <div className="border-t border-stroke-subtle p-2">
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => void ipc.openSettings()}>
          <Cog6ToothIcon className="h-4 w-4" /> Settings
        </Button>
      </div>
    </aside>
  );
}
