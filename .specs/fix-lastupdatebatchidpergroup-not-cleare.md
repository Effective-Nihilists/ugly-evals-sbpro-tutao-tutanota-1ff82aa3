# Fix: lastUpdateBatchIdPerGroup Not Cleared After Membership Loss

## Context
When a user loses membership in a group (e.g., removed from a calendar group), the system should clean up all cached data related to that group, including the `lastUpdateBatchIdPerGroup` mapping that tracks the last processed event batch for each group.

## Repro
The test suite `test/tests/api/worker/rest/EntityRestCacheTest.ts` contains three failing tests in the "membership changes" spec:
1. "membership change deletes an element entity and lastUpdateBatchIdPerGroup"
2. "membership change deletes a list entity and lastUpdateBatchIdPerGroup"
3. "no membership change does not delete an entity and lastUpdateBatchIdPerGroup"

These tests verify that when `handleUpdatedUser` detects a lost membership, it should:
- Delete all entities owned by that group (already works via `deleteAllOwnedBy`)
- Delete the `lastUpdateBatchIdPerGroup` entry for that group (MISSING)

## Root Cause
In `src/api/worker/rest/DefaultEntityRestCache.ts`, the `handleUpdatedUser` method (lines 713-728) handles membership changes:

```typescript
private async handleUpdatedUser(updatedUser: User) {
    const currentUserId = this.storage.getUserId()
    if (areIdsEqual(currentUserId, updatedUser._id)) {
        const currentUser = await this.entityRestClient.load(UserTypeRef, currentUserId)
        const lostMemberships = getLostMemberships((currentUser as User).memberships, updatedUser.memberships)
        
        if (lostMemberships.length > 0) {
            for (const ship of lostMemberships) {
                await this.storage.deleteAllOwnedBy(ship.group)
                // MISSING: Delete lastUpdateBatchIdPerGroup entry for ship.group
            }
        }
    }
}
```

The method calls `deleteAllOwnedBy(ship.group)` to delete cached entities, but does NOT delete the corresponding entry from the `lastUpdateBatchIdPerGroupId` table. This causes the system to continue attempting to download event batches for groups the user no longer has access to.

## Candidate Fixes

### Option 1: Add deleteLastBatchIdForGroup method (RECOMMENDED)
**Pros:**
- Clean separation of concerns
- Follows existing pattern (storage interface methods)
- Type-safe
- Reusable for other scenarios

**Cons:**
- Requires adding method to 4 files (interface + 3 implementations)

**Implementation:**
1. Add `deleteLastBatchIdForGroup(groupId: Id): Promise<void>` to `CacheStorage` interface in `DefaultEntityRestCache.ts`
2. Implement in `OfflineStorage.ts`: `DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ?`
3. Implement in `EphemeralCacheStorage.ts`: delete from Map
4. Implement in `CacheStorageProxy.ts`: proxy call
5. Call `this.storage.deleteLastBatchIdForGroup(ship.group)` in `handleUpdatedUser`

### Option 2: Extend deleteAllOwnedBy to also delete lastUpdateBatchIdPerGroup
**Pros:**
- Single method call in `handleUpdatedUser`
- Encapsulates "delete everything for this group" semantics

**Cons:**
- Breaks single responsibility principle
- Less flexible if we need to delete batch ID independently
- May have unexpected side effects in other callers

### Option 3: Add SQL directly in handleUpdatedUser
**Pros:**
- Minimal code changes

**Cons:**
- Breaks abstraction layer
- `handleUpdatedUser` would need SQL knowledge
- Won't work for `EphemeralCacheStorage`
- Violates separation of concerns

## Verification
After fix, the following should pass:
```bash
cd test && node test EntityRestCacheTest
```

Specifically, these assertions in the membership change tests:
- `o(await storage.getLastBatchIdForGroup(calendarGroupId)).equals(null)` after membership loss
- `o(await storage.getLastBatchIdForGroup(calendarGroupId)).notEquals(null)` when membership is retained
