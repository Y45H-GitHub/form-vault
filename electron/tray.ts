import { Tray, Menu, app, nativeImage } from 'electron';
import path from 'path';
import { togglePopupWindow } from './popup-window';
import { openVaultWindow } from './vault-window';
import { openSettingsWindow } from './settings-window';

let tray: Tray | null = null;

function resolveTrayIconPath(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'assets', 'tray-icon.png')
    : path.join(__dirname, '../../assets/tray-icon.png');
}

export function createTray(): Tray {
  const icon = nativeImage.createFromPath(resolveTrayIconPath());
  tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon);
  tray.setToolTip('FormVault - Your data, one shortcut away');

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Popup', click: () => togglePopupWindow() },
    { type: 'separator' },
    { label: 'Open Vault', click: () => openVaultWindow() },
    { label: 'Settings', click: () => openSettingsWindow() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('click', () => togglePopupWindow());

  return tray;
}

export function getTray(): Tray | null {
  return tray;
}
