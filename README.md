# FormVault

> Your personal data, one shortcut away.

A lightweight desktop productivity app that lives in the system tray. Press a global hotkey → a floating popup appears → pick your data → it's pasted instantly. Works anywhere on your PC: browsers, PDF readers, Excel, government portals.

## Tech Stack

- **Desktop:** Electron + electron-vite
- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** SQLite (better-sqlite3) — local & encrypted
- **Encryption:** AES-256-GCM (Node built-in crypto)
- **Packaging:** electron-builder

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

### Native modules (first-time setup on Windows)

Two features (auto-paste and `!shortcut` text expansion) depend on native
modules — `uiohook-napi` and `robotjs` — that need to compile from source if
no prebuilt binary matches your Electron/Node ABI. If you see a `node-gyp`
error mentioning "Could not find any Visual Studio installation", install the
**Desktop development with C++** workload from
[Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/),
then re-run `npm install`. Without it, the app still runs fully — those two
features just no-op (copy-to-clipboard always works) until the modules
compile.

### Building the installer (`npm run build`)

Producing the `.exe` installer requires electron-builder to extract a
bundled code-signing helper (`winCodeSign`) that contains symlinks. Creating
symlinks on Windows requires either **Developer Mode** (Settings → Privacy &
security → For developers → Developer Mode: On) or an elevated/admin
terminal. Enable one of those once, then `npm run build` will produce
`release/FormVault-Setup-<version>.exe`. `npm run dev` is unaffected by this
and works without either.

## Features

- 🔐 Encrypted local vault — your data never leaves your machine
- ⌨️ Global hotkey popup (Ctrl+Shift+Space) — works in any app
- 📋 One-click copy & paste for any saved field
- ⚡ Text expansion — type `!pan` anywhere to auto-paste your PAN
- 👤 Multiple profiles — personal, business, family
- 📁 File vault — quick access to frequently uploaded documents
