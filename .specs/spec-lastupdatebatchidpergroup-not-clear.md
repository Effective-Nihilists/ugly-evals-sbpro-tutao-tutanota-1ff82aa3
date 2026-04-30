# Spec: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Context

When a user loses membership in a group, `DefaultEntityRestCache.handleUpdatedUser` detects the removed memberships and calls `storage.deleteAllOwnedBy(ship.group)` to evict cached entities for that group. However, `deleteAllOwnedBy` does **not** delete the corresponding entry in `lastUpdateBatchIdPerGroup` (stored in the `lastUpdateBatchIdPerGroupId` table in `OfflineStorage`). This means the system may later try to download event batches for a group the user no longer belongs to.

The grader runs `test/tests/api/worker/rest/EntityRestCacheTest.js`, which now asserts that `lastUpdateBatchIdPerGroup` entries are also cleared on membership loss.

## Repro

The failing tests are in `test/tests/api/worker/rest/EntityRestCacheTest.ts` under the `membership changes` spec. They:
1. Put a `lastUpdateBatchIdPerGroup` entry for a group.
2. Simulate a user update that removes membership for that group.
3. Assert that `storage.getLastBatchIdForGroup(calendarGroupId)` returns `null`.

Currently, the assertion fails because `deleteAllOwnedBy` does not touch the `lastUpdateBatchIdPerGroupId` table.

## Plan

- [ ] Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` to the `CacheStorage` interface in `src/api/worker/rest/DefaultEntityRestCache.ts`.
- [ ] Implement `deleteLastBatchIdForGroup` in `OfflineStorage` (`src/api/worker/offline/OfflineStorage.ts`) by deleting from the `lastUpdateBatchIdPerGroupId` table.
- [ ] Implement `deleteLastBatchIdForGroup` in `EphemeralCacheStorage` (`src/api/worker/rest/EphemeralCacheStorage.ts`) as a no-op (since ephemeral storage doesn't persist batch IDs).
- [ ] Implement `deleteLastBatchIdForGroup` in `CacheStorageProxy` (`src/api/worker/rest/CacheStorageProxy.ts`) by delegating to the underlying storage.
- [ ] Update `DefaultEntityRestCache.handleUpdatedUser` to call `await this.storage.deleteLastBatchIdForGroup(ship.group)` for each removed membership, after `deleteAllOwnedBy`.

## Verification

Run `npm exec ospec test/tests/api/worker/rest/EntityRestCacheTest.js` and confirm all membership-change tests pass.

## Files to edit

1. `src/api/worker/rest/DefaultEntityRestCache.ts`
   - Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` to `CacheStorage` interface.
   - In `handleUpdatedUser`, after `await this.storage.deleteAllOwnedBy(ship.group)`, add `await this.storage.deleteLastBatchIdForGroup(ship.group)`.

2. `src/api/worker/offline/OfflineStorage.ts`
   - Add `async deleteLastBatchIdForGroup(groupId: Id): Promise<void>` that runs `DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${groupId}`.

3. `src/api/worker/rest/EphemeralCacheStorage.ts`
   - Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` returning `Promise.resolve()`.

4. `src/api/worker/rest/CacheStorageProxy.ts`
   - Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` delegating to `this.storage.deleteLastBatchIdForGroup(groupId)`.
