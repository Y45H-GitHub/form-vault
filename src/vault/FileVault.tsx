import { useState } from 'react';
import { DocumentIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { FolderOpenIcon } from '@heroicons/react/24/outline';
import { Button } from '../shared/ui/Button';
import { Input } from '../shared/ui/Input';
import { EmptyState } from '../shared/ui/EmptyState';
import { ipc } from '../shared/ipc-client';
import type { FileRef } from '../shared/types';

interface FileVaultProps {
  profileId: string;
  files: FileRef[];
  onChanged: () => Promise<void>;
}

export function FileVault({ profileId, files, onChanged }: FileVaultProps) {
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [label, setLabel] = useState('');

  async function handlePick() {
    const path = await ipc.pickFile();
    if (!path) return;
    setPendingPath(path);
    const base = path.split(/[\\/]/).pop() ?? path;
    setLabel(base);
  }

  async function handleConfirm() {
    if (!pendingPath || !label.trim()) return;
    await ipc.addFile(profileId, label.trim(), pendingPath);
    setPendingPath(null);
    setLabel('');
    await onChanged();
  }

  async function handleDelete(fileId: string) {
    await ipc.deleteFile(fileId);
    await onChanged();
  }

  return (
    <section className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-caption font-semibold uppercase tracking-wide text-ink-muted">Files</h3>
        <Button variant="ghost" size="sm" onClick={handlePick}>
          <PlusIcon className="h-3.5 w-3.5" /> Add file
        </Button>
      </div>

      {pendingPath && (
        <div className="mb-3 flex items-center gap-2 rounded-card border border-stroke bg-card p-2 shadow-elevation-1">
          <Input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label for this file"
            onKeyDown={(e) => e.key === 'Enter' && void handleConfirm()}
          />
          <Button size="sm" onClick={handleConfirm} disabled={!label.trim()}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setPendingPath(null)}>
            Cancel
          </Button>
        </div>
      )}

      {files.length === 0 && !pendingPath ? (
        <div className="rounded-card border border-dashed border-stroke">
          <EmptyState
            icon={FolderOpenIcon}
            title="No files yet"
            description="Keep shortcuts to documents you upload often — photos, ID scans, signatures."
          />
        </div>
      ) : (
        files.length > 0 && (
          <div className="overflow-hidden rounded-card border border-stroke bg-card shadow-elevation-1">
            {files.map((file, i) => (
              <div
                key={file.id}
                className={
                  'group flex items-center gap-2.5 px-3 py-2 transition-colors hover:bg-hover' +
                  (i < files.length - 1 ? ' border-b border-stroke-subtle' : '')
                }
              >
                <DocumentIcon className="h-4 w-4 shrink-0 text-ink-muted" />
                <span className="min-w-0 flex-1 truncate text-body font-medium text-ink">{file.label}</span>
                <span className="max-w-[45%] truncate font-mono text-caption text-ink-muted">{file.filePath}</span>
                <button
                  onClick={() => void handleDelete(file.id)}
                  aria-label={`Remove ${file.label}`}
                  className="hidden rounded p-1 text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger group-hover:block"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </section>
  );
}
