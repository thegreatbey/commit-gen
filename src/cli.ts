import ora from 'ora';
import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'node:fs';
import { loadConfig } from './config.js';
import { getStagedDiff } from './diff.js';
import { generateCommitMessage } from './generator.js';
import { formatMessage } from './formatter.js';
import { runGitCommit } from './commit.js';
import { ensureConfig } from './init.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

// ---------------------------------------------------------------------------
// Main CLI logic
// ---------------------------------------------------------------------------
export async function runCLI() {
  // Clear previous commit message to avoid confusion
  fs.writeFileSync('.commit-msg', '', 'utf8');
  await ensureConfig();

  const program = new Command()
    .name('commit-genie')
    .version(pkg.version)
    .alias('commit-gen')
    .description('Generate Git commit messages using AI')
    .option('--commit', 'Auto-commit with the generated message')
    .option('--conventional', 'Use Conventional Commit format')
    .parse(process.argv);

  const options = program.opts();
  const config = loadConfig();

  const diff = await getStagedDiff();

  if (!diff) {
    const spinner = ora().fail('No staged changes found.');
    console.log('Tip: Use `git add <file>` to stage changes first.');
    process.exit(1);
  }

  const spinner = ora(`Generating commit message with ${chalk.gray(config.model)} …`).start();
  let message: string;

  try {
    message = await generateCommitMessage(diff, {
      model: config.model,
      conventional: options.conventional ?? config.conventional
    });
    spinner.succeed('Commit message generated!');
  } catch (err) {
    spinner.fail('Failed to generate message');
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }

  const formatted = formatMessage(message, options.conventional ?? config.conventional);
  console.log('\n💬 Suggested Commit Message:\n');
  console.log(chalk.cyan(formatted));

try {
  fs.writeFileSync('.commit-msg', formatted, 'utf8');
  console.log(chalk.green('📝  Saved to .commit-msg (edit if you wish)'));
  console.log(chalk.yellow('\nACCEPT AND COMMIT WITH ---> commit-genie --commit'));
  console.log(chalk.gray('(PRO-TIP: YOU CAN SKIP REVIEW IF YOU USE ---> commit-genie --conventional --commit)\n'));
} catch (e) {
  console.error(chalk.yellow('⚠️  Could not write .commit-msg:'), e);
}

  if (options.commit) {
    await runGitCommit(formatted);
    console.log(chalk.green('✅ Changes committed!'));
  }
}

// Run automatically only when this file is the direct entrypoint
const thisFile = fileURLToPath(import.meta.url);
if (path.resolve(process.argv[1]) === path.resolve(thisFile)) {
  runCLI();
}