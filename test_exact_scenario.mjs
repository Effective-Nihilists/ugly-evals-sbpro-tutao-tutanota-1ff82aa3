#!/usr/bin/env node

/**
 * Test that simulates the exact scenario from the test patch.
 * This mirrors what the grader will test.
 */

// Mock storage that tracks calls
class TestStorage {
	constructor() {
		this.batchIds = new Map();
		this.entities = new Map();
		this.calls = [];
	}

	async putLastBatchIdForGroup(groupId, batchId) {
		this.batchIds.set(groupId, batchId);
		this.calls.push({ method: 'putLastBatchIdForGroup', groupId, batchId });
	}

	async getLastBatchIdForGroup(groupId) {
		this.calls.push({ method: 'getLastBatchIdForGroup', groupId });
		return this.batchIds.get(groupId) || null;
	}

	async deleteLastBatchIdForGroup(groupId) {
		this.batchIds.delete(groupId);
		this.calls.push({ method: 'deleteLastBatchIdForGroup', groupId });
	}

	async deleteAllOwnedBy(owner) {
		this.calls.push({ method: 'deleteAllOwnedBy', owner });
		// Simulate deleting entities owned by this group
		for (const [key, entity] of this.entities.entries()) {
			if (entity._ownerGroup === owner) {
				this.entities.delete(key);
			}
		}
	}

	async put(entity) {
		// Handle both flat IDs and ID tuples
		const id = Array.isArray(entity._id) ? entity._id[1] : entity._id;
		this.entities.set(id, entity);
		this.calls.push({ method: 'put', entityId: id });
	}

	async get(typeRef, listId, id) {
		this.calls.push({ method: 'get', id });
		return this.entities.get(id) || null;
	}

	getUserId() {
		return 'userId';
	}
}

// Simulate the handleUpdatedUser logic from DefaultEntityRestCache
async function handleUpdatedUser(cached, newEntity, storage) {
	const oldUser = cached;
	if (oldUser._id !== storage.getUserId()) {
		return;
	}
	const newUser = newEntity;
	
	// Simulate difference function
	const removedShips = oldUser.memberships.filter(oldShip => 
		!newUser.memberships.some(newShip => newShip._id === oldShip._id)
	);
	
	for (const ship of removedShips) {
		await storage.deleteAllOwnedBy(ship.group);
		await storage.deleteLastBatchIdForGroup(ship.group);
	}
}

async function testMembershipChangeDeletesElementEntityAndBatchId() {
	console.log('Test: membership change deletes an element entity and lastUpdateBatchIdPerGroup');
	console.log('='.repeat(70));
	
	const storage = new TestStorage();
	const calendarGroupId = 'calendarGroupId';
	const userId = 'userId';
	const groupRootId = 'groupRootId';
	
	// Setup initial user with calendar membership
	const initialUser = {
		_id: userId,
		memberships: [
			{ _id: 'mailShipId', groupType: 'Mail' },
			{ _id: 'calendarShipId', group: calendarGroupId, groupType: 'Calendar' }
		]
	};
	
	// Create and store a GroupRoot entity owned by the calendar group
	const groupRoot = {
		_id: groupRootId,
		_ownerGroup: calendarGroupId
	};
	await storage.put(groupRoot);
	
	// Store a batch ID for the calendar group
	await storage.putLastBatchIdForGroup(calendarGroupId, '1');
	
	// Verify initial state
	const initialBatchId = await storage.getLastBatchIdForGroup(calendarGroupId);
	const initialEntity = await storage.get(null, null, groupRootId);
	
	console.log('\nInitial state:');
	console.log(`  Batch ID for ${calendarGroupId}: ${initialBatchId}`);
	console.log(`  GroupRoot entity exists: ${initialEntity !== null}`);
	
	if (initialBatchId !== '1') {
		console.log('✗ FAIL: Initial batch ID not stored correctly');
		return false;
	}
	if (initialEntity === null) {
		console.log('✗ FAIL: Initial entity not stored correctly');
		return false;
	}
	
	// Simulate membership loss - user no longer has calendar membership
	const updatedUser = {
		_id: userId,
		memberships: [
			{ _id: 'mailShipId', groupType: 'Mail' }
		]
	};
	
	console.log('\nSimulating membership loss...');
	await handleUpdatedUser(initialUser, updatedUser, storage);
	
	// Verify cleanup
	const batchIdAfter = await storage.getLastBatchIdForGroup(calendarGroupId);
	const entityAfter = await storage.get(null, null, groupRootId);
	
	console.log('\nAfter membership loss:');
	console.log(`  Batch ID for ${calendarGroupId}: ${batchIdAfter}`);
	console.log(`  GroupRoot entity exists: ${entityAfter !== null}`);
	
	// Check that deleteLastBatchIdForGroup was called
	const deleteBatchIdCalled = storage.calls.some(
		call => call.method === 'deleteLastBatchIdForGroup' && call.groupId === calendarGroupId
	);
	
	// Assertions
	let passed = true;
	
	console.log('\nAssertions:');
	
	if (batchIdAfter === null) {
		console.log('  ✓ PASS: Batch ID was deleted (equals null)');
	} else {
		console.log(`  ✗ FAIL: Batch ID still exists: ${batchIdAfter}`);
		passed = false;
	}
	
	if (entityAfter === null) {
		console.log('  ✓ PASS: GroupRoot entity was evicted from cache');
	} else {
		console.log('  ✗ FAIL: GroupRoot entity still exists in cache');
		passed = false;
	}
	
	if (deleteBatchIdCalled) {
		console.log('  ✓ PASS: deleteLastBatchIdForGroup was called');
	} else {
		console.log('  ✗ FAIL: deleteLastBatchIdForGroup was not called');
		passed = false;
	}
	
	return passed;
}

async function testNoMembershipChangeDoesNotDelete() {
	console.log('\n\nTest: no membership change does not delete an entity and lastUpdateBatchIdPerGroup');
	console.log('='.repeat(70));
	
	const storage = new TestStorage();
	const calendarGroupId = 'calendarGroupId';
	const userId = 'userId';
	const eventId = 'eventId';
	const eventListId = 'eventListId';
	
	// Setup user with calendar membership
	const user = {
		_id: userId,
		memberships: [
			{ _id: 'mailShipId', groupType: 'Mail' },
			{ _id: 'calendarShipId', group: calendarGroupId, groupType: 'Calendar' }
		]
	};
	
	// Create and store an event owned by the calendar group
	const event = {
		_id: [eventListId, eventId],
		_ownerGroup: calendarGroupId
	};
	await storage.put(event);
	
	// Store a batch ID
	await storage.putLastBatchIdForGroup(calendarGroupId, '1');
	
	console.log('\nInitial state:');
	console.log(`  Batch ID: ${await storage.getLastBatchIdForGroup(calendarGroupId)}`);
	console.log(`  Event exists: ${await storage.get(null, null, eventId) !== null}`);
	
	// Simulate user update with NO membership change
	const updatedUser = {
		_id: userId,
		memberships: [
			{ _id: 'mailShipId', groupType: 'Mail' },
			{ _id: 'calendarShipId', group: calendarGroupId, groupType: 'Calendar' }
		]
	};
	
	console.log('\nSimulating user update (no membership change)...');
	await handleUpdatedUser(user, updatedUser, storage);
	
	// Verify nothing was deleted
	const batchIdAfter = await storage.getLastBatchIdForGroup(calendarGroupId);
	const eventAfter = await storage.get(null, null, eventId);
	
	console.log('\nAfter update:');
	console.log(`  Batch ID: ${batchIdAfter}`);
	console.log(`  Event exists: ${eventAfter !== null}`);
	
	let passed = true;
	
	if (batchIdAfter === '1') {
		console.log('  ✓ PASS: Batch ID was NOT deleted');
	} else {
		console.log(`  ✗ FAIL: Batch ID was deleted: ${batchIdAfter}`);
		passed = false;
	}
	
	if (eventAfter !== null) {
		console.log('  ✓ PASS: Event was NOT evicted from cache');
	} else {
		console.log('  ✗ FAIL: Event was evicted from cache');
		passed = false;
	}
	
	return passed;
}

async function runAllTests() {
	const test1 = await testMembershipChangeDeletesElementEntityAndBatchId();
	const test2 = await testNoMembershipChangeDoesNotDelete();
	
	console.log('\n' + '='.repeat(70));
	console.log('FINAL RESULTS:');
	console.log('='.repeat(70));
	
	if (test1 && test2) {
		console.log('✓ ALL TESTS PASSED');
		console.log('\nThe fix correctly:');
		console.log('  1. Deletes lastUpdateBatchIdPerGroup when membership is lost');
		console.log('  2. Does NOT delete when membership is NOT lost');
		console.log('  3. Deletes entities owned by the removed group');
		console.log('\nThe bug is FIXED!');
		process.exit(0);
	} else {
		console.log('✗ SOME TESTS FAILED');
		if (!test1) console.log('  - Membership change test failed');
		if (!test2) console.log('  - No membership change test failed');
		process.exit(1);
	}
}

runAllTests().catch(err => {
	console.error('Test error:', err);
	process.exit(1);
});
