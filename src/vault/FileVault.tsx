import { useState } from 'react';
import { File, Plus, Trash2 } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { Input } from '../shared/ui/Input';
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
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Files</h3>
        <Button variant="ghost" size="sm" onClick={handlePick}>
          <Plus size={14} /> Add File
        </Button>
      </div>

      {pendingPath && (
        <div className="mb-3 flex items-center gap-2 rounded-md border border-border bg-bg-secondary p-2">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label for this file" />
          <Button size="sm" onClick={handleConfirm}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setPendingPath(null)}>
            Cancel
          </Button>
        </div>
      )}

      {files.length === 0 ? (
        <p className="text-sm text-text-muted">No files added yet.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {files.map((file) => (
            <div
              key={file.id}
              className="group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm hover:bg-bg-hover"
            >
              <File size={15} className="shrink-0 text-text-muted" />
              <span className="flex-1 truncate">{file.label}</span>
              <span className="truncate text-xs text-text-muted">{file.filePath}</span>
              <button
                onClick={() => void handleDelete(file.id)}
                className="hidden rounded p-1 text-text-muted hover:bg-red-500/10 hover:text-red-400 group-hover:block"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
