/**
 * robotjs has no bundled type declarations and (per package.json) is an optional
 * dependency that may not be installed at all if its native build fails. This
 * ambient module lets clipboard.ts typecheck against the subset of the API it uses,
 * regardless of whether the real package is present at install time.
 */
declare module 'robotjs' {
  export function keyTap(key: string, modifier?: string | string[]): void;
}
