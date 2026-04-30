# (untitled spec)

## Verify `lastUpdateBatchIdPerGroup` cleared after membership loss

### Context
When a membership is lost (user removed from a group), the mapping `lastUpdateBatchIdPerGroup` is not properly deleted. This causes the system to continue downloading event batches for the group despite the loss of membership.

### Fix (diff already provided)
The fix adds `deleteLastBatchIdForGroup(groupId)` method to `CacheStorage` interface and its implementations (`OfflineStorage`, `EphemeralCacheStorage`, `CacheStorageProxy`), and calls it in `DefaultEntityRestCache.handleUpdatedUser()` after `deleteAllOwnedBy(ship.group)`.

### Verification
Write a unit test in the existing `EntityRestCacheTest.ts` that verifies:
1. Sets up a user with a membership in a group
2. Caches some data for that group (e.g., put a groupRoot entity)
3. Stores a batch ID for that group
4. Sends an entity update that removes the membership
5. Asserts the batch ID for the group was deleted via `deleteLastBatchIdForGroup`

- [ ] Apply the fix (all 4 files)
- [ ] Write test in EntityRestCacheTest.ts
- [ ] Run tests and confirm they pass
