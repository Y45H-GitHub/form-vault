import { useEffect } from 'react';
import { ipc } from './ipc-client';

/** Applies the persisted theme setting to <html> on mount; each window calls this once. */
export function useTheme(): void {
  useEffect(() => {
    void ipc.getSettings().then((settings) => {
      const theme = (settings as { theme?: string }).theme ?? 'dark';
      document.documentElement.classList.toggle('light', theme === 'light');
      document.documentElement.classList.toggle('dark', theme !== 'light');
    });
  }, []);
}
