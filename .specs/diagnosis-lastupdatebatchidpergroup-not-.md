# Diagnosis: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Symptom
When a user's membership in a group is removed, the system evicts cached entities owned by that group (via `deleteAllOwnedBy`) but **does not** delete the corresponding entry in `lastUpdateBatchIdPerGroupId`. This can cause unnecessary event batch processing attempts for groups the user no longer has access to.

## Root Cause
The `handleUpdatedUser` method in `DefaultEntityRestCache.ts` (lines 715-731) correctly calls `this.storage.deleteAllOwnedBy(ship.group)` when a membership is removed, but it was missing a call to delete the batch ID tracking for that group.

## Candidate Fixes

### Fix 1: Add `deleteLastBatchIdForGroup` method to CacheStorage interface and implementations (✓ implemented)
- **Approach**: Add a new method `deleteLastBatchIdForGroup(groupId: Id)` to the `CacheStorage` interface and implement it in:
  - `OfflineStorage.ts` — executes `DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ?`
  - `EphemeralCacheStorage.ts` — no-op stub (ephemeral cache doesn't persist batch IDs)
  - `CacheStorageProxy.ts` — delegates to inner storage
- Then call it from `handleUpdatedUser` alongside `deleteAllOwnedBy`
- **Tradeoffs**: Clean, surgical fix. No API changes needed beyond the new method.
- **Risks**: None — the method is purely additive.

### Fix 2: Inline SQL delete in `handleUpdatedUser`
- Directly delete the batch ID entry without abstracting the method.
- **Tradeoffs**: Simpler but couples the logic to `OfflineStorage`'s table structure. Not viable if the storage abstraction ever changes.

## Verdict
**Fix 1** is the correct approach. It follows the existing pattern (see `putLastBatchIdForGroup` / `getLastBatchIdForGroup`) and properly abstracts the operation across all storage implementations.

## Files Changed
- `src/api/worker/rest/DefaultEntityRestCache.ts` — added method to interface + call in `handleUpdatedUser`
- `src/api/worker/offline/OfflineStorage.ts` — added implementation
- `src/api/worker/rest/EphemeralCacheStorage.ts` — added stub
- `src/api/worker/rest/CacheStorageProxy.ts` — added delegation
