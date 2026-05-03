# Fix Applied: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Symptom
When a user loses membership in a group, the mapping `lastUpdateBatchIdPerGroupId` is not deleted. The system may continue trying to download event batches for groups the user no longer belongs to.

## Root Cause
In `DefaultEntityRestCache.handleUpdatedUser()` (line 713-728), when a membership is lost, it calls `this.storage.deleteAllOwnedBy(ship.group)` to purge cached entities. However:

1. **`OfflineStorage.deleteAllOwnedBy()`** (line 297-318) deletes from `element_entities`, `list_entities`, and `ranges` tables but does NOT delete from `lastUpdateBatchIdPerGroupId` table.

2. **`EphemeralCacheStorage`** has additional problems:
   - `putLastBatchIdForGroup()` (line 219-221) is a no-op — doesn't store batch IDs
   - `getLastBatchIdForGroup()` (line 215-217) always returns `null` — doesn't retrieve stored batch IDs
   - `deleteAllOwnedBy()` (line 254-276) doesn't clear batch IDs for the lost group

## Changes Made

### `src/api/worker/offline/OfflineStorage.ts`
- **`deleteAllOwnedBy`** (line 297): Added `DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${owner}` as the first operation before deleting entities.

### `src/api/worker/rest/EphemeralCacheStorage.ts`
1. **Line 31**: Added `private lastBatchIdPerGroup: Map<Id, Id> = new Map()` field
2. **Line 42**: Added `this.lastBatchIdPerGroup.clear()` in `deinit`
3. **Line 217-218**: `getLastBatchIdForGroup` now returns `this.lastBatchIdPerGroup.get(groupId) ?? null` instead of always `null`
4. **Line 221-222**: `putLastBatchIdForGroup` now calls `this.lastBatchIdPerGroup.set(groupId, batchId)` instead of no-op
5. **Line 227**: `purgeStorage` now calls `this.lastBatchIdPerGroup.clear()`
6. **Line 259**: `deleteAllOwnedBy` now calls `this.lastBatchIdPerGroup.delete(owner)`

No changes needed to `CacheStorageProxy` — it delegates all methods to the underlying storage.

## Verification
- Run `test/tests/api/worker/rest/EntityRestCacheTest.js` test suite
- After fix, tests that assert `getLastBatchIdForGroup(calendarGroupId).equals(null)` after membership change should pass
- Tests that assert `getLastBatchIdForGroup(calendarGroupId).notEquals(null)` when no membership change occurred should pass
