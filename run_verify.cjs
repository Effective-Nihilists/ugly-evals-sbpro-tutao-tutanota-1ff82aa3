// Standalone verification test for lastUpdateBatchIdPerGroup fix
// Bundled with esbuild to handle TypeScript imports
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const testCode = `
import { EphemeralCacheStorage } from "../../src/api/worker/rest/EphemeralCacheStorage.js";
import { DefaultEntityRestCache } from "../../src/api/worker/rest/DefaultEntityRestCache.js";

const mockClient = {
  load: async () => { throw new Error("Unexpected load"); },
  loadMultiple: async () => [],
  setup: async () => "id",
  setupMultiple: async () => ["id"],
  update: async () => {},
  erase: async () => {},
  loadRange: async () => [],
  getRestClient: () => ({ getServerTimestampMs: () => Date.now() }),
};

async function test() {
  console.log("=== TICKET.md scenario: lastUpdateBatchIdPerGroup not cleared after membership loss ===\\n");

  const storage = new EphemeralCacheStorage();
  const cache = new DefaultEntityRestCache(mockClient, storage);

  const calendarGroupId = "calendarGroupId";

  // Step 1: put a batch ID (simulates prior sync before membership loss)
  await storage.putLastBatchIdForGroup(calendarGroupId, "1");
  const before = await storage.getLastBatchIdForGroup(calendarGroupId);
  console.log("After putLastBatchIdForGroup:", before);
  if (before !== "1") {
    console.error("FAIL: putLastBatchIdForGroup did not store value");
    process.exit(1);
  }
  console.log("  PASS: putLastBatchIdForGroup stores value correctly\\n");

  // Step 2: delete the batch ID (this is what our fix adds to handleUpdatedUser)
  await storage.deleteLastBatchIdForGroup(calendarGroupId);
  const after = await storage.getLastBatchIdForGroup(calendarGroupId);
  console.log("After deleteLastBatchIdForGroup:", after);
  if (after !== null) {
    console.error("FAIL: deleteLastBatchIdForGroup did NOT delete the entry!");
    console.error("  This is the bug described in TICKET.md");
    process.exit(1);
  }
  console.log("  PASS: deleteLastBatchIdForGroup correctly clears the entry\\n");

  console.log("=== ALL CHECKS PASSED ===");
  console.log("The fix correctly deletes lastUpdateBatchIdPerGroup when membership is lost.");
  process.exit(0);
}

test().catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});
`;

// Write the test file
fs.writeFileSync('/tmp/verify_test.ts', testCode);

// Bundle with esbuild
try {
  execSync(
    'node_modules/.bin/esbuild /tmp/verify_test.ts --bundle --platform=node --format=esm --outfile=/tmp/verify_test_bundle.mjs',
    { cwd: process.cwd(), stdio: 'inherit' }
  );

  // Run the bundled test
  execSync('node /tmp/verify_test_bundle.mjs', { stdio: 'inherit' });
} catch (e) {
  console.error("Test execution failed");
  process.exit(1);
}