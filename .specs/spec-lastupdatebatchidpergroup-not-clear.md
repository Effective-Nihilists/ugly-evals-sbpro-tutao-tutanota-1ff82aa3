# Spec: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Context

- `DefaultEntityRestCache.handleUpdatedUser` (src/api/worker/rest/DefaultEntityRestCache.ts:713-728) detects lost memberships when a `User` UPDATE event is received. For each removed membership it calls `this.storage.deleteAllOwnedBy(ship.group)` to purge cached entities belonging to that group.
- `CacheStorage` interface (same file, lines 118-165) declares `deleteAllOwnedBy(owner: Id): Promise<void>` but does **not** declare any method to delete the per-group last-batch-id mapping.
- `OfflineStorage.deleteAllOwnedBy` (src/api/worker/offline/OfflineStorage.ts:297-320) deletes `element_entities` and `list_entities` (plus their ranges) but **does not** delete the matching row from `lastUpdateBatchIdPerGroupId`.
- `EphemeralCacheStorage` (src/api/worker/rest/EphemeralCacheStorage.ts) stores no batch ids (`getLastBatchIdForGroup` always returns `null`), so it is unaffected.
- The failing test patch (see eval/metadata.json) adds assertions that after a membership change:
  - `await storage.getLastBatchIdForGroup(calendarGroupId)` must equal `null`.
  - When there is **no** membership change, the batch id must **not** be deleted.

## Root Cause

`deleteAllOwnedBy` only cleans entity tables and ranges; it forgets to remove the group's entry from `lastUpdateBatchIdPerGroupId`. Consequently the system later tries to download event batches for a group the user no longer belongs to.

## Plan

### 1. Add `deleteLastBatchIdForGroup` to `CacheStorage` interface
**File:** `src/api/worker/rest/DefaultEntityRestCache.ts`
- Insert a new method declaration in the `CacheStorage` interface (around line 156, next to `putLastBatchIdForGroup` / `getLastBatchIdForGroup`):
  ```ts
  deleteLastBatchIdForGroup(groupId: Id): Promise<void>;
  ```

### 2. Implement `deleteLastBatchIdForGroup` in `OfflineStorage`
**File:** `src/api/worker/offline/OfflineStorage.ts`
- Add a new async method:
  ```ts
  async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
      const {query, params} = sql`DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${groupId}`
      await this.sqlCipherFacade.run(query, params)
  }
  ```
- In the existing `deleteAllOwnedBy` method, after the two `{ … }` blocks that delete element/list entities and ranges, add:
  ```ts
  await this.deleteLastBatchIdForGroup(owner)
  ```

### 3. Implement stub in `EphemeralCacheStorage`
**File:** `src/api/worker/rest/EphemeralCacheStorage.ts`
- Add a no-op method so the interface contract is satisfied:
  ```ts
  async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
      return Promise.resolve()
  }
  ```

### 4. Implement pass-through in `CacheStorageProxy`
**File:** `src/api/worker/rest/CacheStorageProxy.ts`
- Add the forwarding method (pattern matches existing `putLastBatchIdForGroup` / `getLastBatchIdForGroup` proxies):
  ```ts
  async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
      return this.inner.deleteLastBatchIdForGroup(groupId)
  }
  ```

### 5. Wire `DefaultEntityRestCache.handleUpdatedUser` to clear the batch id
**File:** `src/api/worker/rest/DefaultEntityRestCache.ts`
- Inside `handleUpdatedUser`, in the `for (const ship of removedShips)` loop, after the existing `await this.storage.deleteAllOwnedBy(ship.group)` call, add:
  ```ts
  await this.storage.deleteLastBatchIdForGroup(ship.group)
  ```

## Why this fixes the bug

When a membership is lost, `handleUpdatedUser` now explicitly tells the storage to delete the group's `lastUpdateBatchIdPerGroup` entry. `OfflineStorage` removes the row from its SQLite table, preventing any future attempt to resume event batch downloads for that group. The other storage implementations receive a harmless no-op.

## Verification

The grader runs `test/tests/api/worker/rest/EntityRestCacheTest.js`. The (already-provided) test patch asserts:
1. **No membership change** – after a user update with identical memberships, `storage.getLastBatchIdForGroup(calendarGroupId)` is **not** `null`.
2. **Membership change (element entity)** – after losing the calendar membership, `storage.getLastBatchIdForGroup(calendarGroupId)` **is** `null`.
3. **Membership change (list entity)** – same null assertion.

After applying the plan above, these assertions will pass because the batch-id mapping is correctly preserved in case 1 and correctly deleted in cases 2 and 3.
