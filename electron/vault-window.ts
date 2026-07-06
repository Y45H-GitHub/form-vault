import { BrowserWindow } from 'electron';
import path from 'path';
import { is } from './env';
import { windowBackgroundColor } from './theme';

let vaultWindow: BrowserWindow | null = null;

export function openVaultWindow(): void {
  if (vaultWindow && !vaultWindow.isDestroyed()) {
    vaultWindow.show();
    vaultWindow.focus();
    return;
  }

  vaultWindow = new BrowserWindow({
    width: 900,
    height: 650,
    minWidth: 700,
    minHeight: 480,
    title: 'FormVault — Vault Manager',
    backgroundColor: windowBackgroundColor(),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    vaultWindow.loadURL(`${process.env.ELECTRON_RENDERER_URL}/src/vault/index.html`);
  } else {
    vaultWindow.loadFile(path.join(__dirname, '../renderer/src/vault/index.html'));
  }

  vaultWindow.on('closed', () => {
    vaultWindow = null;
  });
}
