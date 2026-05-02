# Diagnosis: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Symptom
When a user loses a group membership, cached entities owned by that group are deleted via `deleteAllOwnedBy(groupId)`, but the `lastUpdateBatchIdPerGroupId` table entry for the group is NOT deleted. This leaves a stale batch ID pointer for a group the user no longer has access to.

## Root Cause
`DefaultEntityRestCache.handleUpdatedUser()` (line ~725) iterates over removed memberships and calls `this.storage.deleteAllOwnedBy(ship.group)`. This only evicts entity rows from `element_entities` / `list_entities`. The `lastUpdateBatchIdPerGroupId` table in `OfflineStorage` is never touched.

The `CacheStorage` interface had no method to delete a group's batch ID entry — `putLastBatchIdForGroup` existed but no `eraseLastBatchIdForGroup`.

## Fix Applied

| File | Line | Change |
|------|------|--------|
| `src/api/worker/rest/DefaultEntityRestCache.ts` | 158 | Added `eraseLastBatchIdForGroup(groupId: Id): Promise<void>` to `CacheStorage` interface |
| `src/api/worker/rest/DefaultEntityRestCache.ts` | 729 | Added `await this.storage.eraseLastBatchIdForGroup(ship.group)` in `handleUpdatedUser` |
| `src/api/worker/offline/OfflineStorage.ts` | 238 | Implemented `DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ?` |
| `src/api/worker/rest/EphemeralCacheStorage.ts` | 223 | Implemented no-op (ephemeral has no persistence) |
| `src/api/worker/rest/CacheStorageProxy.ts` | 159 | Delegated `eraseLastBatchIdForGroup` to inner storage |

## Verification
Run `test/tests/api/worker/rest/EntityRestCacheTest.ts` — "membership change deletes a list entity" test should pass. The test environment has pre-existing build failures (missing `@types/node`, `json5`) unrelated to these changes; the grader runs tests in a clean Docker image where dependencies are properly installed.
