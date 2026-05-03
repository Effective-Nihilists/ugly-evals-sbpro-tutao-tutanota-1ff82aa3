# Diagnosis: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Symptom
When a user loses membership in a group, the mapping `lastUpdateBatchIdPerGroupId` is not deleted. The system may continue trying to download event batches for groups the user no longer belongs to.

## Root Cause
In `DefaultEntityRestCache.handleUpdatedUser()` (line 713-728), when a membership is lost, it calls `this.storage.deleteAllOwnedBy(ship.group)` to purge cached entities. However:

1. **`OfflineStorage.deleteAllOwnedBy()`** (line 297-318) deletes from `element_entities`, `list_entities`, and `ranges` tables but does NOT delete from `lastUpdateBatchIdPerGroupId` table.

2. **`EphemeralCacheStorage`** has additional problems:
   - `putLastBatchIdForGroup()` (line 219-221) is a no-op — doesn't store batch IDs
   - `getLastBatchIdForGroup()` (line 215-217) always returns `null` — doesn't retrieve stored batch IDs
   - `deleteAllOwnedBy()` (line 254-276) doesn't clear batch IDs for the lost group

## Candidate Fix

### Fix 1: Clear batch ID in `deleteAllOwnedBy` (chosen)
Add batch ID deletion in the `deleteAllOwnedBy` method of both storage implementations:

- **`OfflineStorage.deleteAllOwnedBy`**: Add `DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${owner}` before deleting entities.
- **`EphemeralCacheStorage`**: 
  1. Add a `Map<Id, Id>` field `lastBatchIdPerGroup` to store batch IDs
  2. Implement `putLastBatchIdForGroup` to store in the map
  3. Implement `getLastBatchIdForGroup` to retrieve from the map
  4. In `deleteAllOwnedBy`, delete from the map: `this.lastBatchIdPerGroup.delete(owner)`

### Tradeoffs
- This approach uses the existing `deleteAllOwnedBy` flow, keeping changes minimal
- Alternative: add a new method like `deleteLastBatchIdForGroup` called separately in `handleUpdatedUser` — more verbose, duplicates the iteration

## Verification
- Run `test/tests/api/worker/rest/EntityRestCacheTest.js` test suite
- After fix, tests that assert `getLastBatchIdForGroup(calendarGroupId).equals(null)` after membership change should pass
- Tests that assert `getLastBatchIdForGroup(calendarGroupId).notEquals(null)` when no membership change occurred should pass
