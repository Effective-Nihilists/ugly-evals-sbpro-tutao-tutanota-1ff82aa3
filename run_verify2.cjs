const { execSync } = require('child_process');

try {
  execSync(
    'node_modules/.bin/esbuild /tmp/verify_test.mjs --bundle --platform=node --format=esm --outfile=/tmp/verify_test_bundle.mjs',
    { cwd: '/var/folders/7t/nywtg67n7p1dd8fzv8gtn75w0000gp/T/ugly-eval-RThazR/agent', stdio: 'inherit' }
  );

  execSync('node /tmp/verify_test_bundle.mjs', { stdio: 'inherit' });
} catch (e) {
  process.exit(1);
}