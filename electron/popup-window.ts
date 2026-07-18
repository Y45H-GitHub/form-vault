import { BrowserWindow, screen } from 'electron';
import path from 'path';
import { is } from './env';
import { IPC } from '../src/shared/constants';

let popupWindow: BrowserWindow | null = null;

const WIDTH = 420;
const MAX_HEIGHT = 520;

function createPopupWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: WIDTH,
    height: MAX_HEIGHT,
    show: false,
    frame: false,
    resizable: false,
    movable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(`${process.env.ELECTRON_RENDERER_URL}/src/popup/index.html`);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, '../renderer/src/popup/index.html'));
  }

  win.on('blur', () => {
    hidePopupWindow();
  });

  win.on('close', (e) => {
    e.preventDefault();
    hidePopupWindow();
  });

  return win;
}

function positionNearCursor(win: BrowserWindow): void {
  const cursor = screen.getCursorScreenPoint();
  const display = screen.getDisplayNearestPoint(cursor);
  const { width, height } = win.getBounds();

  let x = cursor.x - width / 2;
  let y = cursor.y + 16;

  const bounds = display.workArea;
  x = Math.min(Math.max(x, bounds.x + 8), bounds.x + bounds.width - width - 8);
  y = Math.min(Math.max(y, bounds.y + 8), bounds.y + bounds.height - height - 8);

  win.setBounds({ x: Math.round(x), y: Math.round(y), width, height });
}

export function showPopupWindow(): void {
  if (!popupWindow || popupWindow.isDestroyed()) {
    popupWindow = createPopupWindow();
  }

  positionNearCursor(popupWindow);
  popupWindow.show();
  popupWindow.focus();
  popupWindow.webContents.send(IPC.HOTKEY_TRIGGERED);
}

export function hidePopupWindow(): void {
  if (popupWindow && !popupWindow.isDestroyed()) {
    popupWindow.hide();
  }
}

export function togglePopupWindow(): void {
  if (popupWindow && !popupWindow.isDestroyed() && popupWindow.isVisible()) {
    hidePopupWindow();
  } else {
    showPopupWindow();
  }
}

export function getPopupWindow(): BrowserWindow | null {
  return popupWindow;
}
