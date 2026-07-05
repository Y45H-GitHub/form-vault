import type { FormVaultApi } from '../../electron/preload';

declare global {
  interface Window {
    formvault: FormVaultApi;
  }
}

export {};
