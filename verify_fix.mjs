#!/usr/bin/env node

/**
 * Simple verification script for the membership loss bug fix.
 * This directly tests the OfflineStorage.deleteLastBatchIdForGroup method.
 */

import {EphemeralCacheStorage} from "../src/api/worker/rest/EphemeralCacheStorage.js"

const TEST_GROUP_ID = "test-calendar-group"
const TEST_BATCH_ID = "test-batch-id"

async function testDeleteLastBatchIdForGroup() {
	console.log("Testing: deleteLastBatchIdForGroup method exists and works")
	
	const storage = new EphemeralCacheStorage()
	
	// Step 1: Set a batch ID
	console.log("  Step 1: Setting batch ID...")
	await storage.putLastBatchIdForGroup(TEST_GROUP_ID, TEST_BATCH_ID)
	const stored = await storage.getLastBatchIdForGroup(TEST_GROUP_ID)
	console.log(`    Stored batch ID: ${stored}`)
	if (stored !== TEST_BATCH_ID) {
		throw new Error(`Failed to set batch ID. Expected: ${TEST_BATCH_ID}, Got: ${stored}`)
	}
	
	// Step 2: Delete the batch ID
	console.log("  Step 2: Deleting batch ID...")
	if (typeof storage.deleteLastBatchIdForGroup !== 'function') {
		throw new Error("deleteLastBatchIdForGroup method does not exist on EphemeralCacheStorage!")
	}
	await storage.deleteLastBatchIdForGroup(TEST_GROUP_ID)
	
	// Step 3: Verify it's deleted
	console.log("  Step 3: Verifying deletion...")
	const afterDelete = await storage.getLastBatchIdForGroup(TEST_GROUP_ID)
	console.log(`    Batch ID after deletion: ${afterDelete}`)
	if (afterDelete !== null) {
		throw new Error(`Batch ID was not deleted! Expected: null, Got: ${afterDelete}`)
	}
	
	console.log("\n✅ TEST PASSED: deleteLastBatchIdForGroup works correctly")
	return true
}

async function main() {
	try {
		await testDeleteLastBatchIdForGroup()
		process.exit(0)
	} catch (error) {
		console.error("\n❌ TEST FAILED:", error.message)
		console.error(error.stack)
		process.exit(1)
	}
}

main()
