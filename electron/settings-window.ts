import { BrowserWindow } from 'electron';
import path from 'path';
import { is } from './env';

let settingsWindow: BrowserWindow | null = null;

export function openSettingsWindow(): void {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.show();
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 600,
    height: 500,
    resizable: false,
    title: 'FormVault — Settings',
    backgroundColor: '#0f0f13',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    settingsWindow.loadURL(`${process.env.ELECTRON_RENDERER_URL}/src/settings/index.html`);
  } else {
    settingsWindow.loadFile(path.join(__dirname, '../renderer/src/settings/index.html'));
  }

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}
