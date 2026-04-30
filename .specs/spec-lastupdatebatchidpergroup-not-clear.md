# SPEC — `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Context

When a user's membership in a group is revoked (e.g., removed from a calendar group), the `DefaultEntityRestCache` correctly calls `storage.deleteAllOwnedBy(ship.group)` to purge cached entities belonging to that group. However, it fails to also delete the `lastUpdateBatchIdPerGroup` entry for the lost group. This stale entry can cause the system to attempt downloading event batches for a group the user no longer has access to.

The `CacheStorage` interface already has `putLastBatchIdForGroup` and `getLastBatchIdForGroup` but is missing a deletion method.

## Fix Plan

### Step 1 — Add `deleteLastBatchIdForGroup` to `CacheStorage` interface (`src/api/worker/rest/DefaultEntityRestCache.ts`)

Add to the `CacheStorage` interface (near line 156, after `getLastBatchIdForGroup`):
```typescript
deleteLastBatchIdForGroup(groupId: Id): Promise<void>
```

### Step 2 — Implement `deleteLastBatchIdForGroup` in `OfflineStorage` (`src/api/worker/offline/OfflineStorage.ts`)

Add method after `getLastBatchIdForGroup` (around line 233):
```typescript
async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
    const {query, params} = sql`DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${groupId}`
    await this.sqlCipherFacade.run(query, params)
}
```

### Step 3 — Implement `deleteLastBatchIdForGroup` in `EphemeralCacheStorage` (`src/api/worker/rest/EphemeralCacheStorage.ts`)

Add method to delete from the `lastUpdateBatchIdPerGroup` Map. Need to check exact Map variable name (likely `this.lastUpdateBatchIdPerGroup` or similar).

### Step 4 — Implement `deleteLastBatchIdForGroup` in `CacheStorageProxy` (`src/api/worker/rest/CacheStorageProxy.ts`)

Delegate to `this.target.deleteLastBatchIdForGroup(groupId)`.

### Step 5 — Call `deleteLastBatchIdForGroup` in `handleUpdatedUser` (`src/api/worker/rest/DefaultEntityRestCache.ts`)

In `handleUpdatedUser` (line 726), after `await this.storage.deleteAllOwnedBy(ship.group)`, add:
```typescript
await this.storage.deleteLastBatchIdForGroup(ship.group)
```

## Verification

Run the `EntityRestCacheTest` test suite. The three membership-change tests will pass:
- "no membership change does not delete an entity and lastUpdateBatchIdPerGroup" — asserts `getLastBatchIdForGroup(calendarGroupId)` is NOT null after membership unchanged
- "membership change deletes an element entity and lastUpdateBatchIdPerGroup" — asserts `getLastBatchIdForGroup(calendarGroupId)` IS null after membership lost
- "membership change deletes a list entity and lastUpdateBatchIdPerGroup" — asserts `getLastBatchIdForGroup(calendarGroupId)` IS null after membership lost