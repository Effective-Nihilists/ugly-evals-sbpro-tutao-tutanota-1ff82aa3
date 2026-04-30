# Spec: lastUpdateBatchIdPerGroup Not Cleared After Membership Loss

## Context

When a user's membership in a group is removed (e.g., removed from a calendar group), the `lastUpdateBatchIdPerGroup` mapping in the cache storage is not deleted. This causes the system to potentially try to download event batches for groups the user no longer has access to.

## Root Cause

In `DefaultEntityRestCache.handleUpdatedUser()` (`src/api/worker/rest/DefaultEntityRestCache.ts:713-728`), when a membership is lost, the code calls `this.storage.deleteAllOwnedBy(ship.group)` to delete all cached entities owned by the removed group, but it **never deletes the `lastUpdateBatchIdPerGroup` entry** for that group ID.

The `CacheStorage` interface lacks a `deleteLastBatchIdForGroup` method entirely — it only has `putLastBatchIdForGroup` and `getLastBatchIdForGroup`.

## Files to Edit

### 1. `src/api/worker/rest/DefaultEntityRestCache.ts` — Add method to `CacheStorage` interface and call it in `handleUpdatedUser`

**Interface change** (after line 156, after `getLastBatchIdForGroup`):
```
deleteLastBatchIdForGroup(groupId: Id): Promise<void>;
```

**Implementation change** in `handleUpdatedUser` (around line 726, after `deleteAllOwnedBy`):
```typescript
await this.storage.deleteLastBatchIdForGroup(ship.group)
```

### 2. `src/api/worker/rest/EphemeralCacheStorage.ts` — Implement stub

**Add after `putLastBatchIdForGroup` method (around line 220):**
```typescript
deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
    return Promise.resolve()
}
```

### 3. `src/api/worker/offline/OfflineStorage.ts` — Implement real deletion

**Add method after `putLastBatchIdForGroup` (around line 236):**
```typescript
async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
    const {query, params} = sql`DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${groupId}`
    await this.sqlCipherFacade.run(query, params)
}
```

### 4. `src/api/worker/rest/CacheStorageProxy.ts` — Forward to inner storage

**Add method after `putLastBatchIdForGroup` (around line 157):**
```typescript
deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
    return this.inner.deleteLastBatchIdForGroup(groupId)
}
```

## Why This Fix Addresses the Bug

The fix adds a `deleteLastBatchIdForGroup` method to `CacheStorage` and all its implementations. When `handleUpdatedUser` detects a lost membership, it now calls this method to delete the stale batch ID entry. Without the batch ID entry, the system will not attempt to download event batches for groups the user no longer has access to.

## Verification

After applying the fix, run:
```
npm exec ospec test/tests/api/worker/rest/EntityRestCacheTest.ts
```

The three "membership changes" tests must pass:
- "no membership change does not delete an entity and lastUpdateBatchIdPerGroup" — batch ID NOT deleted when membership unchanged
- "membership change deletes an element entity and lastUpdateBatchIdPerGroup" — batch ID IS deleted when membership lost  
- "membership change deletes a list entity and lastUpdateBatchIdPerGroup" — batch ID IS deleted when membership lost
