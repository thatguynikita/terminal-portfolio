/**
 * localStorage that never throws. Private windows and blocked site data
 * make every access a potential exception, so all of it is guarded.
 */
const PREFIX = "terminal-portfolio";

export const StorageKey = {
  theme: `${PREFIX}:theme`,
  lang: `${PREFIX}:lang`,
  matrix: `${PREFIX}:matrix`,
} as const;

export const BOOTED_SESSION_KEY = `${PREFIX}:booted`;

export function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore — a preference that can't be saved isn't worth breaking over */
  }
}

export function readSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeSession(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}
