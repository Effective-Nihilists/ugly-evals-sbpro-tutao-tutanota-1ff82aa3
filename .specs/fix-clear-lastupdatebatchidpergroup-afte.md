# Fix: Clear `lastUpdateBatchIdPerGroup` after membership loss

## Context
When a user's membership to a group is removed, `DefaultEntityRestCache.handleUpdatedUser()` calls `deleteAllOwnedBy(ship.group)` to clean up cached entities. However, the `lastUpdateBatchIdPerGroup` mapping (stored in `lastUpdateBatchIdPerGroupId` table in OfflineStorage) is NOT cleared, leaving stale batch IDs for groups the user no longer belongs to.

## Plan
- [ ] In `OfflineStorage.deleteAllOwnedBy()`, add a SQL `DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${owner}`
- [ ] In `EphemeralCacheStorage.deleteAllOwnedBy()`, ensure batch ID entries for the owner group are cleared

## Verification
- Run `cd test && node test` to confirm the EntityRestCacheTest suite passes
