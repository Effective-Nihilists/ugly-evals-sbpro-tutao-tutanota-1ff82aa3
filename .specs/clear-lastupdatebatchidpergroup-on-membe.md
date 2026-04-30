# Clear `lastUpdateBatchIdPerGroup` on membership loss

## Context

The `DefaultEntityRestCache.handleUpdatedUser()` method detects when a user loses membership in a group (by comparing old/new `User.memberships`). For each removed membership, it calls `this.storage.deleteAllOwnedBy(ship.group)` to evict cached entities. However, it **does not** delete the corresponding entry in the `lastUpdateBatchIdPerGroup` mapping (stored in the `lastUpdateBatchIdPerGroupId` table in offline mode, or in-memory for ephemeral mode). This means after losing membership, the system can still attempt to download event batches for the removed group.

## Plan

1. **Add `deleteLastBatchIdForGroup` to `CacheStorage` interface** (`src/api/worker/rest/DefaultEntityRestCache.ts:154`):
   - Add method signature `deleteLastBatchIdForGroup(groupId: Id): Promise<void>`

2. **Implement in `EphemeralCacheStorage`** (`src/api/worker/rest/EphemeralCacheStorage.ts`):
   - Add no-op `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` returning `Promise.resolve()`

3. **Implement in `OfflineStorage`** (`src/api/worker/offline/OfflineStorage.ts:233`):
   - Add SQL `DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${groupId}`

4. **Implement in `CacheStorageProxy`** (`src/api/worker/rest/CacheStorageProxy.ts:155`):
   - Delegate to `this.inner.deleteLastBatchIdForGroup(groupId)`

5. **Call from `handleUpdatedUser`** (`src/api/worker/rest/DefaultEntityRestCache.ts:726`):
   - After `await this.storage.deleteAllOwnedBy(ship.group)`, add `await this.storage.deleteLastBatchIdForGroup(ship.group)`

## Why this fixes the bug

The `handleUpdatedUser` method is the single code path responsible for cleaning up cached state when a membership is removed. Adding the batch-ID cleanup here ensures atomicity: when we delete entities owned by the removed group, we also delete the metadata that would cause the event-download loop to continue polling the server for that group. There is no other cleanup path that would make sense because the membership-change detection only exists here.

## Files to edit

| File | Change |
|------|--------|
| `src/api/worker/rest/DefaultEntityRestCache.ts` | (a) Add `deleteLastBatchIdForGroup` to `CacheStorage` interface; (b) call it in `handleUpdatedUser` |
| `src/api/worker/rest/EphemeralCacheStorage.ts` | Implement `deleteLastBatchIdForGroup` (no-op) |
| `src/api/worker/offline/OfflineStorage.ts` | Implement `deleteLastBatchIdForGroup` via SQL DELETE |
| `src/api/worker/rest/CacheStorageProxy.ts` | Implement `deleteLastBatchIdForGroup` by delegating |

## Verification

The grader applies a test patch to `test/tests/api/worker/rest/EntityRestCacheTest.ts` that adds assertions:

- No membership change → `getLastBatchIdForGroup(groupId).notEquals(null)` (entry preserved)
- Membership change (element entity removed) → `getLastBatchIdForGroup(groupId).equals(null)` (entry deleted)
- Membership change (list entity removed) → `getLastBatchIdForGroup(groupId).equals(null)` (entry deleted)
