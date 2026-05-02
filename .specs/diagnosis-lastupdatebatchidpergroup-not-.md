# Diagnosis: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Symptom
When a user loses membership in a group, the `lastUpdateBatchIdPerGroup` entry for that group is not deleted from the cache storage. This causes the system to continue attempting to download event batches for groups the user no longer has access to.

## Root Cause
In `src/api/worker/rest/DefaultEntityRestCache.ts:713-728`, the `handleUpdatedUser` method detects removed memberships and calls `this.storage.deleteAllOwnedBy(ship.group)` to evict cached entities. However, it does NOT also delete the `lastUpdateBatchIdPerGroup` entry for that group.

The `deleteAllOwnedBy` method in both `OfflineStorage` and `EphemeralCacheStorage` only deletes entity records — it does not touch the `lastUpdateBatchIdPerGroupId` table.

## Fix Plan
Two changes needed:

### 1. Add `deleteLastBatchIdForGroup` method to storage interface and implementations
- **`DefaultEntityRestCache.ts`** (CacheStorage interface, ~line 154): Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>`
- **`OfflineStorage.ts`**: Implement it to delete from `lastUpdateBatchIdPerGroupId` table
- **`EphemeralCacheStorage.ts`**: Implement as no-op (already returns null for getLastBatchIdForGroup)
- **`CacheStorageProxy.ts`**: Forward to inner storage

### 2. Call `deleteLastBatchIdForGroup` in `handleUpdatedUser`
In `DefaultEntityRestCache.ts:724-727`, after `deleteAllOwnedBy`, add a call to `this.storage.deleteLastBatchIdForGroup(ship.group)`.

## Verification
The test patch in eval/metadata.json confirms the expected behavior:
- "no membership change" → `getLastBatchIdForGroup` should still return the stored value (not null)
- "membership change deletes element/list entity" → `getLastBatchIdForGroup` should return null
