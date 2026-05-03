# Diagnosis: lastUpdateBatchIdPerGroup Not Cleared After Membership Loss

## Symptom
When a user's membership is removed from a group (e.g., calendar group), the `lastUpdateBatchIdPerGroup` entry for that group is not deleted. This causes the system to continue attempting to download event batches for groups the user is no longer a member of.

## Root Cause
In `src/api/worker/offline/OfflineStorage.ts`, the `deleteAllOwnedBy()` method (line 297) deletes:
1. All entities owned by the removed group from `element_entities`
2. All list entities owned by the removed group, plus their ranges

**Missing**: The batch ID tracking entry for the group in `lastUpdateBatchIdPerGroupId` table is NOT deleted.

When a user loses membership, `handleUpdatedUser()` in `DefaultEntityRestCache.ts` calls `deleteAllOwnedBy(ship.group)`, but the batch ID remains, causing stale references.

## Candidate Fixes

### Option A: Add batch ID cleanup in OfflineStorage.deleteAllOwnedBy()
Add a DELETE query for `lastUpdateBatchIdPerGroupId WHERE groupId = {owner}` after the existing deletions in `OfflineStorage.ts`.

**Pros**: 
- Fixes the issue in the implementation that uses SQLite
- Minimal, targeted change

**Cons**: 
- Only fixes offline storage, EphemeralCacheStorage also needs the same fix

### Option B: Add cleanup in DefaultEntityRestCache.handleUpdatedUser()
Call `this.storage.deleteBatchIdForGroup(ship.group)` after `deleteAllOwnedBy()` in `handleUpdatedUser()`.

**Pros**: 
- Handles the cleanup at the cache layer
- Works for all storage implementations

**Cons**: 
- Requires adding a new storage method
- More indirect

### Option C: Add to both OfflineStorage and EphemeralCacheStorage
Implement the batch ID cleanup in `deleteAllOwnedBy()` for both storage implementations.

**Pros**: 
- Most complete fix
- Follows existing pattern

**Cons**: 
- More code to change

## Recommended Fix (Option A)
Add the missing DELETE query in `OfflineStorage.deleteAllOwnedBy()` and a corresponding cleanup in `EphemeralCacheStorage`.

## Verification
After fix, the membership change tests in `EntityRestCacheTest.ts` should pass, specifically the tests in the "membership changes" spec (lines 723-914) which test that elements are properly evicted when membership is lost.