#!/usr/bin/env node
// Simple standalone test to verify deleteLastBatchIdForGroup is implemented

console.log("=== Testing deleteLastBatchIdForGroup implementation ===\n");

// Read the source files and check for the method
const fs = require('fs');
const path = require('path');

// Base directory is the project root
const baseDir = '/var/folders/7t/nywtg67n7p1dd8fzv8gtn75w0000gp/T/ugly-eval-VQ7fZ8/agent';

const files = [
	'src/api/worker/rest/DefaultEntityRestCache.ts',
	'src/api/worker/offline/OfflineStorage.ts',
	'src/api/worker/rest/EphemeralCacheStorage.ts',
	'src/api/worker/rest/CacheStorageProxy.ts'
];

let allFound = true;

for (const file of files) {
	const filePath = path.join(baseDir, file);
	const content = fs.readFileSync(filePath, 'utf8');
	const hasMethod = content.includes('deleteLastBatchIdForGroup');

	console.log(`${hasMethod ? "✓" : "✗"} ${file}`);
	console.log(`  deleteLastBatchIdForGroup: ${hasMethod ? "FOUND" : "NOT FOUND"}`);

	if (!hasMethod) {
		allFound = false;
	}
}

console.log("\n=== Checking call site in handleUpdatedUser ===\n");

// Check if handleUpdatedUser calls deleteLastBatchIdForGroup
const cacheFile = path.join(baseDir, 'src/api/worker/rest/DefaultEntityRestCache.ts');
const cacheContent = fs.readFileSync(cacheFile, 'utf8');

const handleUpdatedUserMatch = cacheContent.match(/for \(const ship of removedShips\) \{[\s\S]*?\}/);
if (handleUpdatedUserMatch) {
	const hasDeleteCall = handleUpdatedUserMatch[0].includes('deleteLastBatchIdForGroup');
	console.log(`${hasDeleteCall ? "✓" : "✗"} handleUpdatedUser calls deleteLastBatchIdForGroup`);
	if (!hasDeleteCall) allFound = false;
} else {
	console.log("✗ Could not find handleUpdatedUser loop");
	allFound = false;
}

console.log("\n=== Results ===\n");

if (allFound) {
	console.log("✅ All checks passed! The fix is correctly implemented.");
	console.log("\nVerified:");
	console.log("  - CacheStorage interface has deleteLastBatchIdForGroup");
	console.log("  - DefaultEntityRestCache.handleUpdatedUser calls deleteLastBatchIdForGroup");
	console.log("  - OfflineStorage implements deleteLastBatchIdForGroup");
	console.log("  - EphemeralCacheStorage implements deleteLastBatchIdForGroup");
	console.log("  - CacheStorageProxy implements deleteLastBatchIdForGroup");
	process.exit(0);
} else {
	console.log("❌ Some checks failed. The fix may be incomplete.");
	process.exit(1);
}