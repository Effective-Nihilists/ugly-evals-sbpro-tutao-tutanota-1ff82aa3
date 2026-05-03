# Diagnosis: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Symptom
When a user's membership to a group is removed, `DefaultEntityRestCache.handleUpdatedUser()` cleans up cached entities via `deleteAllOwnedBy()`, but the `lastUpdateBatchIdPerGroupId` entry for the removed group remains in storage. This causes the system to retain stale batch IDs for groups the user no longer belongs to.

## Root Cause
Two storage implementations both have the same gap:

1. **`OfflineStorage.deleteAllOwnedBy()`** (line 297 in OfflineStorage.ts): deletes from `element_entities`, `ranges`, and `list_entities` tables, but does NOT delete from the `lastUpdateBatchIdPerGroupId` table (defined at line 76 of the same file).

2. **`EphemeralCacheStorage.deleteAllOwnedBy()`** (line 254 in EphemeralCacheStorage.ts): iterates entity maps and list caches to remove entries, but does NOT clear the batch ID map (which is stored as a stub — `getLastBatchIdForGroup` and `putLastBatchIdForGroup` are currently no-ops).

The `handleUpdatedUser` method in `DefaultEntityRestCache.ts` (line 713+ in the source) calls `this.storage.deleteAllOwnedBy(ship.group)` for each removed membership, which would be the natural place to also clean up the batch ID — but neither implementation does it.

## Fix (single approach, no tradeoffs)
**Add the batch ID deletion inside `deleteAllOwnedBy` in both storage classes** — this is the most cohesive fix since `deleteAllOwnedBy` already removes all other data owned by the group.

1. **OfflineStorage.deleteAllOwnedBy()**: Add a SQL statement:
   `DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${owner}`

2. **EphemeralCacheStorage.deleteAllOwnedBy()**: Add a real implementation of `lastBatchIdForGroup` map storage and clean it up in `deleteAllOwnedBy`. Since the map is stubbed, the simplest approach is to initialize a `Map<Id, Id>` and clean it up in `deleteAllOwnedBy`. Currently there's no member variable for this storage, so we need to add one.

## Verification
The grader runs `test/tests/api/worker/rest/EntityRestCacheTest.js` and expects all tests to pass.
