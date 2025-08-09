import { execa } from 'execa';

export async function runGitCommit(message: string): Promise<void> {
  // Use -m (single-line). If you need multi-line, write to a temp file and use -F.
  await execa('git', ['commit', '-m', message], { stdio: 'inherit' });
}
