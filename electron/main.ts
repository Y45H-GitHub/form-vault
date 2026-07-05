import { app, BrowserWindow } from 'electron';
import { initDatabase } from './database';
import { createTray } from './tray';
import { registerGlobalHotkey, unregisterAllHotkeys } from './hotkey';
import { registerIpcHandlers } from './ipc-handlers';
import { startTextExpander, stopTextExpander } from './text-expander';
import { getSetting } from './database';
import { DEFAULT_HOTKEY } from '../src/shared/constants';

// Single instance lock — a second launch just focuses/wakes the existing instance.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Tray-resident app: a second launch is a no-op beyond focusing nothing new.
  });

  app.whenReady().then(() => {
    initDatabase();
    registerIpcHandlers();
    createTray();

    const savedHotkey = getSetting('hotkey') ?? DEFAULT_HOTKEY;
    registerGlobalHotkey(savedHotkey);

    startTextExpander();

    const launchAtStartup = getSetting('launchAtStartup');
    if (launchAtStartup === null) {
      // Default to launching at startup per spec; user can opt out in Settings.
      app.setLoginItemSettings({ openAtLogin: true });
    } else {
      app.setLoginItemSettings({ openAtLogin: launchAtStartup === 'true' });
    }
  });

  // Tray app: closing all windows must not quit the app — it should keep living in the tray.
  app.on('window-all-closed', () => {
    if (process.platform === 'darwin') return;
  });

  app.on('before-quit', () => {
    unregisterAllHotkeys();
    stopTextExpander();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createTray();
    }
  });
}
