import { runCLI } from '../src/cli.js';

(async () => {
  console.log('Running smoke test...');
  await runCLI();
})();