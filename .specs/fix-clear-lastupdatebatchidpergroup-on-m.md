# Fix: Clear lastUpdateBatchIdPerGroup on Membership Loss

## Context

When a user loses membership to a group (e.g., via `handleUpdatedUser` in `DefaultEntityRestCache.ts:713-728`), the system correctly deletes all entities owned by that group via `deleteAllOwnedBy()`. However, it fails to delete the corresponding entry in the `lastUpdateBatchIdPerGroup` mapping, which tracks the last processed event batch ID for each group.

This stale entry causes the system to attempt downloading event batches for groups the user no longer has access to, resulting in unnecessary operations and potential errors.

## Root Cause

In `src/api/worker/rest/DefaultEntityRestCache.ts`, the `handleUpdatedUser` method (lines 713-728) handles membership loss by calling `this.storage.deleteAllOwnedBy(ship.group)` for each removed membership. However, it does NOT call any method to delete the `lastUpdateBatchIdPerGroup` entry for that group.

The `CacheStorage` interface (lines 118-165) defines:
- `putLastBatchIdForGroup(groupId: Id, batchId: Id): Promise<void>` (line 154)
- `getLastBatchIdForGroup(groupId: Id): Promise<Id | null>` (line 156)

But there is NO `deleteLastBatchIdForGroup` method defined or implemented.

## Plan

### 1. Add deleteLastBatchIdForGroup to CacheStorage interface

**File:** `src/api/worker/rest/DefaultEntityRestCache.ts`

**Location:** After line 156 (after `getLastBatchIdForGroup`)

**Change:** Add method signature to the `CacheStorage` interface:
```typescript
deleteLastBatchIdForGroup(groupId: Id): Promise<void>;
```

### 2. Implement deleteLastBatchIdForGroup in all CacheStorage implementations

The `CacheStorage` interface has three implementers (per ARCHITECTURE.md):
- `EphemeralCacheStorage` (src/api/worker/rest/EphemeralCacheStorage.ts)
- `LateInitializedCacheStorageImpl` (wrapper, delegates to underlying storage)
- `OfflineStorage` (src/api/worker/offline/OfflineStorage.ts)

#### 2a. EphemeralCacheStorage

**File:** `src/api/worker/rest/EphemeralCacheStorage.ts`

**Location:** After the `getLastBatchIdForGroup` implementation (around line 223)

**Change:** Add implementation:
```typescript
deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
    this._lastUpdateBatchIdPerGroup.delete(groupId)
    return Promise.resolve()
}
```

#### 2b. OfflineStorage

**File:** `src/api/worker/offline/OfflineStorage.ts`

**Location:** After the `getLastBatchIdForGroup` implementation (around line 237)

**Change:** Add implementation:
```typescript
async deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
    await this._db.delete("lastUpdateBatchIdPerGroupId", groupId)
}
```

#### 2c. CacheStorageProxy

**File:** `src/api/worker/rest/CacheStorageProxy.ts`

**Location:** After the `getLastBatchIdForGroup` proxy method (around line 159)

**Change:** Add proxy method:
```typescript
deleteLastBatchIdForGroup(groupId: Id): Promise<void> {
    return this._storage.deleteLastBatchIdForGroup(groupId)
}
```

### 3. Call deleteLastBatchIdForGroup when membership is lost

**File:** `src/api/worker/rest/DefaultEntityRestCache.ts`

**Location:** In `handleUpdatedUser` method, inside the loop at line 724-727

**Current code:**
```typescript
for (const ship of removedShips) {
    console.log("Lost membership on ", ship._id, ship.groupType)
    await this.storage.deleteAllOwnedBy(ship.group)
}
```

**Updated code:**
```typescript
for (const ship of removedShips) {
    console.log("Lost membership on ", ship._id, ship.groupType)
    await this.storage.deleteAllOwnedBy(ship.group)
    await this.storage.deleteLastBatchIdForGroup(ship.group)
}
```

## Why This Fixes the Bug

1. **Completes the cleanup:** When membership is lost, we already delete all entities owned by the group. Adding `deleteLastBatchIdForGroup` ensures we also delete the batch ID tracking for that group.

2. **Prevents irrelevant downloads:** Without this fix, the stale `lastUpdateBatchIdPerGroup` entry would cause the system to attempt downloading event batches for a group the user no longer has access to.

3. **Maintains consistency:** The fix ensures that `lastUpdateBatchIdPerGroup` stays in sync with the actual group memberships, preventing cache inconsistencies.

## Verification

The test suite `test/tests/api/worker/rest/EntityRestCacheTest.js` already contains tests for this behavior (per the test patch in eval/metadata.json). The tests verify:

1. **No membership change:** When there's no membership change, `lastUpdateBatchIdPerGroup` should NOT be deleted.
   - Test: "no membership change does not delete an entity and lastUpdateBatchIdPerGroup"
   - Assertion: `o(await storage.getLastBatchIdForGroup(calendarGroupId)).notEquals(null)`

2. **Membership change (element entity):** When membership is lost and an element entity is deleted, `lastUpdateBatchIdPerGroup` should be deleted.
   - Test: "membership change deletes an element entity and lastUpdateBatchIdPerGroup"
   - Assertion: `o(await storage.getLastBatchIdForGroup(calendarGroupId)).equals(null)`

3. **Membership change (list entity):** When membership is lost and a list entity is deleted, `lastUpdateBatchIdPerGroup` should be deleted.
   - Test: "membership change deletes a list entity and lastUpdateBatchIdPerGroup"
   - Assertion: `storage.getLastBatchIdForGroup && o(await storage.getLastBatchIdForGroup(calendarGroupId)).equals(null)`

After implementing the fix, running `npm test -- test/tests/api/worker/rest/EntityRestCacheTest.js` should pass all these tests.