# Diagnosis: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Symptom

When a user loses a group membership, the `lastUpdateBatchIdPerGroup` entry for that group is not deleted. This causes the system to continue downloading event batches for groups the user no longer has access to.

## Root Cause

The `DefaultEntityRestCache` correctly evicts entities owned by a lost group (via `evictCacheForGroup` / `deleteAllOwnedBy`), but **does not delete the `lastUpdateBatchIdPerGroup` entry** for the removed group.

Key evidence:
- `OfflineStorage.putLastBatchIdForGroup` (line 233) uses `INSERT OR REPLACE` — no corresponding `DELETE` method exists
- `EphemeralCacheStorage.putLastBatchIdForGroup` (line 219) is a no-op — no corresponding `DELETE` method exists
- `CacheStorageProxy` proxies the put but has no delete method
- The `offline-v1.ts` migration (line 23) only deletes via raw SQL — not triggered by membership changes

The membership-change handling in `DefaultEntityRestCache.entityEventsReceived` → `_handleMembershipUpdate` evicts entities but never calls a `deleteLastBatchIdForGroup` on storage.

## Candidate Fixes

### Option A: Add `deleteLastBatchIdForGroup` to all storage implementations + call from cache
1. Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` to `CacheStorage` interface
2. Implement in `OfflineStorage.ts` — `DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ?`
3. Implement in `EphemeralCacheStorage.ts` — no-op return
4. Implement in `CacheStorageProxy.ts` — proxy call
5. Implement in `AdminClientDummyEntityRestCache.ts` — no-op
6. Call `this.storage.deleteLastBatchIdForGroup(calendarGroupId)` in `_handleMembershipUpdate` when membership is removed

### Option B: Call DELETE SQL directly in `_handleMembershipUpdate` via storage
- Pass the sqlCipherFacade to allow raw DELETE — less clean, couples cache to DB

**Option A is the correct approach** — add the delete method to the storage interface and call it from the cache's membership-change handler.

## Impact
- Fixes ticket: `lastUpdateBatchIdPerGroup` will be cleaned up when membership is lost
- The `entityEventsReceived` test suite's membership tests verify entity/list eviction — no test currently asserts `lastUpdateBatchIdPerGroup` is cleared (which is why the bug was introduced unnoticed)
