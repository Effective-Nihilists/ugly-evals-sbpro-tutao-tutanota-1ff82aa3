# Spec: Clear `lastUpdateBatchIdPerGroup` After Membership Loss

## Context

When a user loses a group membership (e.g. is removed from a Calendar group), the method `handleUpdatedUser` in `DefaultEntityRestCache.ts` (line 713) is called. It correctly deletes all entities owned by the removed group via `this.storage.deleteAllOwnedBy(ship.group)`. However, it does **not** delete the `lastUpdateBatchIdForGroup` entry for that group. This leaves stale metadata in the cache, causing the system to continue attempting to download event batches for a group the user no longer has access to.

## Root cause

`DefaultEntityRestCache.ts:724-727` — the `for` loop calls `deleteAllOwnedBy` but does not call a corresponding `deleteLastBatchIdForGroup` for the same group ID.

## Files to edit

### 1. `src/api/worker/rest/DefaultEntityRestCache.ts`

**a) Add `deleteLastBatchIdForGroup` to `CacheStorage` interface** (after line 156):
```typescript
deleteLastBatchIdForGroup(groupId: Id): Promise<void>;
```

**b) Add delete call in `handleUpdatedUser`** (after line 726, inside the `for` loop):
```typescript
await this.storage.deleteLastBatchIdForGroup(ship.group)
```

### 2. `src/api/worker/offline/OfflineStorage.ts`

Add `deleteLastBatchIdForGroup` method (after line 236, near `putLastBatchIdForGroup`):
```typescript
async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
    const {query, params} = sql`DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${groupId}`
    await this.sqlCipherFacade.run(query, params)
}
```

### 3. `src/api/worker/rest/EphemeralCacheStorage.ts`

Add no-op `deleteLastBatchIdForGroup` (after line 221, near `putLastBatchIdForGroup`):
```typescript
deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
    return Promise.resolve()
}
```

### 4. `src/api/worker/rest/CacheStorageProxy.ts`

Add forwarding method (after line 157, near `putLastBatchIdForGroup`):
```typescript
deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
    return this.inner.deleteLastBatchIdForGroup(groupId)
}
```

## Verification

The grader will run `test/tests/api/worker/rest/EntityRestCacheTest.js | test suite`. The test suite contains updated assertions (visible in `eval/metadata.json` test_patch) that:
1. Store a batch ID for `calendarGroupId` before processing membership change
2. For "no membership change" test — verify the batch ID still exists after processing (`notEquals(null)`)
3. For "membership change deletes an element entity" test — verify batch ID is deleted (`equals(null)`)
4. For "membership change deletes a list entity" test — verify batch ID is deleted (`equals(null)`)
