import { clipboard } from 'electron';

/**
 * robotjs is the spec'd keystroke-simulation library, but its native binding is
 * unmaintained and frequently fails to build against current Electron/Node ABIs.
 * uiohook-napi (already a dependency for the text-expander hook) ships its own
 * keyTap/keyToggle simulation, so it's used as a fallback simulator when robotjs
 * isn't available — auto-paste and shortcut-deletion keep working either way.
 */
let robot: typeof import('robotjs') | null = null;
try {
  robot = require('robotjs');
} catch {
  robot = null;
}

let uiohook: typeof import('uiohook-napi') | null = null;
try {
  uiohook = require('uiohook-napi');
} catch {
  uiohook = null;
}

export function copyToClipboard(text: string): void {
  clipboard.writeText(text);
}

function simulateCtrlV(): void {
  if (robot) {
    robot.keyTap('v', process.platform === 'darwin' ? 'command' : 'control');
    return;
  }
  if (uiohook) {
    uiohook.uIOhook.keyTap(uiohook.UiohookKey.V, [uiohook.UiohookKey.Ctrl]);
  }
}

/** Copies text and simulates Ctrl+V into whatever window currently has focus. */
export function copyAndPaste(text: string): void {
  copyToClipboard(text);
  if (!robot && !uiohook) return;
  setTimeout(simulateCtrlV, 80);
}

export function sendBackspaces(count: number): void {
  if (robot) {
    for (let i = 0; i < count; i++) robot.keyTap('backspace');
    return;
  }
  if (uiohook) {
    for (let i = 0; i < count; i++) uiohook.uIOhook.keyTap(uiohook.UiohookKey.Backspace);
  }
}

export const isAutoPasteAvailable = (): boolean => robot !== null || uiohook !== null;
