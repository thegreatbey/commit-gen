import { execa } from 'execa';

type GeneratorOptions = {
  model: string;
  conventional: boolean;
};

/**
 * Generates a commit message using a local Ollama model.
 */
export async function generateCommitMessage(diff: string, options: GeneratorOptions): Promise<string> {
  const prompt = buildPrompt(diff, options.conventional);

  try {
    const { stdout } = await execa('ollama', ['run', options.model], {
      input: prompt
    });

    return stdout.trim();
  } catch (err: any) {
    console.error('❌ Failed to generate commit message via Ollama.');
    console.error(err.stderr || err.message);
    return 'fix: update code';
  }
}

/**
 * Builds the prompt to send to the AI model.
 */
function buildPrompt(diff: string, conventional: boolean): string {
  return `
You are a helpful assistant that writes concise Git commit messages.

Analyze the following staged code diff and generate a commit message:
- Be clear and accurate.
- ${
    conventional
      ? 'Format it using Conventional Commits (e.g., feat:, fix:, refactor:).'
      : 'Use a natural, clear style.'
  }

Git diff:
${diff}

Commit message:
`.trim();
}