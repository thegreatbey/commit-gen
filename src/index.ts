#!/usr/bin/env node
import { ensureConfig } from './init.js';
import { runCLI } from './cli.js';

await ensureConfig(); // <- runs only once if config doesn't exist
await runCLI();       // <- launches the main tool