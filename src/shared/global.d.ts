import type { RetrivoApi } from '../../electron/preload';

declare global {
  interface Window {
    retrivo: RetrivoApi;
  }
}

export {};
