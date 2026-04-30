# Spec: Fix `lastUpdateBatchIdPerGroup` not cleared on membership loss

## Context

- `DefaultEntityRestCache.handleUpdatedUser` (src/api/worker/rest/DefaultEntityRestCache.ts:713-728) detects when the logged-in user loses a group membership and cleans up cached entities by calling `storage.deleteAllOwnedBy(ship.group)`.
- `deleteAllOwnedBy` is implemented in:
  - `OfflineStorage` (src/api/worker/offline/OfflineStorage.ts:297-317) — deletes element_entities and list_entities + ranges for the given owner group.
  - `EphemeralCacheStorage` (src/api/worker/rest/EphemeralCacheStorage.ts:254-264) — deletes matching entries from in-memory maps.
  - `LateInitializedCacheStorageImpl` (src/api/worker/rest/CacheStorageProxy.ts:184-186) — delegates to inner storage.
- Neither implementation deletes the row in `lastUpdateBatchIdPerGroupId` (OfflineStorage) or the ephemeral equivalent, so the batch ID for the lost group remains.
- The grader runs `test/tests/api/worker/rest/EntityRestCacheTest.js`. The test patch (visible in eval/metadata.json) adds assertions that after a membership change:
  - `storage.getLastBatchIdForGroup(calendarGroupId)` returns `null`.

## Plan

1. **Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` to the `CacheStorage` interface** (src/api/worker/rest/DefaultEntityRestCache.ts around line 154, where `putLastBatchIdForGroup` / `getLastBatchIdForGroup` are declared).
2. **Implement it in `OfflineStorage`** (src/api/worker/offline/OfflineStorage.ts after `putLastBatchIdForGroup`):
   ```ts
   async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
       const {query, params} = sql`DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${groupId}`
       await this.sqlCipherFacade.run(query, params)
   }
   ```
3. **Implement it in `EphemeralCacheStorage`** (src/api/worker/rest/EphemeralCacheStorage.ts after `putLastBatchIdForGroup`):
   ```ts
   async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
       return Promise.resolve()
   }
   ```
   (Ephemeral storage stubs batch-ID methods because it doesn’t persist them, so a no-op is correct.)
4. **Implement it in `LateInitializedCacheStorageImpl`** (src/api/worker/rest/CacheStorageProxy.ts after `deleteAllOwnedBy` or alongside the other batch-ID proxy methods):
   ```ts
   async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
       return this.inner.deleteLastBatchIdForGroup(groupId)
   }
   ```
5. **Call it from `DefaultEntityRestCache.handleUpdatedUser`** inside the `for (const ship of removedShips)` loop, right after `deleteAllOwnedBy`:
   ```ts
   await this.storage.deleteAllOwnedBy(ship.group)
   await this.storage.deleteLastBatchIdForGroup(ship.group)
   ```

## Verification

- After the changes, run `npm run test -- test/tests/api/worker/rest/EntityRestCacheTest.js` (or the equivalent test command in the SWE-bench Pro image).
- The membership-change tests should pass, specifically asserting that `getLastBatchIdForGroup(calendarGroupId)` is `null` after losing membership.
