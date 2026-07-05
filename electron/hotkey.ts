import { globalShortcut } from 'electron';
import { DEFAULT_HOTKEY } from '../src/shared/constants';
import { togglePopupWindow } from './popup-window';

let registeredAccelerator: string | null = null;

export function registerGlobalHotkey(accelerator: string = DEFAULT_HOTKEY): boolean {
  if (registeredAccelerator) {
    globalShortcut.unregister(registeredAccelerator);
    registeredAccelerator = null;
  }

  const ok = globalShortcut.register(accelerator, () => togglePopupWindow());
  if (ok) {
    registeredAccelerator = accelerator;
  } else {
    console.error(`[hotkey] Failed to register accelerator: ${accelerator}`);
  }
  return ok;
}

export function unregisterAllHotkeys(): void {
  globalShortcut.unregisterAll();
  registeredAccelerator = null;
}

export function getRegisteredHotkey(): string | null {
  return registeredAccelerator;
}
