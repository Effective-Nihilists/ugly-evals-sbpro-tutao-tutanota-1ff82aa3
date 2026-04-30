# Verify `lastUpdateBatchIdPerGroup` cleared on membership loss

## Context

TICKET.md describes a bug where `lastUpdateBatchIdPerGroup` entries are not deleted when a membership is lost. The fix adds `deleteLastBatchIdForGroup(groupId)` to `CacheStorage` interface and implements it in `OfflineStorage`, `EphemeralCacheStorage`, `CacheStorageProxy`, and calls it from `DefaultEntityRestCache.handleUpdatedUser()`.

## Verification

Write a standalone script that:
1. Uses the existing `EphemeralCacheStorage` to simulate the scenario
2. Puts a batch ID for a group
3. Verifies it exists
4. Calls `deleteLastBatchIdForGroup`
5. Asserts the batch ID returns null after deletion

Run the existing test suite to confirm no regressions.
