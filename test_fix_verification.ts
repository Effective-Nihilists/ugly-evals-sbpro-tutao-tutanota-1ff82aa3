/**
 * Standalone test: lastUpdateBatchIdPerGroup is deleted when membership is lost.
 *
 * Run with: node --experimental-vm-modules test_fix_verification.js
 * Or compile and run with ts-node.
 */
import { EntityRestClient } from "./src/api/worker/rest/EntityRestClient.js"
import { DefaultEntityRestCache } from "./src/api/worker/rest/DefaultEntityRestCache.js"
import { CacheStorage } from "./src/api/worker/rest/DefaultEntityRestCache.js"
import { EphemeralCacheStorage } from "./src/api/worker/rest/EphemeralCacheStorage.js"
import { createUser, createGroupMembership, UserTypeRef } from "./src/api/entities/sys/TypeRefs.js"
import { OperationType } from "./src/api/common/TutanotaConstants.js"
import { QueuedBatch } from "./src/api/worker/search/EventQueue.js"
import { func, instance, object, when } from "testdouble"

// ---- minimal mock EntityRestClient ----
function createMockClient(initialUser: any, updatedUser: any): EntityRestClient {
    const client = object<EntityRestClient>()
    let callCount = 0
    client.load = func<EntityRestClient["load"]>()
    when(client.load(UserTypeRef, initialUser._id)).thenResolve(initialUser)
    when(client.load(UserTypeRef, updatedUser._id)).thenResolve(updatedUser)
    return client
}

function makeBatch(userId: string): QueuedBatch {
    return {
        events: [{
            application: "sys",
            type: "User",
            instanceListId: "",
            instanceId: userId,
            operation: OperationType.UPDATE,
            timestamp: 0
        }],
        groupId: "someGroup",
        batchId: "batch1"
    }
}

async function runTest(): Promise<{ passed: boolean, message: string }> {
    const userId = "userId"
    const calendarGroupId = "calendarGroupId"

    // Step 1: user with calendar membership
    const initialUser = createUser({
        _id: userId,
        memberships: [
            createGroupMembership({ _id: "mailShipId", groupType: "Mail" }),
            createGroupMembership({ _id: "calendarShipId", group: calendarGroupId, groupType: "Calendar" })
        ]
    })

    // Step 2: user without calendar membership (membership was lost)
    const updatedUser = createUser({
        _id: userId,
        memberships: [
            createGroupMembership({ _id: "mailShipId", groupType: "Mail" })
        ]
    })

    // Step 3: storage + cache
    const storage = new EphemeralCacheStorage()
    const client = createMockClient(initialUser, updatedUser)
    const cache = new DefaultEntityRestCache(client, storage)

    // Step 4: put a batch ID for the calendar group (simulates prior sync)
    await storage.putLastBatchIdForGroup(calendarGroupId, "1")

    // Verify it's stored
    const before = await storage.getLastBatchIdForGroup(calendarGroupId)
    console.log(`Before membership loss: getLastBatchIdForGroup = ${before}`)
    if (before !== "1") {
        return { passed: false, message: `putLastBatchIdForGroup failed to store: got ${before}, expected "1"` }
    }

    // Step 5: set userId on storage and trigger membership change via entityEventsReceived
    storage.getUserId = () => userId

    // Use a fresh mock client that returns updatedUser (membership removed)
    const client2 = createMockClient(initialUser, updatedUser)
    const cache2 = new DefaultEntityRestCache(client2, storage)

    // The batch must contain an UPDATE for the User entity to trigger handleUpdatedUser
    await cache2.entityEventsReceived(makeBatch(userId))

    // Step 6: verify batch ID was deleted
    const after = await storage.getLastBatchIdForGroup(calendarGroupId)
    console.log(`After membership loss: getLastBatchIdForGroup = ${after}`)

    if (after !== null) {
        return { passed: false, message: `lastUpdateBatchIdPerGroup was NOT deleted after membership loss: got ${JSON.stringify(after)}, expected null` }
    }

    return { passed: true, message: "lastUpdateBatchIdPerGroup correctly deleted after membership loss" }
}

runTest()
    .then(result => {
        console.log(result.passed ? "✅ TEST PASSED" : "❌ TEST FAILED")
        console.log(result.message)
        process.exit(result.passed ? 0 : 1)
    })
    .catch(err => {
        console.error("❌ TEST ERROR:", err)
        process.exit(1)
    })