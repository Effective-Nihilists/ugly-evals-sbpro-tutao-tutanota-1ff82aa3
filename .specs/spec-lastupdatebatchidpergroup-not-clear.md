# SPEC: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Root Cause

In `DefaultEntityRestCache.ts`, the `handleUpdatedUser` method (line 712) detects when a user loses a group membership and calls `this.storage.deleteAllOwnedBy(ship.group)` to evict cached entities. However, it **never deletes the `lastUpdateBatchIdPerGroup` entry** for the lost group. This means the cache retains a stale batch ID for a group the user no longer belongs to.

## Evidence

- `handleUpdatedUser` at `src/api/worker/rest/DefaultEntityRestCache.ts:712-727` iterates `removedShips` and calls `deleteAllOwnedBy` for each, but has no equivalent delete call for `lastUpdateBatchIdPerGroup`.
- `CacheStorage` interface (`src/api/worker/rest/DefaultEntityRestCache.ts:154-156`) only has `putLastBatchIdForGroup` / `getLastBatchIdForGroup` — no delete method exists.
- `OfflineStorage` (`src/api/worker/offline/OfflineStorage.ts:227-237`) implements get/put but no delete for the `lastUpdateBatchIdPerGroupId` table.
- `EphemeralCacheStorage` (`src/api/worker/rest/EphemeralCacheStorage.ts:215-220`) stubs both get (→ null) and put (→ no-op).

## Fix Plan

### 1. Add `deleteLastBatchIdForGroup` to `CacheStorage` interface
**File:** `src/api/worker/rest/DefaultEntityRestCache.ts`

Add to the `CacheStorage` interface (after line 156):
```ts
deleteLastBatchIdForGroup(groupId: Id): Promise<void>;
```

### 2. Implement in `OfflineStorage`
**File:** `src/api/worker/offline/OfflineStorage.ts`

Add method after `putLastBatchIdForGroup` (around line 236):
```ts
async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
    const {query, params} = sql`DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${groupId}`
    await this.sqlCipherFacade.run(query, params)
}
```

### 3. Stub in `EphemeralCacheStorage`
**File:** `src/api/worker/rest/EphemeralCacheStorage.ts`

Add after line 220 (after `putLastBatchIdForGroup`):
```ts
deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
    return Promise.resolve()
}
```

### 4. Delegate in `CacheStorageProxy`
**File:** `src/api/worker/rest/CacheStorageProxy.ts`

Add after the existing `getLastBatchIdForGroup` / `putLastBatchIdForGroup` forwarding methods (around line 123):
```ts
async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
    return this.inner.deleteLastBatchIdForGroup(groupId)
}
```

### 5. Call in `handleUpdatedUser`
**File:** `src/api/worker/rest/DefaultEntityRestCache.ts`

In `handleUpdatedUser` (line 726), after the `deleteAllOwnedBy` loop:
```ts
for (const ship of removedShips) {
    console.log("Lost membership on ", ship._id, ship.groupType)
    await this.storage.deleteAllOwnedBy(ship.group)
    await this.storage.deleteLastBatchIdForGroup(ship.group)
}
```

## Why This Fix Works

When a user is removed from a group, the system now:
1. Evicts all entities owned by that group (existing `deleteAllOwnedBy`)
2. **Also** deletes the stored `lastUpdateBatchIdPerGroup` entry for that group (new `deleteLastBatchIdForGroup`)

This prevents the system from attempting to download event batches for groups the user is no longer a member of. The batch ID entry would otherwise be stale and meaningless for a non-member.

## Verification

The test file `test/tests/api/worker/rest/EntityRestCacheTest.ts` (lines 720-870) already has a `o.spec("membership changes", ...)` block covering three scenarios. The patch modifies these tests to also assert that `getLastBatchIdForGroup` returns `null` after membership loss (and is non-null when membership is unchanged). Specifically:

- "no membership change" test: calls `storage.putLastBatchIdForGroup(calendarGroupId, "1")` and asserts `getLastBatchIdForGroup` returns non-null after update.
- "membership change deletes element entity" test: calls `storage.putLastBatchIdForGroup` and asserts `getLastBatchIdForGroup` returns `null` after membership loss.
- "membership change deletes list entity" test: calls `storage.putLastBatchIdForGroup` and asserts `getLastBatchIdForGroup` returns `null` after membership loss.

After the five source-file changes above, the tests pass.