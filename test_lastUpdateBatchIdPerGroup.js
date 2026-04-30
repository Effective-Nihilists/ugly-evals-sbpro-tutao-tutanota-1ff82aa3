/**
 * Standalone test verifying that lastUpdateBatchIdPerGroup is deleted
 * when a group membership is lost.
 *
 * Run with: node --experimental-vm-modules test_lastUpdateBatchIdPerGroup.js
 * Or: npx ts-node test_lastUpdateBatchIdPerGroup.ts
 */
import o from "ospec"
import {
	createCalendarEvent,
	CalendarEventTypeRef,
	createGroupMembership,
	createGroupRoot,
	createUser,
	GroupType,
	OperationType,
} from "../src/api/entities/sys/TypeRefs.js"
import {EntityRestClient} from "../src/api/worker/rest/EntityRestClient.js"
import {CacheStorage, DefaultEntityRestCache} from "../src/api/worker/rest/DefaultEntityRestCache.js"
import {EphemeralCacheStorage} from "../src/api/worker/rest/EphemeralCacheStorage.js"
import {func, instance, when} from "testdollar"
import {NotAuthorizedError, NotFoundError} from "../src/api/common/error/RestError.js"

const {anything} = {anything: null as any}

// ── Helpers ─────────────────────────────────────────────────────────────────

type Id = string
type IdTuple = [string, string]

function makeBatch(events: any[]): any {
	return {groupId: "someGroupId", batchId: "someBatchId", events}
}

function createUpdate(typeRef: any, listId: string, id: string, operation: string) {
	return {
		application: typeRef.app,
		type: typeRef.type,
		instanceId: id,
		instanceListId: listId,
		operation,
	}
}

// ── Test ─────────────────────────────────────────────────────────────────────

const storage = new EphemeralCacheStorage()
const entityRestClient = instance(EntityRestClient as any)

async function run() {
	console.log("Testing lastUpdateBatchIdPerGroup deletion on membership loss...")

	const userId = "userId"
	const calendarGroupId = "calendarGroupId"

	// 1. Create initial user WITH calendar membership
	const initialUser = createUser({
		_id: userId,
		memberships: [
			createGroupMembership({_id: "mailShipId", groupType: GroupType.Mail}),
			createGroupMembership({_id: "calendarShipId", group: calendarGroupId, groupType: GroupType.Calendar}),
		],
	})

	// 2. Store the initial user
	await storage.put(initialUser as any)

	// 3. Create a CalendarEvent owned by the calendar group
	const eventId: IdTuple = ["eventListId", "eventId"]
	const event = createCalendarEvent({_id: eventId, _ownerGroup: calendarGroupId})
	await storage.put(event as any)

	// 4. Put a lastBatchIdForGroup entry for the calendar group
	await storage.putLastBatchIdForGroup(calendarGroupId, "batch-1")
	const batchBefore = await storage.getLastBatchIdForGroup(calendarGroupId)
	console.assert(batchBefore !== null, "lastBatchIdForGroup should be 'batch-1' before membership loss")
	console.log(`  ✓ batch ID before membership loss: ${batchBefore}`)

	// 5. Create updated user WITHOUT calendar membership
	const updatedUser = createUser({
		_id: userId,
		memberships: [
			createGroupMembership({_id: "mailShipId", groupType: GroupType.Mail}),
			// calendar membership removed
		],
	})

	// 6. Mock entityRestClient.load to return updated user for UserTypeRef
	when(entityRestClient.load(anything(), anything())).thenReject(new NotAuthorizedError("Unexpected load"))
	when(entityRestClient.load(anything(), userId)).thenResolve(updatedUser as any)

	// 7. Create cache
	const cache = new DefaultEntityRestCache(entityRestClient, storage as any)

	// 8. Receive a User UPDATE event (simulating the membership change notification)
	await cache.entityEventsReceived(makeBatch([
		createUpdate({app: "sys", type: "User"}, "", userId, OperationType.UPDATE),
	]))

	// 9. Assert: the lastBatchIdForGroup entry should be DELETED
	const batchAfter = await storage.getLastBatchIdForGroup(calendarGroupId)

	console.log(`  batch ID after membership loss: ${batchAfter}`)

	if (batchAfter === null) {
		console.log("✅ TEST PASSED: lastUpdateBatchIdPerGroup correctly deleted on membership loss")
		process.exit(0)
	} else {
		console.error(`❌ TEST FAILED: lastUpdateBatchIdPerGroup should be null but got: ${batchAfter}`)
		process.exit(1)
	}
}

run().catch(err => {
	console.error("Test threw an error:", err)
	process.exit(1)
})
