import { nativeTheme } from 'electron';

/** Matches --fv-canvas in src/shared/globals.css for flash-free window opens. */
export function windowBackgroundColor(): string {
  return nativeTheme.shouldUseDarkColors ? '#0e0e11' : '#f6f6f9';
}
