# Diagnosis: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Symptom
When a user's membership is removed from a group (calendar group), the entry in `lastUpdateBatchIdPerGroup` (stored in `lastUpdateBatchIdPerGroupId` table) for that group is NOT deleted. This happens in the `entityEventsReceived` flow when processing a User UPDATE that indicates membership loss. The test patch adds assertions expecting `storage.getLastBatchIdForGroup(calendarGroupId)` to return `null` after membership loss — but currently it still returns the stored batch ID.

## Root Cause
In `DefaultEntityRestCache.entityEventsReceived` (around line 626), when a User entity UPDATE is processed and membership loss is detected, the code calls `evictByGroupMembership()` which:
1. Deletes group roots owned by the lost group
2. Deletes list elements owned by the lost group  
3. Deletes range metadata for lists owned by the lost group

**BUT it does NOT delete the `lastUpdateBatchIdPerGroup` entry for that group.** There is no call to `storage.deleteLastBatchIdForGroup` (or equivalent) when evicting by group membership.

## Candidate Fixes

### Option A: Add delete method to CacheStorage interface (preferred)
1. Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` to the `CacheStorage` interface in `CacheStorageProxy.ts`
2. Implement it in `OfflineStorage.ts` using `DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ?`
3. Implement it in `EphemeralCacheStorage.ts` (no-op, since batch IDs aren't tracked there)
4. Call it in `evictByGroupMembership()` in `DefaultEntityRestCache.ts` after other deletions

### Option B: Pass group ID to existing delete method
If `deleteIfExists` or another existing method could be extended to also clear batch IDs, that would be simpler. However, `deleteIfExists` is per-entity, not per-group, so this doesn't fit well.

### Option C: Add batch ID clearing directly in evictByGroupMembership
Skip the interface method and directly call `storage.putLastBatchIdForGroup(groupId, '') ` or create a new direct SQL call. This is less clean but requires fewer file changes.

## Verification
The test patch modifies 3 tests in the `"membership changes"` suite:
1. "no membership change does not delete an entity" → adds `putLastBatchIdForGroup` then asserts batch ID still exists (not null)
2. "membership change deletes an element entity" → adds `putLastBatchIdForGroup` then asserts batch ID is null after membership loss
3. "membership change deletes a list entity" → adds `putLastBatchIdForGroup` then asserts batch ID is null after membership loss

Fix must make assertions #2 and #3 pass (batch ID becomes null when membership is lost).
