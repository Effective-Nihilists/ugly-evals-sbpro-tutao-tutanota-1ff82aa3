# Fix: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Context
In `DefaultEntityRestCache.handleUpdatedUser()`, when a membership is lost, `storage.deleteAllOwnedBy(ship.group)` removes entities owned by the group from `entities_by_ownerGroup`, but the entry for that group in `lastUpdateBatchIdPerGroupId` (used for event batch tracking) is NOT deleted. This leaves stale batch IDs for groups the user no longer belongs to.

## Diagnosis
- `handleUpdatedUser` (line 725): loops over removed memberships and calls `deleteAllOwnedBy(groupId)`
- `OfflineStorage.deleteAllOwnedBy` only deletes from `element_entities` / `list_entities` — it does NOT touch `lastUpdateBatchIdPerGroupId` table
- The `CacheStorage` interface had no method to delete a group's batch ID entry

## Fix (all done)
- [x] Add `eraseLastBatchIdForGroup(groupId: Id): Promise<void>` to `CacheStorage` interface (`DefaultEntityRestCache.ts:158`)
- [x] Implement `eraseLastBatchIdForGroup` in `OfflineStorage.ts:238` (`DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ?`)
- [x] Implement `eraseLastBatchIdForGroup` in `EphemeralCacheStorage.ts:223` (no-op for ephemeral)
- [x] Implement `eraseLastBatchIdForGroup` in `CacheStorageProxy.ts:159` (delegate to inner)
- [x] Call `eraseLastBatchIdForGroup(ship.group)` in `handleUpdatedUser` (`DefaultEntityRestCache.ts:729`) after `deleteAllOwnedBy`

## Verification
Run `test/tests/api/worker/rest/EntityRestCacheTest.ts` — "membership change deletes a list entity" test should pass.
