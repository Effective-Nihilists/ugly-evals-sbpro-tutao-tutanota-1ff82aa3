# Diagnosis: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Ticket Summary
When a user's membership in a group is removed (via User entity update), the `lastUpdateBatchIdPerGroupId` table entry for that group is not deleted, causing the system to continue attempting to download event batches for a group the user no longer has access to.

## Symptom
- Bug: `lastUpdateBatchIdPerGroup` (mapped in `OfflineStorage` as table `lastUpdateBatchIdPerGroupId`) is not deleted when membership is lost
- Location: `src/api/worker/offline/OfflineStorage.ts`, `deleteAllOwnedBy` method (line 297)
- When membership is lost: `DefaultEntityRestCache.handleUpdatedUser` calls `storage.deleteAllOwnedBy(ship.group)` for each removed membership

## Root Cause
The `deleteAllOwnedBy` method in `OfflineStorage.ts` currently:
1. Deletes element_entities owned by the group
2. Deletes list_entities and ranges for lists owned by the group
3. **Does NOT delete the `lastUpdateBatchIdPerGroupId` entry for that group**

The batch ID entry remains in the database, so subsequent event synchronization will still attempt to query for batches using a stale group ID.

## Candidate Fixes

### Fix A: Add DELETE in `deleteAllOwnedBy` (Recommended)
**Approach:** Add a third block to `deleteAllOwnedBy` in `OfflineStorage.ts`:
```typescript
// delete the lastUpdateBatchIdPerGroupId for this group so we don't try to download events for a group we no longer have access to
const {query, params} = sql`DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${owner}`
await this.sqlCipherFacade.run(query, params)
```

**Tradeoffs:**
- ✅ Minimal, targeted change — only affects the exact issue
- ✅ Follows existing code patterns (same `sql` template pattern used throughout)
- ✅ Self-contained: cleans up related metadata atomically with entity cleanup
- ⚠️ Only addresses `OfflineStorage` — `EphemeralCacheStorage` would need separate handling if it has a similar issue (but Ephemeral doesn't store batch IDs persistently)

**Status:** Already applied as edit.

### Fix B: Add explicit cleanup in `handleUpdatedUser`
**Approach:** In `DefaultEntityRestCache.ts:handleUpdatedUser`, after calling `deleteAllOwnedBy`, also call a new `deleteLastBatchIdForGroup` method.

**Tradeoffs:**
- ❌ Cross-cutting concern handled in wrong layer — cache shouldn't know about batch IDs
- ❌ Would require new interface method and implementation in both storage backends
- ❌ More invasive for no additional benefit

### Fix C: Add table-level cascade or migration
**Approach:** Add SQL foreign key with ON DELETE CASCADE or run a data migration.

**Tradeoffs:**
- ❌ Overkill — the group is being removed from memberships, not the group itself being deleted
- ❌ No FK exists between batchId table and group membership
- ❌ Migration complexity without clear benefit

## Verification
The existing test `test/tests/api/worker/rest/EntityRestCacheTest.ts` line 814 "membership change deletes a list entity" verifies entity and range deletion on membership loss. An additional assertion could verify `getLastBatchIdForGroup(calendarGroupId)` returns `null` after membership removal — but this may be covered by the existing test already.

## Environment Notes
- Test suite could not be fully executed due to @types/node/TypeScript version incompatibilities in the build environment
- The fix was applied via code analysis rather than test-driven iteration
- `npm run build-packages` passes at the package level, but test build fails at the TypeScript type-check step