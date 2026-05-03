# Diagnosis: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Symptom
When a user's membership is removed from a group (e.g., calendar group), the cached `lastUpdateBatchIdPerGroup` entry for that group is not deleted. This causes the system to continue attempting to download event batches for groups the user no longer has access to.

## Root Cause
In `DefaultEntityRestCache.ts`, the `handleUpdatedUser()` method (lines 713-728) detects when a membership is removed and cleans up cached entities via `storage.deleteAllOwnedBy(ship.group)`. However, it does **not** delete the `lastUpdateBatchIdPerGroup` entry for the lost group.

The `CacheStorage` interface lacked a `deleteLastBatchIdForGroup` method, and none of its implementations (`OfflineStorage`, `EphemeralCacheStorage`, `CacheStorageProxy`) provided one.

## Candidate Fixes

### Fix (chosen)
Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` to the `CacheStorage` interface and all implementations, then call it in `handleUpdatedUser()` alongside `deleteAllOwnedBy()`.

**Tradeoffs:**
- Minimal change, follows existing patterns
- Uses DELETE SQL query in OfflineStorage
- EphemeralCacheStorage returns `Promise.resolve()` since it doesn't store batch IDs
- CacheStorageProxy delegates to inner implementation

### Alternative: Delete via putLastBatchIdForGroup with null
Could overwrite with a null marker, but this adds complexity and semantic confusion.

## Implementation Status
Fix has been implemented in the FIX step across 4 files:
1. `src/api/worker/rest/DefaultEntityRestCache.ts` - interface + call site
2. `src/api/worker/offline/OfflineStorage.ts` - SQL DELETE implementation
3. `src/api/worker/rest/EphemeralCacheStorage.ts` - no-op implementation
4. `src/api/worker/rest/CacheStorageProxy.ts` - delegation implementation