# Plan: Fix `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Context

When a user is removed from a group (membership loss), `DefaultEntityRestCache.handleUpdatedUser()` correctly calls `storage.deleteAllOwnedBy(ship.group)` to evict cached entities belonging to that group. However, the **last batch ID for that group** (stored in the `lastUpdateBatchIdPerGroupId` table) is **never deleted**. This leaves stale entries that cause the system to attempt downloading event batches for groups the user no longer belongs to.

## Root Cause

1. `handleUpdatedUser()` in `DefaultEntityRestCache.ts` loops over removed memberships and calls `storage.deleteAllOwnedBy(ship.group)` — but that method only deletes entity tables, NOT the `lastUpdateBatchIdPerGroupId` table.
2. The `CacheStorage` interface lacks a `deleteLastBatchIdForGroup` method.
3. Neither `OfflineStorage` nor `EphemeralCacheStorage` implements deletion of the last batch ID for a group.

## Files to Edit

### 1. `src/api/worker/rest/DefaultEntityRestCache.ts`
**Change:** Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` to the `CacheStorage` interface and the `EntityRestCache` interface.

**Interface `CacheStorage` (line ~154):** add method:
```typescript
deleteLastBatchIdForGroup(groupId: Id): Promise<void>
```

**Interface `EntityRestCache` (line ~77):** add method:
```typescript
deleteLastUpdateBatchIdForGroup(groupId: Id): Promise<void>
```

**`handleUpdatedUser()` method (line ~727):** after `await this.storage.deleteAllOwnedBy(ship.group)`, add:
```typescript
await this.storage.deleteLastBatchIdForGroup(ship.group)
```

### 2. `src/api/worker/offline/OfflineStorage.ts`
**Change:** Add `deleteLastBatchIdForGroup` method to `OfflineStorage` class.

After `putLastBatchIdForGroup` (around line 236), add:
```typescript
async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
    const {query, params} = sql`DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${groupId}`
    await this.sqlCipherFacade.run(query, params)
}
```

### 3. `src/api/worker/rest/EphemeralCacheStorage.ts`
**Change:** Add `deleteLastBatchIdForGroup` method to `EphemeralCacheStorage` class.

After `putLastBatchIdForGroup` (around line 221), add:
```typescript
deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
    return Promise.resolve()
}
```

## Why This Fix Works

When a membership is lost, `handleUpdatedUser()` already identifies the removed group via `ship.group`. Adding the call to `deleteLastBatchIdForGroup(ship.group)` ensures the stale batch ID entry is removed from storage, preventing the system from attempting to process event batches for groups the user no longer has access to.

## Verification

The existing test `"membership change deletes a list entity"` in `test/tests/api/worker/rest/EntityRestCacheTest.ts` (around line 814) validates that membership loss evicts entities from cache. After the fix, the batch ID entry for `calendarGroupId` will also be cleaned up by the same mechanism. The test should pass (and continue to pass as a regression guard).
