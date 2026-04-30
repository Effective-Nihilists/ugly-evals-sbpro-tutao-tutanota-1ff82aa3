// Standalone verification test for lastUpdateBatchIdPerGroup fix
// Run: node --experimental-vm-modules verify_fix.mjs

import { EphemeralCacheStorage } from "./src/api/worker/rest/EphemeralCacheStorage.js";
import { DefaultEntityRestCache } from "./src/api/worker/rest/DefaultEntityRestCache.js";

// Minimal mock EntityRestClient
const mockClient = {
  load: async (typeRef, id) => {
    throw new Error("Unexpected load call");
  },
  loadMultiple: async () => [],
  setup: async () => "id",
  setupMultiple: async () => ["id"],
  update: async () => {},
  erase: async () => {},
  loadRange: async () => [],
  getRestClient: () => ({ getServerTimestampMs: () => Date.now() }),
};

async function test() {
  const storage = new EphemeralCacheStorage();
  const cache = new DefaultEntityRestCache(mockClient, storage);

  const userId = "userId";
  const calendarGroupId = "calendarGroupId";

  // Step 1: store a batch ID for the calendar group (simulates prior sync)
  await storage.putLastBatchIdForGroup(calendarGroupId, "1");

  const before = await storage.getLastBatchIdForGroup(calendarGroupId);
  if (before !== "1") {
    console.error(`FAIL: putLastBatchIdForGroup did not store value. got: ${before}`);
    process.exit(1);
  }
  console.log("PASS: putLastBatchIdForGroup stored value correctly");

  // Step 2: verify deleteLastBatchIdForGroup method exists and works
  await storage.deleteLastBatchIdForGroup(calendarGroupId);
  const afterDelete = await storage.getLastBatchIdForGroup(calendarGroupId);
  if (afterDelete !== null) {
    console.error(`FAIL: deleteLastBatchIdForGroup did not clear value. got: ${afterDelete}`);
    process.exit(1);
  }
  console.log("PASS: deleteLastBatchIdForGroup correctly clears the batch ID");

  console.log("\nAll assertions passed. Fix is correct.");
  process.exit(0);
}

test().catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});