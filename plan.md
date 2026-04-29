# Plan: Fix `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Context
`lastUpdateBatchIdPerGroup` is stored in `OfflineStorage` (SQL table `lastUpdateBatchIdPerGroupId`) and defined in the `CacheStorage` interface. When a user's group membership changes, `DefaultEntityRestCache.entityEventsReceived` detects lost memberships and evicts cached entities via `storage.deleteAllOwnedBy(owner)`, but it does not clear the corresponding `lastUpdateBatchIdPerGroup` entry.

## Repro
Run `test/tests/api/worker/rest/EntityRestCacheTest.ts`. The membership-change tests assert that `storage.getLastBatchIdForGroup(calendarGroupId)` returns `null` after membership loss, but currently it returns the old batch ID.

## Files to Change
1. **`src/api/worker/rest/DefaultEntityRestCache.ts`**
   - Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>;` to the `CacheStorage` interface after `getLastBatchIdForGroup`.
   - In `entityEventsReceived`, inside the membership-change handling where lost groups are processed and `deleteAllOwnedBy` is called, add `await this.storage.deleteLastBatchIdForGroup(groupId)` for each lost group.

2. **`src/api/worker/offline/OfflineStorage.ts`**
   - Add `async deleteLastBatchIdForGroup(groupId: Id): Promise<void>` after `putLastBatchIdForGroup`:
     ```ts
     async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
         const {query, params} = sql`DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${groupId}`
         await this.sqlCipherFacade.run(query, params)
     }
     ```

3. **`src/api/worker/rest/EphemeralCacheStorage.ts`**
   - Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` after `putLastBatchIdForGroup`, returning `Promise.resolve()`.

4. **`src/api/worker/rest/CacheStorageProxy.ts`**
   - Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` after `putLastBatchIdForGroup`, delegating to `this.inner.deleteLastBatchIdForGroup(groupId)`.

## Verification
- Run the EntityRestCacheTest suite and confirm all membership-change tests pass.
