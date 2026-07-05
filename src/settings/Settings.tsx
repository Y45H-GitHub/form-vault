import { useEffect, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { ipc } from '../shared/ipc-client';
import { useTheme } from '../shared/useTheme';
import { DEFAULT_HOTKEY } from '../shared/constants';
import { Button } from '../shared/ui/Button';
import { Switch } from '../shared/ui/Switch';

function codeToAcceleratorKey(code: string): string | null {
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  if (code.startsWith('Numpad')) return code.slice(6) || null;
  if (code === 'Space') return 'Space';
  if (code === 'Tab') return 'Tab';
  if (code === 'Escape') return 'Escape';
  if (code === 'Enter') return 'Enter';
  if (code === 'Backspace') return 'Backspace';
  if (code.startsWith('Arrow')) return code;
  if (/^F\d{1,2}$/.test(code)) return code;
  return null;
}

function formatAccelerator(e: KeyboardEvent): string | null {
  const key = codeToAcceleratorKey(e.code);
  if (!key) return null;
  const parts: string[] = [];
  if (e.ctrlKey) parts.push('Control');
  if (e.altKey) parts.push('Alt');
  if (e.shiftKey) parts.push('Shift');
  if (e.metaKey) parts.push('Super');
  if (parts.length === 0) return null;
  parts.push(key);
  return parts.join('+');
}

export function Settings() {
  useTheme();
  const [hotkey, setHotkey] = useState(DEFAULT_HOTKEY);
  const [recording, setRecording] = useState(false);
  const [launchAtStartup, setLaunchAtStartup] = useState(true);
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [version, setVersion] = useState('');
  const [capabilities, setCapabilities] = useState({ autoPaste: true, textExpansion: true });
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    void ipc.getSettings().then((s) => {
      const settings = s as { hotkey?: string; launchAtStartup?: boolean; theme?: 'dark' | 'light' };
      setHotkey(settings.hotkey ?? DEFAULT_HOTKEY);
      setLaunchAtStartup(settings.launchAtStartup ?? true);
      setThemeState(settings.theme ?? 'dark');
    });
    void ipc.getAppVersion().then(setVersion);
    void ipc.getCapabilities().then(setCapabilities);
  }, []);

  useEffect(() => {
    if (!recording) return;
    function onKeyDown(e: KeyboardEvent) {
      e.preventDefault();
      if (e.key === 'Escape') {
        setRecording(false);
        return;
      }
      const accelerator = formatAccelerator(e);
      if (!accelerator) return;
      setHotkey(accelerator);
      setRecording(false);
      void ipc.setSetting('hotkey', accelerator);
    }
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [recording]);

  async function toggleLaunchAtStartup(checked: boolean) {
    setLaunchAtStartup(checked);
    await ipc.setSetting('launchAtStartup', checked);
  }

  async function toggleTheme(checked: boolean) {
    const next = checked ? 'light' : 'dark';
    setThemeState(next);
    document.documentElement.classList.toggle('light', next === 'light');
    document.documentElement.classList.toggle('dark', next !== 'light');
    await ipc.setSetting('theme', next);
  }

  async function handleExport() {
    setExportStatus(null);
    const result = await ipc.exportVault();
    setExportStatus(result.ok ? `Exported to ${result.path}` : 'Export cancelled');
  }

  async function handleImport() {
    setImportStatus(null);
    const result = await ipc.importVault();
    setImportStatus(result.ok ? 'Vault imported successfully' : 'Import cancelled');
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-bg-primary p-6 text-text-primary">
      <h1 className="mb-6 text-lg font-semibold">Settings</h1>

      <div className="flex flex-col gap-6 overflow-y-auto">
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Global Hotkey</h2>
          <div className="flex items-center justify-between rounded-lg border border-border bg-bg-card px-4 py-3">
            <span className="rounded bg-bg-hover px-2 py-1 font-mono text-sm">
              {recording ? 'Press a key combination…' : hotkey}
            </span>
            <Button size="sm" variant="outline" onClick={() => setRecording(true)} disabled={recording}>
              {recording ? 'Recording…' : 'Change'}
            </Button>
          </div>
        </section>

        <section className="flex items-center justify-between rounded-lg border border-border bg-bg-card px-4 py-3">
          <div>
            <h2 className="text-sm font-medium">Launch at startup</h2>
            <p className="text-xs text-text-muted">Start FormVault automatically when you sign in</p>
          </div>
          <Switch checked={launchAtStartup} onChange={(v) => void toggleLaunchAtStartup(v)} label="Launch at startup" />
        </section>

        <section className="flex items-center justify-between rounded-lg border border-border bg-bg-card px-4 py-3">
          <div>
            <h2 className="text-sm font-medium">Light mode</h2>
            <p className="text-xs text-text-muted">FormVault defaults to dark mode</p>
          </div>
          <Switch checked={theme === 'light'} onChange={(v) => void toggleTheme(v)} label="Light mode" />
        </section>

        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Data</h2>
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-bg-card px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Export vault (encrypted JSON)</span>
              <Button size="sm" variant="outline" onClick={() => void handleExport()}>
                <Download size={14} /> Export
              </Button>
            </div>
            {exportStatus && <p className="text-xs text-text-muted">{exportStatus}</p>}
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm">Import vault</span>
              <Button size="sm" variant="outline" onClick={() => void handleImport()}>
                <Upload size={14} /> Import
              </Button>
            </div>
            {importStatus && <p className="text-xs text-text-muted">{importStatus}</p>}
          </div>
        </section>

        {(!capabilities.autoPaste || !capabilities.textExpansion) && (
          <section className="rounded-lg border border-yellow-600/30 bg-yellow-500/10 px-4 py-3 text-xs text-yellow-500">
            Auto-paste and/or text-expansion are unavailable on this machine because a native module hasn't been
            compiled. Copy-to-clipboard still works everywhere.
          </section>
        )}

        <section className="mt-auto text-xs text-text-muted">FormVault v{version || '0.1.0'} — Your data, one shortcut away</section>
      </div>
    </div>
  );
}
