# commit-genie
[![commit-genie logo](commit-genie.png)](https://github.com/thegreatbey/commit-gen)

> Fast, local, AI-powered Git commit message generator.

[![npm version](https://img.shields.io/npm/v/@cavani21/commit-genie?color=blue)](https://www.npmjs.com/package/@cavani21/commit-genie)
[![downloads](https://img.shields.io/npm/dt/@cavani21/commit-genie)](https://www.npmjs.com/package/@cavani21/commit-genie)
[![license](https://img.shields.io/npm/l/@cavani21/commit-genie)](https://github.com/thegreatbey/commit-gen/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@cavani21/commit-genie)](https://bundlephobia.com/result?p=@cavani21/commit-genie)
[![npm install](https://img.shields.io/badge/npx%20@cavani21%2Fcommit--genie-blue.svg)](https://www.npmjs.com/package/@cavani21/commit-genie)
[![CI](https://github.com/thegreatbey/commit-gen/actions/workflows/publish.yml/badge.svg)](https://github.com/thegreatbey/commit-gen/actions)
[![provenance](https://img.shields.io/badge/provenance-signed-brightgreen?logo=npm)](https://docs.npmjs.com/generating-provenance-statements)

---

## Features

- ✏️ **Generate commit messages** from staged Git diffs
- 🤖 Works with **local AI models** (via Ollama)
- 🌐 Optional: Use OpenAI or Claude API
- 🔧 Supports **Conventional Commits** (`--conventional`)
- 🧑‍💻 Optional `--commit` flag to auto-commit
- 🧪 Built with TypeScript, lightweight, zero bloat
- ✅ Cross-platform (Windows/Linux/Mac)
- 📁 `.commitgenrc.json` for persistent config
- 📦 Tiny footprint, zero dependencies for core functionality

---

## Global Installation

```bash
npm install -g @cavani21/commit-genie
# or
npx @cavani21/commit-genie --help

````

## Usage

```bash
npx commit-genie

# Or manually:
git add .
commit-genie                 # Generates a commit message from staged changes
commit-genie --commit        # Also commits it
commit-genie --conventional  # Format as Conventional Commit
```

---

## Example Output

```
feat: add initial CLI support with local AI (Ollama)
```

---

## Config

You can save settings in a `.commitgenrc.json` file:

```json
{
  "provider": "ollama",
  "model": "mistral",
  "conventional": true
}
```

---

## License

MIT © 2025 [cavani21](https://github.com/thegreatbey)

```