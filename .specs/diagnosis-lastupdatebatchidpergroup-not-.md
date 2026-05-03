# Diagnosis: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Symptom
When a user's group membership is removed (via a `User` entity update), the `lastUpdateBatchIdPerGroup` entry for the removed group is **not deleted**. The system continues tracking batch IDs for groups the user no longer belongs to.

## Root Cause
In `DefaultEntityRestCache.ts`, the `handleUpdatedUser` method correctly identifies removed memberships and cleans up entities owned by the lost group via `deleteAllOwnedBy(groupId)`, but it **never deletes** the corresponding `lastUpdateBatchIdPerGroupId` table entry.

The `lastUpdateBatchIdPerGroup` table tracks the last processed event batch per group for the cache. When membership is lost, this mapping becomes stale and must be cleaned up — both to avoid wasted processing and to prevent the cache from attempting to download event batches for groups the user is no longer a member of.

## Candidate Fixes

### Fix: Add `deleteLastBatchIdForGroup` call in `handleUpdatedUser`
**Approach**: Add `await this.storage.deleteLastBatchIdForGroup(ship.group)` alongside the existing `deleteAllOwnedBy` call.

**Changes required**:
1. Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` to the `CacheStorage` interface
2. Implement in `OfflineStorage.ts` with SQL: `DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ?`
3. Implement in `EphemeralCacheStorage.ts` as a no-op (ephemeral storage doesn't persist)
4. Implement in `CacheStorageProxy.ts` as a passthrough to inner storage
5. Call `this.storage.deleteLastBatchIdForGroup(ship.group)` in `handleUpdatedUser`

**Tradeoffs**:
- Minimal: single new method per storage implementation, one additional await in existing loop
- No impact on performance — membership loss is already an expensive operation
- Correctly scoped — only affects groups the user actually lost membership in

**Fix status**: Already implemented in the FIX step.