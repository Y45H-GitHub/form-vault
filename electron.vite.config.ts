import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: resolve(__dirname, 'electron/main.ts')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: resolve(__dirname, 'electron/preload.ts')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@shared': resolve(__dirname, 'src/shared')
      }
    },
    root: '.',
    build: {
      rollupOptions: {
        input: {
          popup: resolve(__dirname, 'src/popup/index.html'),
          vault: resolve(__dirname, 'src/vault/index.html'),
          settings: resolve(__dirname, 'src/settings/index.html')
        }
      }
    },
    plugins: [react()]
  }
});
