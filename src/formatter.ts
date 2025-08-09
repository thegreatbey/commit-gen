const conventionalRe = /^(feat|fix|docs|chore|refactor|test|build|ci|perf|style|revert|deps)(\([\w\-]+\))?!?:\s/i;

export function formatMessage(message: string, useConventional: boolean): string {
  const trimmed = message.trim().replace(/^["'`\s]+|["'`\s]+$/g, '');
  if (!useConventional) return trimmed;
  if (conventionalRe.test(trimmed)) return trimmed; // already conventional
  return `feat: ${trimmed}`;
}
