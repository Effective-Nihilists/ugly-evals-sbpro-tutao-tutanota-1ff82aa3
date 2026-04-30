#!/usr/bin/env node

/**
 * Standalone test to verify the fix for: lastUpdateBatchIdPerGroup Not Cleared After Membership Loss
 * 
 * This test verifies that when a user loses membership in a group, the corresponding
 * entry in lastUpdateBatchIdPerGroup is properly deleted.
 */

const TEST_GROUP_ID = "test-calendar-group"
const TEST_USER_ID = "test-user-id"
const TEST_BATCH_ID = "test-batch-id"

async function testMembershipLossClearsBatchId() {
	console.log("Testing: Membership loss should clear lastUpdateBatchIdPerGroup entry")
	
	// Import the modules we need
	const {EphemeralCacheStorage} = await import('./src/api/worker/rest/EphemeralCacheStorage.js')
	const {DefaultEntityRestCache} = await import('./src/api/worker/rest/DefaultEntityRestCache.js')
	const {createUser, createGroupMembership, GroupType, createEntityUpdate, OperationType, UserTypeRef} = await import('./src/api/entities/sys/TypeRefs.js')
	
	// Setup: Create storage and cache
	const storage = new EphemeralCacheStorage()
	
	// Mock entity rest client
	const restClient = {
		load: async () => { throw new Error("load should not be called") },
		loadRange: async () => { throw new Error("loadRange should not be called") },
		loadMultiple: async () => { throw new Error("loadMultiple should not be called") },
		setup: async () => { throw new Error("setup should not be called") },
		setupMultiple: async () => { throw new Error("setupMultiple should not be called") },
		update: async () => { throw new Error("update should not be called") },
		erase: async () => { throw new Error("erase should not be called") },
		entityEventsReceived: async (e) => e,
		getRestClient: () => ({
			getServerTimestampMs: () => Date.now()
		})
	}
	
	const cache = new DefaultEntityRestCache(restClient, storage)
	
	// Step 1: Set a batch ID for the group
	console.log("  Step 1: Setting batch ID for group...")
	await storage.putLastBatchIdForGroup(TEST_GROUP_ID, TEST_BATCH_ID)
	const storedBatchId = await storage.getLastBatchIdForGroup(TEST_GROUP_ID)
	if (storedBatchId !== TEST_BATCH_ID) {
		throw new Error(`Failed to set batch ID. Expected: ${TEST_BATCH_ID}, Got: ${storedBatchId}`)
	}
	console.log("    ✓ Batch ID set successfully")
	
	// Step 2: Create user with membership that will be removed
	console.log("  Step 2: Creating user with membership...")
	const initialUser = createUser({
		_id: TEST_USER_ID,
		memberships: [
			createGroupMembership({
				_id: "mail-ship-id",
				groupType: GroupType.Mail,
			}),
			createGroupMembership({
				_id: "calendar-ship-id",
				group: TEST_GROUP_ID,
				groupType: GroupType.Calendar,
			})
		]
	})
	await storage.put(initialUser)
	console.log("    ✓ User created with membership")
	
	// Step 3: Create updated user WITHOUT the membership
	console.log("  Step 3: Creating updated user without membership...")
	const updatedUser = createUser({
		_id: TEST_USER_ID,
		memberships: [
			createGroupMembership({
				_id: "mail-ship-id",
				groupType: GroupType.Mail,
			}),
		]
	})
	
	// Mock the load to return the updated user
	restClient.load = async (typeRef, id) => {
		if (id === TEST_USER_ID) {
			return updatedUser
		}
		throw new Error(`Unexpected load for ${id}`)
	}
	
	// Step 4: Simulate the entity update event that triggers membership loss
	console.log("  Step 4: Processing user update event (membership loss)...")
	storage.getUserId = () => TEST_USER_ID
	
	const update = createEntityUpdate()
	update.application = "sys"
	update.type = "User"
	update.instanceListId = ""
	update.instanceId = TEST_USER_ID
	update.operation = OperationType.UPDATE
	
	await cache.entityEventsReceived({
		events: [update],
		groupId: "system-group",
		batchId: "system-batch",
	})
	console.log("    ✓ Update event processed")
	
	// Step 5: Verify the batch ID was deleted
	console.log("  Step 5: Verifying batch ID was deleted...")
	const batchIdAfter = await storage.getLastBatchIdForGroup(TEST_GROUP_ID)
	if (batchIdAfter !== null) {
		throw new Error(`FAIL: Batch ID was not deleted! Expected: null, Got: ${batchIdAfter}`)
	}
	console.log("    ✓ Batch ID successfully deleted")
	
	console.log("\n✅ TEST PASSED: Membership loss correctly clears lastUpdateBatchIdPerGroup")
	return true
}

async function main() {
	try {
		await testMembershipLossClearsBatchId()
		process.exit(0)
	} catch (error) {
		console.error("\n❌ TEST FAILED:", error.message)
		console.error(error.stack)
		process.exit(1)
	}
}

main()
