# Fix: `lastUpdateBatchIdPerGroup` Not Cleared After Membership Loss

## Context

When a user loses membership in a group (e.g., removed from a calendar group), the system cleans up cached entities owned by that group via `deleteAllOwnedBy()`. However, the `lastUpdateBatchIdPerGroup` mapping is not cleaned up, causing the system to continue attempting to download event batches for the group the user no longer has access to.

## Root Cause

In `src/api/worker/rest/DefaultEntityRestCache.ts`, the `handleUpdatedUser` method (lines 713-728) detects when memberships are removed and calls `this.storage.deleteAllOwnedBy(ship.group)` for each removed group. However, it does not delete the corresponding entry from `lastUpdateBatchIdPerGroup`.

The `lastUpdateBatchIdPerGroup` table stores the last processed batch ID for each group, used to resume event processing. When this entry persists after membership loss, the system may try to continue downloading events for a group it can no longer access.

## Plan

### 1. Add `deleteLastBatchIdForGroup` method to CacheStorage interface

**File:** `src/api/worker/rest/DefaultEntityRestCache.ts`

**Location:** After line 156 (after `getLastBatchIdForGroup`)

**Change:** Add method signature to `CacheStorage` interface:
```typescript
deleteLastBatchIdForGroup(groupId: Id): Promise<void>;
```

### 2. Implement `deleteLastBatchIdForGroup` in OfflineStorage

**File:** `src/api/worker/offline/OfflineStorage.ts`

**Location:** After line 236 (after `putLastBatchIdForGroup`)

**Change:** Add implementation:
```typescript
async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
	const {query, params} = sql`DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ${groupId}`
	await this.sqlCipherFacade.run(query, params)
}
```

### 3. Implement `deleteLastBatchIdForGroup` in EphemeralCacheStorage

**File:** `src/api/worker/rest/EphemeralCacheStorage.ts`

**Location:** After line 221 (after `putLastBatchIdForGroup`)

**Change:** Add stub implementation (ephemeral storage doesn't persist):
```typescript
deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
	return Promise.resolve()
}
```

### 4. Call `deleteLastBatchIdForGroup` when membership is lost

**File:** `src/api/worker/rest/DefaultEntityRestCache.ts`

**Location:** In `handleUpdatedUser` method, after line 726

**Change:** Add call to delete the batch ID mapping:
```typescript
for (const ship of removedShips) {
	console.log("Lost membership on ", ship._id, ship.groupType)
	await this.storage.deleteAllOwnedBy(ship.group)
	await this.storage.deleteLastBatchIdForGroup(ship.group)
}
```

## Verification

The test suite `test/tests/api/worker/rest/EntityRestCacheTest.js` already contains tests for this behavior:

1. **"no membership change does not delete an entity and lastUpdateBatchIdPerGroup"** - Verifies that when there's no membership change, the `lastUpdateBatchIdPerGroup` entry is preserved.

2. **"membership change deletes an element entity and lastUpdateBatchIdPerGroup"** - Verifies that when a membership is lost, both the entity and the `lastUpdateBatchIdPerGroup` entry are deleted.

3. **"membership change deletes a list entity and lastUpdateBatchIdPerGroup"** - Verifies the same for list entities.

These tests already expect the `deleteLastBatchIdForGroup` method to exist and be called. The tests use `putLastBatchIdForGroup` to set up the state and `getLastBatchIdForGroup` to verify it's been deleted (returns `null`).

After implementing the fix, running the test suite should pass all membership change tests.
