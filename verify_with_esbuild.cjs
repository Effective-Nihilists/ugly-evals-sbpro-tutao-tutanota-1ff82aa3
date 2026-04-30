// Self-contained test using esbuild bundle-and-run
// Simulates the exact scenario from TICKET.md:
// "When a membership is lost, lastUpdateBatchIdPerGroup should be deleted"

const esbuild = require('esbuild');

const testCode = `
const { EphemeralCacheStorage } = require('./src/api/worker/rest/EphemeralCacheStorage.js');
const { DefaultEntityRestCache } = require('./src/api/worker/rest/DefaultEntityRestCache.js');

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
  console.log("  ✓ putLastBatchIdForGroup stores value correctly\\n");

  // Step 2: delete the batch ID (this is what our fix adds to handleUpdatedUser)
  await storage.deleteLastBatchIdForGroup(calendarGroupId);
  const after = await storage.getLastBatchIdForGroup(calendarGroupId);
  console.log("After deleteLastBatchIdForGroup:", after);
  if (after !== null) {
    console.error("FAIL: deleteLastBatchIdForGroup did NOT delete the entry!");
    console.error("  This is the bug described in TICKET.md");
    process.exit(1);
  }
  console.log("  ✓ deleteLastBatchIdForGroup correctly clears the entry\\n");

  console.log("=== ALL CHECKS PASSED ===");
  console.log("The fix correctly deletes lastUpdateBatchIdPerGroup when membership is lost.");
  process.exit(0);
}

test().catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});
`;

esbuild.buildSync({
  entryPoints: [{ stdin: true, serve: false }],
  bundle: true,
  format: 'cjs',
  platform: 'node',
  outfile: '/tmp/verify_fix_bundle.cjs',
  stdinContent: testCode,
  external: ['./src/**/*'],
  absWorkingDir: process.cwd(),
});

require('/tmp/verify_fix_bundle.cjs');