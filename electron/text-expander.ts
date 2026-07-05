import { getAllShortcuts } from './database';
import { copyAndPaste, sendBackspaces } from './clipboard';

let uiohook: typeof import('uiohook-napi') | null = null;
try {
  uiohook = require('uiohook-napi');
} catch {
  uiohook = null;
}

const MAX_BUFFER = 32;
const SHIFTED_ONE_CHAR = '!';

let buffer = '';
let shortcuts = new Map<string, { fieldId: string; value: string }>();
let started = false;

export function refreshTextExpanderShortcuts(): void {
  shortcuts = getAllShortcuts();
}

function matchShortcut(): string | null {
  for (const shortcut of shortcuts.keys()) {
    if (buffer.endsWith(shortcut)) return shortcut;
  }
  return null;
}

export function isTextExpanderAvailable(): boolean {
  return uiohook !== null;
}

export function startTextExpander(): void {
  if (started || !uiohook) return;
  started = true;
  refreshTextExpanderShortcuts();

  const { uIOhook, UiohookKey } = uiohook;

  const triggerKeys = new Set<number>([UiohookKey.Space, UiohookKey.Tab]);
  const baseKeyChars: Record<number, string> = {
    [UiohookKey.A]: 'a', [UiohookKey.B]: 'b', [UiohookKey.C]: 'c', [UiohookKey.D]: 'd',
    [UiohookKey.E]: 'e', [UiohookKey.F]: 'f', [UiohookKey.G]: 'g', [UiohookKey.H]: 'h',
    [UiohookKey.I]: 'i', [UiohookKey.J]: 'j', [UiohookKey.K]: 'k', [UiohookKey.L]: 'l',
    [UiohookKey.M]: 'm', [UiohookKey.N]: 'n', [UiohookKey.O]: 'o', [UiohookKey.P]: 'p',
    [UiohookKey.Q]: 'q', [UiohookKey.R]: 'r', [UiohookKey.S]: 's', [UiohookKey.T]: 't',
    [UiohookKey.U]: 'u', [UiohookKey.V]: 'v', [UiohookKey.W]: 'w', [UiohookKey.X]: 'x',
    [UiohookKey.Y]: 'y', [UiohookKey.Z]: 'z',
    [UiohookKey[0]]: '0', [UiohookKey[2]]: '2', [UiohookKey[3]]: '3', [UiohookKey[4]]: '4',
    [UiohookKey[5]]: '5', [UiohookKey[6]]: '6', [UiohookKey[7]]: '7', [UiohookKey[8]]: '8',
    [UiohookKey[9]]: '9'
  };

  uIOhook.on('keydown', (e) => {
    if (e.keycode === UiohookKey.Backspace) {
      buffer = buffer.slice(0, -1);
      return;
    }

    if (triggerKeys.has(e.keycode)) {
      const matched = matchShortcut();
      if (matched) {
        const entry = shortcuts.get(matched);
        buffer = '';
        if (entry) {
          sendBackspaces(matched.length + 1);
          copyAndPaste(entry.value);
        }
        return;
      }
      buffer = '';
      return;
    }

    if (e.keycode === UiohookKey[1] && e.shiftKey) {
      buffer += SHIFTED_ONE_CHAR;
    } else {
      const char = baseKeyChars[e.keycode];
      if (char) buffer += char;
    }

    if (buffer.length > MAX_BUFFER) {
      buffer = buffer.slice(buffer.length - MAX_BUFFER);
    }
  });

  uIOhook.start();
}

export function stopTextExpander(): void {
  if (!started || !uiohook) return;
  uiohook.uIOhook.stop();
  started = false;
}
