#!/usr/bin/env node
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

// ---------------------------------------------------------------------------
// Main CLI logic
// ---------------------------------------------------------------------------
export async function runCLI() {
  await ensureConfig();

  const program = new Command()
    .name('commit-gen')
    .description('Generate Git commit messages using AI')
    .option('--commit', 'Auto-commit with the generated message')
    .option('--conventional', 'Use Conventional Commit format')
    .parse(process.argv);

  const options = program.opts();
  const config  = loadConfig();

  const diff = await getStagedDiff();
  if (!diff) {
    console.error(chalk.red('❌ No staged changes to commit.'));
    process.exit(1);
  }

  // Spinner while talking to the model
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
  } catch (e) {
  console.error(chalk.yellow('⚠️  Could not write .commit-msg:'), e);
  }

  if (options.commit) {
    await runGitCommit(formatted);
    console.log(chalk.green('✅ Changes committed!'));
  }
}

// If executed directly via bin, run the CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  runCLI();
}