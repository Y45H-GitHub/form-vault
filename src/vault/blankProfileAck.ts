/**
 * Tracks which profiles the user explicitly chose "Start blank" for, so the template picker
 * doesn't reappear every time a profile has zero fields. Deliberately not part of the SQLite
 * schema — this is a lightweight, per-install UI preference, not vault data.
 */
const STORAGE_KEY = 'fv-blank-profiles';

function readAcked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function isBlankAcked(profileId: string): boolean {
  return readAcked().has(profileId);
}

export function ackBlank(profileId: string): void {
  const acked = readAcked();
  acked.add(profileId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...acked]));
}
