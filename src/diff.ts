// src/diff.ts
import { execa } from 'execa';

/**
 * Gets the staged Git diff using `git diff --cached`.
 * Returns an empty string if nothing is staged.
 */
export async function getStagedDiff(): Promise<string> {
  try {
    const { stdout } = await execa('git', ['diff', '--cached']);
    return stdout.trim();
  } catch (err) {
    console.error('❌ Failed to run git diff --cached');
    console.error(err);
    return '';
  }
}