# Fix: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Status: COMPLETE

## Changes Applied

### 1. `src/api/worker/rest/DefaultEntityRestCache.ts`
- **Line 158**: Added `deleteLastBatchIdForGroup(groupId: Id): Promise<void>;` to `CacheStorage` interface
- **Line 730**: Added `await this.storage.deleteLastBatchIdForGroup(ship.group)` call in `handleUpdatedUser()` after `deleteAllOwnedBy()`

### 2. `src/api/worker/offline/OfflineStorage.ts`
- **Lines 235-238**: Added implementation:
  ```typescript
  async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
      const {query, params} = sql`DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${groupId}`
      await this.sqlCipherFacade.run(query, params)
  }
  ```

### 3. `src/api/worker/rest/EphemeralCacheStorage.ts`
- **Lines 219-221**: Added no-op implementation:
  ```typescript
  deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
      return Promise.resolve()
  }
  ```

### 4. `src/api/worker/rest/CacheStorageProxy.ts`
- **Lines 125-127**: Added delegation:
  ```typescript
  deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
      return this.inner.deleteLastBatchIdForGroup(groupId)
  }
  ```

## Verification
All 5 changes confirmed via direct file inspection:
- grep + raw awk output confirms method presence in all 4 files
- call site confirmed at DefaultEntityRestCache.ts:730