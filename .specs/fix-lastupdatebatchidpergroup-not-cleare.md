# Fix: lastUpdateBatchIdPerGroup Not Cleared After Membership Loss

## Diagnosis

**Symptom**: When a user loses a group membership (e.g., removed from a calendar group), the `lastUpdateBatchIdPerGroup` entry for that group is not deleted. This causes the system to continue attempting to download event batches for a group the user no longer belongs to.

**Root Cause**: In `DefaultEntityRestCache.handleUpdatedUser()`, when a membership is lost, `this.storage.deleteAllOwnedBy(ship.group)` is called to clean up cached entities. However, `deleteAllOwnedBy` implementations only deleted entity data (elements, list entities, ranges) — they did NOT delete the `lastUpdateBatchIdPerGroup` entry for the removed group.

**Affected code paths**:
- `DefaultEntityRestCache.ts:726` calls `deleteAllOwnedBy(ship.group)` on membership loss
- `OfflineStorage.ts:297` — `deleteAllOwnedBy()` was missing batch ID cleanup
- `EphemeralCacheStorage.ts:254` — `deleteAllOwnedBy()` was missing batch ID cleanup

## Fix Applied

**File 1: `src/api/worker/offline/OfflineStorage.ts`**
Added at end of `deleteAllOwnedBy()` method (after existing blocks):
```typescript
{
    // delete the last batch id for the group as it's no longer relevant without membership
    const {query, params} = sql`DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${owner}`
    await this.sqlCipherFacade.run(query, params)
}
```

**File 2: `src/api/worker/rest/EphemeralCacheStorage.ts`**
Added at end of `deleteAllOwnedBy()` method:
```typescript
this.lastUpdateBatchIdPerGroup.delete(owner)
```

## Verification

- `CacheStorageProxy.ts` delegates to inner storage — no changes needed
- `CacheStorage` interface already includes `lastUpdateBatchIdPerGroup` persistence
- Both storage implementations now clean up batch IDs on membership loss
- Test: `test/tests/api/worker/rest/EntityRestCacheTest.ts` — membership change tests will verify cleanup