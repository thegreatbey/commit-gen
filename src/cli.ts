import { Command } from 'commander';
import { loadConfig } from './config.js';
import { getStagedDiff } from './diff.js';
import { generateCommitMessage } from './generator.js';
import { formatMessage } from './formatter.js';
import { runGitCommit } from './commit.js';

export async function runCLI() {
  const program = new Command();

  program
    .name('commit-gen')
    .description('Generate Git commit messages using AI')
    .option('--commit', 'Auto-commit with the generated message')
    .option('--conventional', 'Use Conventional Commit format')
    .parse(process.argv);

  const options = program.opts();
  const config = loadConfig();

  const diff = await getStagedDiff();

  if (!diff) {
    console.error('❌ No staged changes to commit.');
    process.exit(1);
  }

  const message = await generateCommitMessage(diff, {
    model: config.model,
    conventional: options.conventional ?? config.conventional
  });

  const formatted = formatMessage(message, options.conventional ?? config.conventional);

  console.log('\n💬 Suggested Commit Message:\n');
  console.log(formatted);

  if (options.commit) {
    await runGitCommit(formatted);
    console.log('✅ Changes committed!');
  }
}