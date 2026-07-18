import { beforeEach, describe, expect, it } from 'vitest';
import { ackBlank, isBlankAcked } from './blankProfileAck';

describe('blankProfileAck', () => {
  beforeEach(() => localStorage.clear());

  it('returns false for a profile that has never been acknowledged', () => {
    expect(isBlankAcked('profile-1')).toBe(false);
  });

  it('returns true after acking a profile, and does not affect other profiles', () => {
    ackBlank('profile-1');
    expect(isBlankAcked('profile-1')).toBe(true);
    expect(isBlankAcked('profile-2')).toBe(false);
  });

  it('persists multiple acknowledged profiles independently', () => {
    ackBlank('profile-1');
    ackBlank('profile-2');
    expect(isBlankAcked('profile-1')).toBe(true);
    expect(isBlankAcked('profile-2')).toBe(true);
    expect(isBlankAcked('profile-3')).toBe(false);
  });

  it('tolerates corrupted storage instead of throwing', () => {
    localStorage.setItem('fv-blank-profiles', '{not valid json');
    expect(() => isBlankAcked('profile-1')).not.toThrow();
    expect(isBlankAcked('profile-1')).toBe(false);
  });
});
