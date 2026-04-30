#!/usr/bin/env node

/**
 * Standalone test to verify the fix for the lastUpdateBatchIdPerGroup bug.
 * 
 * This test verifies that when a membership is lost, the deleteLastBatchIdForGroup
 * method is called to clean up the lastUpdateBatchIdPerGroup mapping.
 */

import o from "ospec"
import {
	createGroupMembership,
	createUser,
	GroupType,
	OperationType
} from "../src/api/entities/sys/TypeRefs.js"
import {createEntityUpdate} from "../src/api/entities/sys/TypeRefs.js"
import {UserTypeRef} from "../src/api/entities/sys/TypeRefs.js"
import {EphemeralCacheStorage} from "../src/api/worker/rest/EphemeralCacheStorage.js"
import {DefaultEntityRestCache} from "../src/api/worker/rest/DefaultEntityRestCache.js"
import {func, instance, when} from "testdouble"

const groupId = "testGroupId"
const batchId = "testBatchId"

function makeBatch(updates) {
	return {
		events: updates,
		groupId: groupId,
		batchId: batchId,
	}
}

function createUpdate(typeRef, listId, id, operation) {
	let eu = createEntityUpdate()
	eu.application = typeRef.app
	eu.type = typeRef.type
	eu.instanceListId = listId
	eu.instanceId = id
	eu.operation = operation
	return eu
}

o.spec("deleteLastBatchIdForGroup bug fix verification", function () {
	o("membership change should call deleteLastBatchIdForGroup", async function () {
		const userId = "userId"
		const calendarGroupId = "calendarGroupId"
		
		// Create initial user with two memberships
		const initialUser = createUser({
			_id: userId,
			memberships: [
				createGroupMembership({
					_id: "mailShipId",
					groupType: GroupType.Mail,
				}),
				createGroupMembership({
					_id: "calendarShipId",
					group: calendarGroupId,
					groupType: GroupType.Calendar,
				})
			]
		})

		// Create updated user with only one membership (calendar membership removed)
		const updatedUser = createUser({
			_id: userId,
			memberships: [
				createGroupMembership({
					_id: "mailShipId",
					groupType: GroupType.Mail,
				}),
			]
		})

		// Create storage and cache
		const storage = new EphemeralCacheStorage()
		await storage.init(userId)
		
		// Mock entityRestClient
		const entityRestClient = instance(Object)
		entityRestClient.load = func()
		when(entityRestClient.load(UserTypeRef, userId)).thenResolve(updatedUser)
		entityRestClient.getRestClient = func()
		entityRestClient.getRestClient().getServerTimestampMs = () => Date.now()

		const cache = new DefaultEntityRestCache(entityRestClient, storage)
		
		// Put initial user in storage
		await storage.put(initialUser)
		storage.getUserId = () => userId

		// Spy on deleteLastBatchIdForGroup method
		let deleteLastBatchIdForGroupCalled = false
		let deletedGroupId = null
		const originalDeleteLastBatchIdForGroup = storage.deleteLastBatchIdForGroup.bind(storage)
		storage.deleteLastBatchIdForGroup = async function(groupId) {
			deleteLastBatchIdForGroupCalled = true
			deletedGroupId = groupId
			return originalDeleteLastBatchIdForGroup(groupId)
		}

		// Simulate user update event (membership loss)
		await cache.entityEventsReceived(makeBatch([
			createUpdate(UserTypeRef, "", userId, OperationType.UPDATE)
		]))

		// Verify that deleteLastBatchIdForGroup was called for the removed group
		o(deleteLastBatchIdForGroupCalled).equals(true)(
			"deleteLastBatchIdForGroup should be called when membership is lost"
		)
		o(deletedGroupId).equals(calendarGroupId)(
			"deleteLastBatchIdForGroup should be called with the removed group's ID"
		)
	})

	o("membership change without loss should not call deleteLastBatchIdForGroup", async function () {
		const userId = "userId"
		const calendarGroupId = "calendarGroupId"
		
		// Create initial user with two memberships
		const initialUser = createUser({
			_id: userId,
			memberships: [
				createGroupMembership({
					_id: "mailShipId",
					groupType: GroupType.Mail,
				}),
				createGroupMembership({
					_id: "calendarShipId",
					group: calendarGroupId,
					groupType: GroupType.Calendar,
				})
			]
		})

		// Create updated user with same memberships (no change)
		const updatedUser = createUser({
			_id: userId,
			memberships: [
				createGroupMembership({
					_id: "mailShipId",
					groupType: GroupType.Mail,
				}),
				createGroupMembership({
					_id: "calendarShipId",
					group: calendarGroupId,
					groupType: GroupType.Calendar,
				})
			]
		})

		// Create storage and cache
		const storage = new EphemeralCacheStorage()
		await storage.init(userId)
		
		// Mock entityRestClient
		const entityRestClient = instance(Object)
		entityRestClient.load = func()
		when(entityRestClient.load(UserTypeRef, userId)).thenResolve(updatedUser)
		entityRestClient.getRestClient = func()
		entityRestClient.getRestClient().getServerTimestampMs = () => Date.now()

		const cache = new DefaultEntityRestCache(entityRestClient, storage)
		
		// Put initial user in storage
		await storage.put(initialUser)
		storage.getUserId = () => userId

		// Spy on deleteLastBatchIdForGroup method
		let deleteLastBatchIdForGroupCalled = false
		const originalDeleteLastBatchIdForGroup = storage.deleteLastBatchIdForGroup.bind(storage)
		storage.deleteLastBatchIdForGroup = async function(groupId) {
			deleteLastBatchIdForGroupCalled = true
			return originalDeleteLastBatchIdForGroup(groupId)
		}

		// Simulate user update event (no membership loss)
		await cache.entityEventsReceived(makeBatch([
			createUpdate(UserTypeRef, "", userId, OperationType.UPDATE)
		]))

		// Verify that deleteLastBatchIdForGroup was NOT called
		o(deleteLastBatchIdForGroupCalled).equals(false)(
			"deleteLastBatchIdForGroup should not be called when no membership is lost"
		)
	})
})

o.run()