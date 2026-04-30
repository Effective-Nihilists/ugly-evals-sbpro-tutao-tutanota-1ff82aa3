# Spec: Clear `lastUpdateBatchIdPerGroup` on membership loss

## Context

When a user's group membership is removed, `DefaultEntityRestCache.handleUpdatedUser` detects the change and calls `storage.deleteAllOwnedBy(ship.group)` to purge cached entities belonging to the lost group. However, the per-group `lastUpdateBatchIdPerGroup` entry (used to resume event batch downloads) is **not** deleted. The test patch in `eval/metadata.json` shows the expected behavior: after a membership change, `storage.getLastBatchIdForGroup(calendarGroupId)` should return `null`.

## Repro

The failing test suite is `test/tests/api/worker/rest/EntityRestCacheTest.js`. The relevant tests are under the `"membership changes"` spec:
- `"membership change deletes an element entity and lastUpdateBatchIdPerGroup"`
- `"membership change deletes a list entity and lastUpdateBatchIdPerGroup"`

They `putLastBatchIdForGroup(calendarGroupId, "1")` before the event, then assert `getLastBatchIdForGroup(calendarGroupId)` is `null` after eviction.

## Plan

1. **Add `deleteLastBatchIdForGroup` to `CacheStorage` interface**  
   File: `src/api/worker/rest/DefaultEntityRestCache.ts`  
   Insert a new method signature in the `CacheStorage` interface (around line 160, after `getLastBatchIdForGroup`).

2. **Implement in `EphemeralCacheStorage`**  
   File: `src/api/worker/rest/EphemeralCacheStorage.ts`  
   Add a no-op async method `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` (the ephemeral storage already returns `null` for `getLastBatchIdForGroup`, so nothing needs to be deleted).

3. **Implement in `OfflineStorage`**  
   File: `src/api/worker/offline/OfflineStorage.ts`  
   Add an async method that executes:  
   ```ts
   const {query, params} = sql`DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${groupId}`
   await this.sqlCipherFacade.run(query, params)
   ```

4. **Implement in `CacheStorageProxy`**  
   File: `src/api/worker/rest/CacheStorageProxy.ts`  
   Add a pass-through method `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` that delegates to `this.inner.deleteLastBatchIdForGroup(groupId)`.

5. **Call it from `DefaultEntityRestCache.handleUpdatedUser`**  
   File: `src/api/worker/rest/DefaultEntityRestCache.ts`  
   Inside the `for (const ship of removedShips)` loop (around line 724), after `await this.storage.deleteAllOwnedBy(ship.group)`, add:  
   ```ts
   await this.storage.deleteLastBatchIdForGroup(ship.group)
   ```

## Why this fixes the bug

The eviction path for lost memberships (`handleUpdatedUser`) currently cleans entities and list ranges but leaves the `lastUpdateBatchIdPerGroupId` row behind. By adding a symmetric `deleteLastBatchIdForGroup` operation to the storage interface and invoking it in the same loop, we ensure the offline DB (and any future persistent storage) no longer references the removed group, preventing the worker from trying to download stale event batches.

## Verification

Run the failing test suite after switching to EDIT mode:
```bash
npm exec ospec test/tests/api/worker/rest/EntityRestCacheTest.js
```
All three membership-change tests should pass, specifically asserting that `getLastBatchIdForGroup(calendarGroupId)` returns `null` after membership loss.
