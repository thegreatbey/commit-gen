//src/init.ts
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { execa } from 'execa';
import chalk from 'chalk';

const CONFIG_PATH = path.resolve(process.cwd(), '.commitgenrc.json');

// Check if Ollama is installed
export async function checkOllamaInstalled(): Promise<boolean> {
  try {
    const { stdout } = await execa('cmd', ['/c', 'ollama --version']);
    console.log('✔️ Ollama detected:', stdout);
    return stdout.toLowerCase().includes('ollama version');
  } catch (err: any) {
    console.error('❌ Failed to detect Ollama CLI:');
    console.error(err.stderr || err.message);
    return false;
  }
}

export async function ensureConfig() {
  if (fs.existsSync(CONFIG_PATH)) return; // Already configured

  console.log(chalk.cyanBright('\nWelcome to commit-gen!'));

  const { provider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: 'How do you want to run AI commit generation?',
      choices: [
        { name: 'Use my own local AI model via Ollama (recommended, free)', value: 'ollama' },
        { name: 'Use OpenAI API (requires your own key)', value: 'openai' },
        { name: 'Use Claude API (requires your own key)', value: 'claude' }
      ]
    }
  ]);

  let config: Record<string, any> = {
    provider,
    model: 'mistral', // sensible default
    conventional: true
  };

  if (provider === 'ollama') {
    const installed = await checkOllamaInstalled();
    if (!installed) {
      console.log(chalk.red('\n❌ Ollama CLI not found on your system.'));
      console.log('➡️  Download and install from https://ollama.com/download');
      process.exit(1);
    }
  } else if (provider === 'openai' || provider === 'claude') {
    const keyPrompt = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: `Enter your ${provider === 'openai' ? 'OpenAI' : 'Claude'} API key:`,
        mask: '*',
        validate: (input: string) => input.length > 10 || 'API key seems too short'
      }
    ]);
    if (provider === 'openai') {
      config.openaiApiKey = keyPrompt.apiKey;
    } else {
      config.claudeApiKey = keyPrompt.apiKey;
    }
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  console.log(chalk.green(`\n✅ Config saved to ${CONFIG_PATH}\n`));
}