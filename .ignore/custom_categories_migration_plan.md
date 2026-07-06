# Plan: User-Manageable Categories (DB Migration + Backend Changes)

> Status: **PLAN ONLY — not implemented.** The UI redesign treats categories as the
> current fixed enum. This document scopes what it takes to let users create,
> rename, recolor, reorder, and delete categories, as requested in the redesign
> brief's Vault Manager section.

---

## 1. Current state (why this is a migration, not a UI tweak)

- `fields.category` is a **TEXT column with a CHECK constraint** hard-coded to
  `('personal', 'financial', 'documents', 'business', 'custom')` in
  `electron/database.ts`.
- The `Category` TypeScript type in `src/shared/types.ts` is a string-literal
  union of the same five values.
- Category display names, order, and colors live in `src/shared/constants.ts`
  (`CATEGORIES`, `CATEGORY_COLORS`) — compile-time constants, not data.
- SQLite **cannot drop a CHECK constraint in place**; changing it requires the
  documented 12-step table-rebuild procedure (create new table → copy → drop →
  rename).

## 2. Target schema

```sql
CREATE TABLE IF NOT EXISTS categories (
  id         TEXT PRIMARY KEY,            -- uuid
  profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
                                          -- NULL = global/built-in category
  name       TEXT NOT NULL,
  color      TEXT NOT NULL DEFAULT '#6366f1',
  icon       TEXT DEFAULT '📁',
  sort_order INTEGER DEFAULT 0,
  is_builtin INTEGER DEFAULT 0,           -- built-ins can be renamed but not deleted
  created_at TEXT DEFAULT (datetime('now'))
);

-- fields.category (TEXT enum) becomes fields.category_id (FK)
CREATE TABLE fields_new (
  id          TEXT PRIMARY KEY,
  profile_id  TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  label       TEXT NOT NULL,
  value       TEXT NOT NULL,
  field_type  TEXT NOT NULL DEFAULT 'text'
              CHECK(field_type IN ('text','number','date','multiline','file_path')),
  shortcut    TEXT,
  icon        TEXT DEFAULT '📋',
  sort_order  INTEGER DEFAULT 0,
  created_at  TEXT DEFAULT (datetime('now')),
  updated_at  TEXT DEFAULT (datetime('now'))
);
```

Notes:
- `ON DELETE RESTRICT` on `category_id`: deleting a category that still has
  fields must be blocked at the DB level; the UI offers "move fields to another
  category first" (see §5).
- `is_builtin` protects the five seeded categories from deletion so existing
  UX (tab cycling, seeded fields) never breaks.

## 3. Migration procedure (versioned, one-way)

Introduce schema versioning now — the DB currently has none:

```
PRAGMA user_version;   -- 0 today → 1 after this migration
```

`initDatabase()` gains a tiny migration runner: read `user_version`, apply
migrations `> version` in order inside a single transaction, bump the pragma.

**Migration 1 steps** (single transaction, WAL checkpoint after):

1. `CREATE TABLE categories (...)`.
2. Seed the five built-ins with **fixed, well-known UUIDs** (constants in
   code), `is_builtin = 1`, names/colors copied from today's
   `CATEGORIES`/`CATEGORY_COLORS` constants.
3. Create `fields_new` per §2.
4. Copy rows:
   `INSERT INTO fields_new SELECT id, profile_id, <builtin-uuid-for(category)>, label, value, ... FROM fields;`
   (a 5-branch CASE expression maps the old enum strings to the seeded UUIDs).
5. `DROP TABLE fields; ALTER TABLE fields_new RENAME TO fields;`
6. Recreate any indexes (add `CREATE INDEX idx_fields_category ON fields(category_id)` while here).
7. `PRAGMA user_version = 1;`

Run with `PRAGMA foreign_keys = OFF` for the duration of the rebuild, back ON
after (standard SQLite table-rebuild practice), and verify with
`PRAGMA foreign_key_check` before committing the transaction.

**Safety:** copy `formvault.sqlite3` to `formvault.sqlite3.bak-v0` before the
first migration ever runs; delete the backup after 30 days or N successful
launches.

## 4. Backend changes (electron/)

| File | Change |
|---|---|
| `database.ts` | Migration runner; new CRUD: `getCategories(profileId)`, `addCategory`, `updateCategory` (rename/recolor/reorder), `deleteCategory(id, moveFieldsToId?)`. `getFieldsForProfile` joins `categories` to return `categoryId` + denormalized `categoryName`/`categoryColor` for the renderer. Seeding uses built-in UUID constants. |
| `ipc-handlers.ts` | New channels: `vault:get-categories`, `vault:add-category`, `vault:update-category`, `vault:delete-category` (payload includes optional `moveFieldsTo`). All fire the existing `vault:data-updated` broadcast. |
| `preload.ts` | Expose the four new calls on `window.formvault`. |

`deleteCategory` contract: if the category still has fields and no
`moveFieldsToId` is given → return `{ ok: false, reason: 'has-fields', count }`
so the UI can prompt; never cascade-delete user data silently.

## 5. Shared types & constants (src/shared/)

- `types.ts`: `Category` string-union **replaced** by an interface
  (`{ id, profileId, name, color, icon, sortOrder, isBuiltin }`); `Field` gets
  `categoryId` (+ optional denormalized name/color). This is the breaking
  change that ripples furthest — every `category === 'personal'` comparison in
  the renderer must switch to id/`isBuiltin` checks.
- `constants.ts`: `CATEGORIES` / `CATEGORY_COLORS` shrink to the **seed data
  used only by the migration**; runtime reads come from the DB.

## 6. UI touchpoints (scoped, not designed here)

- **Vault Manager**: "Manage categories" affordance — add / rename / recolor /
  reorder / delete-with-move dialog. Field form's category dropdown becomes
  data-driven.
- **Popup**: tabs render from `getCategories()` (they already render from a
  Set of present categories, so this is small); Tab-cycling order follows
  `sort_order`.

## 7. Export / import compatibility

Bump `VaultExport.version` to 2 and include `categories[]`. Import must handle
v1 files (no categories array): map v1 enum strings through the same CASE
mapping as migration step 4. Never reject old exports.

## 8. Risks / gotchas

- **Text-expander cache**: `getAllShortcuts()` doesn't touch categories — no
  change, but it re-reads on every `vault:data-updated`, so category deletes
  that move fields keep shortcuts intact automatically.
- **StrictMode double-effects** in the renderer refetch categories twice; the
  reads are cheap, no action needed.
- **Concurrent writes during migration**: run migration before any window or
  the text-expander starts (it already would — `initDatabase()` is first in
  `app.whenReady`).
- Rough size: ~1 day of implementation + tests; the table rebuild is the only
  risky part and is fully covered by the pre-migration backup.
