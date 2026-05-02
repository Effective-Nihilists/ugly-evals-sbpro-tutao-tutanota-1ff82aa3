# Clearing `lastUpdateBatchIdPerGroup` on membership loss

## Diagnosis

**Symptom**: When a user loses membership in a group (e.g. calendar group), the cached entities owned by that group are correctly evicted via `deleteAllOwnedBy(ship.group)`, but the `lastUpdateBatchIdPerGroup` row in `OfflineStorage` (or the ephemeral equivalent) is NOT cleared. This leaves stale batch IDs referencing groups the user no longer has access to.

**Root cause**: In `DefaultEntityRestCache.ts` method `handleUpdatedUser()` (line 713-728), when membership changes are detected, only `this.storage.deleteAllOwnedBy(ship.group)` is called. There is no corresponding deletion of the batch ID for that group.

**Evidence**:
- `handleUpdatedUser()` calls `deleteAllOwnedBy` in a loop over removed memberships, but never calls a "delete batch ID for group" method.
- The `CacheStorage` interface has `putLastBatchIdForGroup` and `getLastBatchIdForGroup` but no `deleteLastBatchIdForGroup`.
- The method `deleteLastBatchIdForGroup` doesn't exist anywhere in the codebase (confirmed by grep).
- The `lastUpdateBatchIdPerGroupId` SQL table in `OfflineStorage` has DELETE pragma in migration but no per-group DELETE operation.

## Candidate fix

1. **Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` to the `CacheStorage` interface** in `DefaultEntityRestCache.ts`.
2. **Implement in `EphemeralCacheStorage.ts`** — no-op that returns `Promise.resolve()` (consistent with put/get stubs).
3. **Implement in `OfflineStorage.ts`** — `DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ?`.
4. **Implement in `CacheStorageProxy.ts`** — delegate to `this.inner.deleteLastBatchIdForGroup(groupId)`.
5. **Call it in `handleUpdatedUser()`** after `deleteAllOwnedBy(ship.group)`.

**Tradeoffs**: Minimal. The fix follows the exact existing pattern (`deleteAllOwnedBy` was already called per removed membership; batch ID deletion is simply added alongside it). No changes to the test file are needed — the existing membership-loss tests implicitly or explicitly assert that the batch IDs are cleaned up.
